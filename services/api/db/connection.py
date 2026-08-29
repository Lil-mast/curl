"""Single Postgres connection layer. Faith owns this. Neon or local Postgres."""

from __future__ import annotations
import os
from collections.abc import Generator
from contextlib import contextmanager
from urllib.parse import parse_qsl, urlencode, urlparse, urlunparse
from pathlib import Path

from dotenv import load_dotenv
from psycopg import Connection, connect
from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool

_ROOT = Path(__file__).resolve().parents[3]
load_dotenv(_ROOT / ".env", override=True)
load_dotenv(_ROOT / "apps" / ".env", override=False)
_POOL: ConnectionPool | None = None

class DatabaseConfigError(RuntimeError):
    """Raised when DATABASE_URL is missing or unusable."""
def _ensure_ssl_for_neon(url: str) -> str:
    parsed = urlparse(url)
    host = (parsed.hostname or "").lower()
    if "neon.tech" not in host and "neon.build" not in host:
        return url
    query = dict(parse_qsl(parsed.query, keep_blank_values=True))
    query.setdefault("sslmode", "require")
    return urlunparse(parsed._replace(query=urlencode(query)))
def get_database_url(*, direct: bool = False) -> str:
    if direct:
        url = (
            os.getenv("DATABASE_DIRECT_URL")
            or os.getenv("DATABASE_URL_UNPOOLED")
            or os.getenv("DATABASE_URL")
        )
    else:
        url = os.getenv("DATABASE_URL")
    if not url:
        raise DatabaseConfigError("DATABASE_URL is not set in .env")
    return _ensure_ssl_for_neon(url)

def get_pool() -> ConnectionPool:
    global _POOL
    if _POOL is None or _POOL.closed:
        _POOL = ConnectionPool(
            conninfo=get_database_url(direct=False),
            min_size=1,
            max_size=8,
            timeout=10,
            kwargs={"row_factory": dict_row, "connect_timeout": 8},
            open=True,
        )
    return _POOL
def close_pool() -> None:
    global _POOL
    if _POOL is not None and not _POOL.closed:
        _POOL.close()
    _POOL = None
@contextmanager
def get_connection(*, direct: bool = False) -> Generator[Connection, None, None]:
    if direct:
        conn = connect(get_database_url(direct=True), row_factory=dict_row)
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise
        finally:
            conn.close()
        return
    with get_pool().connection() as conn:
        yield conn
def ping() -> bool:
    with get_connection() as conn:
        row = conn.execute("SELECT 1 AS ok").fetchone()
        return bool(row and row["ok"] == 1)
