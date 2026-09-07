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
    const result = calculatePlateWeightKg(4 * 304.8, 8 * 304.8, 1, 7850, 1);
    expect(result.pieceKg).toBeCloseTo(23.337243648, 6);
  });

  it("calculates an equal angle from one equal leg dimension", () => {
    const sideMm = toMillimetres("2", "in");
    expect(crossSectionAreaMm2("equal-angle", { sideA: sideMm, wallThickness: 5 })).toBeCloseTo(488.83, 2);
  });

  it("calculates 2 in × 2 in × 5 mm × 20 ft mild-steel equal angle", () => {
    const result = calculateMetalWeightKg("equal-angle", { sideA: toMillimetres("2", "in"), wallThickness: 5 }, toMillimetres("20", "ft"), 7850, 1);
    expect(result.pieceKg).toBeCloseTo(23.13, 2);
  });

  it("calculates an unequal angle from two leg dimensions", () => {
    expect(crossSectionAreaMm2("angle", { sideA: 3 * 25.4, sideB: 2 * 25.4, wallThickness: 5 })).toBeCloseTo(610, 8);
  });

  it("calculates 3 in × 2 in × 5 mm × 20 ft mild-steel unequal angle", () => {
    const result = calculateMetalWeightKg("angle", { sideA: toMillimetres("3", "in"), sideB: toMillimetres("2", "in"), wallThickness: 5 }, toMillimetres("20", "ft"), 7850, 1);
    expect(result.pieceKg).toBeCloseTo(29.190696, 6);
  });

  it("calculates pipe and tube area", () => {
    expect(crossSectionAreaMm2("pipe", { outerDiameter: 50, wallThickness: 5 })).toBeCloseTo(Math.PI * (25 ** 2 - 20 ** 2), 8);
    expect(crossSectionAreaMm2("tube", { width: 50, height: 40, wallThickness: 5 })).toBe(800);
  });

  it("calculates idealized channel, I/H beam, tee and Z section areas", () => {
    expect(crossSectionAreaMm2("channel", { depth: 100, flangeWidth: 50, flangeThickness: 5, webThickness: 5 })).toBe(975);
    expect(crossSectionAreaMm2("i-beam", { depth: 200, flangeWidth: 100, flangeThickness: 10, webThickness: 8 })).toBe(2240);
    expect(crossSectionAreaMm2("h-beam", { depth: 200, flangeWidth: 200, flangeThickness: 12, webThickness: 8 })).toBe(4672);
    expect(crossSectionAreaMm2("tee", { depth: 100, flangeWidth: 50, flangeThickness: 6, webThickness: 6 })).toBe(864);
    expect(crossSectionAreaMm2("z", { depth: 100, flangeWidth: 50, flangeThickness: 6, webThickness: 5 })).toBe(970);
  });

  it("rejects impossible angle thickness", () => {
    expect(isValidMetalGeometry("angle", { sideA: 50, sideB: 75, wallThickness: 50 })).toBe(false);
    expect(isValidMetalGeometry("angle", { sideA: 50, sideB: 75, wallThickness: 51 })).toBe(false);
  });

  it("rejects equal-angle thickness equal to or greater than the leg", () => {
    expect(isValidMetalGeometry("equal-angle", { sideA: 50, wallThickness: 50 })).toBe(false);
    expect(isValidMetalGeometry("equal-angle", { sideA: 50, wallThickness: 51 })).toBe(false);
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
