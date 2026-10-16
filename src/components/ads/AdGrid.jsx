import AdSenseUnit from "./AdSenseUnit";

/**
 * Responsive ad grid component
 * Automatically selects ad size based on viewport width
 *
 * Breakpoints:
 * - Mobile (<640px): Vertical ad (160x600 fallback to 300x250)
 * - Tablet (640-1024px): Rectangle (300x250)
 * - Desktop (>1024px): Vertical (160x600) or Rectangle (300x250)
 */
export default function AdGrid({ position = "sidebar", className = "" }) {
  // Position: 'sidebar', 'inline', 'below-content'
  const containerClass = {
    sidebar: "sticky top-20 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3",
    inline: "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 my-4",
    "below-content": "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mt-6 flex justify-center",
  };

  return (
    <div className={`${containerClass[position] || containerClass.sidebar} ${className}`}>
      {/* Mobile: Rectangle ad */}
      <div className="block sm:hidden">
        <AdSenseUnit slot="rectangle" />
      </div>

      {/* Tablet: Rectangle ad */}
      <div className="hidden sm:block lg:hidden">
        <AdSenseUnit slot="rectangle" />
      </div>

      {/* Desktop: Vertical or Rectangle (responsive) */}
      <div className="hidden lg:block">
        <AdSenseUnit slot="vertical" />
      </div>

      {/* Analytics meta tags for monitoring */}
      <div className="text-xs text-slate-400 mt-2 text-center opacity-50 pointer-events-none">
        {position}
      </div>
    </div>
  );
}
