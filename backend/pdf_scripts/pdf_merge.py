#!/usr/bin/env python3
"""Combine multiple PDFs into one.

Usage:
    python pdf_merge.py a.pdf b.pdf c.pdf -o combined.pdf
    python pdf_merge.py "scans/*.pdf" -o combined.pdf --bookmarks
    python pdf_merge.py my_folder/ -o combined.pdf          # every PDF in the folder, sorted by name

Files are merged in the order given. Wildcards are expanded by this script,
so quoted patterns work on Windows too.

Requires: pip install pymupdf
"""

import argparse
import glob
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("PyMuPDF is required. Install it with: pip install pymupdf")


def collect(inputs):
    files = []
    for item in inputs:
        p = Path(item)
        if p.is_dir():
            files.extend(sorted(p.glob("*.pdf")))
        elif any(ch in item for ch in "*?["):
            files.extend(Path(m) for m in sorted(glob.glob(item)))
        else:
            files.append(p)
    return files


def main():
    parser = argparse.ArgumentParser(description="Merge PDFs into one file.")
    parser.add_argument("inputs", nargs="+", help="PDF files, folders or wildcard patterns")
    parser.add_argument("-o", "--output", default="merged.pdf")
    parser.add_argument("--bookmarks", action="store_true",
                        help="Add one bookmark per source file")
    args = parser.parse_args()

    files = collect(args.inputs)
    if not files:
        sys.exit("No PDF files found.")
    out_path = Path(args.output).resolve()

    merged = fitz.open()
    toc = []
    for f in files:
        if f.resolve() == out_path:
            continue  # don't merge the output file into itself
        if not f.is_file():
            sys.exit(f"File not found: {f}")
        src = fitz.open(f)
        if src.needs_pass:
            sys.exit(f"Password protected, skipping is not safe: {f}")
        start = merged.page_count
        merged.insert_pdf(src)
        toc.append([1, f.stem, start + 1])
        print(f"Added {f} ({src.page_count} pages)")
        src.close()

    if merged.page_count == 0:
        sys.exit("Nothing to merge.")
    if args.bookmarks:
        merged.set_toc(toc)

    merged.save(out_path, garbage=3, deflate=True)
    print(f"\nSaved {out_path} ({merged.page_count} pages)")


if __name__ == "__main__":
    main()
