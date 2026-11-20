
from pathlib import Path
import json
import numpy as np
import tensorflow as tf

ROOT = Path(__file__).resolve().parent.parent
MODEL_DIR = ROOT / "artifacts_v2"
IMAGE_DIR = ROOT / "tests" / "sample_images"

model = tf.keras.models.load_model(
    MODEL_DIR / "species_classifier.keras"
)

with open(
    MODEL_DIR / "species_classifier_labels.json"
) as f:
    class_names = json.load(f)

extensions = {".jpg", ".jpeg", ".png", ".webp"}

images = sorted(
    p for p in IMAGE_DIR.iterdir()
    if p.is_file() and p.suffix.lower() in extensions
)

print("Classes:", class_names)
print("External test images:", len(images))

for path in images:
    image = tf.keras.utils.load_img(
        path, target_size=(224, 224)
    )

    array = tf.keras.utils.img_to_array(image)
    batch = np.expand_dims(array, axis=0)

    # Preprocessing is already inside the model
    probabilities = model.predict(batch, verbose=0)[0]

    index = int(np.argmax(probabilities))
    prediction = class_names[index]
    confidence = float(probabilities[index]) * 100

    print(
        f"{path.name}: "
        f"{prediction} ({confidence:.2f}%)"
    )
