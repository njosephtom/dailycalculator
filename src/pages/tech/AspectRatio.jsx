import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  gcd,
  simplifyRatio,
  decimalRatio,
  scaleByWidth,
  scaleByHeight,
  COMMON_RATIOS,
} from "../../utils/aspectRatio";

/* ---------- local helpers ---------- */

const fmt = (n, d = 2) => (isFinite(n) && n > 0 ? n.toFixed(d) : "—");

function SectionLabel({ text }) {
  return (
    <div className="mb-3">
      <span className="inline-block border border-slate-300 dark:border-slate-600 rounded px-2 py-0.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {text}
        </span>
      </span>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 last:border-0">
      <button
        className="w-full flex items-center justify-between py-3 text-left text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{q}</span>
        {open ? (
          <ChevronUp size={14} className="shrink-0 ml-2 text-slate-400" />
        ) : (
          <ChevronDown size={14} className="shrink-0 ml-2 text-slate-400" />
        )}
      </button>
      {open && (
        <p className="pb-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
}

const MODES = [
  { v: "find",    l: "Find Ratio" },
  { v: "width",   l: "Scale by Width" },
  { v: "height",  l: "Scale by Height" },
];

const FAQS = [
  {
    q: "What is an aspect ratio?",
    a: "An aspect ratio is the proportional relationship between the width and height of an image or screen. It is expressed as two numbers separated by a colon, such as 16:9. This means for every 16 units of width there are 9 units of height.",
  },
  {
    q: "Why does aspect ratio matter for responsive design?",
    a: "Maintaining a consistent aspect ratio prevents images and videos from appearing stretched or squished when resized. CSS properties like aspect-ratio and object-fit rely on the ratio to scale content proportionally across different viewport sizes.",
  },
  {
    q: "How do I convert a resolution to an aspect ratio?",
    a: "Divide both the width and height by their greatest common divisor (GCD). For example, 1920 and 1080 share a GCD of 120, so 1920 / 120 = 16 and 1080 / 120 = 9, giving a 16:9 ratio.",
  },
];

/* ---------- component ---------- */

export default function AspectRatio() {
  const [mode,   setMode]   = useState("find");
  const [width,  setWidth]  = useState("1920");
  const [height, setHeight] = useState("1080");
  const [newW,   setNewW]   = useState("1280");
  const [newH,   setNewH]   = useState("720");

  const w = parseFloat(width)  || 0;
  const h = parseFloat(height) || 0;

  /* derived values */
  const ratio     = useMemo(() => simplifyRatio(w, h),   [w, h]);
  const decimal   = useMemo(() => decimalRatio(w, h),    [w, h]);
  const scaledH   = useMemo(() => scaleByWidth(w, h, parseFloat(newW) || 0),  [w, h, newW]);
  const scaledW   = useMemo(() => scaleByHeight(w, h, parseFloat(newH) || 0), [w, h, newH]);

  /* preview rectangle sizing — fit inside a max 280 x 180 box */
  const preview = useMemo(() => {
    if (w <= 0 || h <= 0) return null;
    const maxW = 280, maxH = 180;
    const scale = Math.min(maxW / w, maxH / h);
    return { width: Math.round(w * scale), height: Math.round(h * scale) };
  }, [w, h]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN */}
        <div className="space-y-4">

          {/* Title */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Aspect Ratio Calculator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Find, simplify, and scale aspect ratios for screens, images, and videos.
            </p>
          </div>

          {/* Input form */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">

            {/* Mode toggle */}
            <div>
              <SectionLabel text="Mode" />
              <div className="flex gap-2 flex-wrap">
                {MODES.map((o) => (
                  <button
                    key={o.v}
                    onClick={() => setMode(o.v)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                      mode === o.v
                        ? "bg-white dark:bg-slate-700 border-slate-400 dark:border-slate-400 text-slate-800 dark:text-white shadow-sm"
                        : "border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>

            {/* Original dimensions — always visible */}
            <div>
              <SectionLabel text="Original Dimensions" />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Width"
                  id="orig-w"
                  value={width}
                  onChange={setWidth}
                  min="0"
                  suffix="px"
                  autoFocus
                />
                <InputField
                  label="Height"
                  id="orig-h"
                  value={height}
                  onChange={setHeight}
                  min="0"
                  suffix="px"
                />
              </div>
            </div>

            {/* Extra input for scale modes */}
            {mode === "width" && (
              <div>
                <SectionLabel text="New Width" />
                <InputField
                  label="New Width"
                  id="new-w"
                  value={newW}
                  onChange={setNewW}
                  min="0"
                  suffix="px"
                />
              </div>
            )}

            {mode === "height" && (
              <div>
                <SectionLabel text="New Height" />
                <InputField
                  label="New Height"
                  id="new-h"
                  value={newH}
                  onChange={setNewH}
                  min="0"
                  suffix="px"
                />
              </div>
            )}
          </div>

          {/* Result metric cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
                Aspect Ratio
              </p>
              <p className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300 leading-tight">
                {ratio}
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
                Decimal Ratio
              </p>
              <p className="text-xl font-extrabold text-blue-700 dark:text-blue-300 leading-tight">
                {fmt(decimal, 3)}
              </p>
            </div>
          </div>

          {/* Scaled dimensions — modes 2 & 3 */}
          {mode === "width" && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                Scaled Dimensions
              </p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                {fmt(parseFloat(newW) || 0, 0)} <span className="text-sm font-semibold">x</span>{" "}
                {fmt(scaledH, 0)} <span className="text-sm font-semibold">px</span>
              </p>
            </div>
          )}

          {mode === "height" && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                Scaled Dimensions
              </p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">
                {fmt(scaledW, 0)} <span className="text-sm font-semibold">x</span>{" "}
                {fmt(parseFloat(newH) || 0, 0)} <span className="text-sm font-semibold">px</span>
              </p>
            </div>
          )}

          {/* Visual ratio preview */}
          {preview && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Visual Preview
              </h2>
              <div className="flex items-center justify-center">
                <div
                  className="border-2 border-indigo-400 dark:border-indigo-500 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center"
                  style={{ width: preview.width, height: preview.height }}
                >
                  <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-400">
                    {ratio}
                  </span>
                </div>
              </div>
              <p className="text-center text-xs text-slate-400 mt-2">
                {preview.width} x {preview.height} px (scaled preview)
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">

          {/* Common ratios reference table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Common Aspect Ratios
            </h2>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-slate-800">
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-left">
                    <th className="pb-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                      Ratio
                    </th>
                    <th className="pb-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                      Decimal
                    </th>
                    <th className="pb-2 text-xs font-semibold text-slate-400 dark:text-slate-500">
                      Common Resolutions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMMON_RATIOS.map((r) => (
                    <tr
                      key={r.ratio}
                      className="border-b border-slate-100 dark:border-slate-700/50"
                    >
                      <td className="py-1.5 font-semibold text-indigo-600 dark:text-indigo-400">
                        {r.ratio}
                      </td>
                      <td className="py-1.5 text-slate-600 dark:text-slate-400">
                        {(r.w / r.h).toFixed(3)}
                      </td>
                      <td className="py-1.5 text-slate-600 dark:text-slate-400">
                        {r.resolutions.join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Formula card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
              Formulas
            </h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`Simplified Ratio
  GCD  = gcd(width, height)
  Ratio = (width / GCD) : (height / GCD)

Decimal Ratio
  Decimal = width / height

Scale by Width
  New Height = (Original Height / Original Width) x New Width

Scale by Height
  New Width = (Original Width / Original Height) x New Height`}
            </pre>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH FAQ */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">
          Frequently Asked Questions
        </h2>
        {FAQS.map((f, i) => (
          <FaqItem key={i} q={f.q} a={f.a} />
        ))}
      </div>
    </div>
  );
}
