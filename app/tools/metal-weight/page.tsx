"use client";

import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool-shell";

type Shape = "round" | "square" | "rectangle" | "flat" | "hex" | "plate" | "pipe" | "tube";
const materials = { Steel: 7850, "Stainless Steel": 8000, Aluminum: 2700, Copper: 8960, Brass: 8500, "Cast iron": 7200 } as const;
const shapes: { value: Shape; label: string }[] = [
  { value: "round", label: "Round bar" }, { value: "square", label: "Square bar" },
  { value: "rectangle", label: "Rectangle bar" }, { value: "flat", label: "Flat bar" },
  { value: "hex", label: "Hex bar" }, { value: "plate", label: "Plate / sheet" },
  { value: "pipe", label: "Round pipe" }, { value: "tube", label: "Square tube" },
];
const inputClass = "mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100";
const positive = (v: string) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : 0; };

export default function MetalWeightPage() {
  const [material, setMaterial] = useState<keyof typeof materials>("Steel");
  const [shape, setShape] = useState<Shape>("round");
  const [size, setSize] = useState("25");
  const [size2, setSize2] = useState("10");
  const [thickness, setThickness] = useState("2");
  const [length, setLength] = useState("1000");
  const [unit, setUnit] = useState<"mm" | "cm" | "m" | "in">("mm");

  const result = useMemo(() => {
    const a = positive(size), b = positive(size2), t = positive(thickness), l = positive(length);
    const factor = { mm: 1, cm: 10, m: 1000, in: 25.4 }[unit];
    const x = a * factor, y = b * factor, wall = t * factor, lengthMm = l * factor;
    let area = 0;
    if (shape === "round") area = Math.PI * (x / 2) ** 2;
    if (shape === "square") area = x ** 2;
    if (["rectangle", "plate", "flat"].includes(shape)) area = x * y;
    if (shape === "hex") area = (3 * Math.sqrt(3) * x ** 2) / 8;
    if (shape === "pipe") area = Math.PI * ((x / 2) ** 2 - ((x - 2 * wall) / 2) ** 2);
    if (shape === "tube") area = x ** 2 - (x - 2 * wall) ** 2;
    const valid = a > 0 && l > 0 && area > 0 && (!["rectangle", "plate", "flat"].includes(shape) || b > 0) && (!["pipe", "tube"].includes(shape) || (t > 0 && wall * 2 < x));
    const kg = valid ? area * lengthMm * materials[material] / 1e9 : 0;
    return { kg, tonnes: kg / 1000 };
  }, [material, shape, size, size2, thickness, length, unit]);

  const twoDimensions = ["rectangle", "plate", "flat"].includes(shape);
  const hollow = ["pipe", "tube"].includes(shape);
  const primary = ["round", "pipe", "hex"].includes(shape) ? "Diameter / size" : "Width / size";
  const reset = () => { setMaterial("Steel"); setShape("round"); setSize("25"); setSize2("10"); setThickness("2"); setLength("1000"); setUnit("mm"); };

  return <ToolShell title="Metal Weight Calculator" description="Calculate the approximate weight of metal bars, plates, sheets, pipes and tubes from dimensions, length and material.">
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold text-slate-950">Dimensions</h2><p className="mt-1 text-sm text-slate-500">Enter the material and profile dimensions.</p></div><button type="button" onClick={reset} className="text-sm font-medium text-slate-500 hover:text-slate-950">Reset</button></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Material<select value={material} onChange={e => setMaterial(e.target.value as keyof typeof materials)} className={inputClass}>{Object.entries(materials).map(([name, density]) => <option key={name} value={name}>{name} · {density.toLocaleString()} kg/m³</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">Shape<select value={shape} onChange={e => setShape(e.target.value as Shape)} className={inputClass}>{shapes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">{primary} ({unit})<input inputMode="decimal" min="0" value={size} onChange={e => setSize(e.target.value)} className={inputClass} /></label>
          {twoDimensions && <label className="text-sm font-medium text-slate-700">{shape === "rectangle" ? "Height" : "Thickness"} ({unit})<input inputMode="decimal" min="0" value={size2} onChange={e => setSize2(e.target.value)} className={inputClass} /></label>}
          {hollow && <label className="text-sm font-medium text-slate-700">Wall thickness ({unit})<input inputMode="decimal" min="0" value={thickness} onChange={e => setThickness(e.target.value)} className={inputClass} /></label>}
          <label className="text-sm font-medium text-slate-700">Length ({unit})<input inputMode="decimal" min="0" value={length} onChange={e => setLength(e.target.value)} className={inputClass} /></label>
          <label className="text-sm font-medium text-slate-700">Dimension unit<select value={unit} onChange={e => setUnit(e.target.value as typeof unit)} className={inputClass}><option value="mm">Millimeters (mm)</option><option value="cm">Centimeters (cm)</option><option value="m">Meters (m)</option><option value="in">Inches (in)</option></select></label>
        </div>
        <div className="mt-7 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"><p className="font-medium text-slate-800">Calculation</p><p className="mt-1 leading-6">Weight = volume × material density. Results are estimates and can vary with alloy grade and manufacturing tolerance.</p></div>
      </section>
      <aside className="h-fit rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-7 lg:sticky lg:top-6"><p className="text-sm text-slate-400">Estimated weight</p><div className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{result.kg.toFixed(3)} <span className="text-lg font-medium text-slate-400">kg</span></div><p className="mt-2 text-sm text-slate-500">{result.tonnes.toFixed(4)} tonnes</p><div className="mt-7 border-t border-slate-800 pt-5 text-sm"><div className="flex justify-between gap-4"><span className="text-slate-400">Material</span><span>{material}</span></div><div className="mt-3 flex justify-between gap-4"><span className="text-slate-400">Profile</span><span>{shapes.find(s => s.value === shape)?.label}</span></div><div className="mt-3 flex justify-between gap-4"><span className="text-slate-400">Density</span><span>{materials[material].toLocaleString()} kg/m³</span></div></div></aside>
    </div>
    <section className="mt-8 max-w-3xl"><h2 className="text-xl font-semibold text-slate-950">Metal weight calculation formula</h2><p className="mt-2 text-sm leading-6 text-slate-600">The calculator converts dimensions to millimeters, calculates cross-sectional area and volume, then applies the selected material density. It is useful for estimating stock weight before purchasing or fabrication.</p></section>
  </ToolShell>;
}
