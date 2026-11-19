from pathlib import Path
from PIL import Image

dataset_path = Path("dataset/Medicinal plant dataset")

total_images = 0
valid_images = 0
corrupt_images = []

for plant_folder in sorted(dataset_path.iterdir()):
    if not plant_folder.is_dir():
        continue

    count = 0

    for image_path in plant_folder.iterdir():
        if image_path.suffix.lower() not in [
            ".jpg", ".jpeg", ".png", ".webp"
        ]:
            continue

        total_images += 1

        try:
            with Image.open(image_path) as img:
                img.verify()

            valid_images += 1
            count += 1

        except Exception:
            corrupt_images.append(str(image_path))

    print(f"{plant_folder.name}: {count} valid images")

print("\nDATASET SUMMARY")
print("Total Images:", total_images)
print("Valid Images:", valid_images)
print("Corrupt Images:", len(corrupt_images))

if corrupt_images:
    print("\nCorrupt file paths:")
    for path in corrupt_images:
        print(path)
