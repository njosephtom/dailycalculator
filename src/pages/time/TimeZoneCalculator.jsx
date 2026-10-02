import React, { useState, useEffect, useRef } from "react";
import { X, Copy, Home } from "lucide-react";
import { CITIES_DATA } from "../../data/citiesData";

const TILE_W = 52;
const HOURS_SPAN = 48;
const ACCENTS = ['#3fa796','#e8a33d','#c97b8a','#6f9bd8','#8b7fd1','#d18b4c','#5fb0a0','#c86b5a'];

const DEFAULT_CITIES = [
  { name: "Vancouver", timezone: "America/Vancouver", code: "CA" },
  { name: "Tokyo", timezone: "Asia/Tokyo", code: "JP" },
  { name: "Mumbai", timezone: "Asia/Kolkata", code: "IN" },
];

function getTimezoneAbbr(tz) {
  const now = new Date();
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' })
    .formatToParts(now)
    .find(p => p.type === 'timeZoneName')?.value || 'UTC';
}

function zonedMidnightUTC(dateStr, tz) {
  const [y, m, d] = dateStr.split('-').map(Number);
  let guess = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
  for (let i = 0; i < 2; i++) {
    const dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hourCycle: 'h23',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    const p = {};
    dtf.formatToParts(guess).forEach(x => p[x.type] = x.value);
    const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
    guess = new Date(asUTC - (asUTC - guess.getTime()));
  }
  return guess;
}

function partsAt(tz, date, hour12) {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: hour12 ? 'h12' : 'h23',
    hour: '2-digit', minute: '2-digit', weekday: 'short', day: 'numeric', month: 'short'
  });
  const p = {};
  dtf.formatToParts(date).forEach(x => p[x.type] = x.value);
  return p;
}

function dayPeriod(date, tz) {
  const s = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', hour12: true }).format(date);
  return /am/i.test(s) ? 'am' : 'pm';
}

