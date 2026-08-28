"""
ElevenLabs adapter and audio route integration tests.

Isaac's services.voice module is mocked throughout — no real ElevenLabs
calls are made. Tests verify the adapter contract, the audio store
integration, and the GET /api/audio/<token> route.
"""

import io
import pytest
import sys
import os
from unittest.mock import patch, MagicMock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app import create_app
from services import audio_store
from services.adapters.elevenlabs_voice import ElevenLabsVoiceAdapter
from services.adapters.voice import TranscriptionResult, SynthesisResult


FAKE_MP3 = b"\xff\xfb\x90\x00" + b"\x00" * 100  # minimal fake MP3 header


@pytest.fixture(autouse=True)
def reset_audio_store():
    audio_store._clear()
    yield
    audio_store._clear()


@pytest.fixture
def adapter():
    return ElevenLabsVoiceAdapter()


@pytest.fixture
def client_with_adapter():
    app = create_app(voice_service=ElevenLabsVoiceAdapter())
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c


def _audio_file():
    return (io.BytesIO(b"fake-audio"), "test.wav")


# ---------------------------------------------------------------------------
# Adapter — transcribe()
# ---------------------------------------------------------------------------

def test_transcribe_success_english(adapter):
    mock_stt = MagicMock(return_value={"text": "Where can I find a job?", "detected_language": "en"})
    with patch.dict("sys.modules", {
        "services.voice": MagicMock(speech_to_text=mock_stt),
        "services.voice.errors": MagicMock(VoiceServiceError=Exception),
    }):
        result = adapter.transcribe(b"audio", "en")
    assert result.success is True
    assert result.text == "Where can I find a job?"
    assert result.language == "en"


def test_transcribe_success_somali(adapter):
    mock_stt = MagicMock(return_value={"text": "Waxaan rabaa shaqo", "detected_language": "so"})
    with patch.dict("sys.modules", {
        "services.voice": MagicMock(speech_to_text=mock_stt),
        "services.voice.errors": MagicMock(VoiceServiceError=Exception),
    }):
        result = adapter.transcribe(b"audio", "so")
    assert result.success is True
    assert result.language == "so"


def test_transcribe_voice_service_error_returns_failure(adapter):
    class FakeVoiceServiceError(Exception):
        pass

    mock_stt = MagicMock(side_effect=FakeVoiceServiceError("STT failed"))
    with patch.dict("sys.modules", {
        "services.voice": MagicMock(speech_to_text=mock_stt),
        "services.voice.errors": MagicMock(VoiceServiceError=FakeVoiceServiceError),
    }):
        result = adapter.transcribe(b"audio", "en")
    assert result.success is False
    assert result.text == ""


def test_transcribe_import_error_returns_failure(adapter):
    with patch.dict("sys.modules", {"services.voice": None, "services.voice.errors": None}):
        result = adapter.transcribe(b"audio", "en")
    assert result.success is False


# ---------------------------------------------------------------------------
# Adapter — synthesise()
# ---------------------------------------------------------------------------

def test_synthesise_success_stores_audio_and_returns_url(adapter):
    mock_tts = MagicMock(return_value=FAKE_MP3)
    with patch.dict("sys.modules", {
        "services.voice": MagicMock(text_to_speech=mock_tts),
        "services.voice.errors": MagicMock(VoiceServiceError=Exception),
    }):
        result = adapter.synthesise("Here is some help.", "en")
    assert result.success is True
    assert result.audio_url is not None
    assert result.audio_url.startswith("/api/audio/")


def test_synthesise_stores_correct_bytes(adapter):
    mock_tts = MagicMock(return_value=FAKE_MP3)
    with patch.dict("sys.modules", {
        "services.voice": MagicMock(text_to_speech=mock_tts),
        "services.voice.errors": MagicMock(VoiceServiceError=Exception),
    }):
        result = adapter.synthesise("Help text.", "en")
    token = result.audio_url.split("/")[-1]
    assert audio_store.get(token) == FAKE_MP3


def test_synthesise_voice_service_error_returns_failure(adapter):
    class FakeVoiceServiceError(Exception):
        pass

    mock_tts = MagicMock(side_effect=FakeVoiceServiceError("TTS failed"))
    with patch.dict("sys.modules", {
        "services.voice": MagicMock(text_to_speech=mock_tts),
        "services.voice.errors": MagicMock(VoiceServiceError=FakeVoiceServiceError),
    }):
        result = adapter.synthesise("Help text.", "en")
    assert result.success is False
    assert result.audio_url is None


