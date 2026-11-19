
import tensorflow as tf

print("TensorFlow Version:", tf.__version__)
print("Available GPUs:", tf.config.list_physical_devices("GPU"))

model = tf.keras.Sequential([
    tf.keras.Input(shape=(224, 224, 3)),
    tf.keras.layers.Conv2D(16, (3, 3), activation="relu"),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dense(6, activation="softmax")
])

model.compile(
    optimizer="adam",
    loss="sparse_categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# Dummy images for testing the CNN pipeline
images = tf.random.uniform((4, 224, 224, 3))
labels = tf.constant([0, 1, 2, 3])

model.fit(images, labels, epochs=1)

print("Deep Learning CNN test successful!")
