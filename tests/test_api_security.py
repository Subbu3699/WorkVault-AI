
from datetime import datetime, timedelta, timezone
from unittest.mock import MagicMock

import jwt
from fastapi.testclient import TestClient
from sqlalchemy.sql.elements import BinaryExpression

from app.api.auth import get_current_user, get_db
from app.api.documents import get_db as get_documents_db
from app.core.config import settings
from app.main import app
from app.models.document import Document
from app.models.user import User
from app.services.auth_service import ALGORITHM

client = TestClient(app)


def test_documents_reject_request_without_token():
    response = client.get("/documents")
    assert response.status_code == 401


def test_search_rejects_request_without_token():
    response = client.post(
        "/search",
        json={"query": "placement details"},
    )
    assert response.status_code == 401


def test_chat_rejects_request_without_token():
    response = client.post(
        "/chat",
        json={"question": "What is the CTC?"},
    )
    assert response.status_code == 401


def test_invalid_token_is_rejected():
    response = client.get(
        "/documents",
        headers={"Authorization": "Bearer invalid-token"},
    )
    assert response.status_code == 401


def test_me_rejects_invalid_token():
    response = client.get(
        "/auth/me",
        headers={"Authorization": "Bearer invalid-token"},
    )
    assert response.status_code == 401


def test_me_accepts_valid_token():
    fake_user = MagicMock(spec=User)
    fake_user.id = 123
    fake_user.email = "test@example.com"
    fake_user.full_name = "Test User"
    fake_user.is_active = True

    fake_db = MagicMock()
    fake_db.get.return_value = fake_user

    def override_get_db():
        yield fake_db

    app.dependency_overrides[get_db] = override_get_db

    token = jwt.encode(
        {
            "sub": "123",
            "exp": datetime.now(timezone.utc)
            + timedelta(minutes=5),
        },
        settings.jwt_secret_key,
        algorithm=ALGORITHM,
    )

    try:
        response = client.get(
            "/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == 200
        assert response.json()["id"] == 123
        assert response.json()["email"] == "test@example.com"
        assert response.json()["full_name"] == "Test User"
        assert response.json()["is_active"] is True

        fake_db.get.assert_called_once_with(User, 123)
    finally:
        app.dependency_overrides.pop(get_db, None)


def test_documents_list_is_filtered_by_current_user():
    fake_user = MagicMock(spec=User)
    fake_user.id = 123

    fake_document = MagicMock(spec=Document)
    fake_document.id = 10
    fake_document.filename = "user123.pdf"
    fake_document.status = "processed"
    fake_document.created_at = None

    fake_query = MagicMock()
    fake_query.filter.return_value = fake_query
    fake_query.order_by.return_value = fake_query
    fake_query.all.return_value = [fake_document]

    fake_db = MagicMock()
    fake_db.query.return_value = fake_query

    def override_db():
        yield fake_db

    def override_user():
        return fake_user

    app.dependency_overrides[get_documents_db] = override_db
    app.dependency_overrides[get_current_user] = override_user

    try:
        response = client.get("/documents")

        assert response.status_code == 200
        assert len(response.json()) == 1
        assert response.json()[0]["filename"] == "user123.pdf"

        fake_db.query.assert_called_once_with(Document)
        fake_query.filter.assert_called_once()

        filter_expression = fake_query.filter.call_args.args[0]

        assert isinstance(filter_expression, BinaryExpression)
        assert filter_expression.left == Document.owner_id
        assert filter_expression.right.value == 123

    finally:
        app.dependency_overrides.pop(get_documents_db, None)
        app.dependency_overrides.pop(get_current_user, None)
