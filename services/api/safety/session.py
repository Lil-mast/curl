"""
Anonymous session policy (docs/privacy.md, docs/data.md, T1.6).

Rules enforced here:
  - session_id is opaque (caller-supplied or None; we never derive identity)
  - no user profile is stored
  - no transcript is stored
  - no audio is stored
  - no CV draft persists beyond the request
  - no passport / case ID / asylum narrative is stored

This module holds only the in-memory turn counter used to decide whether
the transparency disclaimer should be shown (first turn of a session).

Persistent anonymous counts (language, domain, turn_count) go into the
Neon `sessions` table — that is Faith's work (T1.7, T1.8). This module
provides the interface Faith's implementation will replace.

Nothing here writes to a database.
"""

import uuid
from dataclasses import dataclass, field


@dataclass
class SessionState:
    session_id: str
    turn_count: int = 0
    disclaimer_shown: bool = False
    # Intentionally no: user_id, name, transcript, audio, cv_draft, documents


# In-process store — lives only for the lifetime of the Flask worker.
# Faith replaces this with Neon-backed persistence in T1.7/T1.8.
_store: dict[str, SessionState] = {}


def get_or_create(session_id: str | None) -> SessionState:
    """
    Return an existing SessionState or create a new one.

    If session_id is None or unknown, a new opaque ID is generated.
    The caller must include the returned session_id in the API response
    so the client can continue the session.
    """
    if session_id and session_id in _store:
        return _store[session_id]

    sid = session_id or _new_id()
    state = SessionState(session_id=sid)
    _store[sid] = state
    return state


def record_turn(session_id: str) -> None:
    """Increment the turn counter for an existing session."""
    if session_id in _store:
        _store[session_id].turn_count += 1


def mark_disclaimer_shown(session_id: str) -> None:
    """Record that the transparency disclaimer has been shown this session."""
    if session_id in _store:
        _store[session_id].disclaimer_shown = True


def _new_id() -> str:
    return str(uuid.uuid4())
