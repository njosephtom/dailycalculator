// Base unit: Bit
// Decimal (SI): 1 KB = 1000 bytes, 1 MB = 1000 KB, etc.
// Binary (IEC): 1 KiB = 1024 bytes, 1 MiB = 1024 KiB, etc.

export const decimalUnits = {
  bit:  { label: "Bit (b)",          toBits: 1 },
  byte: { label: "Byte (B)",         toBits: 8 },
  kb:   { label: "Kilobyte (KB)",    toBits: 8 * 1e3 },
  mb:   { label: "Megabyte (MB)",    toBits: 8 * 1e6 },
  gb:   { label: "Gigabyte (GB)",    toBits: 8 * 1e9 },
  tb:   { label: "Terabyte (TB)",    toBits: 8 * 1e12 },
  pb:   { label: "Petabyte (PB)",    toBits: 8 * 1e15 },
};

export const binaryUnits = {
  bit:  { label: "Bit (b)",          toBits: 1 },
  byte: { label: "Byte (B)",         toBits: 8 },
  kib:  { label: "Kibibyte (KiB)",   toBits: 8 * 1024 },
  mib:  { label: "Mebibyte (MiB)",   toBits: 8 * Math.pow(1024, 2) },
  gib:  { label: "Gibibyte (GiB)",   toBits: 8 * Math.pow(1024, 3) },
  tib:  { label: "Tebibyte (TiB)",   toBits: 8 * Math.pow(1024, 4) },
  pib:  { label: "Pebibyte (PiB)",   toBits: 8 * Math.pow(1024, 5) },
};

/**
 * Convert a value between two data-size units.
 * @param {number} value - Input value
 * @param {string} fromUnit - Key from decimalUnits or binaryUnits
 * @param {string} toUnit - Key from decimalUnits or binaryUnits
 * @param {boolean} binary - true for IEC/binary, false for SI/decimal
 * @returns {number}
 */
export function convertData(value, fromUnit, toUnit, binary = false) {
  const units = binary ? binaryUnits : decimalUnits;
  const bits = value * units[fromUnit].toBits;
  return bits / units[toUnit].toBits;
}

/**
 * Convert a value into every unit in the current system.
 * @param {number} value - Input value
 * @param {string} fromUnit - Source unit key
 * @param {boolean} binary - true for IEC/binary, false for SI/decimal
 * @returns {Object} keyed by unit key, value is the converted number
 */
export function allConversions(value, fromUnit, binary = false) {
  const units = binary ? binaryUnits : decimalUnits;
  const bits = value * units[fromUnit].toBits;
  const result = {};
  for (const [key, unit] of Object.entries(units)) {
    result[key] = bits / unit.toBits;
  }
  return result;
}
