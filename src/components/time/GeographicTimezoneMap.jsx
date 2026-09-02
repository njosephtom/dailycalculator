import React, { useState, useEffect } from "react";
import { Plus, Maximize2 } from "lucide-react";
import { CITIES_DATA } from "../../data/citiesData";

// Timezone color mapping
const getTimezoneColor = (offset) => {
  const colors = {
    '-12': '#FF6B6B', '-11': '#FF8C42', '-10': '#FFA500', '-9': '#FFB84D',
    '-8': '#FFD166', '-7': '#FFED66', '-6': '#F4E4A6', '-5': '#E8E8A0',
    '-4': '#D0F0A0', '-3': '#B8E6A0', '-2': '#A8DCA0', '-1': '#98D0A0',
    '0': '#88C4A0', '1': '#78B8A0', '2': '#68ACA0', '3': '#58A0A0',
    '4': '#4899CC', '5': '#3A9FFF', '6': '#42A9FF', '7': '#4AB3FF',
    '8': '#52BDFF', '9': '#5AC7FF', '10': '#62D1FF', '11': '#9999FF',
    '12': '#9966FF', '13': '#9955FF', '14': '#9944FF',
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

// Simple world map coordinates for countries (center points for labeling)
const COUNTRY_COORDS = {
  'US': { lat: 37, lon: -95, tz: 'America/New_York' },
  'CA': { lat: 56, lon: -106, tz: 'America/Toronto' },
  'MX': { lat: 23, lon: -102, tz: 'America/Mexico_City' },
  'BR': { lat: -10, lon: -51, tz: 'America/Sao_Paulo' },
  'AR': { lat: -34, lon: -64, tz: 'America/Argentina/Buenos_Aires' },
  'GB': { lat: 54, lon: -3, tz: 'Europe/London' },
  'FR': { lat: 46, lon: 2, tz: 'Europe/Paris' },
  'DE': { lat: 51, lon: 10, tz: 'Europe/Berlin' },
  'RU': { lat: 61, lon: 105, tz: 'Europe/Moscow' },
  'JP': { lat: 36, lon: 138, tz: 'Asia/Tokyo' },
  'CN': { lat: 35, lon: 105, tz: 'Asia/Shanghai' },
  'IN': { lat: 20, lon: 78, tz: 'Asia/Kolkata' },
  'AU': { lat: -25, lon: 133, tz: 'Australia/Sydney' },
};

function GeographicTimezoneMap({ onAddCity, addedCities }) {
  const [timezoneMap, setTimezoneMap] = useState({});
  const [hoveredCity, setHoveredCity] = useState(null);
  const [zoom, setZoom] = useState(1);

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

  // Project latitude/longitude to SVG coordinates
  const project = (lat, lon) => {
    const scale = 3;
    const x = (lon + 180) / 360 * 960 * scale;
    const y = (90 - lat) / 180 * 600 * scale;
    return { x, y };
  };

  // Get approximate coordinates for cities
  const getCityCoordinates = (city) => {
    // This is a simplified mapping - in production, you'd use actual city coordinates
    const coordMap = {
      'Tokyo': { lat: 35.68, lon: 139.69 },
      'Mumbai': { lat: 19.08, lon: 72.88 },
      'Seoul': { lat: 37.57, lon: 126.98 },
      'Jakarta': { lat: -6.21, lon: 106.85 },
      'Bangkok': { lat: 13.73, lon: 100.52 },
      'Singapore': { lat: 1.35, lon: 103.82 },
      'Manila': { lat: 14.60, lon: 120.98 },
      'Kuala Lumpur': { lat: 3.14, lon: 101.69 },
      'Karachi': { lat: 24.86, lon: 67.01 },
      'Dhaka': { lat: 23.73, lon: 90.41 },
      'Tehran': { lat: 35.69, lon: 51.39 },
      'Dubai': { lat: 25.20, lon: 55.27 },
      'New York': { lat: 40.71, lon: -74.01 },
      'Los Angeles': { lat: 34.05, lon: -118.24 },
      'Chicago': { lat: 41.88, lon: -87.63 },
      'London': { lat: 51.51, lon: -0.13 },
      'Paris': { lat: 48.86, lon: 2.35 },
      'Berlin': { lat: 52.52, lon: 13.41 },
      'Moscow': { lat: 55.76, lon: 37.62 },
      'Sydney': { lat: -33.87, lon: 151.21 },
      'Melbourne': { lat: -37.81, lon: 144.96 },
    };
    return coordMap[city.name] || { lat: Math.random() * 180 - 90, lon: Math.random() * 360 - 180 };
  };

  return (
    <div className="w-full space-y-4">
      {/* Map Container */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        {/* World Map */}
        <div className="bg-gradient-to-b from-sky-100 to-sky-50 dark:from-slate-900 dark:to-slate-950 relative overflow-x-auto">
          <svg
            viewBox="0 0 960 600"
            className="w-full h-auto"
            style={{ minHeight: '500px', backgroundColor: '#E0F2FE' }}
          >
            {/* Ocean background */}
            <defs>
              <pattern
                id="oceanPattern"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="50" cy="50" r="1" fill="#0EA5E9" opacity="0.1" />
              </pattern>
            </defs>

            {/* Simplified world map using timezone regions */}
            {Object.entries(timezoneMap).map(([offsetStr, cities]) => {
              const offset = parseInt(offsetStr);
              const color = getTimezoneColor(offset);
              const startLon = (offset - 12) * 15;
              const endLon = startLon + 15;

              return (
                <g key={`tz-region-${offsetStr}`} opacity="0.6">
                  {/* Timezone region band */}
                  <rect
                    x={(startLon + 180) / 360 * 960}
                    y="0"
                    width={(15 / 360) * 960}
                    height="600"
                    fill={color}
                    opacity="0.15"
                  />
                  {/* Region border */}
                  <line
                    x1={(startLon + 180) / 360 * 960}
                    y1="0"
                    x2={(startLon + 180) / 360 * 960}
                    y2="600"
                    stroke={color}
                    strokeWidth="1"
                    opacity="0.3"
                  />
                </g>
              );
            })}

            {/* Grid lines for reference */}
            {/* Latitude lines */}
            {[-60, -30, 0, 30, 60].map((lat) => (
              <line
                key={`lat-${lat}`}
                x1="0"
                y1={(90 - lat) / 180 * 600}
                x2="960"
                y2={(90 - lat) / 180 * 600}
                stroke="#94A3B8"
                strokeWidth="0.5"
                opacity="0.2"
              />
            ))}

            {/* Longitude lines (every 30 degrees) */}
            {Array.from({ length: 13 }).map((_, i) => {
              const lon = -180 + i * 30;
              return (
                <line
                  key={`lon-${lon}`}
                  x1={(lon + 180) / 360 * 960}
                  y1="0"
                  x2={(lon + 180) / 360 * 960}
                  y2="600"
                  stroke="#94A3B8"
                  strokeWidth="0.5"
                  opacity="0.2"
                />
              );
            })}

            {/* City markers */}
            {Object.entries(timezoneMap).map(([offsetStr, cities]) =>
              cities.slice(0, 20).map((city, idx) => {
                const coords = getCityCoordinates(city);
                const proj = project(coords.lat, coords.lon);
                const offset = parseInt(offsetStr);
                const color = getTimezoneColor(offset);

                return (
                  <g
                    key={`city-${offsetStr}-${idx}`}
                    onMouseEnter={() => setHoveredCity({ city, offset, proj })}
                    onMouseLeave={() => setHoveredCity(null)}
                    className="cursor-pointer"
                  >
                    {/* Glow effect */}
                    <circle
                      cx={proj.x}
                      cy={proj.y}
                      r="12"
                      fill={color}
                      opacity="0.2"
                      className="transition-all hover:r-16"
                    />
                    {/* Main dot */}
                    <circle
                      cx={proj.x}
                      cy={proj.y}
                      r="6"
                      fill={color}
                      stroke="white"
                      strokeWidth="1.5"
                      opacity="0.9"
                      className="hover:opacity-100"
                    />
                    {/* Hover effect */}
                    {hoveredCity?.city.name === city.name && (
                      <circle
                        cx={proj.x}
                        cy={proj.y}
                        r="10"
                        fill="none"
                        stroke={color}
                        strokeWidth="2"
                        opacity="0.5"
                      />
                    )}
                  </g>
                );
              })
            )}

            {/* Hover tooltip */}
            {hoveredCity && (
              <g>
                {/* Tooltip background */}
                <rect
                  x={hoveredCity.proj.x + 20}
                  y={hoveredCity.proj.y - 50}
                  width="220"
                  height="80"
                  rx="6"
                  fill="white"
                  stroke="#4B5563"
                  strokeWidth="1"
                  opacity="0.95"
                  className="drop-shadow-lg"
                />
                {/* City name */}
                <text
                  x={hoveredCity.proj.x + 30}
                  y={hoveredCity.proj.y - 28}
                  fontSize="14"
                  fontWeight="bold"
                  fill="#1E293B"
                >
                  {hoveredCity.city.name}
                </text>
                {/* Country */}
                <text
                  x={hoveredCity.proj.x + 30}
                  y={hoveredCity.proj.y - 8}
                  fontSize="12"
                  fill="#475569"
                >
                  {hoveredCity.city.country}
                </text>
                {/* Time */}
                <text
                  x={hoveredCity.proj.x + 30}
                  y={hoveredCity.proj.y + 12}
                  fontSize="13"
                  fontWeight="bold"
                  fill="#4F46E5"
                >
                  {formatTime(getTimeInTimezone(hoveredCity.city.timezone))}
                </text>
                {/* Timezone offset */}
                <text
                  x={hoveredCity.proj.x + 30}
                  y={hoveredCity.proj.y + 30}
                  fontSize="11"
                  fill="#64748B"
                >
                  UTC{hoveredCity.offset >= 0 ? '+' : ''}{hoveredCity.offset}
                </text>
              </g>
            )}

            {/* UTC offset labels at bottom */}
            {Array.from({ length: 27 }).map((_, i) => {
              const offset = i - 12;
              const x = (offset + 12) / 24 * 960;
              return (
                <g key={`tz-label-${offset}`}>
                  <text
                    x={x}
                    y="580"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="bold"
                    fill="#64748B"
                    className="dark:fill-slate-400"
                  >
                    {offset >= 0 ? '+' : ''}{offset}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Color scale legend */}
        <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-3">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
            💡 Hover over city dots to see current time • Colors represent UTC offset
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 flex-wrap">
            {Object.keys(timezoneMap)
              .sort((a, b) => parseInt(a) - parseInt(b))
              .map((offsetStr) => {
                const offset = parseInt(offsetStr);
                const color = getTimezoneColor(offset);
                const count = timezoneMap[offsetStr].length;
                return (
                  <div
                    key={`scale-${offsetStr}`}
                    className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700"
                  >
                    <div
                      className="w-3 h-3 rounded-full border border-slate-300"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      UTC{offset >= 0 ? '+' : ''}{offset} ({count})
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Cities List */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          Major Cities ({CITIES_DATA.length} total)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
          {CITIES_DATA.slice(0, 60).map((city) => {
            const offset = getTimezoneOffset(city.timezone);
            const color = getTimezoneColor(offset);
            const isTZAdded = isTimezoneAdded(city.timezone);
            const time = getTimeInTimezone(city.timezone);

            return (
              <div
                key={`${city.timezone}-${city.name}`}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 border border-gray-300"
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

export default GeographicTimezoneMap;
