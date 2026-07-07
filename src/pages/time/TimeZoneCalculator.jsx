import React, { useState, useEffect } from "react";
import { X, Plus, Clock } from "lucide-react";
import InputField from "../../components/ui/InputField";

const COMMON_TIMEZONES = [
  { name: "London", timezone: "Europe/London", code: "GMT/BST" },
  { name: "New York", timezone: "America/New_York", code: "EST/EDT" },
  { name: "Los Angeles", timezone: "America/Los_Angeles", code: "PST/PDT" },
  { name: "Tokyo", timezone: "Asia/Tokyo", code: "JST" },
  { name: "Sydney", timezone: "Australia/Sydney", code: "AEDT/AEST" },
  { name: "Dubai", timezone: "Asia/Dubai", code: "GST" },
  { name: "Singapore", timezone: "Asia/Singapore", code: "SGT" },
  { name: "Hong Kong", timezone: "Asia/Hong_Kong", code: "HKT" },
  { name: "Bangkok", timezone: "Asia/Bangkok", code: "ICT" },
  { name: "Mumbai", timezone: "Asia/Kolkata", code: "IST" },
  { name: "Cairo", timezone: "Africa/Cairo", code: "EET/EEST" },
  { name: "Moscow", timezone: "Europe/Moscow", code: "MSK" },
  { name: "Berlin", timezone: "Europe/Berlin", code: "CET/CEST" },
  { name: "Paris", timezone: "Europe/Paris", code: "CET/CEST" },
  { name: "Toronto", timezone: "America/Toronto", code: "EST/EDT" },
  { name: "Mexico City", timezone: "America/Mexico_City", code: "CST/CDT" },
  { name: "São Paulo", timezone: "America/Sao_Paulo", code: "BRT/BRST" },
  { name: "Buenos Aires", timezone: "America/Argentina/Buenos_Aires", code: "ART" },
  { name: "Auckland", timezone: "Pacific/Auckland", code: "NZDT/NZST" },
];

function TimeDisplay({ time, timezone, cityName }) {
  return (
    <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <p className="font-semibold text-slate-800 dark:text-slate-100">{cityName}</p>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{timezone}</p>
      </div>
      <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 font-mono mb-1">
        {time.toLocaleTimeString('en-US', {
          timeZone: timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })}
      </p>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {time.toLocaleDateString('en-US', {
          timeZone: timezone,
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      </p>
    </div>
  );
}

function CitySelector({ onAdd, addedCities }) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = COMMON_TIMEZONES.filter(
    tz => !addedCities.some(c => c.timezone === tz.timezone) &&
           (tz.name.toLowerCase().includes(search.toLowerCase()) ||
            tz.timezone.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
      >
        <Plus size={18} />
        Add City
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-10">
          <div className="p-3 border-b border-slate-200 dark:border-slate-700">
            <input
              type="text"
              placeholder="Search cities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((tz) => (
                <button
                  key={tz.timezone}
                  onClick={() => {
                    onAdd(tz);
                    setSearch("");
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors text-sm text-slate-700 dark:text-slate-200"
                >
                  <p className="font-medium">{tz.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{tz.timezone}</p>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-sm text-slate-500 dark:text-slate-400">
                No cities found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function TimeZoneCalculator() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [cities, setCities] = useState([
    { name: "London", timezone: "Europe/London", code: "GMT/BST" },
    { name: "Cairo", timezone: "Africa/Cairo", code: "EET/EEST" },
    { name: "Moscow", timezone: "Europe/Moscow", code: "MSK" },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddCity = (city) => {
    setCities([...cities, city]);
  };

  const handleRemoveCity = (timezone) => {
    setCities(cities.filter(c => c.timezone !== timezone));
  };

  return (
    <div className="space-y-4">
      {/* Title card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h1 className="text-xl font-bold text-slate-800 dark:text-white">Time Zone Calculator</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Compare current times across different cities and time zones worldwide.
        </p>
      </div>

      {/* Add city button */}
      <CitySelector onAdd={handleAddCity} addedCities={cities} />

      {/* Cities grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cities.map((city) => (
          <div key={city.timezone} className="relative">
            <TimeDisplay
              time={currentTime}
              timezone={city.timezone}
              cityName={city.name}
            />
            <button
              onClick={() => handleRemoveCity(city.timezone)}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Remove city"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Info card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
          <Clock size={16} className="text-indigo-600 dark:text-indigo-400" />
          About Time Zones
        </h2>
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <p>
            <strong>UTC (Coordinated Universal Time):</strong> The primary time standard by which the world regulates clocks and time.
          </p>
          <p>
            <strong>Daylight Saving Time:</strong> Many regions shift their time forward by one hour during summer months. This calculator automatically accounts for DST.
          </p>
          <p>
            <strong>Time Zone Offset:</strong> Expressed as UTC±HH:MM. For example, UTC+5:30 is India Standard Time, UTC-8 is Pacific Standard Time.
          </p>
          <p>
            <strong>IANA Time Zone Database:</strong> The standard reference for all time zones worldwide, accounting for historical and regional changes.
          </p>
        </div>
      </div>
    </div>
  );
}
