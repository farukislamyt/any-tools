"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { ToolShell } from "@/components/tool-shell";
import { convertUnit, formatConversion, unitCategories, units, type UnitCategory } from "@/lib/unit-converter";

export default function UnitConverterPage() {
  const [category, setCategory] = useState<UnitCategory>("length");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("cm");
  const [value, setValue] = useState("1");

  const options = useMemo(() => Object.entries(units[category]), [category]);
  const result = useMemo(() => {
    const number = Number(value);
    if (!Number.isFinite(number) || value.trim() === "") return "—";
    try { return formatConversion(convertUnit(number, category, from, to)); } catch { return "—"; }
  }, [category, from, to, value]);

  const changeCategory = (next: UnitCategory) => {
    const nextOptions = Object.keys(units[next]);
    setCategory(next);
    setFrom(nextOptions[0]);
    setTo(nextOptions[1] ?? nextOptions[0]);
  };

  const swap = () => { setFrom(to); setTo(from); };

  return (
    <ToolShell title="Unit Converter" description="Convert common units quickly and accurately." category="Conversion">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-3 flex flex-wrap gap-1 border-b border-slate-200 bg-white p-1">
          {unitCategories.map((item) => (
            <button key={item.id} type="button" onClick={() => changeCategory(item.id)} className={`px-3 py-2 text-xs font-semibold ${category === item.id ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>{item.label}</button>
          ))}
        </div>
        <section className="border border-slate-200 bg-white p-4 sm:p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-end">
            <label className="block">
              <span className="text-xs font-semibold text-slate-600">From</span>
              <div className="mt-1.5 flex border border-slate-200">
                <input inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} className="min-w-0 flex-1 px-3 py-2.5 text-lg outline-none focus:bg-slate-50" aria-label="Value" />
                <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-28 border-l border-slate-200 bg-white px-2 text-sm outline-none" aria-label="From unit">
                  {options.map(([id, unit]) => <option key={id} value={id}>{unit.label}</option>)}
                </select>
              </div>
            </label>
            <button type="button" onClick={swap} className="inline-flex h-10 w-10 items-center justify-center border border-slate-200 text-slate-600 hover:bg-slate-100" aria-label="Swap units" title="Swap units"><ArrowDownUp size={16} /></button>
            <label className="block">
              <span className="text-xs font-semibold text-slate-600">To</span>
              <div className="mt-1.5 flex min-h-12 items-center border border-slate-200 bg-slate-50">
                <output className="min-w-0 flex-1 truncate px-3 py-2.5 text-lg font-semibold" aria-live="polite">{result}</output>
                <select value={to} onChange={(e) => setTo(e.target.value)} className="w-28 border-l border-slate-200 bg-white px-2 py-2.5 text-sm outline-none" aria-label="To unit">
                  {options.map(([id, unit]) => <option key={id} value={id}>{unit.label}</option>)}
                </select>
              </div>
            </label>
          </div>
          <p className="mt-4 text-xs text-slate-500">{value || "0"} {units[category][from]?.symbol} = <strong className="text-slate-700">{result} {units[category][to]?.symbol}</strong></p>
        </section>
      </div>
    </ToolShell>
  );
}
