"""
services/voice/tts.py
=====================
Text-to-speech using the ElevenLabs eleven_v3 multilingual model.

Public function:
    synthesise(text, language)
        → bytes   (MP3 audio, ready to stream)

Alvine does NOT call this directly. She calls text_to_speech() from __init__.py.
"""

import httpx

from .elevenlabs import (
    get_client,
    get_voice_id,
    REQUEST_TIMEOUT_SECONDS,
    TTS_MODEL_ID,
    TTS_OUTPUT_FORMAT,
    SUPPORTED_LANGUAGES,
)
from .errors import (
    ElevenLabsTimeoutError,
    TTSError,
    UnsupportedLanguageError,
)


def synthesise(text: str, language: str) -> bytes:
    """Convert text to speech audio bytes.

    Args:
        text:     The text to speak. Should already be in the target language.
                  ElevenLabs eleven_v3 auto-detects the language from the text
                  content — no explicit language_code needed for TTS.
        language: 'so' for Somali, 'en' for English.
                  Used to select the right voice ID from environment variables.

    Returns:
        MP3 audio bytes. The caller (Flask) should return these with
        Content-Type: audio/mpeg.

    Raises:
        UnsupportedLanguageError: if language is not 'so' or 'en'.
        TTSError:                 if text is empty, or on any API failure.
        ElevenLabsTimeoutError:   if the API does not respond in time.
    """
    # Guard: validate language
    if language not in SUPPORTED_LANGUAGES:
        raise UnsupportedLanguageError(language)

    # Guard: empty text
    text = text.strip()
    if not text:
        raise TTSError("Cannot synthesise empty text.")

    voice_id = get_voice_id(language)
    client = get_client()

    try:
        audio_generator = client.text_to_speech.convert(
            text=text,
            voice_id=voice_id,
            model_id=TTS_MODEL_ID,
            output_format=TTS_OUTPUT_FORMAT,
        )

        # The SDK returns a generator of bytes chunks; collect into one blob.
        audio_bytes = _collect_audio(audio_generator)

    except httpx.TimeoutException as exc:
        raise ElevenLabsTimeoutError("text_to_speech", REQUEST_TIMEOUT_SECONDS) from exc

    except TTSError:
        raise  # re-raise our own errors as-is

    except Exception as exc:
        raise TTSError(
            f"ElevenLabs TTS failed: {exc}", original_error=exc
        ) from exc

    if not audio_bytes:
        raise TTSError("ElevenLabs returned empty audio. Check the voice ID and text.")

    return audio_bytes


# ---------------------------------------------------------------------------
# Private helpers
# ---------------------------------------------------------------------------

def _collect_audio(generator) -> bytes:
    """Consume a bytes generator (or a raw bytes object) into a single bytes blob.

    ElevenLabs SDK may return:
    - A generator of bytes chunks (streaming mode)
    - A single bytes object (non-streaming mode)
    Both are handled here.
    """
    if isinstance(generator, bytes):
        return generator

    chunks: list[bytes] = []
    for chunk in generator:
        if isinstance(chunk, bytes) and chunk:
            chunks.append(chunk)

    return b"".join(chunks)
