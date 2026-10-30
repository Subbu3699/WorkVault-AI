
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from app.api.auth import router as auth_router
from app.api.documents import router as documents_router
from app.api.search import router as search_router
from app.api.chat import router as chat_router
from app.db.session import check_database_connection

app = FastAPI(
    title="WorkVault AI API",
    description="Enterprise AI Document Intelligence and Knowledge Retrieval Platform",
    version="0.1.0",
)

# Enable CORS for the local React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes
app.include_router(auth_router)
app.include_router(documents_router)
app.include_router(search_router)
app.include_router(chat_router)


@app.get("/", tags=["Root"])
def root() -> dict[str, str]:
    return {
        "message": "Welcome to WorkVault AI",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "application": "WorkVault AI",
    }


@app.get("/health/database", tags=["Health"])
def database_health_check() -> dict[str, str]:
    try:
        check_database_connection()
        return {
            "status": "ok",
            "database": "connected",
        }
    except SQLAlchemyError as exc:
        raise HTTPException(
            status_code=503,
            detail="Database connection failed",
        ) from exc
