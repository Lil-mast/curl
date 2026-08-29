"""Apply numbered SQL migrations against Neon."""

from __future__ import annotations

import re
from pathlib import Path

from services.api.db.connection import get_connection

MIGRATIONS_DIR = Path(__file__).resolve().parents[1] / "migrations"
_DOLLAR_TAG = re.compile(r"\$[A-Za-z0-9_]*\$")

ENSURE_MIGRATIONS_TABLE = """
CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
"""


def split_sql_statements(script: str) -> list[str]:
    statements: list[str] = []
    current: list[str] = []
    dollar_tag: str | None = None
    i = 0
    length = len(script)
    while i < length:
        if dollar_tag is not None:
            end = script.find(dollar_tag, i)
            if end == -1:
                current.append(script[i:])
                break
            current.append(script[i : end + len(dollar_tag)])
            i = end + len(dollar_tag)
            dollar_tag = None
            continue
        if script.startswith("--", i):
            newline = script.find("\n", i)
            i = length if newline == -1 else newline + 1
            continue
        match = _DOLLAR_TAG.match(script, i)
        if match:
            dollar_tag = match.group(0)
            current.append(dollar_tag)
            i = match.end()
            continue
        char = script[i]
        if char == ";":
            stmt = "".join(current).strip()
            if stmt:
                statements.append(stmt)
            current = []
            i += 1
            continue
        current.append(char)
        i += 1
    stmt = "".join(current).strip()
    if stmt:
        statements.append(stmt)
    return statements


def list_migration_files() -> list[Path]:
    if not MIGRATIONS_DIR.exists():
        return []
    return sorted(p for p in MIGRATIONS_DIR.glob("*.sql") if p.name[:3].isdigit())


def applied_versions(conn) -> set[str]:
    rows = conn.execute("SELECT version FROM schema_migrations").fetchall()
    return {row["version"] for row in rows}


def migrate() -> list[str]:
    applied: list[str] = []
    with get_connection(direct=True) as conn:
        conn.execute(ENSURE_MIGRATIONS_TABLE)
        conn.commit()
        done = applied_versions(conn)
        for path in list_migration_files():
            version = path.stem
            if version in done:
                continue
            sql = path.read_text(encoding="utf-8")
            for statement in split_sql_statements(sql):
                conn.execute(statement)
            conn.execute(
                "INSERT INTO schema_migrations (version) VALUES (%s)",
                (version,),
            )
            conn.commit()
            applied.append(version)
    return applied