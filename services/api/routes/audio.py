from flask import Blueprint, Response, jsonify
from services import audio_store

audio_bp = Blueprint("audio", __name__)


@audio_bp.get("/api/audio/<token>")
def serve_audio(token: str):
    mp3_bytes = audio_store.get(token)
    if mp3_bytes is None:
        return jsonify({
            "error": {"code": "NOT_FOUND", "message": "audio not found or already played"}
        }), 404
    return Response(mp3_bytes, mimetype="audio/mpeg")
