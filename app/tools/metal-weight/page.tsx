"use client";

import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool-shell";
import { sectionFamilies, steelSections } from "@/lib/steel-sections";

type Mode = "standard" | "custom";
type Shape = "round" | "square" | "rectangle" | "flat" | "hex" | "octagon" | "plate" | "pipe" | "tube" | "angle" | "channel" | "i-beam" | "h-beam" | "tee" | "z" | "wire";
type Material = keyof typeof materials;

const materials = {
  Steel: 7850, "Carbon steel": 7850, "Mild steel": 7850,
  "Stainless steel 304": 8000, "Stainless steel 316": 8000, "Galvanized steel": 7850,
  "Cast iron": 7200, "Wrought iron": 7750, Aluminum: 2700, "Aluminum 6061": 2700,
  "Aluminum 7075": 2810, Copper: 8960, Brass: 8500, Bronze: 8800, Zinc: 7140,
  Tin: 7310, Lead: 11340, Nickel: 8900, Titanium: 4500, Magnesium: 1740,
  Chromium: 7190, Cobalt: 8900, Manganese: 7210, Silver: 10490, Gold: 19320, Platinum: 21450,
} as const;

const shapes: { value: Shape; label: string }[] = [
  { value: "round", label: "Round bar" }, { value: "square", label: "Square bar" },
  { value: "rectangle", label: "Rectangle bar" }, { value: "flat", label: "Flat bar" },
  { value: "hex", label: "Hex bar" }, { value: "octagon", label: "Octagonal bar" },
  { value: "plate", label: "Plate / sheet" }, { value: "wire", label: "Wire / rod" },
  { value: "pipe", label: "Round pipe" }, { value: "tube", label: "Square / rectangular tube" },
  { value: "angle", label: "Angle / L-section" }, { value: "channel", label: "Channel / C-section" },
  { value: "i-beam", label: "I-beam" }, { value: "h-beam", label: "H-beam" },
  { value: "tee", label: "T-section" }, { value: "z", label: "Z-section" },
];

const inputClass = "mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100";
const positive = (v: string) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : 0; };

