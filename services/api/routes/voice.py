from flask import Blueprint, request, jsonify, current_app
from schemas.requests import validate_voice

voice_bp = Blueprint("voice", __name__)


@voice_bp.post("/api/voice")
def voice():
    if not request.content_type or "multipart/form-data" not in request.content_type:
        return _error("INVALID_REQUEST", "content-type must be multipart/form-data", 415)

    errors = validate_voice(request.files, request.form)
    if errors:
        return _error("INVALID_REQUEST", errors[0], 400)

    audio_bytes = request.files["audio"].read()
    language = request.form.get("language", "en")
    session_id = request.form.get("session_id")

    result = current_app.orchestrator.handle_voice(
        audio_bytes=audio_bytes,
        language=language,
        session_id=session_id,
    )

    if not result.voice_ready:
        return jsonify({
            "error": {
                "code": "VOICE_SERVICE_UNAVAILABLE",
                "message": result.error or "Voice service is not yet available.",
            }
        }), 503

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
        "audio_url": result.audio_url,
    }), 200


def _error(code: str, message: str, status: int):
    return jsonify({"error": {"code": code, "message": message}}), status
