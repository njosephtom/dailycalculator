import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageSEO from "../../components/ui/PageSEO";
import CalculatorTitle from "../../components/ui/CalculatorTitle";
import SelectField from "../../components/ui/SelectField";
import { PDF_API_URL } from "../../utils/pdfAccess";

// Field = one option of a python/pdf script. `flag` is the CLI flag it maps to.
const FIELDS = {
  page:           { label: "Page number", placeholder: "1" },
  pages:          { label: "Pages (e.g. 2,4-5)" },
  x:              { label: "X (points from left)" },
  y:              { label: "Y (points from top)" },
  text:           { label: "Text" },
  size:           { label: "Font size", placeholder: "12" },
  color:          { label: "Color (hex)", placeholder: "000000" },
  width:          { label: "Width (points)" },
  height:         { label: "Height (points, optional)" },
  old:            { label: "Find" },
  new:            { label: "Replace with" },
  angle:          { label: "Angle", select: ["90", "180", "270", "-90"] },
  dpi:            { label: "DPI", placeholder: "150" },
  level:          { label: "Compression", select: ["low", "medium", "high"] },
  position:       { label: "Position", select: ["bottom-right", "bottom-left", "bottom-center", "top-right", "top-left", "center"] },
  image:          { label: "Image file (PNG/JPG)", file: true, accept: "image/png,image/jpeg" },
  bookmarks:      { label: "Add a bookmark per file", bool: true },
  strip_metadata: { label: "Strip metadata", bool: true },
  editable:       { label: "Editable text boxes (not page pictures)", bool: true },
  notes:          { label: "Copy text into slide notes", bool: true },
  date:           { label: "Print today's date under signature", bool: true },
};

const TOOLS = {
  edit: {
    label: "Edit PDF",
    input: "single",
    actions: {
      text:    { label: "Add text",        fields: ["page", "x", "y", "text", "size", "color"] },
      image:   { label: "Place image",     fields: ["page", "image", "x", "y", "width", "height"] },
      replace: { label: "Replace text",    fields: ["old", "new"] },
      delete:  { label: "Delete pages",    fields: ["pages"] },
      rotate:  { label: "Rotate pages",    fields: ["pages", "angle"] },
      extract: { label: "Keep pages (reorder)", fields: ["pages"] },
    },
    ext: "pdf",
  },
  merge:    { label: "Merge PDFs",        input: "multi",  fields: ["bookmarks"], ext: "pdf" },
  optimize: { label: "Compress PDF",      input: "single", fields: ["level", "strip_metadata"], ext: "pdf" },
  to_image: { label: "PDF to JPG (zip)",  input: "single", fields: ["dpi", "pages"], ext: "zip" },
  to_pptx:  { label: "PDF to PowerPoint", input: "single", fields: ["dpi", "editable", "notes"], ext: "pptx" },
  to_word:  { label: "PDF to Word",       input: "single", fields: ["pages"], ext: "docx" },
};

const flagOf = (key) => "--" + key.replace(/_/g, "-");

// URL slug -> tool key (/pdf-tools/image opens the to_image tool)
const SLUGS = { image: "to_image", pptx: "to_pptx", word: "to_word" };
const toolFromSlug = (slug) => {
  const key = SLUGS[slug] || slug;
  return TOOLS[key] ? key : "merge";
};

