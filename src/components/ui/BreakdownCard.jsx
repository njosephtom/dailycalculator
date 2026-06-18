import React, { useState, useRef, useEffect } from "react";
import { BarChart3, PieChart, TrendingUp, AlignLeft } from "lucide-react";

function fmtC(sym, n) {
  if (!isFinite(n)) return "—";
  return sym + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const ALL_MODES = [
  { v: "bar",      l: "Bar",       Icon: AlignLeft },
  { v: "graph",    l: "Graph",     Icon: TrendingUp },
  { v: "pie",      l: "Pie",       Icon: PieChart },
  { v: "barchart", l: "Bar Chart", Icon: BarChart3 },
];

const SIMPLE_MODES = [
  { v: "bar", l: "Bar", Icon: AlignLeft },
  { v: "pie", l: "Pie", Icon: PieChart },
];

export default function BreakdownCard({
  title = "Principal vs. Interest Breakdown",
  primaryLabel = "Principal",
  secondaryLabel = "Interest",
  primaryPct,
  secondaryPct,
  primaryAmount,
  secondaryAmount,
  sym = "$",
  schedule,
}) {
  const hasSchedule = schedule && schedule.length > 0;
  const modes = hasSchedule ? ALL_MODES : SIMPLE_MODES;
  const [mode, setMode] = useState("bar");

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</h2>
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
          {modes.map(({ v, l, Icon }) => (
            <button
              key={v}
              onClick={() => setMode(v)}
              title={l}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all text-[11px] font-medium ${
                mode === v
                  ? "bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-400"
                  : "text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{l}</span>
            </button>
          ))}
        </div>
      </div>

      {mode === "bar" && <BarView primaryPct={primaryPct} secondaryPct={secondaryPct} />}
      {mode === "pie" && (
        <PieView
          primaryPct={primaryPct}
          primaryLabel={primaryLabel}
          secondaryLabel={secondaryLabel}
          primaryAmount={primaryAmount}
          secondaryAmount={secondaryAmount}
          sym={sym}
        />
      )}
      {mode === "graph" && hasSchedule && <LineGraphView schedule={schedule} sym={sym} />}
      {mode === "barchart" && hasSchedule && <BarChartView schedule={schedule} sym={sym} />}

      <div className="flex gap-5 mt-3 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-indigo-500" />
          {primaryLabel} ({primaryPct.toFixed(1)}%)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm bg-emerald-400" />
          {secondaryLabel} ({secondaryPct.toFixed(1)}%)
        </span>
      </div>
    </div>
  );
}

function BarView({ primaryPct, secondaryPct }) {
  return (
    <div className="flex rounded-full overflow-hidden h-5">
      <div className="bg-indigo-500 transition-all duration-500" style={{ width: `${primaryPct}%` }} />
      <div className="bg-emerald-400 transition-all duration-500" style={{ width: `${secondaryPct}%` }} />
    </div>
  );
}

function PieView({ primaryPct, primaryLabel, secondaryLabel, primaryAmount, secondaryAmount, sym }) {
  const r = 70, cx = 90, cy = 90;
  const angle = (primaryPct / 100) * 360;
  const rad = (a) => ((a - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(rad(0));
  const y1 = cy + r * Math.sin(rad(0));
  const x2 = cx + r * Math.cos(rad(angle));
  const y2 = cy + r * Math.sin(rad(angle));
  const largeArc = angle > 180 ? 1 : 0;

  return (
    <div className="flex items-center justify-center gap-6">
      <svg viewBox="0 0 180 180" className="w-40 h-40 shrink-0">
        <circle cx={cx} cy={cy} r={r} className="fill-emerald-400" />
        {primaryPct > 0 && primaryPct < 100 && (
          <path
            d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
            className="fill-indigo-500"
          />
        )}
        {primaryPct >= 100 && <circle cx={cx} cy={cy} r={r} className="fill-indigo-500" />}
        <circle cx={cx} cy={cy} r={35} className="fill-white dark:fill-slate-800" />
      </svg>
      <div className="text-xs space-y-2">
        <div>
          <p className="text-slate-400 font-medium">{primaryLabel}</p>
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{fmtC(sym, primaryAmount)}</p>
        </div>
        <div>
          <p className="text-slate-400 font-medium">{secondaryLabel}</p>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{fmtC(sym, secondaryAmount)}</p>
        </div>
      </div>
    </div>
  );
}

function LineGraphView({ schedule, sym }) {
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [svgW, setSvgW] = useState(400);

  useEffect(() => {
    const el = svgRef.current?.parentElement;
    if (!el) return;
    const obs = new ResizeObserver(([e]) => setSvgW(e.contentRect.width));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  if (!schedule.length) return null;

  let cumInterest = 0;
  const data = schedule.map(s => {
    cumInterest += s.interestEarned;
    const principal = Math.max(0, s.totalBalance - cumInterest);
    return { ...s, cumInterest, principal };
  });

  const W = svgW, H = 180, pad = { t: 10, r: 15, b: 30, l: 50 };
  const plotW = W - pad.l - pad.r, plotH = H - pad.t - pad.b;
  const maxVal = Math.max(...data.map(s => s.totalBalance), 1);
  const toY = (v) => pad.t + plotH - (v / maxVal) * plotH;
  const toX = (i) => pad.l + (i / Math.max(data.length - 1, 1)) * plotW;
  const bottom = pad.t + plotH;

  const pts = data.map((s, i) => ({
    x: toX(i),
    yTotal: toY(s.totalBalance),
    yPrincipal: toY(s.principal),
    label: s.year ?? s.period,
    balance: s.totalBalance,
    principal: s.principal,
    interest: s.cumInterest,
  }));

  const totalLine = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yTotal}`).join(" ");
  const principalLine = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.yPrincipal}`).join(" ");

  const interestArea = totalLine
    + ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].yPrincipal}`
    + pts.slice().reverse().map(p => ` L ${p.x} ${p.yPrincipal}`).join("")
    + " Z";

  const principalArea = principalLine
    + ` L ${pts[pts.length - 1].x} ${bottom} L ${pts[0].x} ${bottom} Z`;

  const yTicks = 4;
  const gridLines = Array.from({ length: yTicks + 1 }, (_, i) => {
    const val = (maxVal / yTicks) * i;
    return { y: toY(val), label: val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(0) };
  });

  return (
    <div className="relative">
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 180, fontFamily: "'Inter', sans-serif" }}>
        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={pad.l} y1={g.y} x2={W - pad.r} y2={g.y} stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="0.5" />
            <text x={pad.l - 6} y={g.y + 3} textAnchor="end" className="fill-slate-400" style={{ fontSize: 9 }}>{g.label}</text>
          </g>
        ))}
        {pts.filter((_, i) => data.length <= 12 || i % Math.ceil(data.length / 10) === 0 || i === data.length - 1).map(p => (
          <text key={p.label} x={p.x} y={H - 8} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 9 }}>{p.label}</text>
        ))}
        <path d={interestArea} className="fill-emerald-400/30 dark:fill-emerald-400/20" />
        <path d={principalArea} className="fill-indigo-500/30 dark:fill-indigo-400/20" />
        <path d={totalLine} fill="none" className="stroke-emerald-500 dark:stroke-emerald-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d={principalLine} fill="none" className="stroke-indigo-500 dark:stroke-indigo-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x} cy={p.yTotal} r={data.length <= 15 ? 3 : 2}
              className="fill-emerald-500 dark:fill-emerald-400 stroke-white dark:stroke-slate-800"
              strokeWidth="1.5"
              onMouseEnter={() => setTooltip(p)}
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: "pointer" }}
            />
            <circle
              cx={p.x} cy={p.yPrincipal} r={data.length <= 15 ? 3 : 2}
              className="fill-indigo-500 dark:fill-indigo-400 stroke-white dark:stroke-slate-800"
              strokeWidth="1.5"
              onMouseEnter={() => setTooltip(p)}
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: "pointer" }}
            />
          </g>
        ))}
      </svg>
      {tooltip && (
        <div
          className="absolute pointer-events-none bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg font-sans space-y-0.5"
          style={{ left: Math.min(tooltip.x, W - 80), top: tooltip.yTotal - 45, transform: "translateX(-50%)" }}
        >
          <div>Principal: {fmtC(sym, tooltip.principal)}</div>
          <div>Interest: {fmtC(sym, tooltip.interest)}</div>
        </div>
      )}
    </div>
  );
}

function BarChartView({ schedule, sym }) {
  const [hovered, setHovered] = useState(null);
  if (!schedule.length) return null;

  const maxVal = Math.max(...schedule.map(s => s.totalBalance), 1);
  const barCount = schedule.length;

  let cumulativeInterest = 0;
  const bars = schedule.map(s => {
    cumulativeInterest += s.interestEarned;
    return { ...s, cumulativeInterest };
  });

  return (
    <div className="relative">
      <div className="flex items-end gap-[2px] h-44">
        {bars.map((s, i) => {
          const totalH = (s.totalBalance / maxVal) * 100;
          const interestH = s.totalBalance > 0
            ? (s.cumulativeInterest / s.totalBalance) * totalH
            : 0;
          const principalH = totalH - interestH;

          return (
            <div
              key={s.year ?? s.period ?? i}
              className="flex-1 flex flex-col justify-end items-stretch h-full relative group"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              <div className="flex flex-col justify-end flex-1">
                <div
                  className="bg-emerald-400 rounded-t-sm transition-all duration-300"
                  style={{ height: `${interestH}%` }}
                />
                <div
                  className="bg-indigo-500 transition-all duration-300"
                  style={{ height: `${principalH}%` }}
                />
              </div>
              {(barCount <= 15 || i % Math.ceil(barCount / 10) === 0 || i === barCount - 1) && (
                <span className="text-[8px] text-slate-400 text-center mt-1 leading-none font-sans">{s.year ?? s.period}</span>
              )}
              {hovered === i && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap z-10 font-sans">
                  {s.year ?? s.period}: {fmtC(sym, s.totalBalance)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
