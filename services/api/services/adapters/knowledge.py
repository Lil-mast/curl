"""Flask adapter for knowledge retrieval.

Faith owns the Postgres-backed knowledge data. This adapter keeps the Flask
orchestrator contract stable while mapping database rows onto the existing
`retrieve(query, language, domain) -> RetrievalResult` interface.
"""

from __future__ import annotations

import re
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any

def _tokenize(text: str) -> list[str]:
    return [token for token in re.findall(r"[A-Za-z0-9']+", text.lower()) if token]


def _compose_contact(row: dict[str, Any]) -> str | None:
    parts = [
        row.get("contact_name"),
        row.get("contact_phone"),
        row.get("contact_email"),
        row.get("contact_url"),
    ]
    values = [str(part).strip() for part in parts if part not in (None, "")]
    if not values:
        return None
    return " | ".join(values)


@dataclass(frozen=True)
class KnowledgeEntry:
    title: str
    body: str
    source_org: str
    domain: str
    contact: str | None = None
    source_url: str | None = None


@dataclass
class RetrievalResult:
    entries: list[KnowledgeEntry] = field(default_factory=list)

    @property
    def found(self) -> bool:
        return bool(self.entries)


class BaseKnowledgeRetriever(ABC):
    @abstractmethod
    def retrieve(
        self,
        query: str,
        language: str,
        domain: str | None,
    ) -> RetrievalResult:
        raise NotImplementedError


class KnowledgeRetriever(BaseKnowledgeRetriever):
    def retrieve(
        self,
        query: str,
        language: str,
        domain: str | None,
    ) -> RetrievalResult:
        cleaned = (query or "").strip()
        if not cleaned:
            return RetrievalResult()

        tokens = _tokenize(cleaned)
        tsquery = " & ".join(tokens) if tokens else cleaned.lower()

        from services.api.db.connection import get_connection

        with get_connection() as conn:
            rows = conn.execute(
                """
                SELECT
                    title,
                    body,
                    source_name,
                    domain,
                    source_url,
                    contact_name,
                    contact_phone,
                    contact_email,
                    contact_url,
                    ts_rank_cd(search_vector, to_tsquery('simple', %s)) AS rank,
                    last_reviewed
                FROM knowledge_entries
                WHERE language = %s
                  AND (%s::text IS NULL OR domain = %s)
                  AND (
                      search_vector @@ to_tsquery('simple', %s)
                      OR title ILIKE %s
                      OR summary ILIKE %s
                      OR body ILIKE %s
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
                    f"%{cleaned}%",
                ),
            ).fetchall()

        entries = [
            KnowledgeEntry(
                title=str(row["title"]),
                body=str(row["body"]),
                source_org=str(row["source_name"]),
                domain=str(row["domain"]),
                contact=_compose_contact(row),
                source_url=row.get("source_url"),
            )
            for row in rows
        ]
        return RetrievalResult(entries=entries)


class KnowledgeRetrieverNotReady(BaseKnowledgeRetriever):
    def retrieve(
        self,
        query: str,
        language: str,
        domain: str | None,
    ) -> RetrievalResult:
        return RetrievalResult()


__all__ = [
    "BaseKnowledgeRetriever",
    "KnowledgeEntry",
    "KnowledgeRetriever",
    "KnowledgeRetrieverNotReady",
    "RetrievalResult",
]
