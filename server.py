"""Render web service for the PDF API: serves backend/pdf.py's handler on $PORT.

Env:
  PORT                 set by Render (default 8000 locally)
  PDF_CORS_ORIGINS     comma-separated frontend origins allowed to call the API
                       (default http://localhost:5173, the Vite dev server)
"""
import os
from http.server import ThreadingHTTPServer

from backend.pdf import handler

ORIGINS = {o.strip() for o in os.environ.get("PDF_CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()}


class Handler(handler):
    def end_headers(self):
        origin = self.headers.get("Origin", "")
        if origin in ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Vary", "Origin")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(204)
        self.end_headers()


if __name__ == "__main__":
    # ponytail: threads are fine here; each conversion is a subprocess with its own 50s timeout.
    port = int(os.environ.get("PORT", "8000"))
    ThreadingHTTPServer(("0.0.0.0", port), Handler).serve_forever()
