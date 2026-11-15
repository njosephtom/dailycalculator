import React, { useEffect, useRef, useState } from "react";
import * as pdfjs from "pdfjs-dist";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import { PDF_API_URL } from "../../utils/pdfAccess";
import {
  MousePointer2, Type, Highlighter, Underline, Strikethrough, Square, Stamp,
  ImagePlus, Shapes, Pen, Eraser, Replace, SpellCheck, Undo2, Download,
} from "lucide-react";
import PageSEO from "../../components/ui/PageSEO";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

// Coordinates: ops store PDF points, top-left origin. SCALE = screen pixels per point.
const SCALE = 1.4;
const COLORS = { highlight: "#facc15", underline: "#2563eb", strike: "#dc2626", rect: "#2563eb", ellipse: "#2563eb", line: "#2563eb", draw: "#e11d48" };
const DRAG_TOOLS = ["redact", "highlight", "underline", "strike", "shape", "draw"];

const TOOLS = [
  { id: "pointer", label: "Pointer", icon: MousePointer2 },
  { id: "text", label: "Edit Text", icon: Type },
  { id: "addtext", label: "Add Text", icon: Type },
  { id: "redact", label: "Redact", icon: Square },
  { id: "highlight", label: "Highlight", icon: Highlighter },
  { id: "underline", label: "Underline", icon: Underline },
  { id: "strike", label: "Strikeout", icon: Strikethrough },
  { id: "stamp", label: "Stamp", icon: Stamp },
  { id: "image", label: "Add Images", icon: ImagePlus },
  { id: "shape", label: "Shapes", icon: Shapes },
  { id: "draw", label: "Drawing", icon: Pen },
  { id: "erase", label: "True Eraser", icon: Eraser },
  { id: "find", label: "Find & Replace", icon: Replace },
  { id: "spell", label: "Spell Checker", icon: SpellCheck },
];

// Text runs from pdf.js, in PDF points (top-left origin), so they can be clicked and replaced.
async function readPages(doc) {
  const pages = [];
  for (let n = 1; n <= doc.numPages; n++) {
    const page = await doc.getPage(n);
    const vp = page.getViewport({ scale: 1 });
    const content = await page.getTextContent();
    const items = content.items
      .filter((it) => it.str && it.str.trim())
      .map((it) => {
        const m = pdfjs.Util.transform(vp.transform, it.transform);
        const size = Math.hypot(m[2], m[3]);
        return {
          str: it.str, size,
          x: m[4], y: m[5],
          rect: [m[4], m[5] - size, m[4] + it.width, m[5] + size * 0.25],
        };
      });
    pages.push({ number: n, width: vp.width, height: vp.height, items });
  }
  return pages;
}

