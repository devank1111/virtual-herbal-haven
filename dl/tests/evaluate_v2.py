
from pathlib import Path
import json
import numpy as np
import tensorflow as tf

ROOT = Path(__file__).resolve().parent.parent
MODEL_DIR = ROOT / "artifacts_v2"
TEST_DIR = ROOT / "processed_dataset_v2" / "test"

model = tf.keras.models.load_model(
    MODEL_DIR / "species_classifier.keras"
)

with open(
    MODEL_DIR / "species_classifier_labels.json"
) as f:
    class_names = json.load(f)

dataset = tf.keras.utils.image_dataset_from_directory(
    TEST_DIR,
    image_size=(224, 224),
    batch_size=16,
    shuffle=False
)

if dataset.class_names != class_names:
    raise ValueError("Class names do not match")

actual = []
predicted = []

for images, labels in dataset:
    probabilities = model.predict(images, verbose=0)

    actual.extend(labels.numpy())
    predicted.extend(np.argmax(probabilities, axis=1))

actual = np.array(actual)
predicted = np.array(predicted)

matrix = tf.math.confusion_matrix(
    actual,
    predicted,
    num_classes=len(class_names)
).numpy()

print("\nConfusion Matrix")
print("Rows = Actual, Columns = Predicted")
print("Classes:", class_names)
print(matrix)

print("\nPer-Plant Accuracy")

for i, name in enumerate(class_names):
    total = matrix[i].sum()
    correct = matrix[i, i]
    accuracy = 100 * correct / total if total else 0

    print(
        f"{name}: {correct}/{total} "
        f"({accuracy:.2f}%)"
    )

print(
    f"\nOverall Accuracy: "
    f"{100 * np.mean(actual == predicted):.2f}%"
)
