"""
Knowledge retrieval adapter — integration boundary for Faith's module (T3.3).

Flask calls retrieve(); Faith implements the real version backed by Neon.

CONTRACT
--------
retrieve(query, language, domain) -> RetrievalResult

RetrievalResult.entries  : list of KnowledgeEntry
RetrievalResult.found    : bool  (False when nothing matched)

KnowledgeEntry fields:
    title       str
    body        str   (in the requested language where available)
    source_org  str
    contact     str | None
    source_url  str | None
    domain      str

Faith: implement KnowledgeRetriever by subclassing BaseKnowledgeRetriever
and passing an instance to create_orchestrator() in app.py.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field


@dataclass
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
        return len(self.entries) > 0


class BaseKnowledgeRetriever(ABC):
    @abstractmethod
    def retrieve(
        self,
        query: str,
        language: str,
        domain: str | None,
    ) -> RetrievalResult:
        """Query Neon and return matching knowledge entries."""


class KnowledgeRetrieverNotReady(BaseKnowledgeRetriever):
    """
    Placeholder used until Faith's Neon-backed implementation is wired in.
    Always returns an empty result so the orchestrator can exercise the
    'no knowledge found' path without a database connection.
    """

    def retrieve(self, query: str, language: str, domain: str | None) -> RetrievalResult:
        return RetrievalResult()
