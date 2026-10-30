
import uuid
from pathlib import Path

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.models.document import Document
from app.services.document_processor import extract_text
from app.services.document_chunk_service import create_document_chunks


UPLOAD_DIR = Path("uploads")
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_TYPES = {".pdf", ".docx"}


def save_uploaded_document(
    file: UploadFile,
    owner_id: int,
    db: Session,
) -> Document:
    original_name = Path(file.filename or "").name
    extension = Path(original_name).suffix.lower()

    if extension not in ALLOWED_TYPES:
        raise ValueError("Only PDF and DOCX files are supported.")

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    stored_name = f"{uuid.uuid4().hex}{extension}"
    destination = UPLOAD_DIR / stored_name

    try:
        # Save uploaded file and enforce the 10 MB limit.
        size = 0

        with destination.open("wb") as output:
            while True:
                chunk = file.file.read(1024 * 1024)

                if not chunk:
                    break

                size += len(chunk)

                if size > MAX_FILE_SIZE:
                    raise ValueError("File size must not exceed 10 MB.")

                output.write(chunk)

        # Extract readable text from PDF or DOCX.
        extracted_text = extract_text(destination)

        if not extracted_text or not extracted_text.strip():
            raise ValueError(
                "No readable text found. Please upload a text-based PDF or DOCX file."
            )

        # Save document first so it has a database ID.
        document = Document(
            owner_id=owner_id,
            filename=original_name,
            content_type=file.content_type or "application/octet-stream",
            file_path=str(destination),
            status="processing",
            extracted_text=extracted_text,
        )

        db.add(document)
        db.commit()
        db.refresh(document)

        # Split the stored document text and generate embeddings.
        chunk_count = create_document_chunks(
            db=db,
            document_id=document.id,
        )

        if chunk_count == 0:
            raise ValueError("No document chunks were created.")

        # Mark as processed only after chunk creation succeeds.
        document.status = "processed"
        db.commit()
        db.refresh(document)

        return document

    except Exception:
        db.rollback()
        destination.unlink(missing_ok=True)
        raise
