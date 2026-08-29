"""
services/voice/errors.py
========================
Custom exceptions for the voice service.

Alvine's Flask code should catch VoiceServiceError (or its subclasses)
and translate them into appropriate HTTP error responses.

Usage:
    from services.voice.errors import VoiceServiceError, STTError, TTSError
"""


class VoiceServiceError(Exception):
    """Base class for all voice service errors.

    Catch this if you want to handle any voice failure in one place.
    Catch a subclass if you need to handle a specific failure type.
    """

    def __init__(self, message: str, original_error: Exception | None = None):
        super().__init__(message)
        self.original_error = original_error  # preserve the root cause for logging


class STTError(VoiceServiceError):
    """Raised when speech-to-text transcription fails.

    Causes: unintelligible audio, silent recording, ElevenLabs API error.
    """


class TTSError(VoiceServiceError):
    """Raised when text-to-speech synthesis fails.

    Causes: empty text, API error, synthesis timeout.
    """


class UnsupportedLanguageError(VoiceServiceError):
    """Raised when a language other than 'so' or 'en' is requested.

    We only support Somali ('so') and English ('en') in v1.
    """

    def __init__(self, language: str):
        super().__init__(
            f"Unsupported language '{language}'. Supported: 'so' (Somali), 'en' (English)."
        )
        self.language = language


class AudioTooLargeError(VoiceServiceError):
    """Raised when an audio file exceeds the allowed size limit.

    ElevenLabs accepts up to 3 GB, but we enforce a tighter limit
    to keep mobile response times reasonable.
    """

    def __init__(self, size_bytes: int, limit_bytes: int):
        super().__init__(
            f"Audio file is {size_bytes:,} bytes, which exceeds the "
            f"{limit_bytes:,}-byte limit ({limit_bytes // (1024 * 1024)} MB)."
        )
        self.size_bytes = size_bytes
        self.limit_bytes = limit_bytes


class ElevenLabsTimeoutError(VoiceServiceError):
    """Raised when the ElevenLabs API does not respond within the timeout window."""

    def __init__(self, operation: str, timeout_seconds: float):
        super().__init__(
            f"ElevenLabs did not respond within {timeout_seconds}s during '{operation}'."
        )
        self.operation = operation
        self.timeout_seconds = timeout_seconds
