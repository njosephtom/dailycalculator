const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

const convertTwoDigits = (num) => {
  if (num === 0) return '';
  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  const tenDigit = Math.floor(num / 10);
  const oneDigit = num % 10;
  return oneDigit === 0 ? tens[tenDigit] : `${tens[tenDigit]}-${ones[oneDigit]}`;
};

const convertThreeDigits = (num) => {
  if (num === 0) return '';
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;

  let result = '';
  if (hundreds > 0) {
    result = `${ones[hundreds]} Hundred`;
  }

  if (remainder > 0) {
    const remainderWords = convertTwoDigits(remainder);
    result = result ? `${result} ${remainderWords}` : remainderWords;
  }

  return result;
};

// Standard short scale: US, Canada, Australia
export const convertToWordsStandardShortScale = (num) => {
  if (num === 0) return 'Zero';
  if (num < 0) return `Negative ${convertToWordsStandardShortScale(-num)}`;
  if (!isFinite(num)) return 'Invalid';

  const scales = [
    { value: 1_000_000_000_000, name: 'Trillion' },
    { value: 1_000_000_000, name: 'Billion' },
    { value: 1_000_000, name: 'Million' },
    { value: 1_000, name: 'Thousand' },
  ];

  let result = '';
  for (const { value, name } of scales) {
    if (num >= value) {
      const quotient = Math.floor(num / value);
      const words = convertThreeDigits(quotient);
      result += `${words} ${name} `;
      num %= value;
    }
  }

  if (num > 0) {
    result += convertThreeDigits(num);
  }

  return result.trim();
};

// North American hundreds grouping: 2200 = "twenty-two hundred"
export const convertToWordsNorthAmericanHundreds = (num) => {
  if (num === 0) return 'Zero';
  if (num < 0) return `Negative ${convertToWordsNorthAmericanHundreds(-num)}`;
  if (!isFinite(num)) return 'Invalid';

  if (num < 1000) {
    return convertThreeDigits(num);
  }

  // For numbers 1000-9999, use "X hundred" format
  if (num < 10_000) {
    const hundreds = Math.floor(num / 100);
    const remainder = num % 100;
    let result = `${convertTwoDigits(hundreds)} Hundred`;
    if (remainder > 0) {
      result += ` ${convertTwoDigits(remainder)}`;
    }
    return result;
  }

  const scales = [
    { value: 1_000_000_000_000, name: 'Trillion' },
    { value: 1_000_000_000, name: 'Billion' },
    { value: 1_000_000, name: 'Million' },
    { value: 1_000, name: 'Thousand' },
  ];

  let result = '';
  for (const { value, name } of scales) {
    if (num >= value) {
      const quotient = Math.floor(num / value);
      const words = convertThreeDigits(quotient);
      result += `${words} ${name} `;
      num %= value;
    }
  }

  if (num > 0) {
    result += convertThreeDigits(num);
  }

  return result.trim();
};

// Indian numbering system: 2200 = "two thousand two hundred"
export const convertToWordsIndian = (num) => {
  if (num === 0) return 'Zero';
  if (num < 0) return `Negative ${convertToWordsIndian(-num)}`;
  if (!isFinite(num)) return 'Invalid';

  const scales = [
    { value: 10_000_000, name: 'Crore', divisor: 10_000_000 },
    { value: 100_000, name: 'Lakh', divisor: 100_000 },
    { value: 1_000, name: 'Thousand', divisor: 1_000 },
  ];

  let result = '';
  for (const { value, name, divisor } of scales) {
    if (num >= value) {
      const quotient = Math.floor(num / divisor);
      const words = quotient < 100 ? convertTwoDigits(quotient) : convertThreeDigits(quotient);
      result += `${words} ${name} `;
      num %= divisor;
    }
  }

  if (num > 0) {
    result += convertThreeDigits(num);
  }

  return result.trim();
};

// European long scale: used in some European countries
export const convertToWordsEuropeanLongScale = (num) => {
  if (num === 0) return 'Zero';
  if (num < 0) return `Negative ${convertToWordsEuropeanLongScale(-num)}`;
  if (!isFinite(num)) return 'Invalid';

  const scales = [
    { value: 1_000_000_000_000, name: 'Trillion' },
    { value: 1_000_000_000, name: 'Milliard' },
    { value: 1_000_000, name: 'Million' },
    { value: 1_000, name: 'Thousand' },
  ];

  let result = '';
  for (const { value, name } of scales) {
    if (num >= value) {
      const quotient = Math.floor(num / value);
      const words = convertThreeDigits(quotient);
      result += `${words} ${name} `;
      num %= value;
    }
  }

  if (num > 0) {
    result += convertThreeDigits(num);
  }

  return result.trim();
};

export const REGIONS = [
  {
    id: 'north-america',
    name: 'North America (US, Canada)',
    description: 'Uses short scale with hundreds grouping for thousands',
    example: '2200 = "Twenty-Two Hundred"',
    convert: convertToWordsNorthAmericanHundreds,
  },
  {
    id: 'india',
    name: 'India',
    description: 'Uses Indian numbering system (Crore, Lakh, Thousand)',
    example: '2200 = "Two Thousand Two Hundred"',
    convert: convertToWordsIndian,
  },
  {
    id: 'standard',
    name: 'Standard (UK, Australia, Modern)',
    description: 'Standard short scale with Thousand, Million, Billion, Trillion',
    example: '2200 = "Two Thousand Two Hundred"',
    convert: convertToWordsStandardShortScale,
  },
  {
    id: 'european',
    name: 'European (Long Scale)',
    description: 'Uses long scale system with Milliard instead of Billion',
    example: '2200 = "Two Thousand Two Hundred"',
    convert: convertToWordsEuropeanLongScale,
  },
];

export const convertNumberToWords = (num, regionId = 'standard') => {
  const region = REGIONS.find(r => r.id === regionId);
  if (!region) return 'Invalid region';
  return region.convert(num);
};
