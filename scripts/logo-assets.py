"""Derive the web logo set from the master silhouette.

`logosyberis.png` is a 2000x2000 white husky on transparency, which is invisible
on the site's light surfaces. Every variant here is the same alpha mask tinted
for one context, so a new master file only has to be dropped in and re-run.
"""

import pathlib

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
MASTER = ROOT.parent / "logosyberis.png"
PUBLIC = ROOT / "public"

NAVY = (16, 47, 79)
GOLD = (233, 194, 106)
WHITE = (255, 255, 255)


def tinted(mask, color):
    out = Image.new("RGBA", mask.size, color + (0,))
    out.putalpha(mask)
    return out


def scaled(img, width):
    height = round(img.height * width / img.width)
    return img.resize((width, height), Image.LANCZOS)


def build():
    master = Image.open(MASTER).convert("RGBA")
    mask = master.split()[3].crop(master.split()[3].getbbox())

    for name, color, width in [
        ("logo-white.png", WHITE, 900),
        ("logo.png", GOLD, 600),
    ]:
        out = scaled(tinted(mask, color), width)
        out.save(PUBLIC / name)
        print(f"{name:16s} {out.width}x{out.height}")

    # Favicon: square canvas with breathing room, otherwise the silhouette
    # touches the edges and reads as a smear at 16px.
    icon_mark = scaled(tinted(mask, GOLD), 448)
    icon = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    icon.alpha_composite(icon_mark, (32, (512 - icon_mark.height) // 2))
    icon.save(ROOT / "src" / "app" / "icon.png")
    print("icon.png        512x512")


if __name__ == "__main__":
    build()
