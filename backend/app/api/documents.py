
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.api.auth import get_current_user
from app.db.session import SessionLocal
from app.models.document import Document
from app.models.user import User
from app.services.document_service import save_uploaded_document

router = APIRouter(prefix="/documents", tags=["Documents"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/upload", status_code=status.HTTP_201_CREATED)
def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        document = save_uploaded_document(
            file=file,
            owner_id=current_user.id,
            db=db,
        )

        return {
            "id": document.id,
            "filename": document.filename,
            "status": document.status,
            "message": "Document uploaded and text extracted successfully.",
        }

    except ValueError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        ) from exc

    except SQLAlchemyError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="A database error occurred while processing the document.",
        ) from exc

    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Document processing failed. Check the backend terminal.",
        ) from exc

    finally:
        file.file.close()


@router.get("")
def list_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        documents = (
            db.query(Document)
            .filter(Document.owner_id == current_user.id)
            .order_by(Document.id.desc())
            .all()
        )

        return [
            {
                "id": document.id,
                "filename": document.filename,
                "status": document.status,
                "created_at": document.created_at,
            }
            for document in documents
        ]

    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not retrieve documents.",
        ) from exc
