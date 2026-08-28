"""
services/voice/elevenlabs.py
============================
ElevenLabs client singleton and configuration.

This module is the ONLY place in the codebase that reads ElevenLabs secrets
or sets ElevenLabs-specific constants. Nothing else should import the
ElevenLabs SDK directly.

Required environment variables (see .env.example):
    ELEVENLABS_API_KEY        — your ElevenLabs secret key
    ELEVENLABS_VOICE_ID_SO    — voice ID for Somali TTS
    ELEVENLABS_VOICE_ID_EN    — voice ID for English TTS
"""

import os

from elevenlabs.client import ElevenLabs

from .errors import VoiceServiceError

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

# ElevenLabs model IDs
STT_MODEL_ID = "scribe_v2"       # Supports 90+ languages including Somali (ISO: som)
TTS_MODEL_ID = "eleven_v3"       # Best multilingual quality; handles Somali text

# Language codes used internally throughout this service.
# These are the only two languages supported in v1.
SUPPORTED_LANGUAGES: dict[str, str] = {
    "so": "som",   # Somali — internal code → ElevenLabs STT language_code
    "en": "eng",   # English — internal code → ElevenLabs STT language_code
}

# Maximum audio input size we accept before rejecting with AudioTooLargeError.
# ElevenLabs allows up to 3 GB; we cap at 25 MB to keep mobile latency sane.
MAX_AUDIO_BYTES = 25 * 1024 * 1024  # 25 MB

# Seconds to wait for an ElevenLabs API response before giving up.
# Adjust downward if latency measurements (T2.7) demand it.
REQUEST_TIMEOUT_SECONDS = 30.0

# Output audio format for TTS responses returned to Flask.
# MP3 is widely supported in browsers and small enough for mobile.
TTS_OUTPUT_FORMAT = "mp3_44100_128"

# ---------------------------------------------------------------------------
# Client singleton
# ---------------------------------------------------------------------------

_client: ElevenLabs | None = None


def get_client() -> ElevenLabs:
    """Return the shared ElevenLabs client, creating it on first call.

    Raises:
        VoiceServiceError: if ELEVENLABS_API_KEY is not set in the environment.
    """
    global _client
    if _client is None:
        api_key = os.environ.get("ELEVENLABS_API_KEY")
        if not api_key:
            raise VoiceServiceError(
                "ELEVENLABS_API_KEY is not set. "
                "Add it to your .env file and never commit it."
            )
        _client = ElevenLabs(api_key=api_key)
    return _client


# ---------------------------------------------------------------------------
# Voice ID helpers
# ---------------------------------------------------------------------------

def get_voice_id(language: str) -> str:
    """Return the ElevenLabs voice ID for the given internal language code.

    Args:
        language: 'so' for Somali, 'en' for English.

    Returns:
        The voice ID string from environment variables.

    Raises:
        VoiceServiceError: if the voice ID env var is not set.
        UnsupportedLanguageError: if language is not 'so' or 'en'.
    """
    from .errors import UnsupportedLanguageError  # avoid circular at module level

    env_var_map = {
        "so": "ELEVENLABS_VOICE_ID_SO",
        "en": "ELEVENLABS_VOICE_ID_EN",
    }

    if language not in env_var_map:
        raise UnsupportedLanguageError(language)

    env_var = env_var_map[language]
    voice_id = os.environ.get(env_var)

    if not voice_id:
        raise VoiceServiceError(
            f"{env_var} is not set. "
            f"Find a voice in the ElevenLabs Voice Library and add its ID to .env."
        )

    return voice_id


def get_elevenlabs_language_code(internal_code: str) -> str:
    """Convert our internal language code ('so', 'en') to the ElevenLabs STT code.

    Args:
        internal_code: 'so' or 'en'

    Returns:
        ElevenLabs language code string, e.g. 'som', 'eng'.

    Raises:
        UnsupportedLanguageError: if internal_code is not recognised.
    """
    from .errors import UnsupportedLanguageError

    if internal_code not in SUPPORTED_LANGUAGES:
        raise UnsupportedLanguageError(internal_code)

    return SUPPORTED_LANGUAGES[internal_code]
