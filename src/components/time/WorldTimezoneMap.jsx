import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { CITIES_DATA } from "../../data/citiesData";

// Timezone color mapping based on UTC offset
const getTimezoneColor = (offset) => {
  const colors = {
    '-12': '#FF6B6B',    // -12
    '-11': '#FF8787',    // -11
    '-10': '#FF9E9E',    // -10
    '-9': '#FFB5B5',     // -9
    '-8': '#FFC9C9',     // -8
    '-7': '#FFD4B4',     // -7
    '-6': '#FFDA8B',     // -6
    '-5': '#FFED66',     // -5
    '-4': '#FFFF77',     // -4
    '-3': '#E8FF66',     // -3
    '-2': '#D1FF77',     // -2
    '-1': '#B8FF88',     // -1
    '0': '#A8E6A1',      // UTC
    '1': '#90D4A1',      // +1
    '2': '#78C2A1',      // +2
    '3': '#66B3A0',      // +3
    '4': '#66CCCC',      // +4
    '5': '#66D9FF',      // +5
    '6': '#66E6FF',      // +6
    '7': '#66F0FF',      // +7
    '8': '#88D4FF',      // +8
    '9': '#99C7FF',      // +9
    '10': '#AABBFF',     // +10
    '11': '#BBADFF',     // +11
    '12': '#CC99FF',     // +12
    '13': '#DD88FF',     // +13
    '14': '#EE77FF',     // +14
  };
  return colors[offset.toString()] || '#CCCCCC';
};

const getTimezoneOffset = (tzName) => {
  try {
    const now = new Date();
    const utcTime = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzTime = new Date(now.toLocaleString('en-US', { timeZone: tzName }));
    return Math.round((tzTime - utcTime) / (1000 * 60 * 60));
  } catch {
    return 0;
  }
};

function WorldTimezoneMap({ onAddCity, addedCities }) {
  const [timezoneMap, setTimezoneMap] = useState({});
  const [hoveredCity, setHoveredCity] = useState(null);

  useEffect(() => {
    const map = {};
    CITIES_DATA.forEach(city => {
      const offset = getTimezoneOffset(city.timezone);
      const offsetKey = offset.toString();
      if (!map[offsetKey]) {
        map[offsetKey] = [];
      }
      map[offsetKey].push(city);
    });
    setTimezoneMap(map);
  }, []);

  const getTimeInTimezone = (timezone) => {
    const now = new Date();
    return new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isTimezoneAdded = (timezone) => {
    return addedCities.some(city => city.timezone === timezone);
  };

  // Get approximate longitude for offset (-180 to 180)
  const getApproxLongitude = (offset) => {
    return (offset / 12) * 180;
  };

  const offsets = Object.keys(timezoneMap).sort((a, b) => parseInt(a) - parseInt(b));
  const minOffset = parseInt(offsets[0]);
  const maxOffset = parseInt(offsets[offsets.length - 1]);

  return (
    <div className="w-full space-y-4">
      {/* Map Container */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        {/* World Map Visualization */}
        <div className="bg-gradient-to-b from-blue-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 p-6 relative">
          <svg viewBox="0 0 1400 800" className="w-full h-auto" style={{ minHeight: '400px' }}>
            {/* Background */}
            <rect width="1400" height="800" fill="none" />

            {/* Timezone regions as vertical bands */}
            {offsets.map((offsetStr, idx) => {
              const offset = parseInt(offsetStr);
              const x = ((offset - minOffset) / (maxOffset - minOffset + 1)) * 1400;
              const width = (1400 / (maxOffset - minOffset + 1)) * 0.95;
              const color = getTimezoneColor(offset);

              return (
                <g key={`tz-${offsetStr}`}>
                  <rect
                    x={x}
                    y="0"
                    width={width}
                    height="700"
                    fill={color}
                    opacity="0.3"
                  />
                  {/* Timezone label at bottom */}
                  <text
                    x={x + width / 2}
                    y="750"
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="bold"
                    fill="currentColor"
                    className="text-slate-600 dark:text-slate-300"
                  >
                    {offset >= 0 ? '+' : ''}{offset}
                  </text>
                </g>
              );
            })}

            {/* City markers */}
            {Object.entries(timezoneMap).map(([offsetStr, cities]) => {
              const offset = parseInt(offsetStr);
              const offsetNorm = ((offset - minOffset) / (maxOffset - minOffset + 1));
              const x = offsetNorm * 1400 + (1400 / (maxOffset - minOffset + 1)) * 0.475;

              return cities.map((city, idx) => (
                <g key={`${offsetStr}-${idx}`}>
                  {/* City dot */}
                  <circle
                    cx={x}
                    cy={100 + (idx * 60) % 500}
                    r="6"
                    fill="#EF4444"
                    opacity="0.8"
                    onMouseEnter={() => setHoveredCity({ city, x, y: 100 + (idx * 60) % 500 })}
                    onMouseLeave={() => setHoveredCity(null)}
                    className="cursor-pointer hover:opacity-100 transition-opacity"
                  />
                  <circle
                    cx={x}
                    cy={100 + (idx * 60) % 500}
                    r="8"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2"
                    opacity="0.3"
                  />
                </g>
              ));
            })}

            {/* Hover tooltip */}
            {hoveredCity && (
              <g>
                <rect
                  x={hoveredCity.x + 15}
                  y={hoveredCity.y - 40}
                  width="200"
                  height="60"
                  rx="4"
                  fill="white"
                  className="dark:fill-slate-700"
                  stroke="#999"
                  strokeWidth="1"
                  opacity="0.95"
                />
                <text
                  x={hoveredCity.x + 25}
                  y={hoveredCity.y - 20}
                  fontSize="13"
                  fontWeight="bold"
                  fill="currentColor"
                  className="text-slate-900 dark:text-white"
                >
                  {hoveredCity.city.name}
                </text>
                <text
                  x={hoveredCity.x + 25}
                  y={hoveredCity.y}
                  fontSize="11"
                  fill="currentColor"
                  className="text-slate-600 dark:text-slate-300"
                >
                  {hoveredCity.city.country}
                </text>
                <text
                  x={hoveredCity.x + 25}
                  y={hoveredCity.y + 18}
                  fontSize="12"
                  fontWeight="bold"
                  fill="#4F46E5"
                >
                  {formatTime(getTimeInTimezone(hoveredCity.city.timezone))}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* Color scale legend */}
        <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-3">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">UTC Offset Scale:</p>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {offsets.map((offsetStr) => {
              const offset = parseInt(offsetStr);
              const color = getTimezoneColor(offset);
              return (
                <div
                  key={`scale-${offsetStr}`}
                  className="flex-shrink-0 flex items-center gap-1"
                >
                  <div
                    className="w-6 h-6 rounded"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-xs whitespace-nowrap text-slate-600 dark:text-slate-300">
                    {offset >= 0 ? '+' : ''}{offset}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cities List */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">
          Major Cities by Timezone ({CITIES_DATA.length} total)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {CITIES_DATA.slice(0, 50).map((city) => {
            const offset = getTimezoneOffset(city.timezone);
            const color = getTimezoneColor(offset);
            const isTZAdded = isTimezoneAdded(city.timezone);
            const time = getTimeInTimezone(city.timezone);

            return (
              <div
                key={`${city.timezone}-${city.name}`}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-900 dark:text-white truncate">
                      {city.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </p>
                  </div>
                </div>
                {!isTZAdded && (
                  <button
                    onClick={() => onAddCity(city)}
                    className="p-1 rounded ml-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors flex-shrink-0"
                    title="Add city"
                  >
                    <Plus size={14} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WorldTimezoneMap;
