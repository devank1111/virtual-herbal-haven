
from pathlib import Path
from PIL import Image
import hashlib

ROOT = Path(__file__).resolve().parent.parent
DATASET = ROOT / "dataset_clean"

EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
seen = {}
duplicates = []

for folder in sorted(DATASET.iterdir()):
    if not folder.is_dir():
        continue

    for path in sorted(folder.iterdir()):
        if path.suffix.lower() not in EXTENSIONS:
            continue

        with Image.open(path) as img:
            rgb = img.convert("RGB")
            digest = hashlib.sha256(
                rgb.size.__repr__().encode() + rgb.tobytes()
            ).hexdigest()

        if digest in seen:
            duplicates.append((seen[digest], path))
        else:
            seen[digest] = path

print("Unique images:", len(seen))
print("Exact duplicates:", len(duplicates))

for original, duplicate in duplicates[:20]:
    print(f"\nOriginal: {original}")
    print(f"Duplicate: {duplicate}")
