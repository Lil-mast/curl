"""CLI: python -m services.api.seed"""

from __future__ import annotations

import json
import sys

from services.api.seed import SeedError, seed_knowledge


def main() -> int:
    try:
        result = seed_knowledge()
    except SeedError as exc:
        print(f"seed failed: {exc}", file=sys.stderr)
        return 1
    print(json.dumps(result, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())