function shapeFor(op) {
  const s = SCALE;
  const common = { style: { pointerEvents: "auto" } };
  const stroke = op.color || "#2563eb";
  const [x0, y0, x1, y1] = op.rect || [0, 0, 0, 0];
  switch (op.type) {
    case "highlight":
      return <rect {...common} x={x0 * s} y={y0 * s} width={(x1 - x0) * s} height={(y1 - y0) * s} fill={stroke} opacity="0.35" />;
    case "underline":
      return <line {...common} x1={x0 * s} x2={x1 * s} y1={y1 * s} y2={y1 * s} stroke={stroke} strokeWidth="2" />;
    case "strike":
      return <line {...common} x1={x0 * s} x2={x1 * s} y1={(y0 + y1) * s / 2} y2={(y0 + y1) * s / 2} stroke={stroke} strokeWidth="2" />;
    case "redact":
      return <rect {...common} x={x0 * s} y={y0 * s} width={(x1 - x0) * s} height={(y1 - y0) * s} fill="#000" />;
    case "replace_text":
      return (
        <g {...common}>
          <rect x={x0 * s} y={y0 * s} width={(x1 - x0) * s} height={(y1 - y0) * s} fill="#fff" />
          <text x={op.x * s} y={op.y * s} fontSize={op.size * s} fill="#000">{op.text}</text>
        </g>
      );
    case "text":
      return <text {...common} x={op.x * s} y={op.y * s} fontSize={op.size * s} fill={op.color || "#000"}>{op.text}</text>;
    case "stamp":
      return (
        <text {...common} x={op.x * s + 4} y={op.y * s} fontSize={op.size * s} fill={op.color || "#dc2626"}
          stroke={op.color || "#dc2626"} strokeWidth="0.5">{op.text}</text>
      );
    case "rect":
      return <rect {...common} x={x0 * s} y={y0 * s} width={(x1 - x0) * s} height={(y1 - y0) * s} fill="none" stroke={stroke} strokeWidth="2" />;
    case "ellipse":
      return <ellipse {...common} cx={(x0 + x1) * s / 2} cy={(y0 + y1) * s / 2} rx={(x1 - x0) * s / 2} ry={(y1 - y0) * s / 2} fill="none" stroke={stroke} strokeWidth="2" />;
    case "line":
      return <line {...common} x1={op.points[0][0] * s} y1={op.points[0][1] * s} x2={op.points[1][0] * s} y2={op.points[1][1] * s} stroke={stroke} strokeWidth="2" />;
    case "draw":
      return <polyline {...common} points={op.points.map(([x, y]) => `${x * s},${y * s}`).join(" ")} fill="none" stroke={stroke} strokeWidth="2" />;
    case "image":
      return <image {...common} href={op.previewUrl} x={x0 * s} y={y0 * s} width={(x1 - x0) * s} height={(y1 - y0) * s} />;
    default:
      return null;
  }
}

