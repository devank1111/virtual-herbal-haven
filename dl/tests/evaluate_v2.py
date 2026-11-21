
from pathlib import Path
import json
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt
import csv

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

# Create evaluation output folder
RESULTS_DIR = ROOT / "evaluation_results"
RESULTS_DIR.mkdir(exist_ok=True)

# Save confusion matrix graph
fig, ax = plt.subplots(figsize=(7, 6))

im = ax.imshow(matrix, cmap="Blues")

ax.set_xticks(range(len(class_names)))
ax.set_yticks(range(len(class_names)))

ax.set_xticklabels(class_names)
ax.set_yticklabels(class_names)

ax.set_xlabel("Predicted Plant")
ax.set_ylabel("Actual Plant")
ax.set_title("Confusion Matrix - MobileNetV2")

for i in range(len(class_names)):
    for j in range(len(class_names)):
        ax.text(
            j, i, str(matrix[i, j]),
            ha="center",
            va="center",
            color="white" if matrix[i, j] > matrix.max() / 2 else "black"
        )

fig.colorbar(im)
plt.tight_layout()

plt.savefig(
    RESULTS_DIR / "confusion_matrix.png",
    dpi=300
)
plt.close()

print("Confusion matrix graph saved!")


# Precision, Recall and F1-Score graph

precision_scores = []
recall_scores = []
f1_scores = []

for i in range(len(class_names)):
    tp = matrix[i, i]
    actual_total = matrix[i, :].sum()
    predicted_total = matrix[:, i].sum()

    precision = tp / predicted_total if predicted_total else 0
    recall = tp / actual_total if actual_total else 0

    f1 = (
        2 * precision * recall / (precision + recall)
        if precision + recall else 0
    )

    precision_scores.append(precision * 100)
    recall_scores.append(recall * 100)
    f1_scores.append(f1 * 100)

x = np.arange(len(class_names))
width = 0.25

fig, ax = plt.subplots(figsize=(9, 6))

ax.bar(x - width, precision_scores, width, label="Precision")
ax.bar(x, recall_scores, width, label="Recall")
ax.bar(x + width, f1_scores, width, label="F1-Score")

ax.set_xlabel("Plant Species")
ax.set_ylabel("Score (%)")
ax.set_title("MobileNetV2 - Classification Performance")
ax.set_xticks(x)
ax.set_xticklabels(class_names)
ax.set_ylim(0, 110)
ax.legend()

plt.tight_layout()
plt.savefig(
    RESULTS_DIR / "classification_metrics.png",
    dpi=300
)
plt.close()

print("Classification metrics graph saved!")

# Calculate test loss and accuracy
test_loss, test_accuracy = model.evaluate(
    dataset,
    verbose=0
)

print(f"\nTest Loss: {test_loss:.4f}")
print(f"Test Accuracy: {test_accuracy * 100:.2f}%")

# Save evaluation metrics to CSV
csv_path = RESULTS_DIR / "evaluation_metrics.csv"

with open(csv_path, "w", newline="") as file:
    writer = csv.writer(file)

    writer.writerow([
        "Plant",
        "Precision (%)",
        "Recall (%)",
        "F1-Score (%)",
        "Support"
    ])

    for i, name in enumerate(class_names):
        writer.writerow([
            name,
            round(precision_scores[i], 2),
            round(recall_scores[i], 2),
            round(f1_scores[i], 2),
            int(matrix[i].sum())
        ])

    writer.writerow([])
    writer.writerow(["Overall Accuracy (%)", round(test_accuracy * 100, 2)])
    writer.writerow(["Test Loss", round(test_loss, 4)])

print("Evaluation CSV saved!")

# Existing model: Train, Validation and Test comparison

splits = ["train", "val", "test"]
accuracies = []
losses = []

for split in splits:
    split_dir = ROOT / "processed_dataset_v2" / split

    split_dataset = tf.keras.utils.image_dataset_from_directory(
        split_dir,
        image_size=(224, 224),
        batch_size=16,
        shuffle=False
    )

    loss, accuracy = model.evaluate(
        split_dataset,
        verbose=0
    )

    losses.append(loss)
    accuracies.append(accuracy * 100)

    print(
        f"{split}: Accuracy={accuracy * 100:.2f}%, "
        f"Loss={loss:.4f}"
    )

# Accuracy comparison graph
fig, ax = plt.subplots(figsize=(8, 5))

ax.bar(splits, accuracies)
ax.set_title("MobileNetV2 - Dataset Accuracy Comparison")
ax.set_xlabel("Dataset Split")
ax.set_ylabel("Accuracy (%)")
ax.set_ylim(0, 105)

plt.tight_layout()
plt.savefig(
    RESULTS_DIR / "accuracy_comparison.png",
    dpi=300
)
plt.close()

# Loss comparison graph
fig, ax = plt.subplots(figsize=(8, 5))

ax.bar(splits, losses)
ax.set_title("MobileNetV2 - Dataset Loss Comparison")
ax.set_xlabel("Dataset Split")
ax.set_ylabel("Loss")

plt.tight_layout()
plt.savefig(
    RESULTS_DIR / "loss_comparison.png",
    dpi=300
)
plt.close()

print("Accuracy and Loss comparison graphs saved!")
