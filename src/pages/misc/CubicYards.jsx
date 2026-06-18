import React, { useState, useMemo } from "react";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import { calcFromDimensions, calcFromArea, weightTons, MATERIALS } from "../../utils/cubicYards";
import { ChevronDown, ChevronUp } from "lucide-react";

const DEPTH_UNITS = [{ value:"inches", label:"Inches" }, { value:"cm", label:"Centimeters" }, { value:"feet", label:"Feet" }];
const AREA_UNITS  = [{ value:"sqft", label:"Square Feet" }, { value:"sqyd", label:"Square Yards" }, { value:"sqm", label:"Square Meters" }];
const CURRENCY    = ["$","€","£","₹","¥"];
const MAT_OPTS    = Object.entries(MATERIALS).map(([k,v])=>({ value:k, label:v.label }));
const PRICE_UNITS = [{ value:"cu yd", label:"/ cu yd" }, { value:"cu ft", label:"/ cu ft" }, { value:"cu m", label:"/ cu m" }];

const fmt = (n, d=2) => isFinite(n) && n >= 0 ? n.toFixed(d) : "—";

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
        onClick={() => setOpen(v => !v)}
      >
        <span>{q}</span>
        {open
          ? <ChevronUp size={14} className="shrink-0 ml-2 text-slate-400" />
          : <ChevronDown size={14} className="shrink-0 ml-2 text-slate-400" />
        }
      </button>
      {open && <p className="pb-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{a}</p>}
    </div>
  );
}

const FAQS = [
  { q: "Why divide by 27?",                          a: "One cubic yard equals 3 ft × 3 ft × 3 ft = 27 cubic feet. Dividing total cubic feet by 27 converts to cubic yards." },
  { q: "How much does a cubic yard weigh?",           a: "Depends on material. Concrete ≈ 4,050 lbs/cu yd, topsoil ≈ 2,200 lbs/cu yd, mulch ≈ 800 lbs/cu yd, gravel ≈ 2,835 lbs/cu yd." },
  { q: "How many bags of concrete is a cubic yard?",  a: "A 60-lb bag yields ≈ 0.45 cu ft. You need ≈ 60 bags (60 lb) or ≈ 45 bags (80 lb) to fill one cubic yard." },
];

const COVERAGE_DEPTHS = [1,2,3,4,6,8,12];

