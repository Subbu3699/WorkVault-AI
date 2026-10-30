
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.api.documents import get_db
from app.models.user import User
from app.services.rag_service import answer_from_documents

router = APIRouter(prefix="/chat", tags=["RAG Chat"])


class ChatRequest(BaseModel):
    question: str = Field(min_length=1, max_length=2000)
    limit: int = Field(default=5, ge=1, le=20)


@router.post("")
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        result = answer_from_documents(
            db=db,
            question=request.question.strip(),
            owner_id=current_user.id,
            limit=request.limit,
        )
        return result

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        ) from exc

    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=500,
            detail="Document retrieval failed.",
        ) from exc
