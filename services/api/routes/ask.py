from flask import Blueprint, request, jsonify, current_app
from services.api.schemas.requests import validate_ask

ask_bp = Blueprint("ask", __name__)


@ask_bp.post("/api/ask")
def ask():
    data = request.get_json(silent=True)
    if data is None:
        return _error("INVALID_REQUEST", "request body must be valid JSON", 400)

    errors = validate_ask(data)
    if errors:
        return _error("INVALID_REQUEST", errors[0], 400)

    result = current_app.orchestrator.handle_ask(
        message=data["message"].strip(),
        language=data.get("language", "en"),
        domain=data.get("domain"),
        session_id=data.get("session_id"),
    )

    if result.referred:
        return jsonify({
            "referred": True,
            "reason": result.refer_reason,
            "message": result.refer_message,
            "language": result.language,
            "session_id": result.session_id,
        }), 200

    return jsonify({
        "answer": result.answer,
        "language": result.language,
        "sources": result.sources,
        "session_id": result.session_id,
        "disclaimer": result.disclaimer,
    }), 200

def _error(code: str, message: str, status: int):
    return jsonify({"error": {"code": code, "message": message}}), status
