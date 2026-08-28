from flask import Blueprint, request, jsonify
from schemas.requests import validate_ask

ask_bp = Blueprint("ask", __name__)


@ask_bp.post("/api/ask")
def ask():
    data = request.get_json(silent=True)
    if data is None:
        return _error("INVALID_REQUEST", "request body must be valid JSON", 400)

    errors = validate_ask(data)
    if errors:
        return _error("INVALID_REQUEST", errors[0], 400)

    # --- STUB: knowledge retrieval not yet implemented (Faith / T3.3) ---
    # --- STUB: language model phrasing not yet implemented            ---
    return jsonify({
        "answer": None,
        "language": data.get("language", "en"),
        "sources": [],
        "session_id": data.get("session_id"),
        "_stub": True,
    }), 200


def _error(code: str, message: str, status: int):
    return jsonify({"error": {"code": code, "message": message}}), status
