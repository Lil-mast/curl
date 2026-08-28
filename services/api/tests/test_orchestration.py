"""
Orchestration tests.

Faith's and Isaac's interfaces are replaced with fakes — no real database
or ElevenLabs calls are made here.
"""

import io
import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app import create_app
from safety import session as session_module
from services.adapters.knowledge import (
    BaseKnowledgeRetriever,
    KnowledgeEntry,
    RetrievalResult,
)
from services.adapters.voice import (
    BaseVoiceService,
    TranscriptionResult,
    SynthesisResult,
)


# ---------------------------------------------------------------------------
# Fakes
# ---------------------------------------------------------------------------

class FakeRetriever(BaseKnowledgeRetriever):
    """Returns a fixed list of entries; empty list simulates no knowledge."""

    def __init__(self, entries=None):
        self._entries = entries or []
        self.calls = []

    def retrieve(self, query, language, domain):
        self.calls.append({"query": query, "language": language, "domain": domain})
        return RetrievalResult(entries=self._entries)


class FakeVoiceService(BaseVoiceService):
    """Configurable fake for STT and TTS."""

    def __init__(self, transcription_text="Hello", language="en", stt_success=True, tts_success=True, audio_url="https://example.com/audio.mp3"):
        self._transcription_text = transcription_text
        self._language = language
        self._stt_success = stt_success
        self._tts_success = tts_success
        self._audio_url = audio_url
        self.transcribe_calls = []
        self.synthesise_calls = []

    def transcribe(self, audio_bytes, language):
        self.transcribe_calls.append({"language": language})
        return TranscriptionResult(
            text=self._transcription_text,
            language=self._language,
            success=self._stt_success,
        )

    def synthesise(self, text, language):
        self.synthesise_calls.append({"text": text, "language": language})
        return SynthesisResult(
            audio_url=self._audio_url if self._tts_success else None,
            success=self._tts_success,
        )


_SAMPLE_ENTRY = KnowledgeEntry(
    title="Nairobi Community Centre",
    body="Visit the centre at 9am–5pm Monday to Friday for housing and food support.",
    source_org="Nairobi Community Centre",
    domain="services",
    contact="+254 700 000000",
    source_url="https://example.org/ncc",
)


def _audio_file():
    return (io.BytesIO(b"fake-audio"), "test.wav")


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture(autouse=True)
def clear_sessions():
    session_module._store.clear()
    yield
    session_module._store.clear()


@pytest.fixture
def client_empty():
    """App with no knowledge and voice not ready."""
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c


@pytest.fixture
def client_with_knowledge():
    """App with one knowledge entry and voice not ready."""
    retriever = FakeRetriever(entries=[_SAMPLE_ENTRY])
    app = create_app(knowledge_retriever=retriever)
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c, retriever


@pytest.fixture
def client_with_voice():
    """App with knowledge and a working voice service."""
    retriever = FakeRetriever(entries=[_SAMPLE_ENTRY])
    voice = FakeVoiceService()
    app = create_app(knowledge_retriever=retriever, voice_service=voice)
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c, retriever, voice


# ---------------------------------------------------------------------------
# 1. Normal /api/ask — allowed, no knowledge
# ---------------------------------------------------------------------------

def test_ask_normal_request_allowed(client_empty):
    r = client_empty.post("/api/ask", json={"message": "Where can I find a job?", "language": "en"})
    assert r.status_code == 200
    body = r.get_json()
    assert "referred" not in body or body.get("referred") is not True
    assert "answer" in body


# ---------------------------------------------------------------------------
# 2. Safety referral stops downstream processing
# ---------------------------------------------------------------------------

def test_ask_safety_referral_stops_retrieval():
    retriever = FakeRetriever(entries=[_SAMPLE_ENTRY])
    app = create_app(knowledge_retriever=retriever)
    app.config["TESTING"] = True
    with app.test_client() as client:
        r = client.post("/api/ask", json={"message": "Will I get asylum?", "language": "en"})
    assert r.status_code == 200
    body = r.get_json()
    assert body["referred"] is True
    # Retriever must NOT have been called
    assert len(retriever.calls) == 0


# ---------------------------------------------------------------------------
# 3. Retrieval result becomes API response
# ---------------------------------------------------------------------------

