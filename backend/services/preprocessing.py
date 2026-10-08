"""Notebook-matched OpenCV image decoding and resizing."""

from dataclasses import dataclass

import cv2
import numpy as np


IMAGE_SIZE = 240


class InvalidImageError(ValueError):
    """Raised when uploaded bytes cannot be decoded as an image."""


@dataclass(frozen=True)
class PreparedImage:
    """The resized BGR image and float32 batch passed to EfficientNetB2."""

    bgr_image: np.ndarray
    batch: np.ndarray


def decode_and_prepare(image_bytes: bytes) -> PreparedImage:
    """Decode with OpenCV, resize to 240x240, and add a batch dimension.

    Deliberately does not convert BGR to RGB, crop, normalize, or augment. This
    matches the B2 notebook's test-image inference path.
    """
    if not image_bytes:
        raise InvalidImageError("The uploaded image is empty.")

    encoded = np.frombuffer(image_bytes, dtype=np.uint8)
    image = cv2.imdecode(encoded, cv2.IMREAD_COLOR)
    if image is None:
        raise InvalidImageError("Unable to read the uploaded image.")

    resized = cv2.resize(image, (IMAGE_SIZE, IMAGE_SIZE))
    batch = np.expand_dims(resized, axis=0).astype("float32")
    return PreparedImage(bgr_image=resized, batch=batch)

