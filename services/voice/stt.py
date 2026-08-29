"""
services/voice/stt.py
=====================
Speech-to-text using the ElevenLabs Scribe v2 model.

Public function:
    transcribe(audio_bytes, language_hint=None)
        → { "text": str, "detected_language": "so" | "en" }

Alvine does NOT call this directly. She calls speech_to_text() from __init__.py.
"""

import io
import httpx

from .elevenlabs import (
    get_client,
    get_elevenlabs_language_code,
    MAX_AUDIO_BYTES,
    REQUEST_TIMEOUT_SECONDS,
    STT_MODEL_ID,
    SUPPORTED_LANGUAGES,
)
from .errors import (
    AudioTooLargeError,
    ElevenLabsTimeoutError,
    STTError,
    UnsupportedLanguageError,
)


def transcribe(
    audio_bytes: bytes,
    language_hint: str | None = None,
) -> dict[str, str]:
    """Transcribe audio bytes to text, with optional language hint.

    Args:
        audio_bytes:    Raw audio data. Supported formats: MP3, WAV, WebM,
                        M4A, MP4, OGG, FLAC, and others accepted by ElevenLabs.
        language_hint:  Optional. 'so' for Somali, 'en' for English.
                        When provided, passed to Scribe v2 as a language hint
                        to improve accuracy. When None, the model auto-detects.

    Returns:
        A dict with:
            "text"              — the transcribed text string (may be empty
                                  if the audio is silent or unintelligible)
            "detected_language" — 'so' or 'en' (normalised from ElevenLabs output)

    Raises:
        AudioTooLargeError:       if audio_bytes exceeds MAX_AUDIO_BYTES.
        UnsupportedLanguageError: if language_hint is given but not 'so' or 'en'.
        ElevenLabsTimeoutError:   if the API does not respond in time.
        STTError:                 for any other transcription failure.
    """
    # Guard: size check
    if len(audio_bytes) > MAX_AUDIO_BYTES:
        raise AudioTooLargeError(len(audio_bytes), MAX_AUDIO_BYTES)

    # Guard: validate language hint
    elevenlabs_lang_code: str | None = None
    if language_hint is not None:
        elevenlabs_lang_code = get_elevenlabs_language_code(language_hint)

    client = get_client()

    try:
        audio_file = io.BytesIO(audio_bytes)
        audio_file.name = "audio.webm"  # ElevenLabs uses the name for format hints

        kwargs: dict = {
            "file": audio_file,
            "model_id": STT_MODEL_ID,
        }
        if elevenlabs_lang_code:
            kwargs["language_code"] = elevenlabs_lang_code

        response = client.speech_to_text.convert(**kwargs)

    except httpx.TimeoutException as exc:
        raise ElevenLabsTimeoutError("speech_to_text", REQUEST_TIMEOUT_SECONDS) from exc

    except Exception as exc:
        raise STTError(
            f"ElevenLabs STT failed: {exc}", original_error=exc
        ) from exc

    # Extract text
    text: str = _extract_text(response)

    # Normalise language code back to our internal codes ('so' / 'en')
    detected = _normalise_language(response, language_hint)

    return {
        "text": text,
        "detected_language": detected,
    }


# ---------------------------------------------------------------------------
# Private helpers
# ---------------------------------------------------------------------------

def _extract_text(response) -> str:
    """Pull the transcription text out of the ElevenLabs response object."""
    # The SDK returns an object with a .text attribute
    if hasattr(response, "text") and response.text:
        return response.text.strip()

    # Fallback: if the response is already a string (SDK version differences)
    if isinstance(response, str):
        return response.strip()

    return ""


def _normalise_language(response, hint: str | None) -> str:
    """Map the ElevenLabs language code back to our internal 'so' / 'en' codes.

    Strategy:
    1. Check if the response carries a language_code field.
    2. If yes, map it (som → so, eng → en, etc.).
    3. If not detectable, fall back to the hint we sent.
    4. If still unknown, default to 'en' (English) as a safe fallback.
    """
    # Build a reverse lookup: ElevenLabs code → internal code
    reverse_map = {v: k for k, v in SUPPORTED_LANGUAGES.items()}

    detected_code = getattr(response, "language_code", None)

    if detected_code:
        # Try exact match first (e.g. 'som')
        if detected_code in reverse_map:
            return reverse_map[detected_code]

        # Try prefix match for variants (e.g. 'so', 'so-SO')
        for el_code, internal in reverse_map.items():
            if detected_code.lower().startswith(el_code.lower()):
                return internal

    # Fall back to the hint if we couldn't parse the response
    if hint in SUPPORTED_LANGUAGES:
        return hint

    # Final fallback
    return "en"
