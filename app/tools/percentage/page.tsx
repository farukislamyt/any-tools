"use client";

import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool-shell";
import { calculatePercentage, percentageChange } from "@/lib/percentage";

const inputClass = "mt-1.5 h-11 w-full border border-slate-200 bg-white px-3 text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100";

export default function PercentagePage() {
  const [value, setValue] = useState("100");
  const [percent, setPercent] = useState("15");
  const [from, setFrom] = useState("100");
  const [to, setTo] = useState("115");

  const result = useMemo(() => calculatePercentage(Number(value), Number(percent)), [value, percent]);
  const change = useMemo(() => percentageChange(Number(from), Number(to)), [from, to]);

  return <ToolShell title="Percentage Calculator" description="Calculate percentages and percentage change quickly." category="Calculators">
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-lg font-semibold text-slate-950">What is a percentage of a number?</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Number<input inputMode="decimal" value={value} onChange={e => setValue(e.target.value)} className={inputClass} /></label>
          <label className="text-sm font-medium text-slate-700">Percent (%)<input inputMode="decimal" value={percent} onChange={e => setPercent(e.target.value)} className={inputClass} /></label>
        </div>
        <div className="mt-5 bg-slate-950 p-5 text-white"><p className="text-sm text-slate-400">Result</p><p className="mt-1 text-4xl font-bold">{result.toLocaleString(undefined, { maximumFractionDigits: 10 })}</p></div>
      </section>

      <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-lg font-semibold text-slate-950">Percentage change</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">From<input inputMode="decimal" value={from} onChange={e => setFrom(e.target.value)} className={inputClass} /></label>
          <label className="text-sm font-medium text-slate-700">To<input inputMode="decimal" value={to} onChange={e => setTo(e.target.value)} className={inputClass} /></label>
        </div>
        <div className="mt-5 bg-slate-50 p-5"><p className="text-sm text-slate-500">Change</p><p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">{change.toLocaleString(undefined, { maximumFractionDigits: 6 })}%</p></div>
      </section>
    </div>
  </ToolShell>;
}