def test_synthesise_import_error_returns_failure(adapter):
    with patch.dict("sys.modules", {"services.voice": None, "services.voice.errors": None}):
        result = adapter.synthesise("Help text.", "en")
    assert result.success is False


# ---------------------------------------------------------------------------
# GET /api/audio/<token>
# ---------------------------------------------------------------------------

def test_audio_route_returns_mp3_bytes():
    token = audio_store.put(FAKE_MP3)
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        r = client.get(f"/api/audio/{token}")
    assert r.status_code == 200
    assert r.content_type == "audio/mpeg"
    assert r.data == FAKE_MP3


def test_audio_route_token_consumed_after_get():
    token = audio_store.put(FAKE_MP3)
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        client.get(f"/api/audio/{token}")
        r2 = client.get(f"/api/audio/{token}")
    assert r2.status_code == 404


def test_audio_route_unknown_token_returns_404():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        r = client.get("/api/audio/nonexistent-token")
    assert r.status_code == 404
    assert r.get_json()["error"]["code"] == "NOT_FOUND"


def test_audio_route_expired_token_returns_404():
    token = audio_store.put(FAKE_MP3)
    # Manually expire the entry
    audio_store._store[token].expires_at = 0.0
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        r = client.get(f"/api/audio/{token}")
    assert r.status_code == 404


# ---------------------------------------------------------------------------
# End-to-end: /api/voice → audio store → /api/audio/<token>
# ---------------------------------------------------------------------------

def test_voice_endpoint_audio_url_is_fetchable():
    """
    Full path: POST /api/voice → STT → safety → retrieval → TTS →
    audio_store → audio_url in response → GET /api/audio/<token> → MP3.
    """
    mock_stt = MagicMock(return_value={"text": "Where can I find help?", "detected_language": "en"})
    mock_tts = MagicMock(return_value=FAKE_MP3)

    class FakeVoiceServiceError(Exception):
        pass

    voice_module = MagicMock(speech_to_text=mock_stt, text_to_speech=mock_tts)
    errors_module = MagicMock(VoiceServiceError=FakeVoiceServiceError)

    with patch.dict("sys.modules", {
        "services.voice": voice_module,
        "services.voice.errors": errors_module,
    }):
        app = create_app(voice_service=ElevenLabsVoiceAdapter())
        app.config["TESTING"] = True
        with app.test_client() as client:
            r = client.post(
                "/api/voice",
                data={"audio": _audio_file(), "language": "en"},
                content_type="multipart/form-data",
            )
            assert r.status_code == 200
            body = r.get_json()
            assert body["audio_url"] is not None
            assert body["audio_url"].startswith("/api/audio/")

            # Token must be fetchable exactly once
            audio_r = client.get(body["audio_url"])
            assert audio_r.status_code == 200
            assert audio_r.content_type == "audio/mpeg"
            assert audio_r.data == FAKE_MP3

            # Second fetch must be 404
            audio_r2 = client.get(body["audio_url"])
            assert audio_r2.status_code == 404


def test_voice_safety_referral_does_not_call_tts():
    """Safety REFER must stop before TTS — no audio stored."""
    mock_stt = MagicMock(return_value={"text": "Will I be deported?", "detected_language": "en"})
    mock_tts = MagicMock(return_value=FAKE_MP3)

    class FakeVoiceServiceError(Exception):
        pass

    voice_module = MagicMock(speech_to_text=mock_stt, text_to_speech=mock_tts)
    errors_module = MagicMock(VoiceServiceError=FakeVoiceServiceError)

    with patch.dict("sys.modules", {
        "services.voice": voice_module,
        "services.voice.errors": errors_module,
    }):
        app = create_app(voice_service=ElevenLabsVoiceAdapter())
        app.config["TESTING"] = True
        with app.test_client() as client:
            r = client.post(
                "/api/voice",
                data={"audio": _audio_file(), "language": "en"},
                content_type="multipart/form-data",
            )
    assert r.status_code == 200
    body = r.get_json()
    assert body["referred"] is True
    assert body["reason"] == "immigration"
    # TTS must not have been called
    mock_tts.assert_not_called()
    # Audio store must be empty
    assert audio_store._store_size() == 0
