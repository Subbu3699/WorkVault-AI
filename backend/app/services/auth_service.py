
from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.user import User

password_hash = PasswordHash.recommended()

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(password: str, hashed_password: str) -> bool:
    return password_hash.verify(password, hashed_password)


def create_access_token(user_id: int) -> str:
    expires_at = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )
    payload = {
        "sub": str(user_id),
        "exp": expires_at,
    }
    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=ALGORITHM,
    )


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email.lower().strip()))


def register_user(
    db: Session,
    email: str,
    full_name: str,
    password: str,
) -> User:
    normalized_email = email.lower().strip()

    if get_user_by_email(db, normalized_email):
        raise ValueError("An account with this email already exists.")

    if len(password) < 8:
        raise ValueError("Password must contain at least 8 characters.")

    user = User(
        email=normalized_email,
        full_name=full_name.strip(),
        hashed_password=hash_password(password),
    )

    try:
        db.add(user)
        db.commit()
        db.refresh(user)
        return user
    except Exception:
        db.rollback()
        raise


def authenticate_user(
    db: Session,
    email: str,
    password: str,
) -> User | None:
    user = get_user_by_email(db, email)

    if user is None or not verify_password(password, user.hashed_password):
        return None

    if not user.is_active:
        return None

    return user
