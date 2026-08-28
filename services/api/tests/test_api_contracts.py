import io
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


# ---------------------------------------------------------------------------
# /api/ask
# ---------------------------------------------------------------------------

def test_ask_valid_english(client):
    r = client.post("/api/ask", json={"message": "Where can I find education support?", "language": "en"})
    assert r.status_code == 200
    body = r.get_json()
    assert body["language"] == "en"
    assert "answer" in body
    assert "sources" in body
    assert "session_id" in body


def test_ask_valid_somali(client):
    r = client.post("/api/ask", json={"message": "Waxaan rabaa inaan helo shaqo", "language": "so"})
    assert r.status_code == 200
    assert r.get_json()["language"] == "so"


def test_ask_valid_domain(client):
    r = client.post("/api/ask", json={"message": "Tell me about scholarships", "domain": "scholarships"})
    assert r.status_code == 200


def test_ask_optional_session_id(client):
    r = client.post("/api/ask", json={"message": "Hello", "session_id": "abc-123"})
    assert r.status_code == 200
    assert r.get_json()["session_id"] == "abc-123"


def test_ask_missing_message(client):
    r = client.post("/api/ask", json={"language": "en"})
    assert r.status_code == 400
    _assert_error(r, "INVALID_REQUEST", "message is required")


def test_ask_empty_message(client):
    r = client.post("/api/ask", json={"message": "   "})
    assert r.status_code == 400
    _assert_error(r, "INVALID_REQUEST")


def test_ask_message_too_long(client):
    r = client.post("/api/ask", json={"message": "x" * 1001})
    assert r.status_code == 400
    _assert_error(r, "INVALID_REQUEST")


def test_ask_invalid_language(client):
    r = client.post("/api/ask", json={"message": "Hello", "language": "fr"})
    assert r.status_code == 400
    _assert_error(r, "INVALID_REQUEST")


def test_ask_invalid_domain(client):
    r = client.post("/api/ask", json={"message": "Hello", "domain": "astrology"})
    assert r.status_code == 400
    _assert_error(r, "INVALID_REQUEST")


def test_ask_malformed_json(client):
    r = client.post("/api/ask", data="not json", content_type="application/json")
    assert r.status_code == 400
    _assert_error(r, "INVALID_REQUEST")


def test_ask_no_body(client):
    r = client.post("/api/ask", content_type="application/json")
    assert r.status_code == 400
    _assert_error(r, "INVALID_REQUEST")


# ---------------------------------------------------------------------------
# /api/voice
# ---------------------------------------------------------------------------

def _audio_file():
    """Minimal fake audio bytes for multipart upload."""
    return (io.BytesIO(b"fake-audio-data"), "test.wav")


def test_voice_valid_request(client):
    # Voice service is not yet ready (Isaac / T2.2); expect 503 with a clear error code.
    r = client.post(
        "/api/voice",
        data={"audio": _audio_file(), "language": "en"},
        content_type="multipart/form-data",
    )
    assert r.status_code == 503
    _assert_error(r, "VOICE_SERVICE_UNAVAILABLE")


def test_voice_somali_language(client):
    r = client.post(
        "/api/voice",
        data={"audio": _audio_file(), "language": "so"},
        content_type="multipart/form-data",
    )
    assert r.status_code == 503
    _assert_error(r, "VOICE_SERVICE_UNAVAILABLE")


def test_voice_with_session_id(client):
    r = client.post(
        "/api/voice",
        data={"audio": _audio_file(), "session_id": "sess-xyz"},
        content_type="multipart/form-data",
    )
    assert r.status_code == 503
    _assert_error(r, "VOICE_SERVICE_UNAVAILABLE")


def test_voice_missing_audio(client):
    r = client.post(
        "/api/voice",
        data={"language": "en"},
        content_type="multipart/form-data",
    )
    assert r.status_code == 400
    _assert_error(r, "INVALID_REQUEST", "audio file is required")


def test_voice_invalid_language(client):
    r = client.post(
        "/api/voice",
        data={"audio": _audio_file(), "language": "de"},
        content_type="multipart/form-data",
    )
    assert r.status_code == 400
    _assert_error(r, "INVALID_REQUEST")


def test_voice_wrong_content_type(client):
    r = client.post("/api/voice", json={"language": "en"})
    assert r.status_code == 415
    _assert_error(r, "INVALID_REQUEST")


# ---------------------------------------------------------------------------
# Global error handlers
# ---------------------------------------------------------------------------

def test_404_unknown_route(client):
    r = client.get("/api/does-not-exist")
    assert r.status_code == 404
    _assert_error(r, "NOT_FOUND")


def test_405_wrong_method_on_ask(client):
    r = client.get("/api/ask")
    assert r.status_code == 405
    _assert_error(r, "METHOD_NOT_ALLOWED")


def test_405_wrong_method_on_voice(client):
    r = client.get("/api/voice")
    assert r.status_code == 405
    _assert_error(r, "METHOD_NOT_ALLOWED")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _assert_error(response, code: str, message_contains: str = None):
    body = response.get_json()
    assert "error" in body
    assert body["error"]["code"] == code
    if message_contains:
        assert message_contains in body["error"]["message"]
