export type MetalWeightShape =
  | "round" | "square" | "rectangle" | "flat" | "hex" | "octagon" | "plate" | "pipe" | "tube"
  | "angle" | "channel" | "i-beam" | "h-beam" | "tee" | "z" | "wire";

export type MetalWeightUnit = "mm" | "cm" | "m" | "in" | "ft";
export type DimensionKey =
  | "diameter" | "side" | "width" | "height" | "length" | "acrossCorners" | "acrossFlats"
  | "outerDiameter" | "wallThickness" | "sideA" | "sideB" | "depth"
  | "flangeWidth" | "flangeThickness" | "webThickness";
export type ShapeField = { key: DimensionKey; label: string };

export const shapeDefinitions: Record<MetalWeightShape, { label: string; fields: ShapeField[] }> = {
  round: { label: "Round bar", fields: [{ key: "diameter", label: "Diameter" }] },
  wire: { label: "Wire / rod", fields: [{ key: "diameter", label: "Diameter" }] },
  square: { label: "Square bar", fields: [{ key: "side", label: "Side" }] },
  rectangle: { label: "Rectangle bar", fields: [{ key: "width", label: "Side A / Width" }, { key: "height", label: "Side B / Height" }] },
  flat: { label: "Flat bar", fields: [{ key: "width", label: "Width" }, { key: "height", label: "Thickness" }] },
  plate: { label: "Sheet / plate", fields: [{ key: "width", label: "Width" }, { key: "length", label: "Length" }, { key: "height", label: "Thickness" }] },
  hex: { label: "Hex bar", fields: [{ key: "acrossCorners", label: "Across corners" }] },
  octagon: { label: "Octagonal bar", fields: [{ key: "acrossFlats", label: "Across flats" }] },
  pipe: { label: "Round pipe", fields: [{ key: "outerDiameter", label: "Outside diameter" }, { key: "wallThickness", label: "Wall thickness" }] },
  tube: { label: "Square / rectangular tube", fields: [{ key: "width", label: "Outside width" }, { key: "height", label: "Outside height" }, { key: "wallThickness", label: "Wall thickness" }] },
  angle: { label: "Angle / L-section", fields: [{ key: "sideA", label: "Side A" }, { key: "sideB", label: "Side B" }, { key: "wallThickness", label: "Thickness" }] },
  channel: { label: "Channel / C-section", fields: [{ key: "depth", label: "Overall depth / height" }, { key: "flangeWidth", label: "Flange width" }, { key: "flangeThickness", label: "Flange thickness" }, { key: "webThickness", label: "Web thickness" }] },
  "i-beam": { label: "I-beam", fields: [{ key: "depth", label: "Overall depth / height" }, { key: "flangeWidth", label: "Flange width" }, { key: "flangeThickness", label: "Flange thickness" }, { key: "webThickness", label: "Web thickness" }] },
  "h-beam": { label: "H-beam", fields: [{ key: "depth", label: "Overall depth / height" }, { key: "flangeWidth", label: "Flange width" }, { key: "flangeThickness", label: "Flange thickness" }, { key: "webThickness", label: "Web thickness" }] },
  tee: { label: "T-section", fields: [{ key: "depth", label: "Overall depth / height" }, { key: "flangeWidth", label: "Flange width" }, { key: "flangeThickness", label: "Flange thickness" }, { key: "webThickness", label: "Web thickness" }] },
  z: { label: "Z-section", fields: [{ key: "depth", label: "Overall depth / height" }, { key: "flangeWidth", label: "Flange width" }, { key: "flangeThickness", label: "Flange thickness" }, { key: "webThickness", label: "Web thickness" }] },
};

export const shapeOptions = (Object.keys(shapeDefinitions) as MetalWeightShape[]).map(value => ({ value, label: shapeDefinitions[value].label }));
export const metalWeightUnits: { value: MetalWeightUnit; label: string }[] = [
  { value: "mm", label: "mm" }, { value: "cm", label: "cm" }, { value: "m", label: "m" },
  { value: "in", label: "in" }, { value: "ft", label: "ft" },
];

const unitToMm: Record<MetalWeightUnit, number> = { mm: 1, cm: 10, m: 1000, in: 25.4, ft: 304.8 };
export const toMillimetres = (value: string, unit: MetalWeightUnit) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric * unitToMm[unit] : 0;
};

