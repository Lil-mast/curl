"""Service adapters for the API knowledge layer."""

from .adapters.knowledge import BaseKnowledgeRetriever, KnowledgeEntry, KnowledgeRetriever

__all__ = ["BaseKnowledgeRetriever", "KnowledgeEntry", "KnowledgeRetriever"]
