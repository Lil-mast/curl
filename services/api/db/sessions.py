"""Anonymous session persistence. No PII."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any
from uuid import UUID, uuid4

from services.api.db.connection import get_connection

ALLOWED_LANGUAGES = frozenset({"en", "so"})


class SessionError(ValueError):
    pass


@dataclass(frozen=True)
class SessionRecord:
    id: str
    language: str | None
    created_at: datetime
    last_seen_at: datetime

    def to_dict(self) -> dict[str, Any]:
        return {
            "id": self.id,
            "language": self.language,
            "created_at": self.created_at.isoformat(),
            "last_seen_at": self.last_seen_at.isoformat(),
        }


def _row_to_session(row: dict[str, Any]) -> SessionRecord:
    return SessionRecord(
        id=str(row["id"]),
        language=row["language"],
        created_at=row["created_at"],
        last_seen_at=row["last_seen_at"],
    )


def _normalize_language(language: str | None) -> str | None:
    if language is None or language == "":
        return None
    value = language.strip().lower()
    if value in {"english"}:
        value = "en"
    if value in {"somali", "so_so", "so-so"}:
        value = "so"
    if value not in ALLOWED_LANGUAGES:
        raise SessionError("language must be 'en' or 'so'")
    return value


def create_session(language: str | None = None) -> SessionRecord:
    lang = _normalize_language(language)
    session_id = uuid4()
    with get_connection() as conn:
        row = conn.execute(
            """
            INSERT INTO sessions (id, language)
            VALUES (%s, %s)
            RETURNING id, language, created_at, last_seen_at
            """,
            (session_id, lang),
        ).fetchone()
        conn.commit()
    assert row is not None
    return _row_to_session(row)


def get_session(session_id: str) -> SessionRecord | None:
    try:
        parsed = UUID(str(session_id))
    except (ValueError, TypeError):
        return None
    with get_connection() as conn:
        row = conn.execute(
            """
            SELECT id, language, created_at, last_seen_at
            FROM sessions
            WHERE id = %s
            """,
            (parsed,),
        ).fetchone()
    if row is None:
        return None
    return _row_to_session(row)


def touch_session(session_id: str, *, language: str | None = None) -> SessionRecord | None:
    try:
        parsed = UUID(str(session_id))
    except (ValueError, TypeError):
        return None
    lang = _normalize_language(language) if language is not None else None
    with get_connection() as conn:
        if lang is None:
            row = conn.execute(
                """
                UPDATE sessions
                SET last_seen_at = now()
                WHERE id = %s
                RETURNING id, language, created_at, last_seen_at
                """,
                (parsed,),
            ).fetchone()
        else:
            row = conn.execute(
                """
                UPDATE sessions
                SET last_seen_at = now(), language = %s
                WHERE id = %s
                RETURNING id, language, created_at, last_seen_at
                """,
                (lang, parsed),
            ).fetchone()
        conn.commit()
    if row is None:
        return None
    return _row_to_session(row)


def get_or_create_session(session_id: str | None, *, language: str | None = None) -> SessionRecord:
    if session_id:
        existing = touch_session(session_id, language=language)
        if existing is not None:
            return existing
    return create_session(language=language)