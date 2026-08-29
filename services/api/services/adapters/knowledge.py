"""Flask adapter for knowledge retrieval.

This module wraps the Postgres-backed retrieval layer with a lightweight
retriever abstraction that can be used by the API layer without creating a
second Flask app.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any

from services.api.retrieval import retrieve_knowledge


@dataclass(frozen=True)
class KnowledgeEntry:
    slug: str
    domain: str
    language: str
    title: str
    summary: str
    source_name: str
    source_url: str | None
    last_reviewed: str
    stale: bool
    days_since_review: int
    is_verified: bool
    tags: list[str]

    @classmethod
    def from_row(cls, row: dict[str, Any]) -> "KnowledgeEntry":
        return cls(
            slug=str(row["slug"]),
            domain=str(row["domain"]),
            language=str(row["language"]),
            title=str(row["title"]),
            summary=str(row["summary"]),
            source_name=str(row["source_name"]),
            source_url=row.get("source_url"),
            last_reviewed=str(row["last_reviewed"]),
            stale=bool(row.get("stale", False)),
            days_since_review=int(row.get("days_since_review", 0)),
            is_verified=bool(row.get("is_verified", False)),
            tags=list(row.get("tags") or []),
        )


class BaseKnowledgeRetriever(ABC):
    @abstractmethod
    def get(self, query: str, language: str, domain: str | None = None, limit: int = 3) -> list[KnowledgeEntry]:
        raise NotImplementedError


class KnowledgeRetriever(BaseKnowledgeRetriever):
    def get(self, query: str, language: str, domain: str | None = None, limit: int = 3) -> list[KnowledgeEntry]:
        rows = retrieve_knowledge(query, language, domain)[:limit]
        return [KnowledgeEntry.from_row(row) for row in rows]


__all__ = ["BaseKnowledgeRetriever", "KnowledgeEntry", "KnowledgeRetriever"]
