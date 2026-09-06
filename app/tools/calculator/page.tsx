"use client";

import { useState } from "react";
import { ToolShell } from "@/components/tool-shell";
import { evaluateExpression } from "@/lib/calculator";

const keys = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "=", "+"];
const operators = ["+", "−", "×", "÷"];

export default function CalculatorPage() {
  const [display, setDisplay] = useState("0");
  const [expression, setExpression] = useState("");
  const [fresh, setFresh] = useState(true);

  function reset() {
    setDisplay("0");
    setExpression("");
    setFresh(true);
  }

  function press(key: string) {
    if (key === "=") {
      if (!expression || operators.includes(expression.slice(-1))) return;
      try {
        setDisplay(String(evaluateExpression(expression)));
        setExpression("");
        setFresh(true);
      } catch {
        setDisplay("Error");
        setExpression("");
        setFresh(true);
      }
      return;
    }

    if (operators.includes(key)) {
      const base = fresh && !expression ? display : expression || display;
      if (operators.includes(base.slice(-1))) setExpression(base.slice(0, -1) + key);
      else setExpression(base + key);
      setFresh(false);
      return;
    }

    if (fresh || display === "Error") {
      const value = key === "." ? "0." : key;
      setDisplay(value);
      setExpression(value);
      setFresh(false);
      return;
    }

    const currentNumber = expression.split(/[+−×÷]/).pop() ?? "";
    if (key === "." && currentNumber.includes(".")) return;
    const nextExpression = expression + key;
    setExpression(nextExpression);
    setDisplay(nextExpression.split(/[+−×÷]/).pop() || "0");
  }

  return (
    <ToolShell title="Calculator" description="A fast, simple calculator with standard operator precedence." category="Calculators">
      <div className="mx-auto max-w-md overflow-hidden border border-slate-200 bg-white shadow-sm">
        <div className="flex h-20 items-end justify-end bg-slate-950 px-4 py-3 text-3xl font-semibold tracking-tight text-white sm:h-24 sm:px-5 sm:text-4xl">
          <span className="max-w-full overflow-hidden text-ellipsis">{display}</span>
        </div>
        <div className="grid grid-cols-4 gap-px bg-slate-200">
          {keys.map((key) => (
            <button key={key} onClick={() => press(key)} className={`h-16 bg-white text-lg font-semibold text-slate-800 transition hover:bg-slate-50 active:bg-slate-100 sm:h-18 ${key === "=" ? "bg-blue-600 text-white hover:bg-blue-600" : ""}`}>
              {key}
            </button>
          ))}
        </div>
        <button onClick={reset} className="h-11 w-full bg-white text-sm font-semibold text-slate-500 hover:bg-slate-50">Clear</button>
      </div>
    </ToolShell>
  );
}
