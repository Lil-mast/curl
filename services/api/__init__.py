"""API package and knowledge seeding utilities.

This package owns the database, retrieval, migration, and seed modules.
It also includes the knowledge ingestion logic used to load markdown content
into Postgres with idempotent upserts by slug and language.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path

from services.api.db.connection import get_connection

DOMAINS = (
    "services",
    "education",
    "jobs",
    "scholarships",
    "community",
    "cv-help",
)
LANGUAGES = ("en", "so")

KNOWLEDGE_ROOT = Path(__file__).resolve().parents[3] / "knowledge"

FRONTMATTER_RE = re.compile(
    r"^---\s*\n(.*?)\n---\s*\n(.*)$",
    re.DOTALL,
)


class SeedError(ValueError):
    """A knowledge file is missing required fields or is malformed."""


@dataclass
class KnowledgeDocument:
    slug: str
    domain: str
    language: str
    title: str
    summary: str
    body: str
    source_name: str
    source_url: str | None
    contact_name: str | None
    contact_phone: str | None
    contact_email: str | None
    contact_url: str | None
    last_reviewed: date
    review_cadence_days: int
    is_verified: bool
    tags: list[str]
    path: Path


def _parse_scalar(raw: str) -> str:
    value = raw.strip()
    if (value.startswith('"') and value.endswith('"')) or (
        value.startswith("'") and value.endswith("'")
    ):
        return value[1:-1]
    return value


def _parse_frontmatter(block: str) -> dict[str, str]:
    meta: dict[str, str] = {}
    for line in block.splitlines():
        if not line.strip() or line.strip().startswith("#"):
            continue
        if ":" not in line:
            raise SeedError(f"Invalid frontmatter line: {line}")
        key, _, rest = line.partition(":")
        meta[key.strip()] = _parse_scalar(rest)
    return meta


def parse_knowledge_file(path: Path) -> KnowledgeDocument:
    text = path.read_text(encoding="utf-8")
    match = FRONTMATTER_RE.match(text)
    if not match:
        raise SeedError(f"{path}: missing YAML frontmatter delimited by ---")
    meta = _parse_frontmatter(match.group(1))
    body = match.group(2).strip()
    required = (
        "slug",
        "domain",
        "language",
        "title",
        "summary",
        "source_name",
        "last_reviewed",
    )
    missing = [key for key in required if not meta.get(key)]
    if missing:
        raise SeedError(f"{path}: missing fields {missing}")
    if not body:
        raise SeedError(f"{path}: empty body")

    domain = meta["domain"]
    language = meta["language"]
    if domain not in DOMAINS:
        raise SeedError(f"{path}: invalid domain {domain}")
    if language not in LANGUAGES:
        raise SeedError(f"{path}: invalid language {language}")

    tags_raw = meta.get("tags", "")
    tags = [part.strip() for part in tags_raw.split(",") if part.strip()]
    cadence = int(meta.get("review_cadence_days") or "90")
    verified_raw = meta.get("is_verified", "true").lower()
    is_verified = verified_raw in {"1", "true", "yes"}

    return KnowledgeDocument(
        slug=meta["slug"],
        domain=domain,
        language=language,
        title=meta["title"],
        summary=meta["summary"],
        body=body,
        source_name=meta["source_name"],
        source_url=meta.get("source_url") or None,
        contact_name=meta.get("contact_name") or None,
        contact_phone=meta.get("contact_phone") or None,
        contact_email=meta.get("contact_email") or None,
        contact_url=meta.get("contact_url") or None,
        last_reviewed=date.fromisoformat(meta["last_reviewed"]),
        review_cadence_days=cadence,
        is_verified=is_verified,
        tags=tags,
        path=path,
    )


def discover_knowledge_files(root: Path = KNOWLEDGE_ROOT) -> list[Path]:
    if not root.exists():
        return []
    return sorted(root.glob("*/*.md"))


def seed_knowledge(*, root: Path = KNOWLEDGE_ROOT) -> dict[str, int]:
    files = discover_knowledge_files(root)
    if not files:
        raise SeedError(f"No knowledge markdown files found under {root}")

    documents = [parse_knowledge_file(path) for path in files]
    upserted = 0
    with get_connection(direct=True) as conn:
        for doc in documents:
            conn.execute(
                """
                INSERT INTO knowledge_entries (
                    slug, domain, language, title, summary, body,
                    source_name, source_url,
                    contact_name, contact_phone, contact_email, contact_url,
                    last_reviewed, review_cadence_days, is_verified, tags,
                    updated_at
                ) VALUES (
                    %(slug)s, %(domain)s, %(language)s, %(title)s, %(summary)s, %(body)s,
                    %(source_name)s, %(source_url)s,
                    %(contact_name)s, %(contact_phone)s, %(contact_email)s, %(contact_url)s,
                    %(last_reviewed)s, %(review_cadence_days)s, %(is_verified)s, %(tags)s,
                    now()
                )
                ON CONFLICT (slug, language) DO UPDATE SET
                    domain = EXCLUDED.domain,
                    title = EXCLUDED.title,
                    summary = EXCLUDED.summary,
                    body = EXCLUDED.body,
                    source_name = EXCLUDED.source_name,
                    source_url = EXCLUDED.source_url,
                    contact_name = EXCLUDED.contact_name,
                    contact_phone = EXCLUDED.contact_phone,
                    contact_email = EXCLUDED.contact_email,
                    contact_url = EXCLUDED.contact_url,
                    last_reviewed = EXCLUDED.last_reviewed,
                    review_cadence_days = EXCLUDED.review_cadence_days,
                    is_verified = EXCLUDED.is_verified,
                    tags = EXCLUDED.tags,
                    updated_at = now()
                """,
                {
                    "slug": doc.slug,
                    "domain": doc.domain,
                    "language": doc.language,
                    "title": doc.title,
                    "summary": doc.summary,
                    "body": doc.body,
                    "source_name": doc.source_name,
                    "source_url": doc.source_url,
                    "contact_name": doc.contact_name,
                    "contact_phone": doc.contact_phone,
                    "contact_email": doc.contact_email,
                    "contact_url": doc.contact_url,
                    "last_reviewed": doc.last_reviewed,
                    "review_cadence_days": doc.review_cadence_days,
                    "is_verified": doc.is_verified,
                    "tags": doc.tags,
                },
            )
            upserted += 1
        conn.commit()

    return {"files": len(files), "upserted": upserted}