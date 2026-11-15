import React, { useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import PageSEO from "../../components/ui/PageSEO";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

// Positions are PDF points, top-left origin (what pdf_sign.py --x/--y expect). SCALE = px per point.
const SCALE = 1.2;
const TYPED_FONT_SIZE = 28; // matches pdf_sign.py default --font-size

export default function SignPdf() {
  const [file, setFile] = useState(null);
  const [doc, setDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState({ w: 612, h: 792 });
  const [placement, setPlacement] = useState(null); // {x, y} in points
  const [mode, setMode] = useState("draw");         // draw | upload | type
  const [sigBlob, setSigBlob] = useState(null);
  const [sigUrl, setSigUrl] = useState("");
  const [sigAspect, setSigAspect] = useState(0.4);  // height / width of the image signature
  const [typed, setTyped] = useState("");
  const [width, setWidth] = useState(150);
  const [dateLine, setDateLine] = useState(false);
  const [applyAll, setApplyAll] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const canvasRef = useRef(null);
  const pageRef = useRef(null);
  const padRef = useRef(null);
  const drawing = useRef(false);

  // Load the PDF, then render the selected page.
  const openFile = async (f) => {
    setError("");
    setStatus("Loading…");
    try {
      const loaded = await pdfjs.getDocument({ data: await f.arrayBuffer() }).promise;
      setDoc(loaded);
      setFile(f);
      setNumPages(loaded.numPages);
      setPageNo(loaded.numPages); // backend default is the last page
      setPlacement(null);
      setStatus("");
    } catch {
      setError("Could not open this PDF.");
      setStatus("");
    }
  };

  useEffect(() => {
    if (!doc) return;
    let cancelled = false;
    doc.getPage(pageNo).then(async (page) => {
      const viewport = page.getViewport({ scale: SCALE });
      const canvas = canvasRef.current;
      if (!canvas || cancelled) return;
      const unit = page.getViewport({ scale: 1 });
      setPageSize({ w: unit.width, h: unit.height });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    });
    return () => { cancelled = true; };
  }, [doc, pageNo]);

  // Keep the image URL for the preview in step with the signature blob / upload.
  useEffect(() => {
    if (!sigBlob) { setSigUrl(""); return; }
    const url = URL.createObjectURL(sigBlob);
    setSigUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [sigBlob]);

  // ----- Signature pad (draw) -----
  const padPoint = (e) => {
    const r = padRef.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * padRef.current.width) / r.width, y: ((e.clientY - r.top) * padRef.current.height) / r.height };
  };
  const padStart = (e) => {
    drawing.current = true;
    const ctx = padRef.current.getContext("2d");
    const p = padPoint(e);
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000080";
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  };
  const padMove = (e) => {
    if (!drawing.current) return;
    const ctx = padRef.current.getContext("2d");
    const p = padPoint(e);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  };
  const padEnd = () => {
    if (!drawing.current) return;
    drawing.current = false;
    padRef.current.toBlob((blob) => setSigBlob(blob), "image/png");
  };
  const padClear = () => {
    const c = padRef.current;
    c.getContext("2d").clearRect(0, 0, c.width, c.height);
    setSigBlob(null);
  };

  const onUpload = (e) => {
    const f = e.target.files[0];
    if (f) setSigBlob(f);
  };

  // Click on the page to place the signature (top-left corner at the click).
  const onPageClick = (e) => {
    const r = pageRef.current.getBoundingClientRect();
    setPlacement({
      x: Math.max(0, (e.clientX - r.left) / SCALE),
      y: Math.max(0, (e.clientY - r.top) / SCALE),
    });
  };

  const signaturePreviewHeight = (wPts) => (mode === "type" ? TYPED_FONT_SIZE * 1.3 : wPts * sigAspect);

  const save = async () => {
    setError("");
    if (mode === "type" && !typed.trim()) return setError("Type your name to sign.");
    if (mode !== "type" && !sigBlob) return setError(mode === "draw" ? "Draw your signature first." : "Upload a signature image.");
    setBusy(true);
    setStatus("Signing…");
    try {
      const options = { "--page": applyAll ? "all" : String(pageNo), "--width": String(width), "--date": dateLine };
      if (placement) {
        options["--x"] = placement.x.toFixed(2);
        options["--y"] = placement.y.toFixed(2);
      }
      const body = new FormData();
      body.append("tool", "sign");
      if (mode === "type") {
        options["--text"] = typed.trim();
      } else {
        options["--image"] = "@image";
        body.append("image", sigBlob, "signature.png");
      }
      body.append("options", JSON.stringify(options));
      body.append("file", file);
      const res = await fetch("/api/pdf", { method: "POST", body });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Signing failed (${res.status}). Files over 4.5 MB are too large.`);
      }
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${file.name.replace(/\.pdf$/i, "")}_signed.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
      setStatus("Signed. Download started.");
    } catch (err) {
      setError(err.message);
      setStatus("");
    } finally {
      setBusy(false);
    }
  };

  const tabBtn = (id, label) => (
    <button type="button" onClick={() => setMode(id)}
      className={`px-3 py-1.5 text-sm rounded-lg ${mode === id ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"}`}>
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      <PageSEO title="Sign PDF (Beta)" description="Place a drawn, uploaded or typed signature on a PDF page. Beta." path="/pdf-tools/sign" />
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Sign PDF</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Beta. Choose a PDF, click where the signature goes, then sign. Files up to 4.5 MB.</p>
        <input type="file" accept="application/pdf" className="mt-3 text-sm"
          onChange={(e) => e.target.files[0] && openFile(e.target.files[0])} aria-label="PDF file" />
      </div>

      {doc && (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Preview */}
          <div className="bg-slate-200 dark:bg-slate-900 rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3 text-sm">
              <button type="button" disabled={pageNo <= 1} onClick={() => { setPageNo((p) => p - 1); setPlacement(null); }}
                className="px-2 py-1 rounded bg-white dark:bg-slate-700 disabled:opacity-40">Prev</button>
              <span className="text-slate-600 dark:text-slate-300">Page {pageNo} of {numPages}</span>
              <button type="button" disabled={pageNo >= numPages} onClick={() => { setPageNo((p) => p + 1); setPlacement(null); }}
                className="px-2 py-1 rounded bg-white dark:bg-slate-700 disabled:opacity-40">Next</button>
            </div>
            <div className="overflow-auto">
              <div ref={pageRef} onClick={onPageClick} className="relative mx-auto bg-white shadow-md cursor-crosshair"
                style={{ width: pageSize.w * SCALE, height: pageSize.h * SCALE }}>
                <canvas ref={canvasRef} className="absolute inset-0 block" />
                {placement && (mode === "type" ? typed.trim() : sigUrl) && (
                  <div className="absolute pointer-events-none border border-dashed border-blue-500"
                    style={{ left: placement.x * SCALE, top: placement.y * SCALE, width: width * SCALE, height: signaturePreviewHeight(width) * SCALE }}>
                    {mode === "type" ? (
                      <span className="text-blue-900 italic leading-none whitespace-nowrap"
                        style={{ fontSize: TYPED_FONT_SIZE * SCALE, fontFamily: "Georgia, serif" }}>{typed}</span>
                    ) : (
                      <img src={sigUrl} alt="" className="w-full h-full object-contain"
                        onLoad={(e) => setSigAspect(e.target.naturalHeight / e.target.naturalWidth)} />
                    )}
                  </div>
                )}
              </div>
            </div>
            <p className="text-center text-xs text-slate-500 mt-2">
              {placement ? `Signature at ${placement.x.toFixed(0)}, ${placement.y.toFixed(0)} pt. Click again to move.` : "Click the page to place your signature. Without a click it goes bottom-right."}
            </p>
          </div>

          {/* Signature panel */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-4 self-start">
            <div className="flex gap-2">
              {tabBtn("draw", "Draw")}
              {tabBtn("upload", "Upload")}
              {tabBtn("type", "Type")}
            </div>

            {mode === "draw" && (
              <div className="space-y-2">
                <canvas ref={padRef} width={400} height={150}
                  className="w-full h-auto rounded-lg border border-dashed border-slate-400 bg-white touch-none"
                  onPointerDown={padStart} onPointerMove={padMove} onPointerUp={padEnd} onPointerLeave={padEnd} />
                <button type="button" onClick={padClear} className="text-xs text-indigo-600">Clear</button>
              </div>
            )}
            {mode === "upload" && (
              <div className="space-y-2">
                <input type="file" accept="image/png,image/jpeg" onChange={onUpload} className="text-sm" aria-label="Signature image" />
                <p className="text-xs text-slate-500">PNG with a transparent background looks best.</p>
              </div>
            )}
            {mode === "type" && (
              <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Your name"
                className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-slate-700 dark:text-white" />
            )}

            <label className="flex flex-col gap-1 text-sm text-slate-700 dark:text-slate-300">
              Width (points)
              <input type="number" min="20" max="600" value={width} onChange={(e) => setWidth(Number(e.target.value) || 150)}
                className="px-3 py-2 border rounded-lg dark:bg-slate-700 dark:text-white" />
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input type="checkbox" checked={dateLine} onChange={(e) => setDateLine(e.target.checked)} />
              Print today's date under the signature
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input type="checkbox" checked={applyAll} onChange={(e) => setApplyAll(e.target.checked)} />
              Sign every page (same spot)
            </label>

            <button type="button" onClick={save} disabled={busy}
              className="w-full px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
              {busy ? "Signing…" : "Sign & download"}
            </button>
            {status && <p className="text-sm text-slate-500">{status}</p>}
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          </div>
        </div>
      )}

      {!doc && error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      {!doc && status && <p className="text-sm text-slate-500">{status}</p>}
    </div>
  );
}
