"""
Orchestrator — Flask's coordination layer.

Order of operations for text (ask):
  1. Safety check  →  REFER early-exit if high-stakes
  2. Session policy
  3. Knowledge retrieval (Faith)
  4. Format answer + sources  →  "I don't know" if nothing found
  5. Return structured result

Order of operations for voice:
  1. STT (Isaac)  →  surface error if not ready
  2. Safety check on transcribed text
  3. Session policy
  4. Knowledge retrieval (Faith)
  5. Format answer
  6. TTS (Isaac)  →  audio_url or None
  7. Return structured result

The orchestrator never:
  - persists transcripts, audio, or CVs
  - logs user messages or secrets
  - invents knowledge facts
  - calls ElevenLabs directly
  - queries Neon directly
"""

from dataclasses import dataclass, field

from services.api.safety import policy as safety_policy
from services.api.safety.session import get_or_create, record_turn, mark_disclaimer_shown
from services.api.safety.transparency import get_disclaimer
from services.api.services.adapters.knowledge import BaseKnowledgeRetriever, KnowledgeEntry
from services.api.services.adapters.voice import BaseVoiceService

_NO_KNOWLEDGE_EN = (
    "I don't have specific information about that right now. "
    "Please contact a local organisation or community service directly "
    "for accurate and up-to-date help."
)
_NO_KNOWLEDGE_SO = (
    "Hadda ma hayo macluumaad gaar ah oo ku saabsan taas. "
    "Fadlan la xiriir hay'ad maxalliga ah ama adeeg bulsheed si toos ah "
    "si aad u hesho caawimaad saxan oo cusub."
)


@dataclass
class AskResult:
    referred: bool = False
    refer_reason: str | None = None
    refer_message: str | None = None
    answer: str | None = None
    language: str = "en"
    sources: list[dict] = field(default_factory=list)
    session_id: str | None = None
    disclaimer: str | None = None


@dataclass
class VoiceResult:
    referred: bool = False
    refer_reason: str | None = None
    refer_message: str | None = None
    answer: str | None = None
    language: str = "en"
    sources: list[dict] = field(default_factory=list)
    session_id: str | None = None
    audio_url: str | None = None
    voice_ready: bool = True
    error: str | None = None


class Orchestrator:
    def __init__(
        self,
        knowledge: BaseKnowledgeRetriever,
        voice: BaseVoiceService,
    ) -> None:
        self._knowledge = knowledge
        self._voice = voice

    # ------------------------------------------------------------------
    # Text path
    # ------------------------------------------------------------------

    def handle_ask(
        self,
        message: str,
        language: str,
        domain: str | None,
        session_id: str | None,
    ) -> AskResult:
        # 1. Safety — must run before retrieval
        policy = safety_policy.check(message)
        if policy.decision == "REFER":
            return AskResult(
                referred=True,
                refer_reason=policy.reason,
                refer_message=policy.message,
                language=language,
                session_id=session_id,
            )

        # 2. Session
        session = get_or_create(session_id)
        record_turn(session.session_id)
        include_disclaimer = not session.disclaimer_shown
        if include_disclaimer:
            mark_disclaimer_shown(session.session_id)

        # 3. Retrieval (Faith)
        retrieval = self._knowledge.retrieve(message, language, domain)

        # 4. Format
        if retrieval.found:
            answer = retrieval.entries[0].body
            sources = [_entry_to_source(e) for e in retrieval.entries]
        else:
            answer = _NO_KNOWLEDGE_SO if language == "so" else _NO_KNOWLEDGE_EN
            sources = []

        return AskResult(
            answer=answer,
            language=language,
            sources=sources,
            session_id=session.session_id,
            disclaimer=get_disclaimer(language) if include_disclaimer else None,
        )

    # ------------------------------------------------------------------
    # Voice path
    # ------------------------------------------------------------------

    def handle_voice(
        self,
        audio_bytes: bytes,
        language: str,
        session_id: str | None,
    ) -> VoiceResult:
        # 1. STT (Isaac)
        transcription = self._voice.transcribe(audio_bytes, language)
        if not transcription.success:
            return VoiceResult(
                voice_ready=False,
                language=language,
                session_id=session_id,
                error="Voice service is not yet available.",
            )

        detected_language = transcription.language or language
        message = transcription.text

        # 2. Safety on transcribed text
        policy = safety_policy.check(message)
        if policy.decision == "REFER":
            return VoiceResult(
                referred=True,
                refer_reason=policy.reason,
                refer_message=policy.message,
                language=detected_language,
                session_id=session_id,
                voice_ready=True,
            )

        # 3. Session
        session = get_or_create(session_id)
        record_turn(session.session_id)

        # 4. Retrieval (Faith)
        retrieval = self._knowledge.retrieve(message, detected_language, None)

        if retrieval.found:
            answer = retrieval.entries[0].body
            sources = [_entry_to_source(e) for e in retrieval.entries]
        else:
            answer = _NO_KNOWLEDGE_SO if detected_language == "so" else _NO_KNOWLEDGE_EN
            sources = []

        # 5. TTS (Isaac)
        synthesis = self._voice.synthesise(answer, detected_language)

        return VoiceResult(
            answer=answer,
            language=detected_language,
            sources=sources,
            session_id=session.session_id,
            audio_url=synthesis.audio_url if synthesis.success else None,
            voice_ready=True,
        )


# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------

def _entry_to_source(entry: KnowledgeEntry) -> dict:
    return {
        "title": entry.title,
        "source_org": entry.source_org,
        "contact": entry.contact,
        "source_url": entry.source_url,
        "domain": entry.domain,
    }
