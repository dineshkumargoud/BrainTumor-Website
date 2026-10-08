"""Model loading and inference for the trained EfficientNetB2 checkpoint."""

from pathlib import Path

import numpy as np
import tensorflow as tf

from services.gradcam import GradCamService
from services.preprocessing import PreparedImage


CLASS_NAMES = ("Glioma", "Meningioma", "Pituitary")


class ModelLoadError(RuntimeError):
    """Raised when the trained checkpoint cannot be loaded safely."""


class PredictionService:
    def __init__(self, model_path: str | Path) -> None:
        checkpoint = Path(model_path).expanduser().resolve()
        if not checkpoint.is_file():
            raise ModelLoadError(
                "Trained model not found. Place effnetb2_best.keras at "
                f"'{checkpoint}' or set MODEL_PATH to its location."
            )

        try:
            self._model = tf.keras.models.load_model(checkpoint)
        except Exception as exc:
            raise ModelLoadError(
                f"Unable to load the TensorFlow model from '{checkpoint}'."
            ) from exc

        output_size = int(self._model.output_shape[-1])
        if output_size != len(CLASS_NAMES):
            raise ModelLoadError(
                f"Model output has {output_size} classes; expected {len(CLASS_NAMES)}."
            )
        self._gradcam = GradCamService(self._model)

    def predict(self, prepared: PreparedImage) -> dict:
        predictions = self._model.predict(prepared.batch, verbose=0)
        probabilities = np.asarray(predictions[0], dtype=np.float64)
        if probabilities.shape != (len(CLASS_NAMES),) or not np.all(np.isfinite(probabilities)):
            raise RuntimeError("The model returned an invalid prediction vector.")

        predicted_index = int(np.argmax(probabilities))
        gradcam_images = self._gradcam.render(
            prepared.bgr_image,
            prepared.batch,
            predicted_index,
        )

        return {
            "prediction": CLASS_NAMES[predicted_index],
            "class_index": predicted_index,
            "confidence": float(probabilities[predicted_index]),
            "probabilities": {
                name: float(probabilities[index])
                for index, name in enumerate(CLASS_NAMES)
            },
            "gradcam": gradcam_images,
        }

