"use client";

import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool-shell";

const materials = { Steel: 7850, "Stainless Steel": 8000, Aluminum: 2700, Copper: 8960, Brass: 8500 };
type Shape = "round" | "square" | "flat";

export default function MetalWeightPage() {
  const [material, setMaterial] = useState<keyof typeof materials>("Steel");
  const [shape, setShape] = useState<Shape>("round");
  const [size, setSize] = useState("25");
  const [thickness, setThickness] = useState("6");
  const [length, setLength] = useState("1000");

  const weight = useMemo(() => {
    const a = Number(size), t = Number(thickness), l = Number(length);
    if (!a || !l || a < 0 || l < 0 || (shape === "flat" && (!t || t < 0))) return 0;
    const area = shape === "round" ? Math.PI * (a / 2) ** 2 : shape === "square" ? a * a : a * t;
    return (area * l * materials[material]) / 1e9;
  }, [size, thickness, length, material, shape]);

  const sizeLabel = shape === "round" ? "Diameter (mm)" : shape === "square" ? "Side (mm)" : "Width (mm)";

  return <ToolShell title="Metal Weight Calculator" description="Estimate the weight of common metal bars from dimensions, length and material density.">
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Material<select value={material} onChange={e => setMaterial(e.target.value as keyof typeof materials)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-blue-500">{Object.keys(materials).map(m => <option key={m}>{m}</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">Shape<select value={shape} onChange={e => setShape(e.target.value as Shape)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-blue-500"><option value="round">Round bar</option><option value="square">Square bar</option><option value="flat">Flat bar</option></select></label>
          <label className="text-sm font-medium text-slate-700">{sizeLabel}<input inputMode="decimal" value={size} onChange={e => setSize(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-blue-500" /></label>
          {shape === "flat" && <label className="text-sm font-medium text-slate-700">Thickness (mm)<input inputMode="decimal" value={thickness} onChange={e => setThickness(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-blue-500" /></label>}
          <label className="text-sm font-medium text-slate-700">Length (mm)<input inputMode="decimal" value={length} onChange={e => setLength(e.target.value)} className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-3 outline-none focus:border-blue-500" /></label>
        </div>
        <p className="mt-6 text-xs leading-5 text-slate-400">Approximate result using standard material density. Actual weight can vary by grade, tolerance and composition.</p>
      </section>
      <aside className="rounded-3xl bg-slate-950 p-7 text-white shadow-sm"><p className="text-sm text-slate-400">Estimated weight</p><div className="mt-3 text-4xl font-bold tracking-tight">{weight.toFixed(3)} <span className="text-lg font-medium text-slate-400">kg</span></div><div className="mt-7 border-t border-slate-800 pt-5 text-sm text-slate-400"><div className="flex justify-between"><span>Density</span><span>{materials[material].toLocaleString()} kg/m³</span></div><div className="mt-3 flex justify-between"><span>Length</span><span>{Number(length || 0).toLocaleString()} mm</span></div></div></aside>
    </div>
  </ToolShell>;
}
