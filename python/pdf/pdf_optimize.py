#!/usr/bin/env python3
"""Shrink a PDF's file size and export the result.

Usage:
    python pdf_optimize.py big.pdf                      # medium compression
    python pdf_optimize.py big.pdf --level high -o small.pdf
    python pdf_optimize.py big.pdf --level low --strip-metadata

Levels (image downsampling + JPEG quality):
    low     keep up to 200 dpi, quality 85   (best looking)
    medium  keep up to 150 dpi, quality 70   (default, good for screen/email)
    high    keep up to  96 dpi, quality 50   (smallest)

Every level also removes unused objects and compresses streams.
Image recompression needs a recent PyMuPDF (1.24+); on older versions only the
lossless cleanup is applied.

Requires: pip install pymupdf
"""

import argparse
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("PyMuPDF is required. Install it with: pip install pymupdf")

LEVELS = {
    "low": {"dpi": 200, "quality": 85},
    "medium": {"dpi": 150, "quality": 70},
    "high": {"dpi": 96, "quality": 50},
}


def human(size):
    for unit in ("B", "KB", "MB", "GB"):
        if size < 1024 or unit == "GB":
            return f"{size:.1f} {unit}" if unit != "B" else f"{size} B"
        size /= 1024


def main():
    parser = argparse.ArgumentParser(description="Optimize (compress) a PDF.")
    parser.add_argument("pdf")
    parser.add_argument("-o", "--output", help="Output PDF (default: <name>_optimized.pdf)")
    parser.add_argument("--level", choices=LEVELS, default="medium")
    parser.add_argument("--strip-metadata", action="store_true",
                        help="Remove author, title and other document metadata")
    parser.add_argument("--password", help="Password for encrypted PDFs")
    args = parser.parse_args()

    src = Path(args.pdf)
    if not src.is_file():
        sys.exit(f"File not found: {src}")
    out = Path(args.output) if args.output else src.with_name(src.stem + "_optimized.pdf")
    if out.resolve() == src.resolve():
        sys.exit("Output must be a different file than the input.")

    doc = fitz.open(src)
    if doc.needs_pass and not (args.password and doc.authenticate(args.password)):
        sys.exit("PDF is password protected. Provide the correct --password.")

    cfg = LEVELS[args.level]
    try:
        doc.rewrite_images(
            dpi_threshold=cfg["dpi"] + 50,
            dpi_target=cfg["dpi"],
            quality=cfg["quality"],
        )
    except AttributeError:
        print("Note: this PyMuPDF version can't recompress images; "
              "upgrade with 'pip install -U pymupdf' for stronger compression.")

    try:
        doc.subset_fonts()  # needs fontTools; skip quietly if unavailable
    except Exception:
        pass

    if args.strip_metadata:
        doc.set_metadata({})
        try:
            doc.del_xml_metadata()
        except Exception:
            pass

    doc.save(out, garbage=4, deflate=True, clean=True)
    doc.close()

    before, after = src.stat().st_size, out.stat().st_size
    saved = (1 - after / before) * 100 if before else 0
    print(f"{src.name}: {human(before)} -> {out.name}: {human(after)} ({saved:.0f}% smaller)")
    if after >= before:
        print("The result is not smaller; the original was already well optimized. "
              "Keep the original or try --level high.")


if __name__ == "__main__":
    main()
