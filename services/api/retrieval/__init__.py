"""Knowledge retrieval queries against the Postgres knowledge layer."""

from __future__ import annotations

import re
from datetime import date

from services.api.db.connection import get_connection


def _tokenize(text: str) -> list[str]:
    return [token for token in re.findall(r"[A-Za-z0-9']+", text.lower()) if token]


def _is_stale(last_reviewed: date | str | None, cadence_days: int) -> tuple[bool, int]:
    if last_reviewed is None:
        return True, 0
    try:
        reviewed = date.fromisoformat(str(last_reviewed))
    except ValueError:
        return True, 0
    delta_days = (date.today() - reviewed).days
    return delta_days > int(cadence_days), delta_days


def retrieve_knowledge(query: str, language: str, domain: str | None = None) -> list[dict[str, object]]:
    cleaned = (query or "").strip()
    if not cleaned:
        return []

    tokens = _tokenize(cleaned)
    tsquery = " & ".join(tokens) if tokens else cleaned.lower()
    with get_connection() as conn:
        result = conn.execute(
            """
            SELECT
                slug, domain, language, title, summary, source_name, source_url,
                contact_name, contact_phone, contact_email, contact_url,
                last_reviewed, review_cadence_days, is_verified, tags,
                ts_rank_cd(search_vector, to_tsquery('simple', %s)) AS rank
            FROM knowledge_entries
            WHERE language = %s
              AND (%s::text IS NULL OR domain = %s)
              AND (
                  search_vector @@ to_tsquery('simple', %s)
                  OR title ILIKE %s
                  OR summary ILIKE %s
              )
            ORDER BY rank DESC, last_reviewed DESC
            LIMIT 3
            """,
            (
                tsquery,
                language,
                domain,
                domain,
                tsquery,
                f"%{cleaned}%",
                f"%{cleaned}%",
            ),
        ).fetchall()

        if not result:
            result = conn.execute(
                """
                SELECT
                    slug, domain, language, title, summary, source_name, source_url,
                    contact_name, contact_phone, contact_email, contact_url,
                    last_reviewed, review_cadence_days, is_verified, tags,
                    0.0 AS rank
                FROM knowledge_entries
                WHERE language = %s
                  AND (%s::text IS NULL OR domain = %s)
                ORDER BY last_reviewed DESC
                LIMIT 3
                """,
                (language, domain, domain),
            ).fetchall()

    hits: list[dict[str, object]] = []
    for row in result:
        stale, days_since_review = _is_stale(row["last_reviewed"], int(row["review_cadence_days"]))
        hits.append(
            {
                "slug": row["slug"],
                "domain": row["domain"],
                "language": row["language"],
                "title": row["title"],
                "summary": row["summary"],
                "source_name": row["source_name"],
                "source_url": row["source_url"],
                "last_reviewed": str(row["last_reviewed"]),
                "review_cadence_days": int(row["review_cadence_days"]),
                "stale": stale,
                "days_since_review": days_since_review,
                "is_verified": bool(row["is_verified"]),
                "tags": list(row["tags"] or []),
            }
        )
    return hits


__all__ = ["retrieve_knowledge"]
