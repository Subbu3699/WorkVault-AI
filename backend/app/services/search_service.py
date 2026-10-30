
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.document import Document
from app.models.document_chunk import DocumentChunk
from app.services.embedding_service import embed_text


def search_documents(
    db: Session,
    query: str,
    owner_id: int,
    limit: int = 5,
) -> list[dict]:
    """Find semantically relevant chunks belonging only to one user."""

    if not query or not query.strip():
        raise ValueError("Search query cannot be empty.")

    if owner_id < 1:
        raise ValueError("A valid document owner ID is required.")

    if limit < 1 or limit > 20:
        raise ValueError("Limit must be between 1 and 20.")

    query_embedding = embed_text(query.strip())

    distance = DocumentChunk.embedding.cosine_distance(
        query_embedding
    )

    statement = (
        select(
            DocumentChunk.id,
            DocumentChunk.document_id,
            DocumentChunk.chunk_index,
            DocumentChunk.content,
            Document.filename,
            distance.label("distance"),
        )
        .join(
            Document,
            Document.id == DocumentChunk.document_id,
        )
        .where(
            Document.owner_id == owner_id,
            DocumentChunk.embedding.is_not(None),
        )
        .order_by(distance)
        .limit(limit)
    )

    rows = db.execute(statement).all()

    return [
        {
            "chunk_id": row.id,
            "document_id": row.document_id,
            "filename": row.filename,
            "chunk_index": row.chunk_index,
            "content": row.content,
            "similarity": round(
                1 - float(row.distance), 4
            ),
        }
        for row in rows
    ]
