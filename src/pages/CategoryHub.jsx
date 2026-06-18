import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { calculatorRegistry, categoryMeta } from "../data/calculatorRegistry";
import { ArrowRight, CheckCircle, Clock, Search, X } from "lucide-react";

function groupBySubcategory(tools) {
  const map = new Map();
  for (const tool of tools) {
    const key = tool.subcategory ?? "General";
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(tool);
  }
  return map;
}

function ToolCard({ tool }) {
  return (
    <Link
      to={tool.path}
      className="group flex items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-sm transition-all"
    >
      <div className="flex items-start gap-3 min-w-0">
        <span className="mt-0.5 shrink-0">
          {tool.implemented ? (
            <CheckCircle size={15} className="text-emerald-500" />
          ) : (
            <Clock size={15} className="text-slate-300 dark:text-slate-600" />
          )}
        </span>
        <div className="min-w-0">
          <h3 className="font-medium text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm leading-snug">
            {tool.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>
      </div>
      <ArrowRight
        size={15}
        className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 shrink-0 ml-4 transition-colors"
      />
    </Link>
  );
}

export default function CategoryHub() {
  const { category } = useParams();
  const [query, setQuery] = useState("");
  const meta = categoryMeta[category];
  const allTools = calculatorRegistry.filter((c) => c.category === category);

  if (!meta) {
    return (
      <div className="text-center py-20 text-slate-500 dark:text-slate-400">
        <p className="text-lg font-medium">Category not found.</p>
        <Link to="/" className="mt-2 inline-block text-sm text-indigo-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const filtered = query.trim()
    ? allTools.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      )
    : allTools;

  const hasSubs = allTools.some((t) => t.subcategory);
  const grouped = groupBySubcategory(filtered);
  const implementedCount = allTools.filter((t) => t.implemented).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
              {meta.label} Calculators
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{meta.description}</p>
          </div>
          <div className="flex gap-3 text-xs shrink-0">
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300">
              <span className="font-semibold">{allTools.length}</span> tools
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-900/30 rounded-full text-emerald-700 dark:text-emerald-400">
              <CheckCircle size={11} />
              <span className="font-semibold">{implementedCount}</span> live
            </span>
          </div>
        </div>

        {/* Search within category */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Filter ${meta.label.toLowerCase()} calculators…`}
            className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={13} />
            </button>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 px-1">
        <span className="flex items-center gap-1.5">
          <CheckCircle size={12} className="text-emerald-500" /> Live calculator
        </span>
        <span className="flex items-center gap-1.5">
          <Clock size={12} className="text-slate-400" /> Coming soon
        </span>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          <p className="font-medium">No calculators match "{query}"</p>
          <button onClick={() => setQuery("")} className="mt-2 text-sm text-indigo-600 hover:underline">
            Clear filter
          </button>
        </div>
      ) : hasSubs && !query.trim() ? (
        // Subcategory grouped layout
        <div className="space-y-6">
          {[...grouped.entries()].map(([subcat, tools]) => (
            <div key={subcat}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 px-1">
                {subcat}
                <span className="ml-2 normal-case font-normal tracking-normal">({tools.length})</span>
              </h2>
              <div className="grid gap-2">
                {tools.map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Flat list (when searching or no subcategories)
        <div className="grid gap-2">
          {filtered.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
