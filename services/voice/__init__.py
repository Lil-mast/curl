"""
services/voice/__init__.py
==========================
Public API for the voice service.

Alvine's Flask code only needs to know about two functions and one exception:

    from services.voice import speech_to_text, text_to_speech
    from services.voice.errors import VoiceServiceError

Everything else in this package is an implementation detail.

---

FUNCTION CONTRACTS (for Alvine)
================================

speech_to_text(audio_bytes, language_hint=None)
-----------------------------------------------
Args:
    audio_bytes    (bytes)          Raw audio from the browser mic.
                                    Accepted formats: WebM, MP3, WAV, M4A, MP4.
    language_hint  (str | None)     Optional. 'so' (Somali) or 'en' (English).
                                    Pass this if you already know the user's
                                    language (e.g. from a UI language selector).
                                    Pass None to let ElevenLabs auto-detect.

Returns:
    dict with keys:
        "text"               (str)  Transcribed text. May be empty string
                                    if audio was silent or unintelligible.
        "detected_language"  (str)  'so' or 'en'.

Raises:
    VoiceServiceError (or subclass) on any failure.


text_to_speech(text, language)
------------------------------
Args:
    text      (str)   The assistant's reply text, already in the target language.
    language  (str)   'so' (Somali) or 'en' (English).

Returns:
    bytes   MP3 audio. Return to the browser with Content-Type: audio/mpeg.

Raises:
    VoiceServiceError (or subclass) on any failure.


EXAMPLE (Flask route, written by Alvine)
=========================================

    from services.voice import speech_to_text, text_to_speech
    from services.voice.errors import VoiceServiceError

    @app.route("/api/voice", methods=["POST"])
    def voice_endpoint():
        audio_bytes = request.data
        try:
            result = speech_to_text(audio_bytes, language_hint="so")
            user_text = result["text"]
            lang = result["detected_language"]

            # ... Alvine's logic: look up knowledge, build answer ...
            answer_text = "Haddaba, talada koowaad waxay tahay..."

            audio = text_to_speech(answer_text, language=lang)
            return audio, 200, {"Content-Type": "audio/mpeg"}

        except VoiceServiceError as e:
            return {"error": str(e)}, 500
"""

from .stt import transcribe
from .tts import synthesise
from .errors import VoiceServiceError   # re-exported so Alvine has one import path


def speech_to_text(
    audio_bytes: bytes,
    language_hint: str | None = None,
) -> dict[str, str]:
    """Transcribe audio to text. See module docstring for full contract."""
    return transcribe(audio_bytes, language_hint=language_hint)


def text_to_speech(text: str, language: str) -> bytes:
    """Synthesise text to MP3 audio. See module docstring for full contract."""
    return synthesise(text, language=language)


__all__ = [
    "speech_to_text",
    "text_to_speech",
    "VoiceServiceError",
]
