"use client";

import { useMemo, useState } from "react";
import { steelSections, sectionFamilies } from "@/lib/steel-sections";

const input = "mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100";

export default function MetalWeightEmbed() {
  const [family, setFamily] = useState<(typeof sectionFamilies)[number]>("ISMB");
  const [designation, setDesignation] = useState("ISMB 200");
  const [length, setLength] = useState("6");
  const [quantity, setQuantity] = useState("1");
  const [theme, setTheme] = useState("light");

  const sections = useMemo(() => steelSections.filter(s => s.family === family), [family]);
  const selected = steelSections.find(s => s.designation === designation) ?? sections[0];
  const total = (Number(length) || 0) * (Number(quantity) || 0) * (selected?.massKgPerM || 0);

  return (
    <main className={theme === "dark" ? "min-h-screen bg-slate-950 p-4 text-white" : "min-h-screen bg-slate-50 p-4 text-slate-950"}>
      <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">AnyTools</p>
          <h1 className="mt-1 text-xl font-bold">Steel Weight Calculator</h1>
          <p className="mt-1 text-sm text-slate-500">Standard section mass × length × quantity</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">Section family<select className={input} value={family} onChange={e => { const f = e.target.value as typeof family; setFamily(f); setDesignation(steelSections.find(s => s.family === f)?.designation ?? ""); }}>{sectionFamilies.map(f => <option key={f}>{f}</option>)}</select></label>
          <label className="text-sm font-medium">Section<select className={input} value={designation} onChange={e => setDesignation(e.target.value)}>{sections.map(s => <option key={s.designation}>{s.designation} · {s.massKgPerM} kg/m</option>)}</select></label>
          <label className="text-sm font-medium">Length per piece (m)<input className={input} type="number" min="0" step="0.01" value={length} onChange={e => setLength(e.target.value)} /></label>
          <label className="text-sm font-medium">Quantity<input className={input} type="number" min="1" step="1" value={quantity} onChange={e => setQuantity(e.target.value)} /></label>
        </div>
        <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white">
          <p className="text-sm text-slate-400">Estimated total weight</p>
          <p className="mt-1 text-4xl font-bold">{total.toFixed(3)} <span className="text-base font-medium text-slate-400">kg</span></p>
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-800 pt-4 text-sm"><div><span className="block text-slate-500">Mass</span>{selected?.massKgPerM ?? 0} kg/m</div><div><span className="block text-slate-500">Piece</span>{((Number(length) || 0) * (selected?.massKgPerM || 0)).toFixed(3)} kg</div><div><span className="block text-slate-500">Qty</span>{Number(quantity) || 0}</div></div>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-400"><span>For estimation; verify applicable standard before procurement.</span><a href="https://any-tools.vercel.app/tools/metal-weight" target="_blank" rel="noreferrer" className="font-medium text-slate-600 hover:text-slate-950">Open full calculator ↗</a></div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: `try { const p=new URLSearchParams(location.search); const t=p.get('theme'); if(t) document.documentElement.dataset.embedTheme=t; window.parent.postMessage({type:'anytools-resize',height:document.documentElement.scrollHeight},'*'); } catch(e) {}` }} />
    </main>
  );
}
