
from pathlib import Path
from PIL import Image
import numpy as np
import random
import shutil

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "dataset_clean"
DEST = ROOT / "processed_dataset_v2"

SEED = 42
THRESHOLD = 4
EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

random.seed(SEED)

if DEST.exists():
    raise FileExistsError(
        f"{DEST} already exists. Inspect it before running again."
    )


def image_hash(path):
    with Image.open(path) as img:
        img = img.convert("L").resize((16, 16))
        pixels = np.asarray(img, dtype=np.float32)

    bits = pixels > pixels.mean()
    return np.packbits(bits.flatten())


def make_groups(images):
    hashes = [image_hash(path) for path in images]
    parent = list(range(len(images)))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[rb] = ra

    for i in range(len(images)):
        for j in range(i + 1, len(images)):
            distance = int(
                np.unpackbits(
                    np.bitwise_xor(hashes[i], hashes[j])
                ).sum()
            )

            if distance <= THRESHOLD:
                union(i, j)

    groups = {}

    for i, path in enumerate(images):
        groups.setdefault(find(i), []).append(path)

    return list(groups.values())


def split_groups(groups):
    rng = random.Random(SEED)
    rng.shuffle(groups)
    groups.sort(key=len, reverse=True)

    total = sum(len(group) for group in groups)

    targets = {
        "train": total * 0.70,
        "val": total * 0.15,
        "test": total * 0.15,
    }

    result = {split: [] for split in targets}
    counts = {split: 0 for split in targets}

    for group in groups:
        split = max(
            targets,
            key=lambda s: (
                targets[s] - counts[s]
            ) / targets[s]
        )

        result[split].extend(group)
        counts[split] += len(group)

    return result



for plant_folder in sorted(SOURCE.iterdir()):
    
    if not plant_folder.is_dir():
        continue

    images = sorted(
        path for path in plant_folder.iterdir()
        if path.is_file()
        and path.suffix.lower() in EXTENSIONS
    )

    natural_images = [
        path for path in images
        if path.name.lower().startswith("natural")
    ]

    original_images = [
        path for path in images
        if not path.name.lower().startswith("natural")
    ]

    # Group visually similar images
    original_groups = make_groups(original_images)
    natural_groups = make_groups(natural_images)

    # Split both sources separately
    original_splits = split_groups(original_groups)
    natural_splits = split_groups(natural_groups)

    for split in ["train", "val", "test"]:
        output_folder = DEST / split / plant_folder.name
        output_folder.mkdir(parents=True, exist_ok=True)

        files = (
            original_splits[split]
            + natural_splits[split]
        )

        for path in files:
            shutil.copy2(path, output_folder / path.name)

    print(f"\n{plant_folder.name}")
    print(f"Total images: {len(images)}")
    print(f"Natural images: {len(natural_images)}")

    for split in ["train", "val", "test"]:
        total = (
            len(original_splits[split])
            + len(natural_splits[split])
        )
        natural = len(natural_splits[split])

        print(
            f"{split}: {total} images "
            f"({natural} natural)"
        )

print("\nDataset v2 splitting completed!")

