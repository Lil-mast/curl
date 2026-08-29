"""
Short-lived in-process audio store.

MP3 bytes from Isaac's TTS are stored here under an opaque UUID token.
The token is single-use: GET /api/audio/<token> consumes and deletes it.
Entries expire automatically after TTL_SECONDS even if never fetched,
preventing unbounded memory growth.

Rules enforced here:
  - Audio is never written to disk.
  - Audio is never written to Neon.
  - Audio bytes are never logged.
  - Tokens are opaque UUIDs.
  - Each token is consumed on first retrieval.
  - Expired entries are purged lazily on every put() and get().
"""

import time
import uuid
from dataclasses import dataclass

TTL_SECONDS = 120  # tokens expire after 2 minutes


@dataclass
class _Entry:
    mp3_bytes: bytes
    expires_at: float


# Module-level store — lives for the lifetime of the Flask worker process.
_store: dict[str, _Entry] = {}


def put(mp3_bytes: bytes) -> str:
    """
    Store MP3 bytes and return an opaque token.
    The token can be used once within TTL_SECONDS.
    """
    _purge_expired()
    token = str(uuid.uuid4())
    _store[token] = _Entry(
        mp3_bytes=mp3_bytes,
        expires_at=time.monotonic() + TTL_SECONDS,
    )
    return token


def get(token: str) -> bytes | None:
    """
    Retrieve and delete MP3 bytes for a token.
    Returns None if the token is unknown or expired.
    """
    _purge_expired()
    entry = _store.pop(token, None)
    if entry is None:
        return None
    if time.monotonic() > entry.expires_at:
        return None
    return entry.mp3_bytes


def _purge_expired() -> None:
    """Remove all entries whose TTL has elapsed."""
    now = time.monotonic()
    expired = [t for t, e in _store.items() if now > e.expires_at]
    for t in expired:
        del _store[t]


def _store_size() -> int:
    """Test helper — number of live entries."""
    return len(_store)


def _clear() -> None:
    """Test helper — reset the store between tests."""
    _store.clear()