export default function MetalWeightPage() {
  const [mode, setMode] = useState<Mode>("standard");
  const [family, setFamily] = useState<(typeof sectionFamilies)[number]>("ISMB");
  const [designation, setDesignation] = useState("ISMB 200");
  const [quantity, setQuantity] = useState("1");
  const [length, setLength] = useState("6");
  const [lengthUnit, setLengthUnit] = useState<"m" | "ft" | "mm">("m");

  const [material, setMaterial] = useState<Material>("Steel");
  const [shape, setShape] = useState<Shape>("round");
  const [size, setSize] = useState("25");
  const [size2, setSize2] = useState("10");
  const [thickness, setThickness] = useState("2");
  const [flange, setFlange] = useState("50");
  const [web, setWeb] = useState("5");
  const [customLength, setCustomLength] = useState("1000");
  const [unit, setUnit] = useState<"mm" | "cm" | "m" | "in">("mm");

  const familySections = useMemo(() => steelSections.filter(s => s.family === family), [family]);
  const selectedStandard = steelSections.find(s => s.designation === designation) ?? familySections[0];

  const standardResult = useMemo(() => {
    const meters = positive(length) * ({ m: 1, ft: 0.3048, mm: 0.001 }[lengthUnit]);
    const pieces = Math.max(1, Math.floor(positive(quantity)));
    const kgPerM = selectedStandard?.massKgPerM ?? 0;
    const pieceKg = kgPerM * meters;
    return { meters, pieces, kgPerM, pieceKg, totalKg: pieceKg * pieces };
  }, [designation, length, lengthUnit, quantity, selectedStandard]);

  const customResult = useMemo(() => {
    const a = positive(size), b = positive(size2), t = positive(thickness);
    const f = positive(flange), w = positive(web), l = positive(customLength);
    const factor = { mm: 1, cm: 10, m: 1000, in: 25.4 }[unit];
    const x = a * factor, y = b * factor, wall = t * factor, fl = f * factor, wd = w * factor, len = l * factor;
    let area = 0;
    if (["round", "wire"].includes(shape)) area = Math.PI * (x / 2) ** 2;
    if (shape === "square") area = x ** 2;
    if (["rectangle", "flat", "plate"].includes(shape)) area = x * y;
    if (shape === "hex") area = (3 * Math.sqrt(3) * x ** 2) / 8;
    if (shape === "octagon") area = 2 * (1 + Math.sqrt(2)) * (x / 2) ** 2;
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
  }, [material, shape, size, size2, thickness, flange, web, customLength, unit]);

  const twoDimensions = ["rectangle", "flat", "plate", "tube"].includes(shape);
  const hollow = ["pipe", "tube"].includes(shape);
  const structural = ["angle", "channel", "i-beam", "h-beam", "tee", "z"].includes(shape);
  const primary = ["round", "pipe", "hex", "octagon", "wire"].includes(shape) ? "Diameter / size" : "Width / height";
  const reset = () => {
    setMode("standard"); setFamily("ISMB"); setDesignation("ISMB 200"); setQuantity("1"); setLength("6"); setLengthUnit("m");
    setMaterial("Steel"); setShape("round"); setSize("25"); setSize2("10"); setThickness("2"); setFlange("50"); setWeb("5"); setCustomLength("1000"); setUnit("mm");
  };

  return <ToolShell title="Metal Weight Calculator" description="Calculate metal weight using standard Indian rolled steel sections or custom dimensions for common metals and stock shapes.">
    <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setMode("standard")} className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${mode === "standard" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"}`}>Standard steel sections</button>
        <button type="button" onClick={() => setMode("custom")} className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${mode === "custom" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"}`}>Custom dimensions</button>
      </div>
    </div>

    {mode === "standard" ? <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold text-slate-950">Standard rolled section</h2><p className="mt-1 text-sm text-slate-500">Select a catalogue section; weight uses its standard mass per metre.</p></div><button type="button" onClick={reset} className="text-sm font-medium text-slate-500 hover:text-slate-950">Reset</button></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Section family<select value={family} onChange={e => { const next = e.target.value as typeof family; setFamily(next); setDesignation(steelSections.find(s => s.family === next)?.designation ?? ""); }} className={inputClass}>{sectionFamilies.map(f => <option key={f} value={f}>{f}</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">Section designation<select value={designation} onChange={e => setDesignation(e.target.value)} className={inputClass}>{familySections.map(s => <option key={s.designation} value={s.designation}>{s.designation} · {s.massKgPerM} kg/m</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">Length per piece<input inputMode="decimal" min="0" value={length} onChange={e => setLength(e.target.value)} className={inputClass} /></label>
          <label className="text-sm font-medium text-slate-700">Length unit<select value={lengthUnit} onChange={e => setLengthUnit(e.target.value as typeof lengthUnit)} className={inputClass}><option value="m">Meters (m)</option><option value="ft">Feet (ft)</option><option value="mm">Millimeters (mm)</option></select></label>
          <label className="text-sm font-medium text-slate-700">Number of pieces<input inputMode="numeric" min="1" step="1" value={quantity} onChange={e => setQuantity(e.target.value)} className={inputClass} /></label>
        </div>
        <div className="mt-7 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-3">
          <div><p className="text-xs text-slate-400">Standard mass</p><p className="mt-1 font-semibold text-slate-900">{selectedStandard?.massKgPerM ?? 0} kg/m</p></div>
          <div><p className="text-xs text-slate-400">Nominal depth</p><p className="mt-1 font-semibold text-slate-900">{selectedStandard?.depthMm ? `${selectedStandard.depthMm} mm` : "—"}</p></div>
          <div><p className="text-xs text-slate-400">Nominal width</p><p className="mt-1 font-semibold text-slate-900">{selectedStandard?.widthMm ? `${selectedStandard.widthMm} mm` : "—"}</p></div>
        </div>
        <p className="mt-5 text-xs leading-5 text-slate-500">Catalogue values are intended for quantity and weight estimation. For fabrication, procurement or structural design, verify the current applicable standard and mill certificate.</p>
      </section>
      <aside className="h-fit rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-7 lg:sticky lg:top-6"><p className="text-sm text-slate-400">Total estimated weight</p><div className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{standardResult.totalKg.toFixed(3)} <span className="text-lg font-medium text-slate-400">kg</span></div><p className="mt-2 text-sm text-slate-500">{(standardResult.totalKg / 1000).toFixed(4)} tonnes</p><div className="mt-7 border-t border-slate-800 pt-5 text-sm"><div className="flex justify-between gap-4"><span className="text-slate-400">Section</span><span>{selectedStandard?.designation}</span></div><div className="mt-3 flex justify-between"><span className="text-slate-400">Piece weight</span><span>{standardResult.pieceKg.toFixed(3)} kg</span></div><div className="mt-3 flex justify-between"><span className="text-slate-400">Quantity</span><span>{standardResult.pieces}</span></div></div></aside>
    </div> : <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold text-slate-950">Custom dimensions</h2><p className="mt-1 text-sm text-slate-500">For non-standard bars, plates, pipes, tubes and profiles.</p></div><button type="button" onClick={reset} className="text-sm font-medium text-slate-500 hover:text-slate-950">Reset</button></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Material<select value={material} onChange={e => setMaterial(e.target.value as Material)} className={inputClass}>{Object.entries(materials).map(([name, density]) => <option key={name} value={name}>{name} · {density.toLocaleString()} kg/m³</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">Shape<select value={shape} onChange={e => setShape(e.target.value as Shape)} className={inputClass}>{shapes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">{primary} ({unit})<input inputMode="decimal" min="0" value={size} onChange={e => setSize(e.target.value)} className={inputClass} /></label>
          {twoDimensions && <label className="text-sm font-medium text-slate-700">{shape === "plate" || shape === "flat" ? "Thickness" : "Height"} ({unit})<input inputMode="decimal" min="0" value={size2} onChange={e => setSize2(e.target.value)} className={inputClass} /></label>}
          {hollow && <label className="text-sm font-medium text-slate-700">Wall thickness ({unit})<input inputMode="decimal" min="0" value={thickness} onChange={e => setThickness(e.target.value)} className={inputClass} /></label>}
          {structural && <><label className="text-sm font-medium text-slate-700">Flange width ({unit})<input inputMode="decimal" min="0" value={flange} onChange={e => setFlange(e.target.value)} className={inputClass} /></label><label className="text-sm font-medium text-slate-700">Web thickness ({unit})<input inputMode="decimal" min="0" value={web} onChange={e => setWeb(e.target.value)} className={inputClass} /></label><label className="text-sm font-medium text-slate-700">Section thickness ({unit})<input inputMode="decimal" min="0" value={thickness} onChange={e => setThickness(e.target.value)} className={inputClass} /></label></>}
          <label className="text-sm font-medium text-slate-700">Length ({unit})<input inputMode="decimal" min="0" value={customLength} onChange={e => setCustomLength(e.target.value)} className={inputClass} /></label>
          <label className="text-sm font-medium text-slate-700">Dimension unit<select value={unit} onChange={e => setUnit(e.target.value as typeof unit)} className={inputClass}><option value="mm">Millimeters (mm)</option><option value="cm">Centimeters (cm)</option><option value="m">Meters (m)</option><option value="in">Inches (in)</option></select></label>
        </div>
        <div className="mt-7 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"><p className="font-medium text-slate-800">Engineering note</p><p className="mt-1 leading-6">Custom mode uses geometry × density. Rolled structural sections can differ because of fillets, slopes and rolling tolerances; use Standard steel sections when a catalogue designation is available.</p></div>
      </section>
      <aside className="h-fit rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-7 lg:sticky lg:top-6"><p className="text-sm text-slate-400">Estimated weight</p><div className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{customResult.kg.toFixed(3)} <span className="text-lg font-medium text-slate-400">kg</span></div><p className="mt-2 text-sm text-slate-500">{customResult.tonnes.toFixed(4)} tonnes</p><div className="mt-7 border-t border-slate-800 pt-5 text-sm"><div className="flex justify-between gap-4"><span className="text-slate-400">Material</span><span>{material}</span></div><div className="mt-3 flex justify-between gap-4"><span className="text-slate-400">Profile</span><span>{shapes.find(s => s.value === shape)?.label}</span></div><div className="mt-3 flex justify-between gap-4"><span className="text-slate-400">Density</span><span>{materials[material].toLocaleString()} kg/m³</span></div></div></aside>
    </div>}

    <section className="mt-8 max-w-3xl"><h2 className="text-xl font-semibold text-slate-950">Standard section coverage</h2><p className="mt-2 text-sm leading-6 text-slate-600">The standard mode currently includes common ISMB medium beams, ISWB wide-flange beams, ISMC channels and ISA equal angles. The data model is intentionally separated from the calculator so additional IS 808, IS 1161 and IS 4923 catalogues can be added without changing the calculation engine.</p></section>
  </ToolShell>;
}
