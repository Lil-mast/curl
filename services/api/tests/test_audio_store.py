import time
import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from services import audio_store


@pytest.fixture(autouse=True)
def reset_store():
    audio_store._clear()
    yield
    audio_store._clear()


# ---------------------------------------------------------------------------
# Basic put / get
# ---------------------------------------------------------------------------

def test_put_returns_string_token():
    token = audio_store.put(b"mp3data")
    assert isinstance(token, str)
    assert len(token) == 36  # UUID4


def test_get_returns_bytes():
    token = audio_store.put(b"mp3data")
    result = audio_store.get(token)
    assert result == b"mp3data"


def test_get_unknown_token_returns_none():
    assert audio_store.get("not-a-real-token") is None


# ---------------------------------------------------------------------------
# Single-use
# ---------------------------------------------------------------------------

def test_token_consumed_on_first_get():
    token = audio_store.put(b"mp3data")
    audio_store.get(token)
    assert audio_store.get(token) is None


def test_store_size_decreases_after_get():
    token = audio_store.put(b"mp3data")
    assert audio_store._store_size() == 1
    audio_store.get(token)
    assert audio_store._store_size() == 0


# ---------------------------------------------------------------------------
# TTL / expiry
# ---------------------------------------------------------------------------

def test_expired_token_returns_none(monkeypatch):
    token = audio_store.put(b"mp3data")
    # Wind the clock past TTL
    monkeypatch.setattr(
        audio_store,
        "TTL_SECONDS",
        -1,  # already expired
    )
    # Force re-expiry by manipulating the entry directly
    audio_store._store[token].expires_at = time.monotonic() - 1
    assert audio_store.get(token) is None


def test_purge_removes_expired_entries(monkeypatch):
    audio_store.put(b"data1")
    audio_store.put(b"data2")
    assert audio_store._store_size() == 2

    # Expire all entries
    for entry in audio_store._store.values():
        entry.expires_at = time.monotonic() - 1

    # put() triggers purge
    audio_store.put(b"data3")
    assert audio_store._store_size() == 1  # only the new one remains


def test_multiple_tokens_are_independent():
    t1 = audio_store.put(b"audio1")
    t2 = audio_store.put(b"audio2")
    assert audio_store.get(t1) == b"audio1"
    assert audio_store.get(t2) == b"audio2"


def test_tokens_are_unique():
    tokens = {audio_store.put(b"x") for _ in range(20)}
    assert len(tokens) == 20
