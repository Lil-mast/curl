import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from routes.health import health_bp
from routes.ask import ask_bp
from routes.voice import voice_bp

load_dotenv()


def create_app():
    app = Flask(__name__)

    allowed_origin = os.getenv("ALLOWED_ORIGIN", "")
    CORS(app, origins=[allowed_origin] if allowed_origin else [])

    app.register_blueprint(health_bp)
    app.register_blueprint(ask_bp)
    app.register_blueprint(voice_bp)

    @app.errorhandler(404)
    def not_found(_):
        return jsonify({"error": {"code": "NOT_FOUND", "message": "route not found"}}), 404

    @app.errorhandler(405)
    def method_not_allowed(_):
        return jsonify({"error": {"code": "METHOD_NOT_ALLOWED", "message": "method not allowed"}}), 405

    @app.errorhandler(500)
    def internal_error(_):
        return jsonify({"error": {"code": "INTERNAL_ERROR", "message": "an unexpected error occurred"}}), 500

    return app


if __name__ == "__main__":
    app = create_app()
    app.run()
