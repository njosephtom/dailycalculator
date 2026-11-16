#!/usr/bin/env python3
"""Add a visual signature (image or typed name) to a PDF.

Usage:
    python pdf_sign.py contract.pdf --image signature.png
    python pdf_sign.py contract.pdf --image signature.png --page 3 --position bottom-left --width 180
    python pdf_sign.py contract.pdf --text "Jane Doe" --date
    python pdf_sign.py contract.pdf --image sig.png --x 350 --y 700     # exact spot (points, from top-left)
    python pdf_sign.py contract.pdf --image sig.png --page all

Tips:
  * Use a PNG with a transparent background so the signature blends in.
  * --page accepts a number, "last" (default) or "all".

Note: this stamps a visible signature. It is NOT a cryptographic digital
signature. For certificate-based signing, look at the "pyHanko" library.

Requires: pip install pymupdf
"""

import argparse
import sys
from datetime import date
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("PyMuPDF is required. Install it with: pip install pymupdf")

POSITIONS = ["bottom-right", "bottom-left", "bottom-center", "top-right", "top-left", "center"]
TEXT_FONT = "tiit"  # built-in Times Italic: a signature-like look without extra files


def resolve_pages(spec, count):
    spec = spec.strip().lower()
    if spec == "last":
        return [count - 1]
    if spec == "all":
        return list(range(count))
    try:
        n = int(spec)
    except ValueError:
        sys.exit('--page must be a number, "last" or "all".')
    if n < 1 or n > count:
        sys.exit(f"Page {n} is out of range (1-{count}).")
    return [n - 1]


def place(page_rect, w, h, position, margin):
    if position == "bottom-right":
        return page_rect.width - w - margin, page_rect.height - h - margin
    if position == "bottom-left":
        return margin, page_rect.height - h - margin
    if position == "bottom-center":
        return (page_rect.width - w) / 2, page_rect.height - h - margin
    if position == "top-right":
        return page_rect.width - w - margin, margin
    if position == "top-left":
        return margin, margin
    return (page_rect.width - w) / 2, (page_rect.height - h) / 2


def main():
    parser = argparse.ArgumentParser(description="Add a signature to a PDF.")
    parser.add_argument("pdf")
    parser.add_argument("-o", "--output", help="Output PDF (default: <name>_signed.pdf)")
    parser.add_argument("--password", help="Password for encrypted PDFs")
    src = parser.add_mutually_exclusive_group(required=True)
    src.add_argument("--image", help="Signature image (PNG with transparency works best)")
    src.add_argument("--text", help="Typed signature, e.g. your name")
    parser.add_argument("--page", default="last", help='Page number, "last" (default) or "all"')
    parser.add_argument("--position", choices=POSITIONS, default="bottom-right")
    parser.add_argument("--x", type=float, help="Left edge in points (overrides --position)")
    parser.add_argument("--y", type=float, help="Top edge in points (overrides --position)")
    parser.add_argument("--width", type=float, default=150, help="Image width in points (default 150)")
    parser.add_argument("--font-size", type=float, default=28, help="Typed signature size (default 28)")
    parser.add_argument("--color", default="000080", help="Typed signature color hex (default navy)")
    parser.add_argument("--margin", type=float, default=36, help="Distance from page edge (default 36)")
    parser.add_argument("--date", action="store_true", help="Print today's date under the signature")
    args = parser.parse_args()

    pdf_path = Path(args.pdf)
    if not pdf_path.is_file():
        sys.exit(f"File not found: {pdf_path}")
    doc = fitz.open(pdf_path)
    if doc.needs_pass and not (args.password and doc.authenticate(args.password)):
        sys.exit("PDF is password protected. Provide the correct --password.")

    # Size of the signature block
    if args.image:
        if not Path(args.image).is_file():
            sys.exit(f"Image not found: {args.image}")
        pix = fitz.Pixmap(args.image)
        w = args.width
        h = w * pix.height / pix.width
    else:
        w = fitz.get_text_length(args.text, fontname=TEXT_FONT, fontsize=args.font_size)
        h = args.font_size * 1.3

    date_h = 14 if args.date else 0
    color = tuple(int(args.color.lstrip("#")[i:i + 2], 16) / 255 for i in (0, 2, 4))

    for index in resolve_pages(args.page, doc.page_count):
        page = doc[index]
        if args.x is not None and args.y is not None:
            x, y = args.x, args.y
        else:
            x, y = place(page.rect, w, h + date_h, args.position, args.margin)

        if args.image:
            page.insert_image(fitz.Rect(x, y, x + w, y + h), filename=args.image, overlay=True)
        else:
            page.insert_text((x, y + args.font_size), args.text,
                             fontsize=args.font_size, fontname=TEXT_FONT, color=color)
        if args.date:
            page.insert_text((x, y + h + 11), date.today().strftime("%Y-%m-%d"),
                             fontsize=9, fontname="helv", color=(0.3, 0.3, 0.3))

    out = Path(args.output) if args.output else pdf_path.with_name(pdf_path.stem + "_signed.pdf")
    doc.save(out, garbage=3, deflate=True)
    print(f"Saved {out}")


if __name__ == "__main__":
    main()
