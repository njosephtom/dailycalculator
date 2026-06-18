// Western zodiac signs by date ranges
const ZODIAC_SIGNS = [
  { sign: "Capricorn",   start: [1, 1],   end: [1, 19]  },
  { sign: "Aquarius",    start: [1, 20],  end: [2, 18]  },
  { sign: "Pisces",      start: [2, 19],  end: [3, 20]  },
  { sign: "Aries",       start: [3, 21],  end: [4, 19]  },
  { sign: "Taurus",      start: [4, 20],  end: [5, 20]  },
  { sign: "Gemini",      start: [5, 21],  end: [6, 20]  },
  { sign: "Cancer",      start: [6, 21],  end: [7, 22]  },
  { sign: "Leo",         start: [7, 23],  end: [8, 22]  },
  { sign: "Virgo",       start: [8, 23],  end: [9, 22]  },
  { sign: "Libra",       start: [9, 23],  end: [10, 22] },
  { sign: "Scorpio",     start: [10, 23], end: [11, 21] },
  { sign: "Sagittarius", start: [11, 22], end: [12, 21] },
  { sign: "Capricorn",   start: [12, 22], end: [12, 31] },
];

const CHINESE_ANIMALS = [
  "Monkey", "Rooster", "Dog", "Pig", "Rat", "Ox",
  "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Goat",
];

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SEASONS_NORTH = [
  { season: "Winter", start: [12, 21], end: [3, 19] },
  { season: "Spring", start: [3, 20],  end: [6, 20] },
  { season: "Summer", start: [6, 21],  end: [9, 22] },
  { season: "Autumn", start: [9, 23],  end: [12, 20] },
];

export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getZodiacSign(month, day) {
  for (const z of ZODIAC_SIGNS) {
    const [sm, sd] = z.start;
    const [em, ed] = z.end;
    if (sm === em) {
      if (month === sm && day >= sd && day <= ed) return z.sign;
    } else {
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return z.sign;
    }
  }
  return "Unknown";
}

export function getChineseZodiac(year) {
  return CHINESE_ANIMALS[year % 12];
}

export function getDayOfWeek(date) {
  return DAYS_OF_WEEK[date.getDay()];
}

export function getSeason(month, day) {
  // Northern hemisphere seasons
  for (const s of SEASONS_NORTH) {
    const [sm, sd] = s.start;
    const [em, ed] = s.end;
    if (s.season === "Winter") {
      // Winter wraps around the year
      if ((month === 12 && day >= 21) || (month <= 2) || (month === 3 && day <= 19)) {
        return s.season;
      }
    } else {
      if ((month === sm && day >= sd) || (month === em && day <= ed) || (month > sm && month < em)) {
        return s.season;
      }
    }
  }
  return "Unknown";
}

export function calculateAge(dob, calcAt) {
  if (!dob || !calcAt || calcAt < dob) return null;

  // Age in years, months, days
  let years = calcAt.getFullYear() - dob.getFullYear();
  let months = calcAt.getMonth() - dob.getMonth();
  let days = calcAt.getDate() - dob.getDate();

  if (days < 0) {
    months -= 1;
    // Days in previous month relative to calcAt
    const prevMonth = new Date(calcAt.getFullYear(), calcAt.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  // Total days
  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDays = Math.floor((calcAt - dob) / msPerDay);
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = years * 12 + months;
  const totalHours = totalDays * 24;

  // Next birthday
  let nextBirthday = new Date(calcAt.getFullYear(), dob.getMonth(), dob.getDate());
  if (nextBirthday <= calcAt) {
    nextBirthday = new Date(calcAt.getFullYear() + 1, dob.getMonth(), dob.getDate());
  }
  const daysUntilBirthday = Math.ceil((nextBirthday - calcAt) / msPerDay);

  // Birth info
  const dayOfBirth = getDayOfWeek(dob);
  const zodiacSign = getZodiacSign(dob.getMonth() + 1, dob.getDate());
  const chineseZodiac = getChineseZodiac(dob.getFullYear());
  const bornInLeapYear = isLeapYear(dob.getFullYear());
  const season = getSeason(dob.getMonth() + 1, dob.getDate());

  const dobFormatted = dob.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalMonths,
    totalHours,
    daysUntilBirthday,
    dayOfBirth,
    dobFormatted,
    zodiacSign,
    chineseZodiac,
    bornInLeapYear,
    season,
  };
}

export function getMilestones(dob) {
  const msPerDay = 1000 * 60 * 60 * 24;

  const milestones = [
    { label: "1,000 days old",           days: 1000 },
    { label: "5,000 days old",           days: 5000 },
    { label: "10,000 days old",          days: 10000 },
    { label: "20,000 days old",          days: 20000 },
    { label: "25,000 days old",          days: 25000 },
    { label: "30,000 days old",          days: 30000 },
    { label: "1 billion seconds old",    days: Math.floor(1e9 / 86400) },
    { label: "100 weeks old",            days: 700 },
    { label: "500 weeks old",            days: 3500 },
    { label: "1,000 weeks old",          days: 7000 },
    { label: "2,000 weeks old",          days: 14000 },
    { label: "10,000 hours old",         days: Math.floor(10000 / 24) },
    { label: "100,000 hours old",        days: Math.floor(100000 / 24) },
    { label: "1,000,000 hours old",      days: Math.floor(1000000 / 24) },
  ];

  const now = new Date();

  return milestones
    .map((m) => {
      const date = new Date(dob.getTime() + m.days * msPerDay);
      const passed = date <= now;
      return {
        label: m.label,
        date: date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
        passed,
      };
    })
    .sort((a, b) => {
      // Sort by date
      const da = new Date(a.date);
      const db = new Date(b.date);
      return da - db;
    });
}
