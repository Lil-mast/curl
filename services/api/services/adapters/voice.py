"""
Voice service adapter — integration boundary for Isaac's module (T2.2, T2.3).

Flask calls transcribe() and synthesise(); Isaac implements the real versions
backed by ElevenLabs.

CONTRACT
--------
transcribe(audio_bytes, language) -> TranscriptionResult
    TranscriptionResult.text      : str
    TranscriptionResult.language  : str   (detected or confirmed)
    TranscriptionResult.success   : bool

synthesise(text, language) -> SynthesisResult
    SynthesisResult.audio_url     : str | None
    SynthesisResult.success       : bool

Isaac: implement VoiceService by subclassing BaseVoiceService and passing
an instance to create_orchestrator() in app.py.

Do NOT import ElevenLabs here. That belongs in services/voice/ (Isaac's).
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class TranscriptionResult:
    text: str
    language: str
    success: bool


@dataclass
class SynthesisResult:
    audio_url: str | None
    success: bool


class BaseVoiceService(ABC):
    @abstractmethod
    def transcribe(self, audio_bytes: bytes, language: str) -> TranscriptionResult:
        """Convert audio bytes to text using STT."""

    @abstractmethod
    def synthesise(self, text: str, language: str) -> SynthesisResult:
        """Convert answer text to audio using TTS."""


class VoiceServiceNotReady(BaseVoiceService):
    """
    Placeholder used until Isaac's ElevenLabs implementation is wired in.
    Returns a clearly marked not-ready result so the orchestrator can
    surface a safe integration response without calling ElevenLabs.
    """

    def transcribe(self, audio_bytes: bytes, language: str) -> TranscriptionResult:
        return TranscriptionResult(
            text="",
            language=language,
            success=False,
        )

    def synthesise(self, text: str, language: str) -> SynthesisResult:
        return SynthesisResult(audio_url=None, success=False)
