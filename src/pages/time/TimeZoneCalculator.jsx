import React, { useState, useEffect } from "react";
import { X, Plus, Clock } from "lucide-react";

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

function TimelineHours({ currentHour }) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="flex gap-1 px-2 overflow-x-auto pb-2 scrollbar-hide">
      {hours.map((hour) => {
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour < 12 ? 'am' : 'pm';
        const isNow = Math.floor(currentHour) === hour;

        return (
          <div
            key={hour}
            className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors ${
              isNow
                ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
            }`}
          >
            <span className="text-center leading-tight">
              <div>{displayHour}</div>
              <div className="text-[9px]">{period}</div>
            </span>
          </div>
        );
      })}
    </div>
  );
}

function CityTimeline({ city, currentTime, onRemove }) {
  const cityTime = new Date(currentTime.toLocaleString('en-US', { timeZone: city.timezone }));
  const currentHour = cityTime.getHours() + cityTime.getMinutes() / 60;

  const timeString = cityTime.toLocaleTimeString('en-US', {
    timeZone: city.timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const dateString = cityTime.toLocaleDateString('en-US', {
    timeZone: city.timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div className="flex">
        {/* Left info section */}
        <div className="w-32 border-r border-slate-200 dark:border-slate-700 p-4 flex flex-col justify-center shrink-0">
          <div className="flex items-baseline gap-1.5 mb-1">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">{city.name}</h3>
            <span className="text-[10px] uppercase tracking-wider font-medium text-slate-500 dark:text-slate-400">{city.code}</span>
          </div>
          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 font-mono mb-0.5">
            {timeString}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
            {dateString}
          </p>
          <button
            onClick={() => onRemove(city.timezone)}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors w-fit"
            aria-label="Remove city"
          >
            <X size={14} />
          </button>
        </div>

        {/* Timeline section */}
        <div className="flex-1 px-3 py-3 overflow-x-auto">
          <div className="flex gap-0.5">
            {hours.map((hour) => {
              const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
              const period = hour < 12 ? 'am' : 'pm';
              const isNow = Math.floor(currentHour) === hour;

              return (
                <div
                  key={hour}
                  className={`flex-shrink-0 w-8 h-12 rounded-md flex items-center justify-center text-[9px] font-bold transition-colors ${
                    isNow
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white'
                      : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                  }`}
                >
                  <span className="text-center leading-tight">
                    <div className="text-[10px]">{displayHour}</div>
                    <div className="text-[7px]">{period}</div>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function CitySelector({ onAdd, addedCities }) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = COMMON_TIMEZONES.filter(
    tz => !addedCities.some(c => c.timezone === tz.timezone) &&
           (tz.name.toLowerCase().includes(search.toLowerCase()) ||
            tz.timezone.toLowerCase().includes(search.toLowerCase()) ||
            tz.code.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="relative mb-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Place or timezone"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full px-4 py-3 text-sm border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg z-10 max-h-64 overflow-y-auto">
          {filtered.length > 0 ? (
            filtered.map((tz) => (
              <button
                key={tz.timezone}
                onClick={() => {
                  onAdd(tz);
                  setSearch("");
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors text-sm border-b border-slate-100 dark:border-slate-700 last:border-0"
              >
                <p className="font-medium text-slate-900 dark:text-white">{tz.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{tz.timezone} • {tz.code}</p>
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-center text-sm text-slate-500 dark:text-slate-400">
              No cities found
            </div>
          )}
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

      {/* Search and add city */}
      <CitySelector onAdd={handleAddCity} addedCities={cities} />

      {/* Cities timelines */}
      <div className="space-y-3">
        {cities.length > 0 ? (
          cities.map((city) => (
            <CityTimeline
              key={city.timezone}
              city={city}
              currentTime={currentTime}
              onRemove={handleRemoveCity}
            />
          ))
        ) : (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
            <Clock className="mx-auto mb-3 text-slate-400" size={32} />
            <p className="text-slate-600 dark:text-slate-400">Add a city to compare time zones</p>
          </div>
        )}
      </div>

      {/* Info card */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
          <Clock size={16} className="text-indigo-600 dark:text-indigo-400" />
          About Time Zones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-400">
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">UTC (Coordinated Universal Time)</p>
            <p>The primary time standard by which the world regulates clocks and time.</p>
          </div>
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Daylight Saving Time</p>
            <p>Many regions shift their time forward by one hour during summer months. Automatically accounted for here.</p>
          </div>
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">Time Zone Offset</p>
            <p>Expressed as UTC±HH:MM. For example, UTC+5:30 is India Standard Time, UTC-8 is Pacific Standard Time.</p>
          </div>
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">IANA Time Zone Database</p>
            <p>The standard reference for all time zones worldwide, accounting for historical and regional changes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