def test_ask_retrieval_result_in_response(client_with_knowledge):
    client, retriever = client_with_knowledge
    r = client.post("/api/ask", json={"message": "Where can I get housing help?", "language": "en"})
    assert r.status_code == 200
    body = r.get_json()
    assert body["answer"] == _SAMPLE_ENTRY.body
    assert len(body["sources"]) == 1
    assert body["sources"][0]["title"] == _SAMPLE_ENTRY.title
    assert body["sources"][0]["source_org"] == _SAMPLE_ENTRY.source_org


# ---------------------------------------------------------------------------
# 4. Empty retrieval produces "I don't know" response
# ---------------------------------------------------------------------------

def test_ask_empty_retrieval_produces_dont_know(client_empty):
    r = client_empty.post("/api/ask", json={"message": "Where can I find a unicorn?", "language": "en"})
    assert r.status_code == 200
    body = r.get_json()
    assert body["answer"] is not None
    assert "don't have" in body["answer"] or "don't know" in body["answer"].lower() or "contact" in body["answer"].lower()
    assert body["sources"] == []


def test_ask_empty_retrieval_somali_response(client_empty):
    r = client_empty.post("/api/ask", json={"message": "Waxaan rabaa caawimaad", "language": "so"})
    assert r.status_code == 200
    body = r.get_json()
    assert body["answer"] is not None
    assert body["sources"] == []


# ---------------------------------------------------------------------------
# 5. Sources passed through correctly
# ---------------------------------------------------------------------------

def test_ask_sources_fields_present(client_with_knowledge):
    client, _ = client_with_knowledge
    r = client.post("/api/ask", json={"message": "I need help", "language": "en"})
    source = r.get_json()["sources"][0]
    assert "title" in source
    assert "source_org" in source
    assert "domain" in source
    assert "contact" in source
    assert "source_url" in source


# ---------------------------------------------------------------------------
# 6. Session ID is preserved across turns
# ---------------------------------------------------------------------------

def test_ask_session_id_preserved(client_empty):
    r1 = client_empty.post("/api/ask", json={"message": "Hello"})
    sid = r1.get_json()["session_id"]
    assert sid is not None

    r2 = client_empty.post("/api/ask", json={"message": "Tell me more", "session_id": sid})
    assert r2.get_json()["session_id"] == sid


def test_ask_disclaimer_only_on_first_turn(client_empty):
    r1 = client_empty.post("/api/ask", json={"message": "Hello"})
    body1 = r1.get_json()
    assert body1["disclaimer"] is not None
    sid = body1["session_id"]

    r2 = client_empty.post("/api/ask", json={"message": "Tell me more", "session_id": sid})
    assert r2.get_json()["disclaimer"] is None


# ---------------------------------------------------------------------------
# 7. Voice request reaches voice interface when available
# ---------------------------------------------------------------------------

def test_voice_request_reaches_voice_service(client_with_voice):
    client, retriever, voice = client_with_voice
    r = client.post(
        "/api/voice",
        data={"audio": _audio_file(), "language": "en"},
        content_type="multipart/form-data",
    )
    assert r.status_code == 200
    assert len(voice.transcribe_calls) == 1
    assert len(voice.synthesise_calls) == 1
    body = r.get_json()
    assert body["audio_url"] == "https://example.com/audio.mp3"
    assert body["answer"] == _SAMPLE_ENTRY.body


# ---------------------------------------------------------------------------
# 8. Voice service failure produces safe API error
# ---------------------------------------------------------------------------

def test_voice_service_failure_returns_503():
    voice = FakeVoiceService(stt_success=False)
    app = create_app(voice_service=voice)
    app.config["TESTING"] = True
    with app.test_client() as client:
        r = client.post(
            "/api/voice",
            data={"audio": _audio_file(), "language": "en"},
            content_type="multipart/form-data",
        )
    assert r.status_code == 503
    body = r.get_json()
    assert body["error"]["code"] == "VOICE_SERVICE_UNAVAILABLE"


# ---------------------------------------------------------------------------
# 9. No downstream service called after safety referral (voice path)
# ---------------------------------------------------------------------------

def test_voice_safety_referral_stops_retrieval_and_tts():
    retriever = FakeRetriever(entries=[_SAMPLE_ENTRY])
    voice = FakeVoiceService(transcription_text="Will I be deported?")
    app = create_app(knowledge_retriever=retriever, voice_service=voice)
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
    # Retrieval must not have been called
    assert len(retriever.calls) == 0
    # TTS must not have been called
    assert len(voice.synthesise_calls) == 0
