"use client";

import { useState } from "react";
import { ToolShell } from "@/components/tool-shell";

const keys = ["7", "8", "9", "÷", "4", "5", "6", "×", "1", "2", "3", "−", "0", ".", "=", "+"];

export default function CalculatorPage() {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  function press(key: string) {
    if (key === "=") {
      if (stored === null || !operator) return;
      const current = Number(display);
      const result = operator === "+" ? stored + current : operator === "−" ? stored - current : operator === "×" ? stored * current : current === 0 ? 0 : stored / current;
      setDisplay(String(Number(result.toFixed(10)))); setStored(null); setOperator(null); setFresh(true); return;
    }
    if (["+", "−", "×", "÷"].includes(key)) { setStored(Number(display)); setOperator(key); setFresh(true); return; }
    if (fresh) { setDisplay(key === "." ? "0." : key); setFresh(false); } else if (key === "." && display.includes(".")) return; else setDisplay(display === "0" && key !== "." ? key : display + key);
  }

  return <ToolShell title="Calculator" description="A fast, simple calculator for everyday arithmetic." category="Calculators">
    <div className="mx-auto max-w-md overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className="flex h-20 items-end justify-end bg-slate-950 px-4 py-3 text-3xl font-semibold tracking-tight text-white sm:h-24 sm:px-5 sm:text-4xl"><span className="max-w-full overflow-hidden text-ellipsis">{display}</span></div>
      <div className="grid grid-cols-4 gap-px bg-slate-200">
        {keys.map((key) => <button key={key} onClick={() => press(key)} className={`h-16 bg-white text-lg font-semibold text-slate-800 transition hover:bg-slate-50 active:bg-slate-100 sm:h-18 ${key === "=" ? "bg-blue-600 text-white hover:bg-blue-600" : ""}`}>{key}</button>)}
      </div>
      <button onClick={() => { setDisplay("0"); setStored(null); setOperator(null); setFresh(true); }} className="h-11 w-full bg-white text-sm font-semibold text-slate-500 hover:bg-slate-50">Clear</button>
    </div>
  </ToolShell>;
}
