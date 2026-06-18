import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import { decimalUnits, binaryUnits, convertData, allConversions } from "../../utils/byteConverter";
import { ChevronDown, ChevronUp } from "lucide-react";

/* ---------- helpers ---------- */

const fmtVal = (n) => {
  if (!isFinite(n) || n < 0) return "—";
  if (n === 0) return "0";
  if (Math.abs(n) < 0.0001 || Math.abs(n) >= 1e15) return n.toExponential(4);
  if (Math.abs(n) < 1) return n.toFixed(6).replace(/\.?0+$/, "");
  if (Math.abs(n) < 1000) return Number(n.toPrecision(8)).toString();
  return n.toLocaleString("en-US", { maximumFractionDigits: 4 });
};

const buildOpts = (units) =>
  Object.entries(units).map(([k, v]) => ({ value: k, label: v.label }));

/* ---------- local components ---------- */

function SectionLabel({ children }) {
  return (
    <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
      {children}
    </p>
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

/* ---------- static data ---------- */

const FAQS = [
  {
    q: "What is the difference between binary (IEC) and decimal (SI) units?",
    a: "Decimal units use powers of 1000: 1 KB = 1,000 bytes, 1 MB = 1,000,000 bytes. Binary units use powers of 1024: 1 KiB = 1,024 bytes, 1 MiB = 1,048,576 bytes. The IEC standard (KiB, MiB, GiB) was introduced in 1998 to eliminate the ambiguity. Operating systems like Windows traditionally report sizes in binary but label them with decimal prefixes (KB, MB, GB), which is a common source of confusion.",
  },
  {
    q: "Why does my hard drive show less space than advertised?",
    a: "Hard drive manufacturers use decimal (SI) units where 1 GB = 1,000,000,000 bytes. However, most operating systems report storage using binary math where 1 GB = 1,073,741,824 bytes. A drive advertised as 1 TB (1,000,000,000,000 bytes) appears as roughly 931 GiB in your OS. The missing space is not defective — it is simply a labeling difference between the two measurement systems.",
  },
  {
    q: "How many bits are in a byte?",
    a: "One byte equals exactly 8 bits. A bit is the smallest unit of data (a 0 or 1). A byte can represent 256 different values (2⁸). This 8-bit byte has been the standard in virtually all modern computer architectures since the 1960s, though historically some systems used 6-bit or 7-bit bytes.",
  },
];

const DECIMAL_QUICK_REF = [
  "1 Byte = 8 Bits",
  "1 KB = 1,000 Bytes",
  "1 MB = 1,000 KB",
  "1 GB = 1,000 MB",
  "1 TB = 1,000 GB",
  "1 PB = 1,000 TB",
];

const BINARY_QUICK_REF = [
  "1 Byte = 8 Bits",
  "1 KiB = 1,024 Bytes",
  "1 MiB = 1,024 KiB",
  "1 GiB = 1,024 MiB",
  "1 TiB = 1,024 GiB",
  "1 PiB = 1,024 TiB",
];

/* ---------- main component ---------- */

export default function ByteConverter() {
  const [value, setValue] = useState("1");
  const [binary, setBinary] = useState(false);
  const [fromUnit, setFromUnit] = useState("gb");
  const [toUnit, setToUnit] = useState("mb");

  const units = binary ? binaryUnits : decimalUnits;
  const unitOpts = useMemo(() => buildOpts(units), [binary]);

  // When toggling binary/decimal, map units to their counterpart
  const handleBinaryToggle = (on) => {
    const decToBin = { bit: "bit", byte: "byte", kb: "kib", mb: "mib", gb: "gib", tb: "tib", pb: "pib" };
    const binToDec = { bit: "bit", byte: "byte", kib: "kb", mib: "mb", gib: "gb", tib: "tb", pib: "pb" };
    if (on) {
      setFromUnit((u) => decToBin[u] ?? "gib");
      setToUnit((u) => decToBin[u] ?? "mib");
    } else {
      setFromUnit((u) => binToDec[u] ?? "gb");
      setToUnit((u) => binToDec[u] ?? "mb");
    }
    setBinary(on);
  };

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (!isFinite(v)) return null;
    return convertData(v, fromUnit, toUnit, binary);
  }, [value, fromUnit, toUnit, binary]);

  const allResults = useMemo(() => {
    const v = parseFloat(value);
    if (!isFinite(v)) return [];
    const conv = allConversions(v, fromUnit, binary);
    return Object.entries(units).map(([k, u]) => ({
      key: k,
      label: u.label,
      value: conv[k],
    }));
  }, [value, fromUnit, binary, units]);

  function swap() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  }

  const quickRef = binary ? BINARY_QUICK_REF : DECIMAL_QUICK_REF;

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">
              Byte / Data Converter
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Convert between bits, bytes, kilobytes, megabytes, gigabytes,
              terabytes and petabytes in decimal (SI) or binary (IEC) units.
            </p>
          </div>

          {/* Input form card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            {/* Binary / Decimal toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Mode
              </span>
              <button
                onClick={() => handleBinaryToggle(false)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  !binary
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
                }`}
              >
                Decimal (SI)
              </button>
              <button
                onClick={() => handleBinaryToggle(true)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  binary
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600"
                }`}
              >
                Binary (IEC)
              </button>
            </div>

            {/* Value + From + Swap + To */}
            <div className="flex flex-wrap items-end gap-3">
              <InputField
                label="Value"
                id="byte-val"
                value={value}
                onChange={setValue}
                className="flex-1 min-w-32"
                autoFocus
              />

              <SelectField
                label="From"
                id="byte-from"
                value={fromUnit}
                onChange={setFromUnit}
                options={unitOpts}
                className="flex-1 min-w-40"
              />

              {/* Swap button */}
              <button
                onClick={swap}
                className="mb-0.5 p-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                title="Swap units"
              >
                <svg
                  className="w-4 h-4 text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
              </button>

              <SelectField
                label="To"
                id="byte-to"
                value={toUnit}
                onChange={setToUnit}
                options={unitOpts}
                className="flex-1 min-w-40"
              />
            </div>
          </div>

          {/* Primary result */}
          <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl p-5">
            <SectionLabel>Result</SectionLabel>
            <p className="text-2xl font-extrabold text-indigo-700 dark:text-indigo-300 break-all leading-tight">
              {value}{" "}
              {units[fromUnit]?.label?.split(" ")[0] ?? fromUnit} ={" "}
              {fmtVal(result)}{" "}
              {units[toUnit]?.label?.split(" ")[0] ?? toUnit}
            </p>
          </div>

          {/* Full conversion table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              All conversions for {value} {units[fromUnit]?.label}
            </h2>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-slate-800">
                  <tr className="text-left text-xs text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <th className="pb-2 pr-4 font-semibold">Unit</th>
                    <th className="pb-2 font-semibold">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {allResults.map((r) => (
                    <tr
                      key={r.key}
                      className={`border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/20 cursor-pointer ${
                        r.key === toUnit
                          ? "bg-indigo-50 dark:bg-indigo-900/20"
                          : ""
                      }`}
                      onClick={() => setToUnit(r.key)}
                    >
                      <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">
                        {r.label}
                      </td>
                      <td className="py-2 font-mono font-medium text-slate-800 dark:text-white">
                        {fmtVal(r.value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Click a row to set it as the target unit
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Quick reference table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Quick Reference ({binary ? "Binary / IEC" : "Decimal / SI"})
            </h2>
            <div className="grid grid-cols-1 gap-1.5 text-sm text-slate-600 dark:text-slate-400">
              {quickRef.map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50"
                >
                  <span className="font-mono text-slate-700 dark:text-slate-200">
                    {s}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Binary vs Decimal explainer card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
              Binary vs Decimal Explained
            </h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`Decimal (SI) — powers of 1000
  1 KB  = 1,000 B
  1 MB  = 1,000 KB  = 1,000,000 B
  1 GB  = 1,000 MB  = 1,000,000,000 B

Binary (IEC) — powers of 1024
  1 KiB = 1,024 B
  1 MiB = 1,024 KiB = 1,048,576 B
  1 GiB = 1,024 MiB = 1,073,741,824 B

The difference grows at larger scales:
  1 TB  = 1,000 GB    (decimal)
  1 TiB = 1,024 GiB   (binary)
  1 TiB ≈ 1.0995 TB

Storage vendors use decimal (SI) units.
Operating systems often use binary math
but display decimal labels (GB not GiB),
causing the "missing space" confusion.`}
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
