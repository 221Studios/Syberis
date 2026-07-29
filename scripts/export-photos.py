"""Export web-ready photos from the kennel dump into public/.

Source frames are 8-12 MP phone shots; every target here declares the aspect
ratio and width the layout actually needs, so the site never ships a 5 MB JPEG.
Indices refer to the contact sheets produced by contact-sheets.py.
"""

import json
import pathlib

from PIL import Image, ImageOps

INDEX = pathlib.Path("/tmp/syberis-sheets/photo-index.json")
PUBLIC = pathlib.Path(__file__).resolve().parent.parent / "public"

LANDSCAPE = (3, 2)
PORTRAIT = (4, 5)
SQUARE = (1, 1)
WIDE = (16, 9)
TALL = (9, 16)

# target path -> (source index, aspect ratio, output width)
TARGETS = {
    # Home page
    "images/hero.jpg": (29, TALL, 1600),
    "images/about.jpg": (115, PORTRAIT, 1200),
    "images/showreel.jpg": (22, WIDE, 1800),
    "images/featured-1.jpg": (52, PORTRAIT, 1200),
    "images/featured-2.jpg": (148, PORTRAIT, 1200),
    "images/featured-3.jpg": (99, PORTRAIT, 1200),
    "images/featured-4.jpg": (307, PORTRAIT, 1200),
    "images/featured-5.jpg": (366, PORTRAIT, 1200),
    # Parents
    "parents/ozzie.jpg": (351, PORTRAIT, 1200),
    "parents/kaja.jpg": (366, PORTRAIT, 1200),
    "parents/mia.jpg": (307, PORTRAIT, 1200),
    "parents/cynamon.jpg": (277, PORTRAIT, 1200),
    "parents/ozzie-wide.jpg": (351, WIDE, 1600),
    "parents/kaja-wide.jpg": (365, WIDE, 1600),
    "parents/mia-wide.jpg": (250, WIDE, 1600),
    "parents/cynamon-wide.jpg": (247, WIDE, 1600),
    # Litter C puppies
    "litters/c/cover.jpg": (148, WIDE, 1600),
    "litters/c/ciri.jpg": (123, TALL, 1200),
    "litters/c/celeste.jpg": (206, TALL, 1200),
    "litters/c/cleo.jpg": (159, TALL, 1200),
    "litters/c/coco.jpg": (290, TALL, 1200),
    "litters/c/cyan.jpg": (327, TALL, 1200),
    # Litter B
    "litters/b/cover.jpg": (153, WIDE, 1600),
    "litters/b/balto.jpg": (199, TALL, 1200),
    "litters/b/bella.jpg": (124, TALL, 1200),
    "litters/b/bruno.jpg": (298, TALL, 1200),
    "litters/b/bianka.jpg": (313, TALL, 1200),
    "litters/b/blue.jpg": (277, TALL, 1200),
    "litters/b/grown-1.jpg": (307, SQUARE, 900),
    "litters/b/grown-2.jpg": (366, SQUARE, 900),
    "litters/b/grown-3.jpg": (227, SQUARE, 900),
    # Litter A
    "litters/a/cover.jpg": (103, WIDE, 1600),
    "litters/a/aki.jpg": (19, TALL, 1200),
    "litters/a/alma.jpg": (13, TALL, 1200),
    "litters/a/argo.jpg": (97, TALL, 1200),
    "litters/a/ayla.jpg": (121, TALL, 1200),
    "litters/a/grown-1.jpg": (351, SQUARE, 900),
    "litters/a/grown-2.jpg": (365, SQUARE, 900),
    # 3D gallery wall (landscape frames)
    "gallery/img1.jpg": (10, LANDSCAPE, 1100),
    "gallery/img2.jpg": (13, LANDSCAPE, 1100),
    "gallery/img3.jpg": (34, LANDSCAPE, 1100),
    "gallery/img4.jpg": (49, LANDSCAPE, 1100),
    "gallery/img5.jpg": (75, LANDSCAPE, 1100),
    "gallery/img6.jpg": (147, LANDSCAPE, 1100),
    "gallery/img7.jpg": (224, LANDSCAPE, 1100),
    "gallery/img8.jpg": (250, LANDSCAPE, 1100),
    "gallery/img9.jpg": (277, LANDSCAPE, 1100),
    "gallery/img10.jpg": (366, LANDSCAPE, 1100),
    # Contact page cards
    "contact/card-1.jpg": (171, PORTRAIT, 1000),
    "contact/card-2.jpg": (183, PORTRAIT, 1000),
    "contact/card-3.jpg": (227, PORTRAIT, 1000),
}


def export():
    index = json.loads(INDEX.read_text())

    for target, (source_no, ratio, width) in TARGETS.items():
        source = index.get(str(source_no))
        if not source:
            print(f"!! no source for #{source_no} ({target})")
            continue

        out = PUBLIC / target
        out.parent.mkdir(parents=True, exist_ok=True)

        img = Image.open(source)
        img = ImageOps.exif_transpose(img).convert("RGB")

        height = round(width * ratio[1] / ratio[0])
        img = ImageOps.fit(img, (width, height), method=Image.LANCZOS, centering=(0.5, 0.4))
        img.save(out, "JPEG", quality=82, optimize=True, progressive=True)

        print(f"{target:34s} <- #{source_no:>3} {width}x{height}")


if __name__ == "__main__":
    export()