function TimeZoneCalculator() {
  const getTodayDate = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const [cities, setCities] = useState(DEFAULT_CITIES);
  const [use24Hour, setUse24Hour] = useState(false);
  const [selStart, setSelStart] = useState(21);
  const [selEnd, setSelEnd] = useState(21.5);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [browserTz] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [selectedDate] = useState(getTodayDate());
  const scrollRefs = useRef([]);

  const homeMidnight = zonedMidnightUTC(selectedDate, browserTz);
  const timelineStart = new Date(homeMidnight.getTime());
  const timeline = Array.from({ length: HOURS_SPAN }, (_, i) =>
    new Date(timelineStart.getTime() + i * 3600 * 1000)
  );

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    const handleMouseUp = () => setDragging(false);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      clearInterval(interval);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);


  const handleAddCity = (e) => {
    const cityId = e.target.value;
    if (!cityId) return;
    const cityData = CITIES_DATA.find(c => c.name === cityId);
    if (cityData && !cities.find(c => c.timezone === cityData.timezone)) {
      setCities([...cities, { name: cityData.name, timezone: cityData.timezone, code: cityData.code }]);
    }
    e.target.value = '';
  };

  const handleRemoveCity = (idx) => {
    if (cities.length > 1) {
      setCities(cities.filter((_, i) => i !== idx));
    }
  };

  const handleScroll = (e, idx) => {
    scrollRefs.current.forEach((ref, i) => {
      if (i !== idx && ref) ref.scrollLeft = e.target.scrollLeft;
    });
  };

  const handleCopyTimes = () => {
    const lo = Math.min(selStart, selEnd);
    const hi = Math.max(selStart, selEnd);
    const startT = timeline[Math.floor(lo)];
    const endMs = timeline[0].getTime() + hi * 3600000;
    const endT = new Date(endMs);

    const lines = cities.map(city => {
      const sp = partsAt(city.timezone, startT, !use24Hour);
      const ep = partsAt(city.timezone, endT, !use24Hour);
      const ampmS = !use24Hour ? ' ' + dayPeriod(startT, city.timezone) : '';
      const ampmE = !use24Hour ? ' ' + dayPeriod(endT, city.timezone) : '';
      return `${city.name}: ${sp.hour}:${sp.minute}${ampmS} – ${ep.hour}:${ep.minute}${ampmE} (${sp.weekday} ${sp.month} ${sp.day})`;
    });

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      alert('Copied to clipboard');
    });
  };

  const handleGoogleCalendar = () => {
    const lo = Math.min(selStart, selEnd);
    const hi = Math.max(selStart, selEnd);
    const startT = timeline[Math.floor(lo)];
    const endT = new Date(timeline[0].getTime() + hi * 3600000);
    const fmt = d => d.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Meeting&dates=${fmt(startT)}/${fmt(endT)}`;
    window.open(url, '_blank');
  };

  const getAccentColor = (idx) => ACCENTS[idx % ACCENTS.length];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-end flex-wrap gap-4 border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">Time Zone Calculator</div>
          <h1 className="text-2xl font-semibold">Meeting Time Finder</h1>
        </div>
        <div className="flex gap-2 items-center">
          <select
            onChange={handleAddCity}
            defaultValue=""
            className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-sm"
          >
            <option value="">+ Add city…</option>
            {CITIES_DATA.map(city => (
              !cities.find(c => c.timezone === city.timezone) && (
                <option key={city.timezone} value={city.name}>
                  {city.name} — {city.country}
                </option>
              )
            ))}
          </select>
          <div className="flex border border-slate-300 dark:border-slate-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setUse24Hour(false)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                !use24Hour
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              12h
            </button>
            <button
              onClick={() => setUse24Hour(true)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                use24Hour
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              24h
            </button>
          </div>
          <button
            onClick={() => {
              requestAnimationFrame(() => {
                const nowOffsetHours = (currentTime.getTime() - timelineStart.getTime()) / 3600000;
                const currentHour = Math.floor(nowOffsetHours);
                setSelStart(currentHour);
                setSelEnd(currentHour + 1);
                const scrollPos = Math.max(0, (currentHour - 12) * TILE_W);
                scrollRefs.current.forEach(ref => {
                  if (ref) {
                    ref.scrollLeft = scrollPos;
                  }
                });
              });
            }}
            className="px-4 py-2 text-sm font-medium transition-colors bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-700 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/40"
          >
            Now
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        {cities.map((city, cityIdx) => (
          <div key={city.timezone} className={`flex border-b last:border-b-0 dark:border-slate-700 relative ${cityIdx < cities.length - 1 ? 'border-slate-200' : ''}`}>
            {/* Info Panel */}
            <div className="w-48 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800 relative" style={{ borderLeftWidth: '3px', borderLeftColor: getAccentColor(cityIdx) }}>
              <div className="font-semibold text-sm text-slate-900 dark:text-white mb-1 flex items-center gap-1">
                {city.name}
                {city.timezone === browserTz && <Home size={14} className="text-slate-500" />}
                <span className="font-normal text-xs text-slate-600 dark:text-slate-400 ml-2">
                  {getTimezoneAbbr(city.timezone)}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{city.code}</div>
              <div className="text-xl font-mono font-semibold text-slate-900 dark:text-white mt-3">
                {partsAt(city.timezone, currentTime, !use24Hour).hour}:{partsAt(city.timezone, currentTime, !use24Hour).minute}
                <span className="text-xs text-slate-500 dark:text-slate-400 font-normal ml-2">
                  {partsAt(city.timezone, currentTime, !use24Hour).weekday}, {partsAt(city.timezone, currentTime, !use24Hour).month} {partsAt(city.timezone, currentTime, !use24Hour).day}
                </span>
              </div>
              {city.timezone !== browserTz && (
                <button
                  onClick={() => handleRemoveCity(cityIdx)}
                  className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                >
                  ×
                </button>
              )}
            </div>

            {/* Timeline */}
            <div
              ref={(el) => (scrollRefs.current[cityIdx] = el)}
              className="flex-1 overflow-x-auto overflow-y-hidden scrollbar-hide relative"
              onScroll={(e) => handleScroll(e, cityIdx)}
            >
              <div style={{ display: 'flex', position: 'relative', width: `${timeline.length * TILE_W}px`, height: '100%' }}>
                {timeline.map((t, i) => {
                  const p = partsAt(city.timezone, t, !use24Hour);
                  const hourLabel = !use24Hour ? p.hour.replace(/^0/, '') : p.hour;
                  const isSelected = i >= Math.floor(selStart) && i < Math.ceil(selEnd);
                  const isDayStart = i > 0 && p.day !== partsAt(city.timezone, timeline[i-1], !use24Hour).day;

                  return (
                    <button
                      key={i}
                      onMouseDown={() => {
                        dragStart.current = i;
                        setDragging(true);
                        setSelStart(i);
                        setSelEnd(i + 1);
                      }}
                      onMouseEnter={() => {
                        if (dragging && dragStart.current !== null) {
                          const lo = Math.min(dragStart.current, i);
                          const hi = Math.max(dragStart.current, i) + 1;
                          setSelStart(lo);
                          setSelEnd(hi);
                        }
                      }}
                      className={`flex-shrink-0 w-12 h-16 flex flex-col items-center justify-center text-xs font-mono border-r dark:border-slate-700 position-relative cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-t-2 border-b-2 border-blue-500'
                          : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
                      } ${isDayStart ? 'border-l-2 border-l-dashed border-l-slate-400' : ''}`}
                    >
                      <div>{hourLabel}{p.minute !== '00' ? ':' + p.minute : ''}</div>
                      {!use24Hour && <div className="text-[9px] text-slate-500 dark:text-slate-400 mt-1">{dayPeriod(t, city.timezone)}</div>}
                    </button>
                  );
                })}

                {/* Date labels under 12 AM hours */}
                {timeline.map((t, i) => {
                  const p = partsAt(city.timezone, t, false);
                  const hour = parseInt(p.hour);
                  if (hour === 0) {
                    return (
                      <div
                        key={`label-${i}`}
                        className="absolute -bottom-5 text-xs font-medium text-slate-900 dark:text-slate-300 pointer-events-none"
                        style={{ left: `${i * TILE_W + TILE_W / 2}px`, transform: 'translateX(-50%)' }}
                      >
                        {p.month} {p.day}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Selection Summary */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <div className="text-xs font-mono text-slate-500 uppercase mb-3">Selected window</div>
        <div className="space-y-2 mb-4">
          {cities.map(city => {
            const lo = Math.min(selStart, selEnd);
            const hi = Math.max(selStart, selEnd);
            const startT = timeline[Math.floor(lo)];
            const endMs = timeline[0].getTime() + hi * 3600000;
            const endT = new Date(endMs);
            const sp = partsAt(city.timezone, startT, !use24Hour);
            const ep = partsAt(city.timezone, endT, !use24Hour);
            const ampmS = !use24Hour ? ' ' + dayPeriod(startT, city.timezone) : '';
            const ampmE = !use24Hour ? ' ' + dayPeriod(endT, city.timezone) : '';

            return (
              <div key={city.timezone} className="text-sm text-slate-700 dark:text-slate-300">
                <strong className="text-slate-900 dark:text-white">{city.name}:</strong>{' '}
                <span className="font-mono text-amber-600 dark:text-amber-400">
                  {sp.hour}:{sp.minute}{ampmS}
                </span>{' '}
                –{' '}
                <span className="font-mono text-amber-600 dark:text-amber-400">
                  {ep.hour}:{ep.minute}{ampmE}
                </span>{' '}
                <span className="text-slate-500">({sp.weekday} {sp.month} {sp.day})</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopyTimes}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
          >
            <Copy size={14} />
            Copy times
          </button>
          <button
            onClick={handleGoogleCalendar}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
          >
            Add to Google Calendar
          </button>
        </div>
      </div>

      {/* Hint */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 text-sm text-slate-600 dark:text-slate-400">
        <p>Drag across any row to choose a meeting time slot — every row highlights the same instant. Scroll any row to move all of them together.</p>
      </div>
    </div>
  );
}

export default TimeZoneCalculator;
