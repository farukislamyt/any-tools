"use client";

import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool-shell";

type Shape =
  | "round" | "square" | "rectangle" | "flat" | "hex" | "octagon" | "plate"
  | "pipe" | "tube" | "angle" | "channel" | "i-beam" | "h-beam" | "tee" | "z" | "wire";

type Material = keyof typeof materials;

const materials = {
  Steel: 7850,
  "Carbon steel": 7850,
  "Mild steel": 7850,
  "Stainless steel 304": 8000,
  "Stainless steel 316": 8000,
  "Galvanized steel": 7850,
  Cast iron: 7200,
  Wrought iron: 7750,
  Aluminum: 2700,
  "Aluminum 6061": 2700,
  "Aluminum 7075": 2810,
  Copper: 8960,
  Brass: 8500,
  Bronze: 8800,
  Zinc: 7140,
  Tin: 7310,
  Lead: 11340,
  Nickel: 8900,
  Titanium: 4500,
  Magnesium: 1740,
  Chromium: 7190,
  Cobalt: 8900,
  Manganese: 7210,
  Silver: 10490,
  Gold: 19320,
  Platinum: 21450,
} as const;

const shapes: { value: Shape; label: string }[] = [
  { value: "round", label: "Round bar" },
  { value: "square", label: "Square bar" },
  { value: "rectangle", label: "Rectangle bar" },
  { value: "flat", label: "Flat bar" },
  { value: "hex", label: "Hex bar" },
  { value: "octagon", label: "Octagonal bar" },
  { value: "plate", label: "Plate / sheet" },
  { value: "wire", label: "Wire / rod" },
  { value: "pipe", label: "Round pipe" },
  { value: "tube", label: "Square / rectangular tube" },
  { value: "angle", label: "Angle / L-section" },
  { value: "channel", label: "Channel / C-section" },
  { value: "i-beam", label: "I-beam" },
  { value: "h-beam", label: "H-beam" },
  { value: "tee", label: "T-section" },
  { value: "z", label: "Z-section" },
];

const inputClass = "mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100";
const positive = (v: string) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : 0; };

