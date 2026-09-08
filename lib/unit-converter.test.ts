import { describe, expect, it } from "vitest";
import { convertUnit, formatConversion } from "./unit-converter";

describe("unit converter", () => {
  it("converts length", () => expect(convertUnit(1, "length", "m", "cm")).toBe(100));
  it("converts weight", () => expect(convertUnit(1, "weight", "kg", "lb")).toBeCloseTo(2.20462262, 7));
  it("converts temperature", () => expect(convertUnit(32, "temperature", "f", "c")).toBeCloseTo(0));
  it("converts area", () => expect(convertUnit(1, "area", "m2", "cm2")).toBe(10000));
  it("converts volume", () => expect(convertUnit(1, "volume", "l", "ml")).toBe(1000));
  it("formats without unnecessary trailing zeros", () => expect(formatConversion(100)).toBe("100"));
  it("rejects invalid conversions", () => expect(() => convertUnit(1, "length", "m", "bad")).toThrow());
});