export default function PdfTools() {
  const { tool: slug } = useParams();
  const [tool, setTool] = useState(() => toolFromSlug(slug));
  const [action, setAction] = useState("text");
  const [files, setFiles] = useState([]);
  const [values, setValues] = useState({});
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const cfg = TOOLS[tool];
  const activeFields = cfg.actions ? cfg.actions[action].fields : cfg.fields;
  const setValue = (key, v) => setValues((prev) => ({ ...prev, [key]: v }));

  const changeTool = (t) => {
    setTool(t);
    setFiles([]);
    setValues({});
    setError("");
    setStatus("");
  };

  useEffect(() => {
    if (slug) changeTool(toolFromSlug(slug));
  }, [slug]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");
    if (files.length === 0) return setError("Choose a PDF first.");

    const hasImage = !!values.image;
    const options = {};
    if (cfg.actions) options.command = action;
    if (values.password) options["--password"] = values.password;
    for (const key of activeFields) {
      const v = values[key];
      if (key === "image") { if (hasImage) options["--image"] = "@image"; continue; }
      if (key === "text" && tool === "sign" && hasImage) continue; // image wins over typed signature
      if (FIELDS[key].bool) { if (v) options[flagOf(key)] = true; continue; }
      if (v !== undefined && v !== "") options[flagOf(key)] = v;
    }
    if (tool === "sign" && !hasImage && !values.text) return setError("Add a signature image or typed text.");

    const body = new FormData();
    body.append("tool", tool);
    body.append("options", JSON.stringify(options));
    files.forEach((f) => body.append("file", f));
    if (hasImage) body.append("image", values.image);

    setBusy(true);
    setStatus("Processing…");
    try {
      const res = await fetch(PDF_API_URL, { method: "POST", body });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status}). Large files may exceed the 4.5 MB limit.`);
      }
      const blob = await res.blob();
      const stem = files[0].name.replace(/\.pdf$/i, "");
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${stem}_${tool}.${cfg.ext}`;
      link.click();
      URL.revokeObjectURL(link.href);
      setStatus("Done. Download started.");
    } catch (err) {
      setError(err.message);
      setStatus("");
    } finally {
      setBusy(false);
    }
  };

  const renderField = (key) => {
    const def = FIELDS[key];
    const id = `pdf-${tool}-${key}`;
    if (def.bool) {
      return (
        <label key={key} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
          <input type="checkbox" checked={!!values[key]} onChange={(e) => setValue(key, e.target.checked)} />
          {def.label}
        </label>
      );
    }
    if (def.file) {
      return (
        <div key={key} className="flex flex-col gap-1">
          <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">{def.label}</label>
          <input id={id} type="file" accept={def.accept} className="text-sm"
            onChange={(e) => setValue(key, e.target.files[0] || null)} />
        </div>
      );
    }
    if (def.select) {
      return (
        <SelectField key={key} id={id} label={def.label}
          value={values[key] ?? def.select[0]}
          onChange={(v) => setValue(key, v)}
          options={def.select.map((s) => ({ value: s, label: s }))} />
      );
    }
    return (
      <div key={key} className="flex flex-col gap-1">
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">{def.label}</label>
        <input id={id} type="text" placeholder={def.placeholder || ""} value={values[key] || ""}
          onChange={(e) => setValue(key, e.target.value)}
          className="w-full py-2 px-3 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white" />
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <PageSEO
        title="PDF Tools (Beta)"
        description="Merge, edit, sign, compress and convert PDFs online. Beta."
        path="/pdf-tools"
      />
      <CalculatorTitle calculatorId="pdf-tools" title="PDF Tools" description="Merge, edit, sign, compress and convert PDF files. Beta: files up to 4.5 MB." />

      <form onSubmit={submit} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
        <SelectField id="pdf-tool" label="Tool" value={tool} onChange={changeTool}
          options={Object.entries(TOOLS).map(([value, t]) => ({ value, label: t.label }))} />

        {cfg.actions && (
          <SelectField id="pdf-action" label="Action" value={action} onChange={setAction}
            options={Object.entries(cfg.actions).map(([value, a]) => ({ value, label: a.label }))} />
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="pdf-file" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {cfg.input === "multi" ? "PDF files (in merge order)" : "PDF file"}
          </label>
          <input id="pdf-file" type="file" accept="application/pdf" multiple={cfg.input === "multi"}
            className="text-sm" onChange={(e) => setFiles(Array.from(e.target.files || []))} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">{activeFields.map(renderField)}</div>

        <div className="flex flex-col gap-1">
          <label htmlFor="pdf-password" className="text-sm font-medium text-slate-700 dark:text-slate-300">Password (if encrypted)</label>
          <input id="pdf-password" type="password" value={values.password || ""}
            onChange={(e) => setValue("password", e.target.value)}
            className="w-full py-2 px-3 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg dark:text-white" />
        </div>

        <button type="submit" disabled={busy}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
          {busy ? "Working…" : "Run"}
        </button>

        {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}
        {status && <p className="text-sm text-slate-500 dark:text-slate-400">{status}</p>}
      </form>
    </div>
  );
}
