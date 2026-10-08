"""Flask API for notebook-matched EfficientNetB2 MRI inference."""

import logging
import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.exceptions import RequestEntityTooLarge

from services.gradcam import GradCamError
from services.prediction import ModelLoadError, PredictionService
from services.preprocessing import InvalidImageError, decode_and_prepare


BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
ALLOWED_MIME_TYPES = {"image/png", "image/jpeg"}
MAX_UPLOAD_BYTES = 10 * 1024 * 1024


def create_app() -> Flask:
    app = Flask(__name__)
    app.config["MAX_CONTENT_LENGTH"] = MAX_UPLOAD_BYTES

    allowed_origins = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
        if origin.strip()
    ]
    CORS(app, resources={r"/*": {"origins": allowed_origins}})

    configured_model_path = Path(os.getenv(
        "MODEL_PATH",
        str(BASE_DIR / "models" / "effnetb2_best.keras"),
    )).expanduser()
    model_path = (
        configured_model_path
        if configured_model_path.is_absolute()
        else BASE_DIR / configured_model_path
    )
    predictor = PredictionService(model_path)

    @app.get("/health")
    def health():
        return jsonify({"status": "ok", "model": "EfficientNetB2"})

    @app.post("/predict")
    def predict():
        uploaded = request.files.get("file")
        if uploaded is None or not uploaded.filename:
            return jsonify({"error": "No image file was uploaded."}), 400

        extension = uploaded.filename.rsplit(".", 1)[-1].lower() if "." in uploaded.filename else ""
        if extension not in ALLOWED_EXTENSIONS:
            return jsonify({"error": "Unsupported file extension. Use PNG, JPG, or JPEG."}), 415
        if uploaded.mimetype not in ALLOWED_MIME_TYPES:
            return jsonify({"error": "Unsupported image type. Use PNG, JPG, or JPEG."}), 415

        try:
            prepared = decode_and_prepare(uploaded.read())
            return jsonify(predictor.predict(prepared))
        except InvalidImageError as exc:
            return jsonify({"error": str(exc)}), 400
        except GradCamError:
            app.logger.exception("Grad-CAM generation failed")
            return jsonify({"error": "Prediction completed, but Grad-CAM visualization failed."}), 500
        except Exception:
            app.logger.exception("MRI analysis failed")
            return jsonify({"error": "Unable to analyze this image. Please try again."}), 500

    @app.errorhandler(RequestEntityTooLarge)
    def handle_too_large(_error):
        return jsonify({"error": "The uploaded image exceeds the 10 MB limit."}), 413

    return app


if __name__ == "__main__":
    try:
        application = create_app()
    except ModelLoadError as exc:
        logging.basicConfig(level=logging.ERROR)
        logging.error("API startup failed: %s", exc)
        raise SystemExit(1) from exc

    application.run(
        host=os.getenv("FLASK_HOST", "127.0.0.1"),
        port=int(os.getenv("FLASK_PORT", "5000")),
        debug=os.getenv("FLASK_DEBUG", "false").lower() == "true",
    )