export default function CubicYards() {
  const [mode,      setMode]      = useState("dimensions");
  const [lengthFt,  setLengthFt]  = useState("10");
  const [widthFt,   setWidthFt]   = useState("10");
  const [area,      setArea]      = useState("100");
  const [areaUnit,  setAreaUnit]  = useState("sqft");
  const [depth,     setDepth]     = useState("4");
  const [depthUnit, setDepthUnit] = useState("inches");
  const [material,  setMaterial]  = useState("concrete");
  const [price,     setPrice]     = useState("");
  const [priceUnit, setPriceUnit] = useState("cu yd");
  const [currency,  setCurrency]  = useState("$");

  const vol = useMemo(() => {
    if (mode === "dimensions")
      return calcFromDimensions({ lengthFt: parseFloat(lengthFt)||0, widthFt: parseFloat(widthFt)||0, depth, depthUnit });
    return calcFromArea({ area: parseFloat(area)||0, areaUnit, depth, depthUnit });
  }, [mode, lengthFt, widthFt, area, areaUnit, depth, depthUnit]);

  const wt = useMemo(() => weightTons(vol.cubicYards, material), [vol.cubicYards, material]);

  const cost = useMemo(() => {
    const p = parseFloat(price)||0;
    if (!p) return null;
    const qty = priceUnit === "cu yd" ? vol.cubicYards : priceUnit === "cu ft" ? vol.cubicFt : vol.cubicMeters;
    return p * qty;
  }, [price, priceUnit, vol]);

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(340px,420px)] gap-4 items-start">

        {/* LEFT COLUMN — Form + Results */}
        <div className="space-y-4">

          {/* Title */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Cubic Yards Calculator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Calculate volume in cubic yards for concrete, topsoil, mulch, gravel and more.
            </p>
          </div>

          {/* Input form */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-4">
            {/* Mode toggle */}
            <div>
              <SectionLabel text="Measurement Input" />
              <div className="flex gap-2">
                {[{ v:"dimensions", l:"Length × Width" }, { v:"area", l:"Area" }].map(o => (
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

            {/* Dimension or area inputs */}
            {mode === "dimensions" ? (
              <div className="grid grid-cols-2 gap-4">
                <InputField label="Length (ft)" id="len" value={lengthFt} onChange={setLengthFt} min="0" />
                <InputField label="Width (ft)"  id="wid" value={widthFt}  onChange={setWidthFt}  min="0" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <InputField  label="Area"      id="area" value={area}     onChange={setArea}     min="0" />
                <SelectField label="Area Unit" id="au"   value={areaUnit} onChange={setAreaUnit} options={AREA_UNITS} />
              </div>
            )}

            {/* Depth */}
            <div className="grid grid-cols-2 gap-4">
              <InputField  label="Depth"      id="dep" value={depth}     onChange={setDepth}     min="0" />
              <SelectField label="Depth Unit" id="du"  value={depthUnit} onChange={setDepthUnit} options={DEPTH_UNITS} />
            </div>

            {/* Material */}
            <SelectField label="Material" id="mat" value={material} onChange={setMaterial} options={MAT_OPTS} />

            {/* Price estimate */}
            <div>
              <SectionLabel text="Price Estimate (Optional)" />
              <div className="flex gap-2 items-end">
                <div className="relative flex-1">
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 text-sm bg-transparent border-none outline-none text-slate-400 cursor-pointer z-10"
                  >
                    {CURRENCY.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input
                    type="number" value={price} onChange={e => setPrice(e.target.value)}
                    placeholder="Price per unit"
                    className="w-full py-2 pl-7 pr-3 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder-slate-400"
                  />
                </div>
                <SelectField label="" id="pu" value={priceUnit} onChange={setPriceUnit} options={PRICE_UNITS} className="w-32" />
              </div>
            </div>
          </div>

          {/* Primary result metrics — 3 columns */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Cubic Yards</p>
              <p className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 leading-tight">{fmt(vol.cubicYards)} <span className="text-sm font-semibold">yd³</span></p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">Cubic Feet</p>
              <p className="text-xl font-extrabold text-blue-700 dark:text-blue-300 leading-tight">{fmt(vol.cubicFt)} <span className="text-sm font-semibold">ft³</span></p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Cubic Meters</p>
              <p className="text-xl font-extrabold text-slate-700 dark:text-slate-200 leading-tight">{fmt(vol.cubicMeters)} <span className="text-sm font-semibold">m³</span></p>
            </div>
          </div>

          {/* Weight metrics — 2 columns */}
          {wt && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Weight (lbs)</p>
                <p className="text-2xl font-extrabold text-slate-700 dark:text-slate-200">{fmt(wt.lbs, 0)} <span className="text-sm font-semibold">lbs</span></p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-1">Weight (tons)</p>
                <p className="text-2xl font-extrabold text-slate-700 dark:text-slate-200">{fmt(wt.tons)} <span className="text-sm font-semibold">tons</span></p>
              </div>
            </div>
          )}

          {/* Estimated cost */}
          {cost != null && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">Estimated Cost</p>
              <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{currency}{fmt(cost)}</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — Table + Formula */}
        <div className="space-y-4">

          {/* Coverage table */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Coverage: <span className="text-indigo-600 dark:text-indigo-400">1 Cubic Yard</span> at Various Depths
            </h2>
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-white dark:bg-slate-800">
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-left">
                    <th className="pb-2 text-xs font-semibold text-slate-400 dark:text-slate-500">Depth</th>
                    <th className="pb-2 text-xs font-semibold text-slate-400 dark:text-slate-500">Area Covered</th>
                  </tr>
                </thead>
                <tbody>
                  {COVERAGE_DEPTHS.map(d => (
                    <tr key={d} className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="py-1.5 text-slate-600 dark:text-slate-400">{d} inch{d > 1 ? "es" : ""}</td>
                      <td className="py-1.5 font-semibold text-indigo-600 dark:text-indigo-400">
                        {(27 / (d / 12)).toFixed(0)} sq ft
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* How to calculate */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">How to Calculate Cubic Yards</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              This calculator simplifies computing cubic yards. Fill in the fields above and results update instantly. All inputs are validated for numeric accuracy and edge cases.
            </p>
          </div>

          {/* Formula */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Mathematical Formula</h2>
            <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed">
{`Cubic Yards = (Length × Width × Depth) ÷ 27
(all measurements in feet)

Depth conversions:
  inches → feet: ÷ 12
  cm → feet: ÷ 30.48`}
            </pre>
          </div>

        </div>
      </div>

      {/* FULL-WIDTH FAQ — below both columns */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Frequently Asked Questions</h2>
        {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
      </div>
    </div>
  );
}
