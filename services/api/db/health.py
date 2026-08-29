"""Database health check for Alvine's /api/health."""

from __future__ import annotations

from services.api.db.connection import DatabaseConfigError, get_connection


def check_db_health() -> dict:
    try:
        with get_connection() as conn:
            row = conn.execute(
                """
                SELECT
                    current_database() AS database,
                    (SELECT count(*) FROM knowledge_entries) AS knowledge_count,
                    (SELECT count(*) FROM knowledge_entries WHERE is_verified) AS verified_count
                """
            ).fetchone()
        assert row is not None
        return {
            "ok": True,
            "database": row["database"],
            "knowledge_count": row["knowledge_count"],
            "verified_count": row["verified_count"],
        }
    except DatabaseConfigError as exc:
        return {"ok": False, "error": str(exc)}
    except Exception as exc:
        return {"ok": False, "error": str(exc)}