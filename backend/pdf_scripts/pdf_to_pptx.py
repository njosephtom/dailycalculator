#!/usr/bin/env python3
"""Convert a PDF to a PowerPoint presentation (.pptx), one slide per page.

Two modes:
    (default)   Each page is rendered as a high-resolution picture on its slide.
                Looks identical to the PDF, but text is not editable.
    --editable  Text blocks become editable text boxes and embedded images are
                placed as pictures. Fonts, spacing and vector graphics will not
                match the PDF exactly, so expect some manual cleanup.

Usage:
    python pdf_to_pptx.py slides.pdf
    python pdf_to_pptx.py slides.pdf -o deck.pptx --dpi 200
    python pdf_to_pptx.py report.pdf --editable
    python pdf_to_pptx.py slides.pdf --notes      # put each page's text into speaker notes

Requires: pip install pymupdf python-pptx
"""

import argparse
import io
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("PyMuPDF is required. Install it with: pip install pymupdf")
try:
    from pptx import Presentation
    from pptx.dml.color import RGBColor
    from pptx.util import Emu, Pt
except ImportError:
    sys.exit("python-pptx is required. Install it with: pip install python-pptx")

EMU_PER_POINT = 12700


def emu(points):
    return Emu(int(points * EMU_PER_POINT))


def add_image_slide(prs, page, scale, dpi):
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # blank layout
    zoom = dpi / 72
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    slide.shapes.add_picture(
        io.BytesIO(pix.tobytes("png")),
        0, 0,
        width=emu(page.rect.width * scale),
        height=emu(page.rect.height * scale),
    )
    return slide


def add_editable_slide(prs, page, scale):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    for block in page.get_text("dict")["blocks"]:
        x0, y0, x1, y1 = block["bbox"]
        left, top = emu(x0 * scale), emu(y0 * scale)
        width, height = emu((x1 - x0) * scale), emu((y1 - y0) * scale)

        if block["type"] == 1:  # image
            try:
                slide.shapes.add_picture(io.BytesIO(block["image"]), left, top, width, height)
            except Exception:
                pass  # unsupported image format; skip it
            continue

        lines = [ln for ln in block["lines"] if ln["spans"]]
        if not lines:
            continue
        box = slide.shapes.add_textbox(left, top, width, height)
        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_right = tf.margin_top = tf.margin_bottom = 0
        for i, line in enumerate(lines):
            para = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            for span in line["spans"]:
                run = para.add_run()
                run.text = span["text"]
                run.font.size = Pt(max(span["size"] * scale, 1))
                run.font.bold = bool(span["flags"] & 16)
                run.font.italic = bool(span["flags"] & 2)
                c = span["color"]
                run.font.color.rgb = RGBColor((c >> 16) & 255, (c >> 8) & 255, c & 255)
    return slide


def main():
    parser = argparse.ArgumentParser(description="Convert PDF to PowerPoint (.pptx).")
    parser.add_argument("pdf")
    parser.add_argument("-o", "--output", help="Output .pptx (default: same name as the PDF)")
    parser.add_argument("--dpi", type=int, default=150, help="Image resolution (default 150)")
    parser.add_argument("--editable", action="store_true", help="Use editable text boxes instead of page pictures")
    parser.add_argument("--notes", action="store_true", help="Copy each page's text into the slide notes")
    parser.add_argument("--password", help="Password for encrypted PDFs")
    args = parser.parse_args()

    src = Path(args.pdf)
    if not src.is_file():
        sys.exit(f"File not found: {src}")
    out = Path(args.output) if args.output else src.with_suffix(".pptx")

    doc = fitz.open(src)
    if doc.needs_pass and not (args.password and doc.authenticate(args.password)):
        sys.exit("PDF is password protected. Provide the correct --password.")

    prs = Presentation()
    first = doc[0].rect
    prs.slide_width, prs.slide_height = emu(first.width), emu(first.height)

    for page in doc:
        scale = first.width / page.rect.width  # fit pages of other sizes to the slide width
        if args.editable:
            slide = add_editable_slide(prs, page, scale)
        else:
            slide = add_image_slide(prs, page, scale, args.dpi)
        if args.notes:
            slide.notes_slide.notes_text_frame.text = page.get_text().strip()
        print(f"Page {page.number + 1}/{doc.page_count}")

    prs.save(out)
    print(f"\nSaved {out}")


if __name__ == "__main__":
    main()
