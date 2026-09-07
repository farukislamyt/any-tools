import { describe, expect, it } from "vitest";
import { calculatePercentage, percentageChange } from "./percentage";

describe("percentage calculator", () => {
  it("calculates a percentage of a number", () => {
    expect(calculatePercentage(200, 15)).toBe(30);
    expect(calculatePercentage(1000, 7.5)).toBe(75);
  });

  it("supports negative and decimal values", () => {
    expect(calculatePercentage(-200, 10)).toBe(-20);
    expect(calculatePercentage(12.5, 20)).toBe(2.5);
  });

  it("calculates percentage change", () => {
    expect(percentageChange(100, 120)).toBe(20);
    expect(percentageChange(200, 150)).toBe(-25);
  });

  it("handles zero and non-finite input safely", () => {
    expect(percentageChange(0, 100)).toBe(0);
    expect(calculatePercentage(Number.NaN, 10)).toBe(0);
  });
});
