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
    document_id: int | None = None,
):
    if not query or not query.strip():
        raise ValueError("Search query cannot be empty.")

    if not owner_id:
        raise ValueError("A valid user is required.")

    if limit < 1 or limit > 20:
        raise ValueError("Limit must be between 1 and 20.")

    if document_id is not None:
        document = db.execute(
            select(Document.id).where(
                Document.id == document_id,
                Document.owner_id == owner_id,
            )
        ).scalar_one_or_none()

        if document is None:
            raise ValueError("Document not found or access denied.")

    query_embedding = embed_text(query.strip())

    distance = DocumentChunk.embedding.cosine_distance(
        query_embedding
    )

    conditions = [
        Document.owner_id == owner_id,
        DocumentChunk.embedding.is_not(None),
    ]

    if document_id is not None:
        conditions.append(
            DocumentChunk.document_id == document_id
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
        .where(*conditions)
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
            "similarity": round(1 - float(row.distance), 4),
        }
        for row in rows
    ]