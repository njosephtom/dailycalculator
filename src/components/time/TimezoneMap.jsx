import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { CITIES_DATA } from "../../data/citiesData";

// Get unique timezones and their major cities
const getTimezoneMap = () => {
  const tzMap = {};
  CITIES_DATA.forEach(city => {
    if (!tzMap[city.timezone]) {
      tzMap[city.timezone] = [];
    }
    tzMap[city.timezone].push(city);
  });
  return tzMap;
};

function TimezoneMap({ onAddCity, addedCities }) {
  const [timezones, setTimezones] = useState([]);
  const [selectedTZ, setSelectedTZ] = useState(null);

  useEffect(() => {
    const tzMap = getTimezoneMap();
    const tzList = Object.entries(tzMap).map(([tz, cities]) => ({
      timezone: tz,
      cities: cities,
      offset: getTimezoneOffset(tz)
    })).sort((a, b) => a.offset - b.offset);
    setTimezones(tzList);
  }, []);

  const getTimezoneOffset = (tzName) => {
    try {
      const now = new Date();
      const utcTime = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
      const tzTime = new Date(now.toLocaleString('en-US', { timeZone: tzName }));
      return (tzTime - utcTime) / (1000 * 60 * 60);
    } catch {
      return 0;
    }
  };

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

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const isTimezoneAdded = (timezone) => {
    return addedCities.some(city => city.timezone === timezone);
  };

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 mb-4">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">World Timezone Map</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">View current time across all timezones</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
        {timezones.map((tzData) => {
          const tzTime = getTimeInTimezone(tzData.timezone);
          const offsetSign = tzData.offset >= 0 ? '+' : '';
          const offsetHours = Math.floor(Math.abs(tzData.offset));
          const offsetMinutes = Math.round((Math.abs(tzData.offset) - offsetHours) * 60);
          const offsetStr = `UTC${offsetSign}${offsetHours}${offsetMinutes ? ':' + offsetMinutes.toString().padStart(2, '0') : ''}`;
          const mainCity = tzData.cities[0];
          const isTZAdded = isTimezoneAdded(tzData.timezone);

          return (
            <div
              key={tzData.timezone}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:border-indigo-400 dark:hover:border-indigo-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">
                    {offsetStr}
                  </p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {mainCity.city || mainCity.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tzData.timezone}
                  </p>
                </div>
                {!isTZAdded && (
                  <button
                    onClick={() => onAddCity(mainCity)}
                    className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                    title="Add this timezone"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>

              <div className="flex items-baseline gap-2 mb-3">
                <p className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                  {formatTime(tzTime)}
                </p>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                {formatDate(tzTime)}
              </p>

              {tzData.cities.length > 1 && (
                <div className="text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
                  <p className="font-semibold mb-1">Other cities:</p>
                  <div className="flex flex-wrap gap-1">
                    {tzData.cities.slice(0, 3).map((city, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs"
                      >
                        {city.name}
                      </span>
                    ))}
                    {tzData.cities.length > 3 && (
                      <span className="inline-block bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs">
                        +{tzData.cities.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TimezoneMap;
