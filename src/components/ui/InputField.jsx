import React, { useState, useMemo } from "react";

export default function InputField({
  label,
  value,
  onChange,
  type = "number",
  min,
  max,
  placeholder,
  prefix,
  suffix,
  id,
  className = "",
  inputMode,
  autoFocus,
  onKeyDown,
}) {
  const [isFocused, setIsFocused] = useState(false);

  const isNumeric = type === "number";
  const shouldFormat = isNumeric;
  const effectiveType = shouldFormat ? "text" : type;
  const effectiveInputMode = inputMode ?? (isNumeric ? "decimal" : undefined);

  const displayValue = useMemo(() => {
    if (!shouldFormat || isFocused) return value;
    const num = parseFloat(String(value).replace(/,/g, ""));
    if (isNaN(num)) return value;
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 10,
    });
  }, [shouldFormat, isFocused, value]);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-slate-400 text-sm pointer-events-none select-none z-10">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={effectiveType}
          inputMode={effectiveInputMode}
          value={displayValue}
          onChange={(e) => onChange(e.target.value.replace(/,/g, ""))}
          min={min}
          max={max}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onKeyDown={onKeyDown}
          onFocus={(e) => {
            setIsFocused(true);
            if (shouldFormat) e.target.select();
          }}
          onBlur={() => setIsFocused(false)}
          className={`w-full py-2 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white placeholder-slate-400 transition-shadow hover:border-slate-300 dark:hover:border-slate-500 ${
            prefix ? "pl-7" : "pl-3"
          } ${suffix ? "pr-12" : "pr-3"}`}
          aria-label={label}
        />
        {suffix && (
          <span className="absolute right-3 text-slate-400 text-sm pointer-events-none select-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}
