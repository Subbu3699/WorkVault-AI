
from pathlib import Path

from docx import Document as WordDocument
from pypdf import PdfReader


SUPPORTED_EXTENSIONS = {".pdf", ".docx"}


def extract_text(file_path: str | Path) -> str:
    """Extract text from a PDF or DOCX file."""
    path = Path(file_path)
    extension = path.suffix.lower()

    if extension not in SUPPORTED_EXTENSIONS:
        raise ValueError("Only PDF and DOCX files are supported.")

    if not path.is_file():
        raise FileNotFoundError("Document file was not found.")

    if extension == ".pdf":
        reader = PdfReader(str(path))
        text = "\n".join(
            page.extract_text() or "" for page in reader.pages
        )
    else:
        document = WordDocument(str(path))
        text = "\n".join(
            paragraph.text
            for paragraph in document.paragraphs
            if paragraph.text.strip()
        )

    text = text.strip()

    if not text:
        raise ValueError(
            "No readable text found. Scanned PDFs may need OCR."
        )

    return text
