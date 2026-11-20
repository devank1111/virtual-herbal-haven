
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps
import math

ROOT = Path(__file__).resolve().parent.parent
DATASET = ROOT / "dataset_clean"
OUTPUT = ROOT / "artifacts_new"

OUTPUT.mkdir(exist_ok=True)

classes = ["Aloe_Vera", "Neem", "Tulsi"]
extensions = {".jpg", ".jpeg", ".png", ".webp"}

for plant in classes:
    folder = DATASET / plant

    # Natural photos ke filename me "natural" hona chahiye
    images = sorted(
        p for p in folder.iterdir()
        if p.suffix.lower() in extensions
        and p.name.lower().startswith("natural")
    )

    if not images:
        print(f"{plant}: Natural filenames nahi mile")
        continue

    columns = 4
    cell_w, cell_h = 220, 260
    rows = math.ceil(len(images) / columns)

    sheet = Image.new(
        "RGB",
        (columns * cell_w, rows * cell_h),
        "white"
    )

    draw = ImageDraw.Draw(sheet)

    for i, path in enumerate(images):
        with Image.open(path) as img:
            img = ImageOps.contain(
                img.convert("RGB"), (200, 220)
            )

        x = (i % columns) * cell_w + 10
        y = (i // columns) * cell_h + 10

        sheet.paste(img, (x, y))
        draw.text(
            (x, y + 225),
            path.name[:28],
            fill="black"
        )

    output = OUTPUT / f"{plant}_natural_sheet.jpg"
    sheet.save(output)

    print(f"{plant}: {len(images)} photos")
    print(f"Saved: {output}")
