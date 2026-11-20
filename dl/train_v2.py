
from pathlib import Path
import json
import tensorflow as tf

ROOT = Path(__file__).resolve().parent

# New dataset and model output
DATA_DIR = ROOT / "processed_dataset_v2"
OUTPUT_DIR = ROOT / "artifacts_v2"

IMG_SIZE = (224, 224)
BATCH_SIZE = 16
SEED = 42

tf.keras.utils.set_random_seed(SEED)

# Protect existing trained models
if OUTPUT_DIR.exists():
    raise FileExistsError(
        f"{OUTPUT_DIR} already exists. "
        "Inspect it before training."
    )

for split in ("train", "val", "test"):
    if not (DATA_DIR / split).is_dir():
        raise FileNotFoundError(DATA_DIR / split)

OUTPUT_DIR.mkdir(parents=True)

# Load dataset
train_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR / "train",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=True,
    seed=SEED,
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR / "val",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False,
)

test_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR / "test",
    image_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    shuffle=False,
)

class_names = train_ds.class_names

if val_ds.class_names != class_names:
    raise ValueError("Validation class names do not match")

if test_ds.class_names != class_names:
    raise ValueError("Test class names do not match")

print("Classes:", class_names)

with open(
    OUTPUT_DIR / "species_classifier_labels.json",
    "w"
) as f:
    json.dump(class_names, f, indent=2)

AUTOTUNE = tf.data.AUTOTUNE

train_ds = train_ds.prefetch(AUTOTUNE)
val_ds = val_ds.prefetch(AUTOTUNE)
test_ds = test_ds.prefetch(AUTOTUNE)

# Image augmentation
augmentation = tf.keras.Sequential([
    tf.keras.layers.RandomFlip("horizontal"),
    tf.keras.layers.RandomRotation(0.10),
    tf.keras.layers.RandomZoom(0.15),
    tf.keras.layers.RandomContrast(0.15),
])

# Pretrained MobileNetV2
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights="imagenet",
)

# Stage 1: Train classifier head
base_model.trainable = False

inputs = tf.keras.Input(shape=(224, 224, 3))

x = augmentation(inputs)
x = tf.keras.applications.mobilenet_v2.preprocess_input(x)

x = base_model(x, training=False)

x = tf.keras.layers.GlobalAveragePooling2D()(x)
x = tf.keras.layers.Dropout(0.30)(x)

outputs = tf.keras.layers.Dense(
    len(class_names),
    activation="softmax"
)(x)

model = tf.keras.Model(inputs, outputs)

model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.001
    ),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)

callbacks = [
    tf.keras.callbacks.EarlyStopping(
        monitor="val_loss",
        patience=4,
        restore_best_weights=True,
    )
]

print("\nStage 1: Training classifier head")

history = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=15,
    callbacks=callbacks,
)

# Stage 2: Fine-tune top layers
print("\nStage 2: Fine-tuning MobileNetV2")

base_model.trainable = True

# Freeze earlier layers, train only last 30
for layer in base_model.layers[:-30]:
    layer.trainable = False

# Keep BatchNormalization layers frozen
for layer in base_model.layers:
    if isinstance(
        layer, tf.keras.layers.BatchNormalization
    ):
        layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(
        learning_rate=0.00001
    ),
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"],
)

fine_tune_callbacks = [
    tf.keras.callbacks.EarlyStopping(
        monitor="val_loss",
        patience=4,
        restore_best_weights=True,
    )
]

history_fine = model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=10,
    callbacks=fine_tune_callbacks,
)

# Final test
print("\nEvaluating Dataset V2")

test_loss, test_accuracy = model.evaluate(
    test_ds
)

print(f"\nTest Accuracy: {test_accuracy * 100:.2f}%")
print(f"Test Loss: {test_loss:.4f}")

# Save model
model.save(
    OUTPUT_DIR / "species_classifier.keras"
)

print("\nModel saved to:", OUTPUT_DIR)
