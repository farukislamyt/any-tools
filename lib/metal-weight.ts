export type MetalWeightShape =
  | "round" | "square" | "rectangle" | "flat" | "hex" | "octagon" | "plate" | "pipe" | "tube"
  | "equal-angle" | "angle" | "channel" | "i-beam" | "h-beam" | "tee" | "z" | "wire";

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
  "equal-angle": { label: "Equal angle / L-section", fields: [{ key: "sideA", label: "Side" }, { key: "wallThickness", label: "Thickness" }] },
  angle: { label: "Unequal angle / L-section", fields: [{ key: "sideA", label: "Side A" }, { key: "sideB", label: "Side B" }, { key: "wallThickness", label: "Thickness" }] },
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
  switch (shape) {
    case "round":
    case "wire":
      return positive(d.diameter ?? 0);
    case "square":
      return positive(d.side ?? 0);
    case "rectangle":
    case "flat":
      return positive(d.width ?? 0, d.height ?? 0);
    case "plate":
      return positive(d.width ?? 0, d.length ?? 0, d.height ?? 0);
    case "hex":
      return positive(d.acrossCorners ?? 0);
    case "octagon":
      return positive(d.acrossFlats ?? 0);
    case "pipe": {
      const od = d.outerDiameter ?? 0;
      const wall = d.wallThickness ?? 0;
      return positive(od, wall) && 2 * wall < od;
    }
    case "tube": {
      const width = d.width ?? 0;
      const height = d.height ?? 0;
      const wall = d.wallThickness ?? 0;
      return positive(width, height, wall) && 2 * wall < width && 2 * wall < height;
    }
    case "equal-angle": {
      const side = d.sideA ?? 0;
      const wall = d.wallThickness ?? 0;
      return positive(side, wall) && wall < side;
    }
    case "angle": {
      const sideA = d.sideA ?? 0;
      const sideB = d.sideB ?? 0;
      const wall = d.wallThickness ?? 0;
      return positive(sideA, sideB, wall) && wall < Math.min(sideA, sideB);
    }
    case "channel":
    case "i-beam":
    case "h-beam":
    case "z": {
      const depth = d.depth ?? 0;
      const flangeWidth = d.flangeWidth ?? 0;
      const flangeThickness = d.flangeThickness ?? 0;
      const webThickness = d.webThickness ?? 0;
      return positive(depth, flangeWidth, flangeThickness, webThickness)
        && 2 * flangeThickness < depth
        && webThickness <= flangeWidth;
    }
    case "tee": {
      const depth = d.depth ?? 0;
      const flangeWidth = d.flangeWidth ?? 0;
      const flangeThickness = d.flangeThickness ?? 0;
      const webThickness = d.webThickness ?? 0;
      return positive(depth, flangeWidth, flangeThickness, webThickness)
        && flangeThickness < depth
        && webThickness <= flangeWidth;
    }
  }
}

export function crossSectionAreaMm2(shape: MetalWeightShape, d: MetalDimensions): number {
  if (!isValidMetalGeometry(shape, d)) return 0;

  switch (shape) {
    case "round":
    case "wire": {
      const diameter = d.diameter!;
      return Math.PI * diameter ** 2 / 4;
    }
    case "square":
      return d.side! ** 2;
    case "rectangle":
    case "flat":
      return d.width! * d.height!;
    case "plate":
      return d.width! * d.height!;
    case "hex":
      return 3 * Math.sqrt(3) * d.acrossCorners! ** 2 / 8;
    case "octagon":
      return 2 * (Math.sqrt(2) - 1) * d.acrossFlats! ** 2;
    case "pipe": {
      const od = d.outerDiameter!;
      const wall = d.wallThickness!;
      const id = od - 2 * wall;
      return Math.PI * (od ** 2 - id ** 2) / 4;
    }
    case "tube": {
      const width = d.width!;
      const height = d.height!;
      const wall = d.wallThickness!;
      return width * height - (width - 2 * wall) * (height - 2 * wall);
    }
    case "equal-angle": {
      const side = d.sideA!;
      const wall = d.wallThickness!;
      return wall * (2 * side - wall);
    }
    case "angle": {
      const sideA = d.sideA!;
      const sideB = d.sideB!;
      const wall = d.wallThickness!;
      return wall * (sideA + sideB - wall);
    }
    case "channel":
    case "i-beam":
    case "h-beam":
    case "z": {
      const depth = d.depth!;
      const flangeWidth = d.flangeWidth!;
      const flangeThickness = d.flangeThickness!;
      const webThickness = d.webThickness!;
      return 2 * flangeWidth * flangeThickness + (depth - 2 * flangeThickness) * webThickness;
    }
    case "tee": {
      const depth = d.depth!;
      const flangeWidth = d.flangeWidth!;
      const flangeThickness = d.flangeThickness!;
      const webThickness = d.webThickness!;
      return flangeWidth * flangeThickness + (depth - flangeThickness) * webThickness;
    }
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
