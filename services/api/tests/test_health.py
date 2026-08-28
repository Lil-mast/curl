import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_health_status_code(client):
    response = client.get("/health")
    assert response.status_code == 200


def test_health_json(client):
    response = client.get("/health")
    assert response.get_json() == {"status": "ok"}
