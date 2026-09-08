export type UnitCategory = "length" | "weight" | "temperature" | "area" | "volume";

type UnitDefinition = { label: string; symbol: string; toBase: (value: number) => number; fromBase: (value: number) => number };

const linear = (symbol: string, factor: number): UnitDefinition => ({
  label: symbol,
  symbol,
  toBase: (value) => value * factor,
  fromBase: (value) => value / factor,
});

export const unitCategories: { id: UnitCategory; label: string }[] = [
  { id: "length", label: "Length" },
  { id: "weight", label: "Weight / Mass" },
  { id: "temperature", label: "Temperature" },
  { id: "area", label: "Area" },
  { id: "volume", label: "Volume" },
];

export const units: Record<UnitCategory, Record<string, UnitDefinition>> = {
  length: {
    mm: linear("mm", 0.001), cm: linear("cm", 0.01), m: linear("m", 1), km: linear("km", 1000),
    in: linear("in", 0.0254), ft: linear("ft", 0.3048), yd: linear("yd", 0.9144), mi: linear("mi", 1609.344),
  },
  weight: {
    mg: linear("mg", 0.000001), g: linear("g", 0.001), kg: linear("kg", 1), tonne: linear("tonne", 1000),
    oz: linear("oz", 0.028349523125), lb: linear("lb", 0.45359237),
  },
  temperature: {
    c: { label: "Celsius", symbol: "°C", toBase: (v) => v, fromBase: (v) => v },
    f: { label: "Fahrenheit", symbol: "°F", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    k: { label: "Kelvin", symbol: "K", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  },
  area: {
    mm2: linear("mm²", 0.000001), cm2: linear("cm²", 0.0001), m2: linear("m²", 1), km2: linear("km²", 1_000_000),
    in2: linear("in²", 0.00064516), ft2: linear("ft²", 0.09290304), yd2: linear("yd²", 0.83612736), acre: linear("acre", 4046.8564224),
  },
  volume: {
    ml: linear("mL", 0.000001), l: linear("L", 0.001), m3: linear("m³", 1), cm3: linear("cm³", 0.000001),
    in3: linear("in³", 0.000016387064), ft3: linear("ft³", 0.028316846592), gal: linear("US gal", 0.003785411784),
  },
};

export function convertUnit(value: number, category: UnitCategory, from: string, to: string): number {
  const fromUnit = units[category]?.[from];
  const toUnit = units[category]?.[to];
  if (!fromUnit || !toUnit || !Number.isFinite(value)) throw new Error("Invalid conversion");
  return toUnit.fromBase(fromUnit.toBase(value));
}

export function formatConversion(value: number): string {
  if (!Number.isFinite(value)) return "—";
  if (Math.abs(value) >= 1e10 || (Math.abs(value) > 0 && Math.abs(value) < 1e-7)) return value.toExponential(8);
  return Number(value.toPrecision(12)).toString();
}
