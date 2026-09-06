import { describe, expect, it } from "vitest";
import { evaluateExpression } from "./calculator";

describe("calculator", () => {
  it("handles basic arithmetic", () => {
    expect(evaluateExpression("2+3")).toBe(5);
    expect(evaluateExpression("9−4")).toBe(5);
    expect(evaluateExpression("6×7")).toBe(42);
    expect(evaluateExpression("20÷5")).toBe(4);
  });

  it("uses normal operator precedence", () => {
    expect(evaluateExpression("2+3×4")).toBe(14);
    expect(evaluateExpression("20−6÷2")).toBe(17);
    expect(evaluateExpression("2×3+4×5")).toBe(26);
  });

  it("supports decimals", () => {
    expect(evaluateExpression("10.5÷2")).toBe(5.25);
    expect(evaluateExpression("0.1+0.2")).toBeCloseTo(0.3, 12);
  });

  it("rejects division by zero", () => {
    expect(() => evaluateExpression("10÷0")).toThrow("Cannot divide by zero");
  });

  it("rejects malformed expressions", () => {
    expect(() => evaluateExpression("2++3")).toThrow();
    expect(() => evaluateExpression("2÷")).toThrow();
    expect(() => evaluateExpression("abc")).toThrow();
  });
});
