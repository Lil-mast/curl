"""
ElevenLabs voice adapter — concrete implementation of BaseVoiceService.

Bridges Isaac's services.voice public API to our adapter contract:

    speech_to_text(audio_bytes, language_hint)  →  TranscriptionResult
    text_to_speech(text, language)              →  SynthesisResult

Isaac's module is imported lazily inside each method so this file is
importable even before his branch is merged. If the import fails at
call time, the adapter surfaces a clean failure rather than crashing
the whole Flask process at startup.

MP3 bytes from TTS are handed to audio_store.put(), which returns an
opaque token. The adapter builds the audio_url as /api/audio/<token>.
The browser fetches that URL once; the token is then consumed.

This adapter NEVER:
  - logs audio bytes
  - persists audio to disk or Neon
  - calls ElevenLabs before the safety check (that ordering is the
    orchestrator's responsibility — this adapter only executes what
    the orchestrator asks)
"""

from services.api.services.adapters.voice import BaseVoiceService, TranscriptionResult, SynthesisResult
from services.api.services import audio_store


class ElevenLabsVoiceAdapter(BaseVoiceService):
    """
    Concrete BaseVoiceService backed by Isaac's services.voice module.

    Pass an instance to create_app(voice_service=...) once Isaac's branch
    is merged and ELEVENLABS_API_KEY is set in the environment.
    """

    def transcribe(self, audio_bytes: bytes, language: str) -> TranscriptionResult:
        try:
            from services.voice import speech_to_text
            from services.voice.errors import VoiceServiceError
        except ImportError:
            return TranscriptionResult(text="", language=language, success=False)

        try:
            result = speech_to_text(audio_bytes, language_hint=language)
            return TranscriptionResult(
                text=result["text"],
                language=result["detected_language"],
                success=True,
            )
        except VoiceServiceError:
            return TranscriptionResult(text="", language=language, success=False)

    def synthesise(self, text: str, language: str) -> SynthesisResult:
        try:
            from services.voice import text_to_speech
            from services.voice.errors import VoiceServiceError
        except ImportError:
            return SynthesisResult(audio_url=None, success=False)

        try:
            mp3_bytes = text_to_speech(text, language)
            token = audio_store.put(mp3_bytes)
            return SynthesisResult(
                audio_url=f"/api/audio/{token}",
                success=True,
            )
        except VoiceServiceError:
            return SynthesisResult(audio_url=None, success=False)
