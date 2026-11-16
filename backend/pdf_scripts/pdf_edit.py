#!/usr/bin/env python3
"""Edit a PDF: add text or images, replace text, delete/rotate/extract/reorder pages.

Coordinates are in PDF points (1/72 inch) measured from the TOP-LEFT of the page.
A US Letter page is 612 x 792 points, A4 is 595 x 842.

Usage:
    python pdf_edit.py text    in.pdf --page 1 --x 72 --y 100 --text "Hello" --size 14
    python pdf_edit.py image   in.pdf --page 1 --x 72 --y 100 --width 120 --image logo.png
    python pdf_edit.py replace in.pdf --old "2025" --new "2026"
    python pdf_edit.py delete  in.pdf --pages 2,4-5
    python pdf_edit.py rotate  in.pdf --pages 1-3 --angle 90
    python pdf_edit.py extract in.pdf --pages 3,1,2        # keeps this order (also reorders)
    python pdf_edit.py apply   in.pdf --ops-file ops.json  # many edits at once (used by the web editor)

Add -o OUTPUT to any command (default: <name>_edited.pdf).

Requires: pip install pymupdf
"""

import argparse
import json
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("PyMuPDF is required. Install it with: pip install pymupdf")


def parse_color(value):
    value = value.strip().lstrip("#")
    if len(value) != 6:
        sys.exit("Color must be a hex value like 000000 or #ff0000")
    return tuple(int(value[i:i + 2], 16) / 255 for i in (0, 2, 4))


def parse_pages(spec, count):
    """'3,1,4-5' -> [2, 0, 3, 4] (0-based, order preserved)."""
    pages = []
    for part in spec.split(","):
        part = part.strip()
        if not part:
            continue
        if "-" in part:
            a, b = part.split("-", 1)
            pages.extend(range(int(a), int(b) + 1))
        else:
            pages.append(int(part))
    bad = [p for p in pages if p < 1 or p > count]
    if bad:
        sys.exit(f"Page(s) out of range (1-{count}): {sorted(set(bad))}")
    return [p - 1 for p in pages]


def open_pdf(path, password=None):
    p = Path(path)
    if not p.is_file():
        sys.exit(f"File not found: {p}")
    doc = fitz.open(p)
    if doc.needs_pass and not (password and doc.authenticate(password)):
        sys.exit("PDF is password protected. Provide the correct --password.")
    return doc


def get_page(doc, number):
    if number < 1 or number > doc.page_count:
        sys.exit(f"Page {number} is out of range (1-{doc.page_count}).")
    return doc[number - 1]


def save(doc, src, out):
    out = Path(out) if out else Path(src).with_name(Path(src).stem + "_edited.pdf")
    doc.save(out, garbage=3, deflate=True)
    print(f"Saved {out}")


def cmd_text(args):
    doc = open_pdf(args.pdf, args.password)
    page = get_page(doc, args.page)
    # Built-in Helvetica: Latin characters only. For other scripts, use insert_font().
    page.insert_text(
        fitz.Point(args.x, args.y),
        args.text,
        fontsize=args.size,
        fontname="helv",
        color=parse_color(args.color),
    )
    save(doc, args.pdf, args.output)


def cmd_image(args):
    doc = open_pdf(args.pdf, args.password)
    page = get_page(doc, args.page)
    if not Path(args.image).is_file():
        sys.exit(f"Image not found: {args.image}")
    pix = fitz.Pixmap(args.image)
    height = args.height if args.height else args.width * pix.height / pix.width
    rect = fitz.Rect(args.x, args.y, args.x + args.width, args.y + height)
    page.insert_image(rect, filename=args.image, overlay=True)
    save(doc, args.pdf, args.output)


