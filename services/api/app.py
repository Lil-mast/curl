"""Flask HTTP app for Maktab AI.

Local:  python -m services.api.app
Render: gunicorn --bind 0.0.0.0:$PORT services.api.app:app
"""

from __future__ import annotations

import os

from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

_ROOT = Path(__file__).resolve().parents[2]
load_dotenv(_ROOT / ".env", override=True)
load_dotenv(_ROOT / "apps" / ".env", override=False)


def _cors_origins() -> list[str]:
    raw = os.getenv("ALLOWED_ORIGINS") or os.getenv("ALLOWED_ORIGIN") or "http://localhost:3000"
    return [part.strip() for part in raw.split(",") if part.strip()]


def create_app() -> Flask:
    app = Flask(__name__)
    app.secret_key = os.getenv("FLASK_SECRET_KEY") or "dev-only-change-me"
    CORS(app, origins=_cors_origins())

    @app.get("/health")
    @app.get("/api/health")
    def health():
        payload: dict = {"ok": True, "service": "maktab-api"}
        try:
            from services.api.db.health import check_db_health

            payload["db"] = check_db_health()
        except Exception as exc:
            payload["db"] = {"ok": False, "error": str(exc)}
        return jsonify(payload)

    @app.get("/api/knowledge")
    def knowledge():
        query = (request.args.get("q") or request.args.get("query") or "").strip()
        language = (request.args.get("lang") or request.args.get("language") or "en").lower()
        if language not in {"en", "so"}:
            language = "en"
        domain = request.args.get("domain") or None
        try:
            from services.api.retrieval import retrieve_knowledge

            results = retrieve_knowledge(query, language, domain)
            return jsonify({"query": query, "language": language, "domain": domain, "results": results})
        except Exception as exc:
            return jsonify({"error": str(exc), "results": []}), 503

    return app


app = create_app()


def main() -> None:
    port = int(os.getenv("PORT") or "5000")
    app.run(host="0.0.0.0", port=port, debug=os.getenv("FLASK_DEBUG") == "1")


if __name__ == "__main__":
    main()
