"""Build indexed contact sheets from the kennel photo dump.

Lets a person review every frame at once and pick keepers by
index; `photo-index.json` maps those indices back to the source files.
"""

import json
import os
import pathlib

from PIL import Image, ImageDraw

SOURCE_ROOT = pathlib.Path(
    os.environ.get(
        "SYBERIS_PHOTO_SOURCE", pathlib.Path(__file__).resolve().parent.parent
    )
)
OUT_DIR = pathlib.Path("/tmp/syberis-sheets")

COLS, ROWS = 6, 8
CELL_W, CELL_H = 260, 200
LABEL_H = 22
PER_SHEET = COLS * ROWS


def collect():
    photos = []
    for folder in sorted(SOURCE_ROOT.glob("Miot 1-*/Miot 1")):
        photos.extend(sorted(folder.glob("*.jpg")))
    # Drop Google Photos edit duplicates like "...~2.jpg"
    photos = [p for p in photos if "~" not in p.name]
    if not photos:
        raise FileNotFoundError(
            "No source photos found. Put the photo dump under SOURCE_ROOT or "
            "set SYBERIS_PHOTO_SOURCE to its directory."
        )
    return photos


def build():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    photos = collect()
    index = {}

    for sheet_no in range((len(photos) + PER_SHEET - 1) // PER_SHEET):
        chunk = photos[sheet_no * PER_SHEET : (sheet_no + 1) * PER_SHEET]
        sheet = Image.new(
            "RGB", (COLS * CELL_W, ROWS * (CELL_H + LABEL_H)), (245, 245, 245)
        )
        draw = ImageDraw.Draw(sheet)

        for slot, path in enumerate(chunk):
            number = sheet_no * PER_SHEET + slot
            index[number] = str(path)

            try:
                img = Image.open(path)
                img.draft("RGB", (CELL_W * 2, CELL_H * 2))
                img = img.convert("RGB")
                img.thumbnail((CELL_W - 8, CELL_H - 8))
            except Exception as exc:  # noqa: BLE001
                print(f"skip {path}: {exc}")
                continue

            col, row = slot % COLS, slot // COLS
            x = col * CELL_W + (CELL_W - img.width) // 2
            y = row * (CELL_H + LABEL_H) + (CELL_H - img.height) // 2
            sheet.paste(img, (x, y))
            draw.text(
                (col * CELL_W + 6, row * (CELL_H + LABEL_H) + CELL_H + 4),
                f"#{number}",
                fill=(20, 20, 20),
            )

        out = OUT_DIR / f"sheet-{sheet_no:02d}.jpg"
        sheet.save(out, quality=80)
        print(f"{out} ({len(chunk)} photos)")

    (OUT_DIR / "photo-index.json").write_text(json.dumps(index, indent=1))
    print(f"total {len(photos)} photos")


if __name__ == "__main__":
    build()
