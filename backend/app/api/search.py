
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.api.documents import get_db
from app.models.user import User
from app.services.search_service import search_documents

router = APIRouter(prefix="/search", tags=["Search"])


class SearchRequest(BaseModel):
    query: str = Field(min_length=1, max_length=2000)
    limit: int = Field(default=5, ge=1, le=20)
    document_id: int | None = Field(default=None, gt=0)


@router.post("")
def search(
    request: SearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = request.query.strip()

    if not query:
        raise HTTPException(
            status_code=400,
            detail="Search query cannot be empty.",
        )

    try:
        results = search_documents(
            db=db,
            query=query,
            owner_id=current_user.id,
            limit=request.limit,
            document_id=request.document_id,
        )

        return {
            "query": query,
            "results_count": len(results),
            "results": results,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=500,
            detail="Document search failed.",
        ) from exc
