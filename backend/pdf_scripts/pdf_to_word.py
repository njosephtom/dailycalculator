#!/usr/bin/env python3
"""Convert a PDF to an editable Word document (.docx).

Usage:
    python pdf_to_word.py input.pdf
    python pdf_to_word.py input.pdf -o output.docx
    python pdf_to_word.py input.pdf --pages 1-5

Works best on PDFs that contain real text. Scanned PDFs (images of pages) need
OCR first, for example with OCRmyPDF.

Requires: pip install pdf2docx
"""

import argparse
import sys
from pathlib import Path

try:
    from pdf2docx import Converter
except ImportError:
    sys.exit("pdf2docx is required. Install it with: pip install pdf2docx")


def parse_pages(spec):
    """'1-3,5' -> [0, 1, 2, 4] (pdf2docx uses 0-based page numbers)."""
    pages = []
    for part in spec.split(","):
        part = part.strip()
        if "-" in part:
            a, b = part.split("-", 1)
            pages.extend(range(int(a) - 1, int(b)))
        elif part:
            pages.append(int(part) - 1)
    if any(p < 0 for p in pages):
        sys.exit("Page numbers start at 1.")
    return pages


def main():
    parser = argparse.ArgumentParser(description="Convert PDF to Word (.docx).")
    parser.add_argument("pdf")
    parser.add_argument("-o", "--output", help="Output .docx (default: same name as the PDF)")
    parser.add_argument("--pages", help="Pages to convert, e.g. '1-5,8' (default: all)")
    parser.add_argument("--password", help="Password for encrypted PDFs")
    args = parser.parse_args()

    src = Path(args.pdf)
    if not src.is_file():
        sys.exit(f"File not found: {src}")
    out = Path(args.output) if args.output else src.with_suffix(".docx")

    converter = Converter(str(src), password=args.password) if args.password else Converter(str(src))
    try:
        converter.convert(str(out), pages=parse_pages(args.pages) if args.pages else None)
    finally:
        converter.close()
    print(f"Saved {out}")


if __name__ == "__main__":
    main()
