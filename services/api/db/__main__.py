from __future__ import annotations

import argparse
import json
import sys

from services.api.db.health import check_db_health
from services.api.db.migrate import migrate
from services.api.db.connection import ping


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Faith Postgres tools")
    parser.add_argument("command", choices=("migrate", "health", "ping"))
    args = parser.parse_args(argv)
    if args.command == "migrate":
        applied = migrate()
        print("applied: " + ", ".join(applied) if applied else "already up to date")
        return 0
    if args.command == "ping":
        ok = ping()
        print("ok" if ok else "failed")
        return 0 if ok else 1
    payload = check_db_health()
    print(json.dumps(payload, indent=2))
    return 0 if payload.get("ok") else 1


if __name__ == "__main__":
    sys.exit(main())