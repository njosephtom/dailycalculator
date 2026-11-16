#!/usr/bin/env python3
"""Convert each page of a PDF to a JPG image.

Usage:
    python pdf_to_jpg.py input.pdf
    python pdf_to_jpg.py input.pdf -o output_folder --dpi 200 --quality 90
    python pdf_to_jpg.py input.pdf --pages 1-3,5

Requires PyMuPDF:
    pip install pymupdf
"""

import argparse
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("PyMuPDF is required. Install it with: pip install pymupdf")


def parse_pages(spec, page_count):
    """Turn a spec like '1-3,5' into a sorted list of 0-based page indexes."""
    if not spec:
        return list(range(page_count))
    pages = set()
    for part in spec.split(","):
        part = part.strip()
        if "-" in part:
            start, end = part.split("-", 1)
            pages.update(range(int(start), int(end) + 1))
        elif part:
            pages.add(int(part))
    invalid = [p for p in pages if p < 1 or p > page_count]
    if invalid:
        sys.exit(f"Page(s) out of range (1-{page_count}): {sorted(invalid)}")
    return sorted(p - 1 for p in pages)


def pdf_to_jpg(pdf_path, out_dir=None, dpi=150, quality=85, pages=None, password=None):
    pdf_path = Path(pdf_path)
    if not pdf_path.is_file():
        sys.exit(f"File not found: {pdf_path}")

    out_dir = Path(out_dir) if out_dir else pdf_path.with_suffix("")
    out_dir.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(pdf_path)
    if doc.needs_pass:
        if not password or not doc.authenticate(password):
            sys.exit("PDF is password protected. Provide the correct --password.")

    indexes = parse_pages(pages, doc.page_count)
    zoom = dpi / 72  # PDF native resolution is 72 dpi
    matrix = fitz.Matrix(zoom, zoom)
    width = len(str(doc.page_count))

    saved = []
    for i in indexes:
        pix = doc[i].get_pixmap(matrix=matrix, colorspace=fitz.csRGB, alpha=False)
        out_file = out_dir / f"{pdf_path.stem}_page_{i + 1:0{width}d}.jpg"
        pix.save(out_file, jpg_quality=quality)
        saved.append(out_file)
        print(f"Saved {out_file}")

    doc.close()
    return saved


def main():
    parser = argparse.ArgumentParser(description="Convert PDF pages to JPG images.")
    parser.add_argument("pdf", help="Path to the input PDF")
    parser.add_argument("-o", "--output", help="Output folder (default: folder named after the PDF)")
    parser.add_argument("--dpi", type=int, default=150, help="Resolution in DPI (default: 150)")
    parser.add_argument("--quality", type=int, default=85, help="JPG quality 1-100 (default: 85)")
    parser.add_argument("--pages", help="Pages to convert, e.g. '1-3,5' (default: all)")
    parser.add_argument("--password", help="Password for encrypted PDFs")
    args = parser.parse_args()

    saved = pdf_to_jpg(args.pdf, args.output, args.dpi, args.quality, args.pages, args.password)
    print(f"\nDone: {len(saved)} image(s) written.")


if __name__ == "__main__":
    main()