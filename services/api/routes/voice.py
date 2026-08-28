from flask import Blueprint, request, jsonify
from schemas.requests import validate_voice

voice_bp = Blueprint("voice", __name__)


@voice_bp.post("/api/voice")
def voice():
    if not request.content_type or "multipart/form-data" not in request.content_type:
        return _error("INVALID_REQUEST", "content-type must be multipart/form-data", 415)

    errors = validate_voice(request.files, request.form)
    if errors:
        return _error("INVALID_REQUEST", errors[0], 400)

    # --- STUB: ElevenLabs STT not yet implemented (Isaac / T2.2) ---
    # --- STUB: ElevenLabs TTS not yet implemented (Isaac / T2.3) ---
    return jsonify({
        "answer": None,
        "language": request.form.get("language", "en"),
        "sources": [],
        "session_id": request.form.get("session_id"),
        "audio_url": None,
        "_stub": True,
    }), 200


def _error(code: str, message: str, status: int):
    return jsonify({"error": {"code": code, "message": message}}), status
