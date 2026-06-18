import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 dark:border-slate-700 last:border-0">
      <button
        className="w-full flex items-center justify-between py-3 text-left text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span>{question}</span>
        {open ? <ChevronUp size={15} className="shrink-0 ml-2" /> : <ChevronDown size={15} className="shrink-0 ml-2" />}
      </button>
      {open && (
        <p className="pb-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{answer}</p>
      )}
    </div>
  );
}

export default function ExplainerSection({ title, formula, faqs }) {
  return (
    <div className="space-y-4 mt-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-2">How to Calculate {title}</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          This calculator simplifies computing {title.toLowerCase()}. Fill in the fields above and
          results update instantly. All inputs are validated for numeric accuracy and edge cases.
        </p>
      </div>

      {formula && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-3">Mathematical Formula</h2>
          <pre className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 text-sm text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 overflow-x-auto whitespace-pre-wrap font-mono">
            {formula}
          </pre>
        </div>
      )}

      {faqs?.length > 0 && (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-3">Frequently Asked Questions</h2>
          <div>
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
