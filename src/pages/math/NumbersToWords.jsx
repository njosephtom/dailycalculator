import React, { useState } from "react";
import { convertNumberToWords, REGIONS } from "../../utils/numbersToWords";
import InputField from "../../components/ui/InputField";
import SelectField from "../../components/ui/SelectField";
import { ChevronDown, ChevronUp } from "lucide-react";

function ResultCard({ wordsOutput, regionName }) {
  if (!wordsOutput) return null;
  return (
    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-xl">
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500 dark:text-indigo-400 mb-2">
        {regionName}
      </p>
      <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 leading-relaxed break-words">
        {wordsOutput}
      </p>
    </div>
  );
}

function RegionCard({ region, isSelected, onSelect, output }) {
  return (
    <button
      onClick={() => onSelect(region.id)}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        isSelected
          ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-600"
          : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-700"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <p className="font-semibold text-slate-800 dark:text-slate-100">{region.name}</p>
        {isSelected && <div className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-1" />}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{region.description}</p>
      {output && (
        <p className="text-sm font-mono text-indigo-600 dark:text-indigo-400 bg-slate-50 dark:bg-slate-900 p-2 rounded mt-2 line-clamp-2">
          {output}
        </p>
      )}
    </button>
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
      {open && <p className="pb-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{a}</p>}
    </div>
  );
}

const FAQS = [
  {
    q: "What's the difference between these numbering systems?",
    a: "Different regions use different ways to group large numbers. North America uses 'hundreds' for numbers like 2200 ('twenty-two hundred'), while India uses 'Crores' and 'Lakhs'. Standard systems use 'Thousand', 'Million', 'Billion'.",
  },
  {
    q: "What is the North American 'hundreds' system?",
    a: "In North America, numbers like 2200 are often spoken as 'twenty-two hundred' instead of 'two thousand two hundred'. This is common for years and other specific contexts.",
  },
  {
    q: "What are Crores and Lakhs in the Indian system?",
    a: "The Indian numbering system uses: 1 Lakh = 100,000 and 1 Crore = 10,000,000. This is the standard in India and makes it easier to read large numbers in that region.",
  },
  {
    q: "Can I convert decimals or very large numbers?",
    a: "This converter works with whole numbers up to trillions. Decimals are not supported as the word conversion becomes complex and context-dependent.",
  },
];

export default function NumbersToWords() {
  const [inputNumber, setInputNumber] = useState("2200");
  const [selectedRegion, setSelectedRegion] = useState("north-america");

  const numValue = parseFloat(inputNumber);
  const isValid = !isNaN(numValue) && isFinite(numValue) && Number.isInteger(numValue) && numValue >= 0;
  const outputs = {};

  REGIONS.forEach((region) => {
    if (isValid) {
      outputs[region.id] = region.convert(numValue);
    }
  });

  return (
    <div className="space-y-4">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_minmax(320px,380px)] gap-4 items-start">
        {/* LEFT COLUMN — Input + Results */}
        <div className="space-y-4">
          {/* Title card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h1 className="text-xl font-bold text-slate-800 dark:text-white">Numbers to Words Converter</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Convert numbers to words in multiple regions and numbering systems.
            </p>
          </div>

          {/* Input card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <label htmlFor="number-input" className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-3 block">
              Enter a Number
            </label>
            <InputField
              id="number-input"
              value={inputNumber}
              onChange={setInputNumber}
              autoFocus
              placeholder="e.g., 2200"
            />
            {!isValid && inputNumber && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-2">Please enter a valid whole number ≥ 0</p>
            )}
          </div>

          {/* Results by Region */}
          {isValid && (
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-3">
                  Results by Region
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {REGIONS.map((region) => (
                    <ResultCard
                      key={region.id}
                      regionName={region.name}
                      wordsOutput={outputs[region.id]}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — Region Selector */}
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-3">
              Select a Region
            </p>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {REGIONS.map((region) => (
                <RegionCard
                  key={region.id}
                  region={region}
                  isSelected={selectedRegion === region.id}
                  onSelect={setSelectedRegion}
                  output={isValid ? outputs[region.id] : null}
                />
              ))}
            </div>
          </div>

          {/* Info card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Quick Examples</h3>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <p><strong>100:</strong> One Hundred</p>
              <p><strong>1,000:</strong> One Thousand / Ten Hundred</p>
              <p><strong>2,200:</strong> Two Thousand Two Hundred / Twenty-Two Hundred (NA)</p>
              <p><strong>100,000:</strong> One Lakh (India)</p>
              <p><strong>1,000,000:</strong> One Million</p>
            </div>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH FAQ */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Frequently Asked Questions</h2>
        {FAQS.map((f, i) => (
          <FaqItem key={i} q={f.q} a={f.a} />
        ))}
      </div>
    </div>
  );
}