def cmd_replace(args):
    """Find text, cover it, and write the new text in its place.

    This is a best-effort replacement: the new text uses Helvetica, not the
    original font, and long replacements may overflow the original space.
    """
    doc = open_pdf(args.pdf, args.password)
    total = 0
    for page in doc:
        hits = page.search_for(args.old)
        if not hits:
            continue
        for rect in hits:
            page.add_redact_annot(rect, fill=(1, 1, 1))
        page.apply_redactions(images=fitz.PDF_REDACT_IMAGE_NONE)
        for rect in hits:
            size = max(rect.height * 0.75, 4)
            page.insert_text(
                (rect.x0, rect.y1 - rect.height * 0.2),
                args.new,
                fontsize=size,
                fontname="helv",
                color=(0, 0, 0),
            )
        total += len(hits)
    if total == 0:
        sys.exit(f'Text "{args.old}" was not found.')
    print(f"Replaced {total} occurrence(s).")
    save(doc, args.pdf, args.output)


def cmd_delete(args):
    doc = open_pdf(args.pdf, args.password)
    targets = sorted(set(parse_pages(args.pages, doc.page_count)))
    if len(targets) >= doc.page_count:
        sys.exit("Refusing to delete every page.")
    doc.delete_pages(targets)
    save(doc, args.pdf, args.output)


def cmd_rotate(args):
    if args.angle % 90 != 0:
        sys.exit("Angle must be a multiple of 90.")
    doc = open_pdf(args.pdf, args.password)
    indexes = parse_pages(args.pages, doc.page_count) if args.pages else range(doc.page_count)
    for i in indexes:
        doc[i].set_rotation((doc[i].rotation + args.angle) % 360)
    save(doc, args.pdf, args.output)


def cmd_extract(args):
    doc = open_pdf(args.pdf, args.password)
    doc.select(parse_pages(args.pages, doc.page_count))
    save(doc, args.pdf, args.output)


def cmd_apply(args):
    """Apply editor operations (a JSON list) in one pass.

    Page numbers are the original 1-based numbers. Rects and points are PDF points, top-left origin.
    Order: redactions first (replace_text also redacts its box), then drawings and text,
    then rotations, then page deletions.
    """
    ops = json.loads(Path(args.ops_file).read_text(encoding="utf8"))
    doc = open_pdf(args.pdf, args.password)
    known = {"redact", "replace_text", "text", "stamp", "highlight", "underline", "strike",
             "rect", "ellipse", "line", "draw", "image", "rotate", "delete_page"}
    for op in ops:
        if op.get("type") not in known:
            sys.exit(f"Unknown operation: {op.get('type')}")

    def page_of(op):
        return get_page(doc, int(op["page"]))

    def rect_of(op):
        x0, y0, x1, y1 = (float(v) for v in op["rect"])
        return fitz.Rect(min(x0, x1), min(y0, y1), max(x0, x1), max(y0, y1))

    # 1. Redactions (they remove the original text under the box).
    touched = set()
    for op in ops:
        if op["type"] in ("redact", "replace_text"):
            fill = (0, 0, 0) if op["type"] == "redact" else (1, 1, 1)
            page = page_of(op)
            page.add_redact_annot(rect_of(op), fill=fill)
            touched.add(page.number)
    for number in touched:
        doc[number].apply_redactions()

    # 2. Text, marks, shapes, images.
    for op in ops:
        kind = op["type"]
        if kind in ("redact", "rotate", "delete_page"):
            continue
        page = page_of(op)
        color = parse_color(op["color"]) if op.get("color") else None
        if kind in ("text", "stamp", "replace_text"):  # replace_text: its box was redacted above
            size = float(op.get("size", 12))
            x, y = float(op["x"]), float(op["y"])
            lines = str(op["text"]).split(chr(10))
            if kind == "stamp":
                width = max(fitz.get_text_length(line, fontname="helv", fontsize=size) for line in lines)
                box = fitz.Rect(x, y - size, x + width + 8, y + size * 0.3 * len(lines))
                shape = page.new_shape()
                shape.draw_rect(box)
                shape.finish(color=color or (1, 0, 0), width=1.5)
                shape.commit()
                x += 4
            for i, line in enumerate(lines):
                page.insert_text((x, y + i * size * 1.2), line, fontsize=size, color=color or (0, 0, 0))
        elif kind in ("highlight", "underline", "strike"):
            add = {"highlight": page.add_highlight_annot, "underline": page.add_underline_annot,
                   "strike": page.add_strikeout_annot}[kind]
            annot = add(rect_of(op))
            if color:
                annot.set_colors(stroke=color)
            annot.update()
        elif kind in ("rect", "ellipse", "line", "draw"):
            shape = page.new_shape()
            if kind == "rect":
                shape.draw_rect(rect_of(op))
            elif kind == "ellipse":
                shape.draw_oval(rect_of(op))
            elif kind == "line":
                a, b = op["points"][0], op["points"][-1]
                shape.draw_line(fitz.Point(*a), fitz.Point(*b))
            else:
                shape.draw_polyline([fitz.Point(*pt) for pt in op["points"]])
            shape.finish(color=color or (1, 0, 0), width=float(op.get("width", 2)))
            shape.commit()
        elif kind == "image":
            page.insert_image(rect_of(op), filename=op["file"], keep_proportion=True)

    # 3. Rotations, then deletions (deletions last so page numbers above stay valid).
    for op in ops:
        if op["type"] == "rotate":
            page = page_of(op)
            page.set_rotation((page.rotation + int(op["angle"])) % 360)
    deletes = sorted({int(op["page"]) - 1 for op in ops if op["type"] == "delete_page"})
    if deletes:
        if len(deletes) >= doc.page_count:
            sys.exit("Refusing to delete every page.")
        doc.delete_pages(deletes)
    save(doc, args.pdf, args.output)


