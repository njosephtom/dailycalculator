import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Country code to timezone mapping
const COUNTRY_TIMEZONES = {
  JP: 'Asia/Tokyo',
  ID: 'Asia/Jakarta',
  CN: 'Asia/Shanghai',
  IN: 'Asia/Kolkata',
  MX: 'America/Mexico_City',
  BR: 'America/Sao_Paulo',
  KR: 'Asia/Seoul',
  EG: 'Africa/Cairo',
  PK: 'Asia/Karachi',
  US: 'America/New_York',
  BD: 'Asia/Dhaka',
  RU: 'Europe/Moscow',
  TH: 'Asia/Bangkok',
  NG: 'Africa/Lagos',
  TR: 'Europe/Istanbul',
  VN: 'Asia/Ho_Chi_Minh',
  IR: 'Asia/Tehran',
  AR: 'America/Argentina/Buenos_Aires',
  PH: 'Asia/Manila',
  GB: 'Europe/London',
  FR: 'Europe/Paris',
  IT: 'Europe/Rome',
  ES: 'Europe/Madrid',
  DE: 'Europe/Berlin',
  AU: 'Australia/Sydney',
  CA: 'America/Toronto',
  ZA: 'Africa/Johannesburg',
  SG: 'Asia/Singapore',
  MY: 'Asia/Kuala_Lumpur',
  TW: 'Asia/Taipei',
  TH: 'Asia/Bangkok',
  CD: 'Africa/Kinshasa',
};

// Read CSV file
const csvPath = 'C:\\Users\\jtom\\Downloads\\simplemaps_worldcities_basicv1.91.1\\worldcities.csv';

try {
  const data = fs.readFileSync(csvPath, 'utf8');
  const lines = data.split('\n');

  // Parse CSV (skip header)
  const cities = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing (handles quoted fields)
    const matches = line.match(/"([^"]*)"/g);
    if (!matches || matches.length < 5) continue;

    const city = matches[0].replace(/"/g, '');
    const country = matches[4].replace(/"/g, '');
    const iso2 = matches[5].replace(/"/g, '');
    const population = parseInt(matches[9]?.replace(/"/g, '') || 0);

    // Only include cities with population and valid country
    if (population > 0 && COUNTRY_TIMEZONES[iso2]) {
      cities.push({
        name: city,
        country: country,
        iso2: iso2,
        timezone: COUNTRY_TIMEZONES[iso2],
        population: population
      });
    }
  }

  // Sort by population and take top 100
  cities.sort((a, b) => b.population - a.population);
  const topCities = cities.slice(0, 100);

  // Generate JavaScript file
  const jsContent = `// Generated from worldcities.csv
export const CITIES_DATA = [
${topCities.map(city =>
  `  { name: "${city.name.replace(/"/g, '\\"')}", timezone: "${city.timezone}", code: "${city.iso2}", country: "${city.country.replace(/"/g, '\\"')}" }`
).join(',\n')}
];
`;

  // Write to data file
  const outputPath = path.join(__dirname, '../src/data/citiesData.js');
  fs.writeFileSync(outputPath, jsContent, 'utf8');

  console.log(`✓ Generated citiesData.js with ${topCities.length} cities`);
  console.log(`Top 10 cities:`);
  topCities.slice(0, 10).forEach((city, i) => {
    console.log(`  ${i + 1}. ${city.name} (${city.country}) - ${city.timezone}`);
  });

} catch (error) {
  console.error('Error processing CSV:', error.message);
  process.exit(1);
}
