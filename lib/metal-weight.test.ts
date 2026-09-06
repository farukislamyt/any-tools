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
  it("calculates a round bar area", () => {
    expect(crossSectionAreaMm2("round", { diameter: 100 })).toBeCloseTo(Math.PI * 2500, 8);
  });

  it("calculates hex area when input is across corners", () => {
    expect(crossSectionAreaMm2("hex", { acrossCorners: 100 })).toBeCloseTo((3 * Math.sqrt(3) * 100 ** 2) / 8, 8);
  });

  it("calculates octagon area from across-flats correctly", () => {
    expect(crossSectionAreaMm2("octagon", { acrossFlats: 100 })).toBeCloseTo(100 ** 2 / (2 * (1 + Math.sqrt(2))), 8);
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
    const widthMm = 4 * 304.8;
    const lengthMm = 8 * 304.8;
    const result = calculatePlateWeightKg(widthMm, lengthMm, 1, 7850, 1);
    expect(result.pieceKg).toBeCloseTo(23.337243648, 6);
  });

  it("rejects incomplete plate dimensions", () => {
    expect(isValidMetalGeometry("plate", { width: 1000, length: 2000, height: 0 })).toBe(false);
    expect(calculatePlateWeightKg(1000, 2000, 0, 7850, 1).totalKg).toBe(0);
  });

  it("rejects impossible pipe and tube walls", () => {
    expect(isValidMetalGeometry("pipe", { outerDiameter: 50, wallThickness: 25 })).toBe(false);
    expect(isValidMetalGeometry("tube", { width: 50, height: 40, wallThickness: 20 })).toBe(false);
    expect(crossSectionAreaMm2("pipe", { outerDiameter: 50, wallThickness: 25 })).toBe(0);
  });

  it("validates structural section dimensions", () => {
    expect(isValidMetalGeometry("i-beam", { depth: 200, flangeWidth: 100, flangeThickness: 10, webThickness: 8 })).toBe(true);
    expect(isValidMetalGeometry("i-beam", { depth: 20, flangeWidth: 100, flangeThickness: 10, webThickness: 8 })).toBe(false);
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

  it("returns zero for invalid length, density, or quantity", () => {
    expect(calculateMetalWeightKg("round", { diameter: 100 }, 0, 7850, 1).totalKg).toBe(0);
    expect(calculateMetalWeightKg("round", { diameter: 100 }, 1000, 0, 1).totalKg).toBe(0);
    expect(calculateMetalWeightKg("round", { diameter: 100 }, 1000, 7850, 0).totalKg).toBe(0);
  });
});