export type MetalDimensions = Partial<Record<DimensionKey, number>>;

function positive(...values: number[]) {
  return values.every(value => Number.isFinite(value) && value > 0);
}

export function isValidMetalGeometry(shape: MetalWeightShape, d: MetalDimensions): boolean {
  const a = d.diameter ?? d.side ?? d.width ?? d.sideA ?? d.outerDiameter ?? d.depth ?? 0;
  const b = d.height ?? d.sideB ?? 0;
  const t = d.wallThickness ?? 0;
  const f = d.flangeWidth ?? 0;
  const ft = d.flangeThickness ?? 0;
  const w = d.webThickness ?? 0;

  switch (shape) {
    case "round": case "wire": return positive(a);
    case "square": return positive(a);
    case "rectangle": case "flat": return positive(a, b);
    case "plate": return positive(d.width ?? 0, d.length ?? 0, d.height ?? 0);
    case "hex": case "octagon": return positive(a);
    case "pipe": return positive(a, t) && 2 * t < a;
    case "tube": return positive(a, b, t) && 2 * t < a && 2 * t < b;
    case "angle": return positive(a, b, t) && t <= Math.min(a, b);
    case "channel": case "i-beam": case "h-beam": case "z":
      return positive(a, f, ft, w) && 2 * ft < a && w <= f;
    case "tee": return positive(a, f, ft, w) && ft < a && w <= f;
  }
}

export function crossSectionAreaMm2(shape: MetalWeightShape, d: MetalDimensions): number {
  if (shape === "plate") {
    return isValidMetalGeometry(shape, d) ? (d.width ?? 0) * (d.height ?? 0) : 0;
  }
  if (!isValidMetalGeometry(shape, d)) return 0;

  const a = d.diameter ?? d.side ?? d.width ?? d.sideA ?? d.outerDiameter ?? d.depth ?? 0;
  const b = d.height ?? d.sideB ?? 0;
  const t = d.wallThickness ?? 0;
  const f = d.flangeWidth ?? 0;
  const ft = d.flangeThickness ?? 0;
  const w = d.webThickness ?? 0;

  switch (shape) {
    case "round": case "wire": return Math.PI * (a / 2) ** 2;
    case "square": return a ** 2;
    case "rectangle": case "flat": return a * b;
    case "hex": return (3 * Math.sqrt(3) * a ** 2) / 8;
    case "octagon": return a ** 2 / (2 * (1 + Math.sqrt(2)));
    case "pipe": return Math.PI * ((a / 2) ** 2 - ((a - 2 * t) / 2) ** 2);
    case "tube": return a * b - (a - 2 * t) * (b - 2 * t);
    case "angle": return t * (a + b - t);
    case "channel": case "i-beam": case "h-beam": case "z": return 2 * f * ft + (a - 2 * ft) * w;
    case "tee": return f * ft + (a - ft) * w;
    case "plate": return 0;
  }
}

export function calculateMetalWeightKg(shape: MetalWeightShape, dimensions: MetalDimensions, lengthMm: number, densityKgM3: number, quantity = 1) {
  const areaMm2 = crossSectionAreaMm2(shape, dimensions);
  const pieces = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 0;
  const pieceKg = areaMm2 > 0 && Number.isFinite(lengthMm) && lengthMm > 0 && Number.isFinite(densityKgM3) && densityKgM3 > 0
    ? areaMm2 * lengthMm * densityKgM3 / 1e9
    : 0;
  return { areaMm2, pieceKg, totalKg: pieceKg * pieces, tonnes: pieceKg * pieces / 1000, pieces };
}

export function calculatePlateWeightKg(widthMm: number, lengthMm: number, thicknessMm: number, densityKgM3: number, quantity = 1) {
  const valid = positive(widthMm, lengthMm, thicknessMm, densityKgM3);
  const pieces = Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 0;
  const volumeMm3 = valid ? widthMm * lengthMm * thicknessMm : 0;
  const pieceKg = valid ? volumeMm3 * densityKgM3 / 1e9 : 0;
  return {
    areaMm2: valid ? widthMm * thicknessMm : 0,
    volumeMm3,
    pieceKg,
    totalKg: pieceKg * pieces,
    tonnes: pieceKg * pieces / 1000,
    pieces,
  };
}
