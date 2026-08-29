"""CLI: python -m services.api.retrieval QUERY -l en -d services"""

from __future__ import annotations

import argparse
import json
import sys

from services.api.retrieval import retrieve_knowledge


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Retrieve trusted knowledge entries from Postgres.")
    parser.add_argument("query", help="Search text to match against Postgres knowledge entries")
    parser.add_argument("-l", "--language", choices=("en", "so"), default="en")
    parser.add_argument("-d", "--domain", choices=("services", "education", "jobs", "scholarships", "community", "cv-help"), default=None)
    args = parser.parse_args(argv)

    results = retrieve_knowledge(args.query, args.language, args.domain)
    payload = {
        "query": args.query,
        "language": args.language,
        "domain": args.domain,
        "results": results,
    }
    print(json.dumps(payload, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
