import { CALCULATOR_CONTENT, CATEGORY_DISCLAIMER, LAST_REVIEWED } from "../../data/calculatorContent";

// Visible explainer under each calculator: summary, FAQ, disclaimer and review date.
// Plain HTML text on purpose so crawlers that skip JavaScript still see it (see scripts/prerender.js).
export default function CalculatorInfo({ calc }) {
  const content = CALCULATOR_CONTENT[calc.id];
  if (!content) return null;
  const disclaimer = CATEGORY_DISCLAIMER[calc.category];

  return (
    <section className="mt-8 space-y-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
      <h2 className="text-base font-semibold text-slate-800 dark:text-white">About this calculator</h2>
      <p>{content.summary}</p>

      <div className="space-y-3">
        <h2 className="text-base font-semibold text-slate-800 dark:text-white">Frequently asked questions</h2>
        {content.faq.map((item) => (
          <div key={item.q}>
            <h3 className="font-medium text-slate-800 dark:text-white">{item.q}</h3>
            <p>{item.a}</p>
          </div>
        ))}
      </div>

      {disclaimer && <p className="text-xs text-amber-700 dark:text-amber-400">{disclaimer}</p>}
      <p className="text-xs text-slate-400 dark:text-slate-500">
        Last reviewed {LAST_REVIEWED}. Calculations run in your browser.
      </p>
    </section>
  );
}