function PageView({ info, pdfDoc, ops, tool, shape, find, onAdd, onRemove, onImagePoint }) {
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const [drag, setDrag] = useState(null);   // {start, cur, points}
  const [entry, setEntry] = useState(null); // {kind, x, y, value, item?}

  const w = info.width * SCALE;
  const h = info.height * SCALE;

  useEffect(() => {
    let cancelled = false;
    pdfDoc.getPage(info.number).then(async (page) => {
      const viewport = page.getViewport({ scale: SCALE });
      const canvas = canvasRef.current;
      if (!canvas || cancelled) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
    });
    return () => { cancelled = true; };
  }, [pdfDoc, info.number]);

  const pt = (e) => {
    const r = overlayRef.current.getBoundingClientRect();
    return { x: (e.clientX - r.left) / SCALE, y: (e.clientY - r.top) / SCALE };
  };

  const onDown = (e) => {
    if (entry) return;
    const p = pt(e);
    if (tool === "addtext" || tool === "stamp") {
      setEntry({ kind: tool, x: p.x, y: p.y, value: "" });
    } else if (tool === "image") {
      onImagePoint(info.number, p.x, p.y);
    } else if (DRAG_TOOLS.includes(tool)) {
      setDrag({ start: p, cur: p, points: [p] });
    }
  };

  const onMove = (e) => {
    if (!drag) return;
    const p = pt(e);
    setDrag((d) => ({ ...d, cur: p, points: tool === "draw" ? [...d.points, p] : d.points }));
  };

  const onUp = () => {
    if (!drag) return;
    const { start, cur, points } = drag;
    setDrag(null);
    const page = info.number;
    const rect = [Math.min(start.x, cur.x), Math.min(start.y, cur.y), Math.max(start.x, cur.x), Math.max(start.y, cur.y)];
    if (tool === "draw") {
      if (points.length > 1) onAdd({ page, type: "draw", points: points.map((p) => [p.x, p.y]), color: COLORS.draw, width: 2 });
      return;
    }
    if (tool === "shape") {
      if (shape === "line") onAdd({ page, type: "line", points: [[start.x, start.y], [cur.x, cur.y]], color: COLORS.line, width: 2 });
      else if (rect[2] - rect[0] > 2 && rect[3] - rect[1] > 2) onAdd({ page, type: shape, rect, color: COLORS[shape], width: 2 });
      return;
    }
    if (rect[2] - rect[0] < 2 || rect[3] - rect[1] < 2) return;
    onAdd({ page, type: tool, rect, color: COLORS[tool] });
  };

  const commit = () => {
    if (!entry) return;
    const page = info.number;
    if (entry.kind === "edit") {
      if (entry.value !== entry.item.str) {
        onAdd({ page, type: "replace_text", rect: entry.item.rect, x: entry.item.x, y: entry.item.y, size: entry.item.size, text: entry.value });
      }
    } else if (entry.value.trim()) {
      onAdd({ page, type: entry.kind === "stamp" ? "stamp" : "text", x: entry.x, y: entry.y, size: 12, text: entry.value, color: entry.kind === "stamp" ? "#dc2626" : "#000000" });
    }
    setEntry(null);
  };

  const previewDrag = drag && (() => {
    const { start, cur, points } = drag;
    if (tool === "draw") return { type: "draw", points: points.map((p) => [p.x, p.y]), color: COLORS.draw };
    if (tool === "shape" && shape === "line") return { type: "line", points: [[start.x, start.y], [cur.x, cur.y]], color: COLORS.line };
    const type = tool === "shape" ? shape : tool;
    return { type, rect: [Math.min(start.x, cur.x), Math.min(start.y, cur.y), Math.max(start.x, cur.x), Math.max(start.y, cur.y)], color: COLORS[type] };
  })();

  const showItems = tool === "text" || tool === "find";

  return (
    <div className="relative mx-auto bg-white shadow-md" style={{ width: w, height: h }}>
      <canvas ref={canvasRef} className="absolute inset-0 block" />

      <div
        ref={overlayRef}
        className="absolute inset-0"
        style={{ cursor: tool === "pointer" ? "default" : "crosshair" }}
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
      >
        <svg width={w} height={h} className="absolute inset-0" style={{ pointerEvents: tool === "erase" ? "auto" : "none" }}>
          {ops.map((op) => (
            <g key={op.id} onClick={tool === "erase" ? (e) => { e.stopPropagation(); onRemove(op.id); } : undefined}
              style={{ cursor: tool === "erase" ? "pointer" : "default" }}>
              {shapeFor(op)}
            </g>
          ))}
          {previewDrag && shapeFor(previewDrag)}
        </svg>

        {showItems && info.items.map((item, i) => {
          const hit = tool === "find" && find && item.str.includes(find);
          return (
            <button
              key={i}
              type="button"
              title={tool === "text" ? "Click to edit this text" : undefined}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (tool === "text") setEntry({ kind: "edit", item, x: item.x, y: item.y, value: item.str });
              }}
              className={`absolute border ${hit ? "bg-yellow-300/50 border-yellow-500" : "border-transparent hover:border-blue-500 hover:bg-blue-100/30"}`}
              style={{
                left: item.rect[0] * SCALE,
                top: item.rect[1] * SCALE,
                width: (item.rect[2] - item.rect[0]) * SCALE,
                height: (item.rect[3] - item.rect[1]) * SCALE,
              }}
            />
          );
        })}

        {entry && (
          <input
            autoFocus
            value={entry.value}
            onChange={(e) => setEntry({ ...entry, value: e.target.value })}
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEntry(null); }}
            onBlur={commit}
            placeholder={entry.kind === "edit" ? "" : "Type and press Enter"}
            className="absolute text-black bg-white/90 border border-blue-500 px-1 outline-none"
            style={{
              left: (entry.kind === "edit" ? entry.item.rect[0] : entry.x) * SCALE,
              top: ((entry.kind === "edit" ? entry.item.y : entry.y) - (entry.kind === "edit" ? entry.item.size : 12)) * SCALE,
              fontSize: (entry.kind === "edit" ? entry.item.size : 12) * SCALE,
              minWidth: 120,
              width: entry.kind === "edit" ? Math.max(120, (entry.item.rect[2] - entry.item.rect[0]) * SCALE) : 240,
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function PdfEditor() {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pages, setPages] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [ops, setOps] = useState([]);
  const [uploads, setUploads] = useState([]); // images, referenced by index in ops
  const [tool, setTool] = useState("pointer");
  const [shape, setShape] = useState("rect");
  const [find, setFind] = useState("");
  const [replaceWith, setReplaceWith] = useState("");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const imageTarget = useRef(null);
  const imageInput = useRef(null);

  const addOps = (list) => setOps((prev) => [...prev, ...list.map((op) => ({ ...op, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` }))]);
  const addOp = (op) => addOps([op]);
  const removeOp = (id) => setOps((prev) => prev.filter((op) => op.id !== id));

  const openFile = async (file) => {
    setError("");
    setStatus("Loading…");
    try {
      const doc = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      setPages(await readPages(doc));
      setPdfDoc(doc);
      setFile(file);
      setFileName(file.name);
      setOps([]);
      setUploads([]);
      setStatus("");
    } catch {
      setError("Could not open this PDF.");
      setStatus("");
    }
  };

  const onImagePoint = (page, x, y) => {
    imageTarget.current = { page, x, y };
    imageInput.current.click();
  };

  const onImagePicked = (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file || !imageTarget.current) return;
    const { page, x, y } = imageTarget.current;
    const index = uploads.length;
    setUploads((prev) => [...prev, file]);
    addOp({ page, type: "image", rect: [x, y, x + 160, y + 120], file: `upload:${index}`, previewUrl: URL.createObjectURL(file) });
  };

  const rotatePage = (page) => addOp({ page, type: "rotate", angle: 90 });
  const deletePage = (page) => addOp({ page, type: "delete_page" });

  const replaceAll = () => {
    if (!find) return;
    const list = [];
    pages.forEach((p) => p.items.forEach((item) => {
      if (item.str.includes(find)) {
        list.push({ page: p.number, type: "replace_text", rect: item.rect, x: item.x, y: item.y, size: item.size, text: item.str.split(find).join(replaceWith) });
      }
    }));
    if (list.length === 0) return setStatus(`"${find}" not found.`);
    addOps(list);
    setStatus(`Replaced ${list.length} text item(s).`);
  };

  const save = async () => {
    setError("");
    setBusy(true);
    setStatus("Saving…");
    try {
      const body = new FormData();
      body.append("tool", "edit");
      body.append("options", JSON.stringify({ command: "apply" }));
      body.append("ops", JSON.stringify(ops.map(({ id, previewUrl, ...op }) => op)));
      body.append("file", file);
      uploads.forEach((u) => body.append("upload", u));
      const res = await fetch(PDF_API_URL, { method: "POST", body });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Save failed (${res.status}). Files over 4.5 MB are too large.`);
      }
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName.replace(/\.pdf$/i, "")}_edited.pdf`;
      link.click();
      URL.revokeObjectURL(link.href);
      setStatus("Saved. Download started.");
    } catch (err) {
      setError(err.message);
      setStatus("");
    } finally {
      setBusy(false);
    }
  };

  const deletedPages = new Set(ops.filter((o) => o.type === "delete_page").map((o) => o.page));
  const rotatedPages = ops.filter((o) => o.type === "rotate");

  return (
    <div className="space-y-3">
      <PageSEO title="Edit PDF (Beta)" description="Edit PDFs in the browser: edit text, redact, highlight, shapes, drawing, images, find and replace." path="/pdf-tools/edit" />

      <div className="bg-slate-900 text-white rounded-xl px-3 py-2 flex flex-wrap items-center gap-1">
        {TOOLS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            disabled={!pdfDoc && id !== "pointer"}
            onClick={() => (id === "spell" ? setStatus("Spell checking needs a dictionary and is not available yet.") : setTool(id))}
            className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-md text-[11px] min-w-[64px] disabled:opacity-40 ${tool === id ? "bg-white text-slate-900" : "hover:bg-slate-700"}`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
        {tool === "shape" && (
          <select value={shape} onChange={(e) => setShape(e.target.value)} className="text-slate-900 text-xs rounded px-1 py-1">
            <option value="rect">Rectangle</option>
            <option value="ellipse">Ellipse</option>
            <option value="line">Line</option>
          </select>
        )}
        <div className="ml-auto flex items-center gap-2">
          <button type="button" onClick={() => setOps((p) => p.slice(0, -1))} disabled={ops.length === 0}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs hover:bg-slate-700 disabled:opacity-40">
            <Undo2 size={14} /> Undo
          </button>
          <button type="button" onClick={save} disabled={!pdfDoc || busy || ops.length === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40">
            <Download size={14} /> {busy ? "Saving…" : "Save PDF"}
          </button>
        </div>
      </div>

      {tool === "find" && pdfDoc && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex flex-wrap gap-2 items-end">
          <input value={find} onChange={(e) => setFind(e.target.value)} placeholder="Find"
            className="px-2 py-1.5 text-sm border rounded-lg dark:bg-slate-700 dark:text-white" />
          <input value={replaceWith} onChange={(e) => setReplaceWith(e.target.value)} placeholder="Replace with"
            className="px-2 py-1.5 text-sm border rounded-lg dark:bg-slate-700 dark:text-white" />
          <button type="button" onClick={replaceAll} className="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white">Replace all</button>
          <p className="text-xs text-slate-500">Matches within a single text run.</p>
        </div>
      )}

      {!pdfDoc ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center space-y-3">
          <label htmlFor="pdf-editor-file" className="text-sm font-medium text-slate-700 dark:text-slate-200">Choose a PDF to edit</label>
          <input id="pdf-editor-file" type="file" accept="application/pdf" className="block mx-auto text-sm"
            onChange={(e) => e.target.files[0] && openFile(e.target.files[0])} />
          {status && <p className="text-sm text-slate-500">{status}</p>}
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>{fileName} · {pages.length} page(s) · {ops.length} change(s)</span>
            <label className="cursor-pointer text-indigo-600">
              Open another PDF
              <input id="pdf-editor-file" type="file" accept="application/pdf" className="hidden"
                onChange={(e) => e.target.files[0] && openFile(e.target.files[0])} />
            </label>
          </div>
          <input ref={imageInput} type="file" accept="image/png,image/jpeg" className="hidden" onChange={onImagePicked} />

          <div className="bg-slate-200 dark:bg-slate-900 rounded-xl p-4 space-y-6 overflow-x-auto">
            {pages.map((info) => (
              <div key={info.number} className={deletedPages.has(info.number) ? "opacity-30" : ""}>
                <div className="flex items-center gap-2 mb-1 text-xs text-slate-600 dark:text-slate-300 justify-center">
                  <span>Page {info.number}{rotatedPages.some((r) => r.page === info.number) ? " (rotated on save)" : ""}{deletedPages.has(info.number) ? " (deleted on save)" : ""}</span>
                  <button type="button" onClick={() => rotatePage(info.number)} className="px-2 py-0.5 rounded bg-white dark:bg-slate-700">Rotate</button>
                  <button type="button" onClick={() => deletePage(info.number)} className="px-2 py-0.5 rounded bg-white dark:bg-slate-700">Delete</button>
                </div>
                <PageView
                  info={info}
                  pdfDoc={pdfDoc}
                  ops={ops.filter((o) => o.page === info.number)}
                  tool={tool}
                  shape={shape}
                  find={find}
                  onAdd={addOp}
                  onRemove={removeOp}
                  onImagePoint={onImagePoint}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {status && pdfDoc && <p className="text-sm text-slate-500">{status}</p>}
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <p className="text-xs text-slate-500">
        Beta. Changes are applied on the server when you save; files up to 4.5 MB. Edited text uses Helvetica, so
        non-Latin text and original fonts are not kept.
      </p>
    </div>
  );
}
