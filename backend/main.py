
import io
import json
import os
from contextlib import asynccontextmanager
from pathlib import Path

import numpy as np
import tensorflow as tf

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, ImageOps, UnidentifiedImageError


ROOT = Path(__file__).resolve().parent

MODEL_DIR = ROOT.parent / "dl" / "artifacts_v2"
MODEL_PATH = MODEL_DIR / "species_classifier.keras"
LABELS_PATH = MODEL_DIR / "species_classifier_labels.json"

model = None
class_names = []


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, class_names

    print("Loading V2 plant classifier...")

    model = tf.keras.models.load_model(MODEL_PATH)

    with open(LABELS_PATH, "r") as f:
        class_names = json.load(f)

    print("Model loaded successfully!")
    print("Classes:", class_names)

    yield


app = FastAPI(
    title="Virtual Herbal Garden Plant API",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:8080,http://127.0.0.1:8080",
).split(","),
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "classifier_ready": model is not None,
        "classes": class_names,
    }


@app.post("/identify")
async def identify(image: UploadFile = File(...)):

    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Plant classifier is not ready.",
        )

    if image.content_type not in (
        "image/jpeg",
        "image/png",
        "image/webp",
    ):
        raise HTTPException(
            status_code=415,
            detail="Upload JPG, PNG or WebP image.",
        )

    raw = await image.read(8 * 1024 * 1024 + 1)

    if len(raw) > 8 * 1024 * 1024:
        raise HTTPException(
            status_code=413,
            detail="Maximum image size is 8 MB.",
        )

    try:
        picture = Image.open(io.BytesIO(raw))
        picture.verify()

        picture = Image.open(io.BytesIO(raw))
        picture = ImageOps.exif_transpose(picture)
        picture = picture.convert("RGB")
        picture = picture.resize(
            (224, 224),
            Image.Resampling.BILINEAR,
        )

    except (UnidentifiedImageError, OSError, ValueError):
        raise HTTPException(
            status_code=400,
            detail="Invalid image file.",
        )

    x = np.asarray(
        picture,
        dtype=np.float32,
    )[None, ...]

    probabilities = model.predict(x, verbose=0)[0]

    index = int(np.argmax(probabilities))

    predicted_label = class_names[index]
    confidence = float(probabilities[index])

    return {
        "status": "predicted",
        "scientific_name": predicted_label,
        "common_name": predicted_label.replace("_", " "),
        "confidence": confidence,
        "message": (
            "AI prediction only. The model recognizes "
            "Aloe Vera, Neem and Tulsi; other plants may "
            "be incorrectly classified."
        ),
        "saved": False,
    }
