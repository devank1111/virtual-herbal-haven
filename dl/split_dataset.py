
from pathlib import Path
from sklearn.model_selection import train_test_split
import shutil

SOURCE = Path("dataset/Medicinal plant dataset")
DESTINATION = Path("processed_dataset")

SEED = 42

if DESTINATION.exists():
    raise FileExistsError(
        "processed_dataset already exists. "
        "Check it before running again."
    )

for plant_folder in sorted(SOURCE.iterdir()):

    if not plant_folder.is_dir():
        continue

    images = sorted([
        p for p in plant_folder.iterdir()
        if p.suffix.lower() in
        {".jpg", ".jpeg", ".png", ".webp"}
    ])

    train_images, temp_images = train_test_split(
        images,
        test_size=0.30,
        random_state=SEED
    )

    val_images, test_images = train_test_split(
        temp_images,
        test_size=0.50,
        random_state=SEED
    )

    for split_name, split_images in [
        ("train", train_images),
        ("val", val_images),
        ("test", test_images)
    ]:
        output_folder = (
            DESTINATION / split_name / plant_folder.name
        )

        output_folder.mkdir(
            parents=True,
            exist_ok=True
        )

        for image in split_images:
            shutil.copy2(
                image,
                output_folder / image.name
            )

    print(
        f"{plant_folder.name}: "
        f"Train={len(train_images)}, "
        f"Val={len(val_images)}, "
        f"Test={len(test_images)}"
    )

print("\nDataset splitting completed!")
