
import pytest

from app.services.search_service import search_documents


def test_search_rejects_empty_query():
    with pytest.raises(ValueError):
        search_documents(
            db=None,
            query="   ",
            owner_id=1,
        )


def test_search_rejects_invalid_limit():
    with pytest.raises(ValueError):
        search_documents(
            db=None,
            query="placement details",
            owner_id=1,
            limit=0,
        )
