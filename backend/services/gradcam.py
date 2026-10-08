"""Grad-CAM implementation transcribed from the B2 notebook."""

import base64

import cv2
import numpy as np
import tensorflow as tf


LAST_CONV_LAYER_NAME = "top_activation"


class GradCamError(RuntimeError):
    """Raised when the checkpoint cannot produce a Grad-CAM visualization."""


class GradCamService:
    def __init__(self, model: tf.keras.Model) -> None:
        try:
            activation_output = model.get_layer(LAST_CONV_LAYER_NAME).output
        except ValueError as exc:
            raise GradCamError(
                f"Model does not contain the required Grad-CAM layer: {LAST_CONV_LAYER_NAME}."
            ) from exc

        self._grad_model = tf.keras.models.Model(
            inputs=model.inputs,
            outputs=[activation_output, model.output],
        )

    def make_heatmap(self, image_batch: np.ndarray, class_index: int) -> np.ndarray:
        with tf.GradientTape() as tape:
            conv_outputs, predictions = self._grad_model(image_batch, training=False)
            class_score = predictions[:, class_index]

        grads = tape.gradient(class_score, conv_outputs)
        if grads is None:
            raise GradCamError("TensorFlow could not calculate Grad-CAM gradients.")

        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        conv_outputs = conv_outputs[0]
        heatmap = tf.reduce_sum(conv_outputs * pooled_grads, axis=-1)
        heatmap = tf.maximum(heatmap, 0)
        heatmap = heatmap / (
            tf.reduce_max(heatmap) + tf.keras.backend.epsilon()
        )
        return heatmap.numpy()

    def render(self, bgr_image: np.ndarray, image_batch: np.ndarray, class_index: int) -> dict[str, str]:
        heatmap = self.make_heatmap(image_batch, class_index)
        heatmap_resized = cv2.resize(
            heatmap,
            (bgr_image.shape[1], bgr_image.shape[0]),
        )
        heatmap_uint8 = np.uint8(255 * heatmap_resized)
        colored_heatmap = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
        overlay = cv2.addWeighted(bgr_image, 0.6, colored_heatmap, 0.4, 0)

        return {
            "original_image": _to_data_url(bgr_image),
            "heatmap": _to_data_url(colored_heatmap),
            "overlay": _to_data_url(overlay),
        }


def _to_data_url(bgr_image: np.ndarray) -> str:
    success, encoded = cv2.imencode(".png", bgr_image)
    if not success:
        raise GradCamError("Unable to encode a Grad-CAM output image.")
    payload = base64.b64encode(encoded.tobytes()).decode("ascii")
    return f"data:image/png;base64,{payload}"

