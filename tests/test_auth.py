
from datetime import datetime, timedelta, timezone

import jwt

from app.core.config import settings
from app.services.auth_service import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    ALGORITHM,
    create_access_token,
    hash_password,
    verify_password,
)


def test_password_is_hashed():
    password = "TestPassword123!"
    hashed = hash_password(password)

    assert hashed != password
    assert verify_password(password, hashed)


def test_wrong_password_is_rejected():
    hashed = hash_password("CorrectPassword123!")

    assert not verify_password("WrongPassword123!", hashed)


def test_access_token_contains_user_id_and_expiry():
    token = create_access_token(123)

    payload = jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[ALGORITHM],
    )

    assert payload["sub"] == "123"
    assert "exp" in payload


def test_access_token_expiry_is_30_minutes():
    before = datetime.now(timezone.utc)
    token = create_access_token(123)
    after = datetime.now(timezone.utc)

    payload = jwt.decode(
        token,
        settings.jwt_secret_key,
        algorithms=[ALGORITHM],
    )

    expiry = datetime.fromtimestamp(payload["exp"], timezone.utc)

    earliest = before + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    latest = after + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # JWT expiry uses whole-second timestamps, so allow 1 second of rounding.
    assert earliest - timedelta(seconds=1) <= expiry
    assert expiry <= latest + timedelta(seconds=1)