def main():
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("pdf", help="Input PDF")
    common.add_argument("-o", "--output", help="Output PDF (default: <name>_edited.pdf)")
    common.add_argument("--password", help="Password for encrypted PDFs")

    parser = argparse.ArgumentParser(description="Edit a PDF.")
    sub = parser.add_subparsers(dest="command", required=True)

    p = sub.add_parser("text", parents=[common], help="Add text to a page")
    p.add_argument("--page", type=int, default=1)
    p.add_argument("--x", type=float, required=True)
    p.add_argument("--y", type=float, required=True, help="Baseline of the text")
    p.add_argument("--text", required=True)
    p.add_argument("--size", type=float, default=12)
    p.add_argument("--color", default="000000")
    p.set_defaults(func=cmd_text)

    p = sub.add_parser("image", parents=[common], help="Place an image on a page")
    p.add_argument("--page", type=int, default=1)
    p.add_argument("--image", required=True)
    p.add_argument("--x", type=float, required=True)
    p.add_argument("--y", type=float, required=True)
    p.add_argument("--width", type=float, required=True)
    p.add_argument("--height", type=float, help="Default: keep aspect ratio")
    p.set_defaults(func=cmd_image)

    p = sub.add_parser("replace", parents=[common], help="Replace text everywhere")
    p.add_argument("--old", required=True)
    p.add_argument("--new", required=True)
    p.set_defaults(func=cmd_replace)

    p = sub.add_parser("delete", parents=[common], help="Delete pages")
    p.add_argument("--pages", required=True, help="e.g. 2,4-5")
    p.set_defaults(func=cmd_delete)

    p = sub.add_parser("rotate", parents=[common], help="Rotate pages")
    p.add_argument("--pages", help="e.g. 1-3 (default: all)")
    p.add_argument("--angle", type=int, default=90, help="90, 180, 270 or -90")
    p.set_defaults(func=cmd_rotate)

    p = sub.add_parser("apply", parents=[common], help="Apply editor operations from a JSON file")
    p.add_argument("--ops-file", required=True)
    p.set_defaults(func=cmd_apply)

    p = sub.add_parser("extract", parents=[common], help="Keep only these pages, in this order")
    p.add_argument("--pages", required=True, help="e.g. 3,1,2 or 1-4")
    p.set_defaults(func=cmd_extract)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
