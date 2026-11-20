
from pathlib import Path
import json
import numpy as np
import tensorflow as tf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent

MODEL_DIR = ROOT / "artifacts_v2"
IMAGE_PATH = ROOT / "tests/sample_images/aloe5.png"
OUTPUT_DIR = ROOT / "tests/crop_results"

OUTPUT_DIR.mkdir(exist_ok=True)

model = tf.keras.models.load_model(
    MODEL_DIR / "species_classifier.keras"
)

with open(MODEL_DIR / "species_classifier_labels.json") as f:
    class_names = json.load(f)


def predict(image, title):
    image = image.convert("RGB")
    image = image.resize(
        (224, 224),
        Image.Resampling.BILINEAR
    )

    array = np.asarray(image, dtype=np.float32)
    batch = np.expand_dims(array, axis=0)

    # Model already contains MobileNetV2 preprocessing
    probabilities = model.predict(batch, verbose=0)[0]

    print(f"\n{title}")

    for index in np.argsort(probabilities)[::-1]:
        print(
            f"{class_names[index]}: "
            f"{probabilities[index] * 100:.2f}%"
        )


with Image.open(IMAGE_PATH) as img:
    original = img.convert("RGB")

width, height = original.size

# Crop central 60% of the image
left = int(width * 0.20)
top = int(height * 0.20)
right = int(width * 0.80)
bottom = int(height * 0.80)

cropped = original.crop(
    (left, top, right, bottom)
)

cropped.save(OUTPUT_DIR / "aloe5_cropped.jpg")

predict(original, "Original Image")
predict(cropped, "Cropped Image")

print("\nCrop saved to:", OUTPUT_DIR)