export default function MetalWeightPage() {
  const [material, setMaterial] = useState<Material>("Steel");
  const [shape, setShape] = useState<Shape>("round");
  const [size, setSize] = useState("25");
  const [size2, setSize2] = useState("10");
  const [thickness, setThickness] = useState("2");
  const [flange, setFlange] = useState("50");
  const [web, setWeb] = useState("5");
  const [length, setLength] = useState("1000");
  const [unit, setUnit] = useState<"mm" | "cm" | "m" | "in">("mm");

  const result = useMemo(() => {
    const a = positive(size), b = positive(size2), t = positive(thickness);
    const f = positive(flange), w = positive(web), l = positive(length);
    const factor = { mm: 1, cm: 10, m: 1000, in: 25.4 }[unit];
    const x = a * factor, y = b * factor, wall = t * factor, fl = f * factor, wd = w * factor, len = l * factor;
    let area = 0;

    // Cross-sectional area in mm². Formulas assume sharp-corner theoretical sections;
    // real rolled sections should use manufacturer tables for exact mass.
    if (["round", "wire"].includes(shape)) area = Math.PI * (x / 2) ** 2;
    if (shape === "square") area = x ** 2;
    if (["rectangle", "flat", "plate"].includes(shape)) area = x * y;
    if (shape === "hex") area = (3 * Math.sqrt(3) * x ** 2) / 8; // x = across-corners
    if (shape === "octagon") area = 2 * (1 + Math.sqrt(2)) * (x / 2) ** 2; // x = across-flats
    if (shape === "pipe") area = Math.PI * ((x / 2) ** 2 - Math.max(0, (x - 2 * wall) / 2) ** 2);
    if (shape === "tube") area = x * y - Math.max(0, x - 2 * wall) * Math.max(0, y - 2 * wall);
    if (shape === "angle") area = 2 * fl * wall - wall ** 2;
    if (shape === "channel") area = 2 * fl * wall + Math.max(0, x - wall) * wd;
    if (["i-beam", "h-beam"].includes(shape)) area = 2 * fl * wall + Math.max(0, x - 2 * wall) * wd;
    if (shape === "tee") area = fl * wall + Math.max(0, x - wall) * wd;
    if (shape === "z") area = 2 * fl * wall + Math.max(0, x - 2 * wall) * wd;

    const two = ["rectangle", "flat", "plate", "tube"].includes(shape);
    const structural = ["angle", "channel", "i-beam", "h-beam", "tee", "z"].includes(shape);
    const valid = a > 0 && l > 0 && area > 0 && (!two || b > 0) && (!structural || (f > 0 && w > 0 && t > 0));
    const kg = valid ? area * len * materials[material] / 1e9 : 0;
    return { kg, tonnes: kg / 1000 };
  }, [material, shape, size, size2, thickness, flange, web, length, unit]);

  const twoDimensions = ["rectangle", "flat", "plate", "tube"].includes(shape);
  const hollow = ["pipe", "tube"].includes(shape);
  const structural = ["angle", "channel", "i-beam", "h-beam", "tee", "z"].includes(shape);
  const primary = ["round", "pipe", "hex", "octagon", "wire"].includes(shape) ? "Diameter / size" : "Width / height";
  const reset = () => {
    setMaterial("Steel"); setShape("round"); setSize("25"); setSize2("10"); setThickness("2");
    setFlange("50"); setWeb("5"); setLength("1000"); setUnit("mm");
  };

  return <ToolShell title="Metal Weight Calculator" description="Calculate estimated weight for common metals, bars, plates, pipes, tubes and structural sections using dimensions, length and material density.">
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div><h2 className="text-lg font-semibold text-slate-950">Dimensions & material</h2><p className="mt-1 text-sm text-slate-500">Choose a common metal and everyday stock profile.</p></div>
          <button type="button" onClick={reset} className="text-sm font-medium text-slate-500 hover:text-slate-950">Reset</button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Material<select value={material} onChange={e => setMaterial(e.target.value as Material)} className={inputClass}>{Object.entries(materials).map(([name, density]) => <option key={name} value={name}>{name} · {density.toLocaleString()} kg/m³</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">Shape<select value={shape} onChange={e => setShape(e.target.value as Shape)} className={inputClass}>{shapes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">{primary} ({unit})<input inputMode="decimal" min="0" value={size} onChange={e => setSize(e.target.value)} className={inputClass} /></label>
          {twoDimensions && <label className="text-sm font-medium text-slate-700">{shape === "tube" ? "Height" : shape === "rectangle" ? "Height" : shape === "plate" || shape === "flat" ? "Thickness" : "Height"} ({unit})<input inputMode="decimal" min="0" value={size2} onChange={e => setSize2(e.target.value)} className={inputClass} /></label>}
          {hollow && <label className="text-sm font-medium text-slate-700">Wall thickness ({unit})<input inputMode="decimal" min="0" value={thickness} onChange={e => setThickness(e.target.value)} className={inputClass} /></label>}
          {structural && <>
            <label className="text-sm font-medium text-slate-700">Flange width ({unit})<input inputMode="decimal" min="0" value={flange} onChange={e => setFlange(e.target.value)} className={inputClass} /></label>
            <label className="text-sm font-medium text-slate-700">Web thickness ({unit})<input inputMode="decimal" min="0" value={web} onChange={e => setWeb(e.target.value)} className={inputClass} /></label>
            <label className="text-sm font-medium text-slate-700">Section thickness ({unit})<input inputMode="decimal" min="0" value={thickness} onChange={e => setThickness(e.target.value)} className={inputClass} /></label>
          </>}
          <label className="text-sm font-medium text-slate-700">Length ({unit})<input inputMode="decimal" min="0" value={length} onChange={e => setLength(e.target.value)} className={inputClass} /></label>
          <label className="text-sm font-medium text-slate-700">Dimension unit<select value={unit} onChange={e => setUnit(e.target.value as typeof unit)} className={inputClass}><option value="mm">Millimeters (mm)</option><option value="cm">Centimeters (cm)</option><option value="m">Meters (m)</option><option value="in">Inches (in)</option></select></label>
        </div>
        <div className="mt-7 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"><p className="font-medium text-slate-800">Engineering note</p><p className="mt-1 leading-6">Weight = cross-sectional area × length × density. Values are estimates. Alloy composition, corner radii, coatings and rolling tolerances can change actual mass. For certified structural quantities, use the section manufacturer&apos;s mass-per-metre table.</p></div>
      </section>
      <aside className="h-fit rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-7 lg:sticky lg:top-6">
        <p className="text-sm text-slate-400">Estimated weight</p><div className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{result.kg.toFixed(3)} <span className="text-lg font-medium text-slate-400">kg</span></div>
        <p className="mt-2 text-sm text-slate-500">{result.tonnes.toFixed(4)} tonnes</p>
        <div className="mt-7 border-t border-slate-800 pt-5 text-sm"><div className="flex justify-between gap-4"><span className="text-slate-400">Material</span><span>{material}</span></div><div className="mt-3 flex justify-between gap-4"><span className="text-slate-400">Profile</span><span>{shapes.find(s => s.value === shape)?.label}</span></div><div className="mt-3 flex justify-between gap-4"><span className="text-slate-400">Density</span><span>{materials[material].toLocaleString()} kg/m³</span></div></div>
      </aside>
    </div>
    <section className="mt-8 max-w-3xl"><h2 className="text-xl font-semibold text-slate-950">Common metals and profiles</h2><p className="mt-2 text-sm leading-6 text-slate-600">AnyTools now covers common ferrous and non-ferrous metals plus everyday stock forms: round, square, flat, rectangular, hexagonal and octagonal bars; plate and sheet; wire; pipes and hollow tubes; and common L, C, I, H, T and Z structural sections.</p></section>
  </ToolShell>;
}
