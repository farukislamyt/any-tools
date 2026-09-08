import { describe, expect, it } from "vitest";
import {
  calculateMetalWeightKg,
  calculatePlateWeightKg,
  crossSectionAreaMm2,
  isValidMetalGeometry,
  toMillimetres,
} from "./metal-weight";

describe("metal weight units", () => {
  it("converts supported length units to millimetres", () => {
    expect(toMillimetres("10", "mm")).toBe(10);
    expect(toMillimetres("10", "cm")).toBe(100);
    expect(toMillimetres("1", "m")).toBe(1000);
    expect(toMillimetres("1", "in")).toBeCloseTo(25.4, 10);
    expect(toMillimetres("1", "ft")).toBeCloseTo(304.8, 10);
  });
});

describe("metal cross-section geometry", () => {
  it("calculates round and wire area", () => {
    const expected = Math.PI * 2500;
    expect(crossSectionAreaMm2("round", { diameter: 100 })).toBeCloseTo(expected, 8);
    expect(crossSectionAreaMm2("wire", { diameter: 100 })).toBeCloseTo(expected, 8);
  });

  it("calculates square, rectangle and flat bar area", () => {
    expect(crossSectionAreaMm2("square", { side: 100 })).toBe(10000);
    expect(crossSectionAreaMm2("rectangle", { width: 100, height: 50 })).toBe(5000);
    expect(crossSectionAreaMm2("flat", { width: 100, height: 5 })).toBe(500);
  });

  it("calculates hex area from across-corners dimension", () => {
    expect(crossSectionAreaMm2("hex", { acrossCorners: 100 })).toBeCloseTo((3 * Math.sqrt(3) * 100 ** 2) / 8, 8);
  });

  it("calculates octagon area from across-flats dimension", () => {
    expect(crossSectionAreaMm2("octagon", { acrossFlats: 100 })).toBeCloseTo(2 * (Math.sqrt(2) - 1) * 100 ** 2, 8);
  });

  it("calculates sheet/plate cross-section from width and thickness", () => {
    expect(crossSectionAreaMm2("plate", { width: 1000, length: 2000, height: 5 })).toBeCloseTo(5000, 8);
  });

  it("calculates mild-steel plate weight with width × length × thickness", () => {
    const result = calculatePlateWeightKg(1000, 2000, 5, 7850, 1);
    expect(result.volumeMm3).toBe(10_000_000);
    expect(result.pieceKg).toBeCloseTo(78.5, 10);
    expect(result.totalKg).toBeCloseTo(78.5, 10);
  });

  it("calculates a 4 ft × 8 ft × 1 mm mild-steel sheet correctly", () => {
    const result = calculatePlateWeightKg(4 * 304.8, 8 * 304.8, 1, 7850, 1);
    expect(result.pieceKg).toBeCloseTo(23.337243648, 6);
  });

  it("calculates equal and unequal angles", () => {
    const equalSide = toMillimetres("2", "in");
    expect(crossSectionAreaMm2("equal-angle", { sideA: equalSide, wallThickness: 5 })).toBeCloseTo(483.28, 2);
    expect(crossSectionAreaMm2("angle", { sideA: 3 * 25.4, sideB: 2 * 25.4, wallThickness: 5 })).toBeCloseTo(610.16, 2);
  });

  it("calculates pipe and tube area", () => {
    expect(crossSectionAreaMm2("pipe", { outerDiameter: 50, wallThickness: 5 })).toBeCloseTo(Math.PI * (25 ** 2 - 20 ** 2), 8);
    expect(crossSectionAreaMm2("tube", { width: 50, height: 40, wallThickness: 5 })).toBe(800);
  });

  it("calculates all structural section areas using the documented idealized model", () => {
    const channel = { depth: 100, flangeWidth: 50, flangeThickness: 5, webThickness: 5 };
    const iBeam = { depth: 200, flangeWidth: 100, flangeThickness: 10, webThickness: 8 };
    const hBeam = { depth: 200, flangeWidth: 200, flangeThickness: 12, webThickness: 8 };
    const tee = { depth: 100, flangeWidth: 50, flangeThickness: 6, webThickness: 6 };
    const z = { depth: 100, flangeWidth: 50, flangeThickness: 6, webThickness: 5 };

    expect(crossSectionAreaMm2("channel", channel)).toBe(950);
    expect(crossSectionAreaMm2("i-beam", iBeam)).toBe(3440);
    expect(crossSectionAreaMm2("h-beam", hBeam)).toBe(6208);
    expect(crossSectionAreaMm2("tee", tee)).toBe(864);
    expect(crossSectionAreaMm2("z", z)).toBe(910);
  });

  it("rejects impossible geometry", () => {
    expect(isValidMetalGeometry("angle", { sideA: 50, sideB: 75, wallThickness: 50 })).toBe(false);
    expect(isValidMetalGeometry("equal-angle", { sideA: 50, wallThickness: 50 })).toBe(false);
    expect(isValidMetalGeometry("pipe", { outerDiameter: 50, wallThickness: 25 })).toBe(false);
    expect(isValidMetalGeometry("tube", { width: 50, height: 40, wallThickness: 20 })).toBe(false);
    expect(isValidMetalGeometry("i-beam", { depth: 20, flangeWidth: 100, flangeThickness: 10, webThickness: 8 })).toBe(false);
    expect(crossSectionAreaMm2("pipe", { outerDiameter: 50, wallThickness: 25 })).toBe(0);
  });

  it("rejects incomplete plate dimensions", () => {
    expect(isValidMetalGeometry("plate", { width: 1000, length: 2000, height: 0 })).toBe(false);
    expect(calculatePlateWeightKg(1000, 2000, 0, 7850, 1).totalKg).toBe(0);
  });
});

describe("metal weight", () => {
  it("uses mm³ to m³ conversion correctly", () => {
    const result = calculateMetalWeightKg("square", { side: 100 }, 1000, 7850, 1);
    expect(result.areaMm2).toBe(10000);
    expect(result.pieceKg).toBeCloseTo(78.5, 10);
    expect(result.totalKg).toBeCloseTo(78.5, 10);
  });

  it("scales by whole-piece quantity", () => {
    const result = calculateMetalWeightKg("round", { diameter: 100 }, 1000, 7850, 3.9);
    expect(result.pieces).toBe(3);
    expect(result.totalKg).toBeCloseTo(result.pieceKg * 3, 10);
  });

  it("calculates a non-plate shape end-to-end", () => {
    const result = calculateMetalWeightKg("round", { diameter: 100 }, 1000, 7850, 2);
    expect(result.areaMm2).toBeCloseTo(Math.PI * 2500, 8);
    expect(result.pieceKg).toBeCloseTo(61.653, 3);
    expect(result.totalKg).toBeCloseTo(123.306, 3);
  });

  it("returns zero for invalid length, density, or quantity", () => {
    expect(calculateMetalWeightKg("round", { diameter: 100 }, 0, 7850, 1).totalKg).toBe(0);
    expect(calculateMetalWeightKg("round", { diameter: 100 }, 1000, 0, 1).totalKg).toBe(0);
    expect(calculateMetalWeightKg("round", { diameter: 100 }, 1000, 7850, 0).totalKg).toBe(0);
  });
});
