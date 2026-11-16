"""PDF Tools endpoint (Vercel Python function). Beta.

Runs the scripts in python/pdf/ as subprocesses, so they stay the single source of truth.
POST multipart/form-data:
  tool     edit | merge | optimize | sign | to_image | to_pptx | to_word
  options  JSON object, e.g. {"command": "text", "--page": "1", "--bookmarks": true}
  file     the PDF (merge: several, in order)
  image    optional PNG/JPG, referenced in options as "--image": "@image"
Ceiling: Vercel's 4.5 MB request body limit; no queueing, one run per request.
"""

import json
import re
import subprocess
import sys
import tempfile
import zipfile
from email.parser import BytesParser
from email.policy import default
from http.server import BaseHTTPRequestHandler
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent.parent / "python" / "pdf"
TOOLS = {  # tool -> (script, result extension)
    "edit": ("pdf_edit.py", "pdf"),
    "merge": ("pdf_merge.py", "pdf"),
    "optimize": ("pdf_optimize.py", "pdf"),
    "sign": ("pdf_sign.py", "pdf"),
    "to_image": ("pdf_to_image.py", "zip"),
    "to_pptx": ("pdf_to_pptx.py", "pptx"),
    "to_word": ("pdf_to_word.py", "docx"),
}
EDIT_COMMANDS = {"text", "image", "replace", "delete", "rotate", "extract", "apply"}
MIME = {
    "pdf": "application/pdf",
    "zip": "application/zip",
    "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
}
FLAG = re.compile(r"^--[a-z][a-z-]*$")


class ToolError(Exception):
    """Bad input from the client; message is safe to show."""


def parse_multipart(content_type, body):
    msg = BytesParser(policy=default).parsebytes(
        b"Content-Type: " + content_type.encode() + b"\r\n\r\n" + body)
    fields, files = {}, {}
    for part in msg.iter_parts():
        name = part.get_param("name", header="content-disposition")
        if part.get_filename():
            files.setdefault(name, []).append((part.get_filename(), part.get_payload(decode=True)))
        else:
            fields[name] = part.get_content()
    return fields, files


def build_flags(options, image_path):
    flags = []
    for key, value in options.items():
        if not FLAG.match(key) or key == "--output":
            raise ToolError(f"Option not allowed: {key}")
        if value in (False, None, ""):
            continue
        if value is True:
            flags.append(key)
        elif key == "--image":
            if value != "@image" or image_path is None:
                raise ToolError("Upload an image to use as the signature or stamp.")
            flags.append(f"{key}={image_path}")
        else:
            flags.append(f"{key}={value}")
    return flags


def command_is_apply(args):
    return bool(args) and args[0] == "apply"


def run_tool(fields, files):
    tool = fields.get("tool", "")
    if tool not in TOOLS:
        raise ToolError("Unknown tool.")
    script, ext = TOOLS[tool]
    options = json.loads(fields.get("options") or "{}")
    if not isinstance(options, dict):
        raise ToolError("Options must be a JSON object.")

    pdfs = files.get("file", [])
    if not pdfs:
        raise ToolError("Upload a PDF.")
    if tool == "merge" and len(pdfs) < 2:
        raise ToolError("Upload at least two PDFs to merge.")
    if tool != "merge":
        pdfs = pdfs[:1]

    args = []
    if tool == "edit":
        command = options.pop("command", "")
        if command not in EDIT_COMMANDS:
            raise ToolError("Pick an edit action.")
        args.append(command)

    with tempfile.TemporaryDirectory() as work_dir:
        work = Path(work_dir)
        inputs = []
        for i, (filename, data) in enumerate(pdfs):
            path = work / f"input{i}.pdf"
            path.write_bytes(data)
            inputs.append(str(path))

        image_path = None
        if files.get("image"):
            image_name, image_data = files["image"][0]
            suffix = Path(image_name).suffix.lower()
            if suffix not in {".png", ".jpg", ".jpeg"}:
                raise ToolError("Image must be PNG or JPG.")
            image_path = work / f"image{suffix}"
            image_path.write_bytes(image_data)

        if command_is_apply(args):
            # Editor: ops list in fields["ops"]; images referenced as "upload:N" in files["upload"].
            ops = json.loads(fields.get("ops") or "[]")
            if not isinstance(ops, list):
                raise ToolError("Operations must be a list.")
            uploads = files.get("upload", [])
            for op in ops:
                if isinstance(op, dict) and str(op.get("file", "")).startswith("upload:"):
                    idx = int(op["file"].split(":", 1)[1])
                    if idx >= len(uploads):
                        raise ToolError("Missing image upload.")
                    name = Path(uploads[idx][0]).suffix.lower()
                    if name not in {".png", ".jpg", ".jpeg"}:
                        raise ToolError("Image must be PNG or JPG.")
                    path = work / f"upload{idx}{name}"
                    path.write_bytes(uploads[idx][1])
                    op["file"] = str(path)
            ops_path = work / "ops.json"
            ops_path.write_text(json.dumps(ops), encoding="utf8")
            options["--ops-file"] = str(ops_path)
            args[0] = "apply"

        flags = build_flags(options, str(image_path) if image_path else None)
        out = work / "pages" if tool == "to_image" else work / f"result.{ext}"
        if tool == "to_image":
            out.mkdir()

        argv = [sys.executable, str(SCRIPTS / script), *args, *inputs, "-o", str(out), *flags]
        proc = subprocess.run(argv, capture_output=True, text=True, timeout=50)
        if proc.returncode != 0:
            lines = (proc.stderr or proc.stdout).strip().splitlines()
            raise ToolError(lines[-1] if lines else "Conversion failed.")

        if tool == "to_image":
            zip_path = work / "pages.zip"
            with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as zf:
                for jpg in sorted(out.glob("*.jpg")):
                    zf.write(jpg, jpg.name)
            out = zip_path
        return out.read_bytes(), MIME[ext]


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        body = self.rfile.read(int(self.headers.get("Content-Length") or 0))
        try:
            fields, files = parse_multipart(self.headers.get("Content-Type", ""), body)
            data, mime = run_tool(fields, files)
        except ToolError as err:
            return self._send(400, json.dumps({"error": str(err)}).encode(), "application/json")
        except Exception:  # keep tracebacks out of responses
            return self._send(500, json.dumps({"error": "Processing failed. Try a different file."}).encode(),
                              "application/json")
        self._send(200, data, mime)

    def _send(self, status, data, content_type):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


if __name__ == "__main__":
    # ponytail: self-check. Merges two generated PDFs through the same path the endpoint uses.
    import fitz
    a, b = fitz.open(), fitz.open()
    a.new_page()
    b.new_page()
    fields = {"tool": "merge", "options": "{}"}
    files = {"file": [("a.pdf", a.tobytes()), ("b.pdf", b.tobytes())]}
    out, mime = run_tool(fields, files)
    assert mime == MIME["pdf"] and fitz.open(stream=out, filetype="pdf").page_count == 2
    print("ok: merge via endpoint path")
