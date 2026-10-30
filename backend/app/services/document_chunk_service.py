from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.services.chunking import split_text
from app.services.embedding_service import embed_texts


def create_document_chunks(
    db: Session,
    document_id: int,
    chunk_size: int = 1000,
    overlap: int = 150,
) -> int:
    document = db.scalar(
        select(Document).where(Document.id == document_id)
    )

    if document is None:
        raise ValueError("Document not found.")

    if not document.extracted_text:
        raise ValueError("Document has no extracted text.")

    chunks = split_text(
        document.extracted_text,
        chunk_size=chunk_size,
        overlap=overlap,
    )

    if not chunks:
        raise ValueError("No readable text to split.")

    # Generate one 384-dimensional embedding per chunk.
    embeddings = embed_texts(chunks)

    try:
        db.execute(
            delete(DocumentChunk).where(
                DocumentChunk.document_id == document_id
            )
        )

        for index, content in enumerate(chunks):
            db.add(
                DocumentChunk(
                    document_id=document_id,
                    chunk_index=index,
                    content=content,
                    embedding=embeddings[index],
                )
            )

        db.commit()
        return len(chunks)

    except Exception:
        db.rollback()
        raise