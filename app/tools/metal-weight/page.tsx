"use client";

import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool-shell";
import { sectionFamilies, steelSections } from "@/lib/steel-sections";

type Mode = "standard" | "custom";
type Shape =
  | "round" | "square" | "rectangle" | "flat" | "hex" | "octagon" | "plate" | "pipe" | "tube"
  | "angle" | "channel" | "i-beam" | "h-beam" | "tee" | "z" | "wire";
type Material = keyof typeof materials;
type Unit = "mm" | "cm" | "m" | "in" | "ft";

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

const units: { value: Unit; label: string }[] = [
  { value: "mm", label: "mm" }, { value: "cm", label: "cm" }, { value: "m", label: "m" },
  { value: "in", label: "in" }, { value: "ft", label: "ft" },
];

const inputClass = "mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100";
const positive = (v: string) => { const n = Number(v); return Number.isFinite(n) && n > 0 ? n : 0; };
const toMm = (value: string, unit: Unit) => positive(value) * ({ mm: 1, cm: 10, m: 1000, in: 25.4, ft: 304.8 }[unit]);

function DimensionInput({ label, value, unit, onValue, onUnit }: { label: string; value: string; unit: Unit; onValue: (v: string) => void; onUnit: (u: Unit) => void }) {
  return <label className="text-sm font-medium text-slate-700">
    {label}
    <div className="mt-2 grid grid-cols-[minmax(0,1fr)_92px] gap-2">
      <input inputMode="decimal" min="0" value={value} onChange={e => onValue(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100" />
      <select value={unit} onChange={e => onUnit(e.target.value as Unit)} className="h-12 rounded-xl border border-slate-200 bg-white px-2 text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100">
        {units.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
      </select>
    </div>
  </label>;
}

export default function MetalWeightPage() {
  const [mode, setMode] = useState<Mode>("standard");
  const [family, setFamily] = useState<(typeof sectionFamilies)[number]>("ISMB");
  const [designation, setDesignation] = useState("ISMB 200");
  const [quantity, setQuantity] = useState("1");
  const [length, setLength] = useState("6");
  const [lengthUnit, setLengthUnit] = useState<Unit>("m");

  const [material, setMaterial] = useState<Material>("Steel");
  const [shape, setShape] = useState<Shape>("round");
  const [size, setSize] = useState("25");
  const [sizeUnit, setSizeUnit] = useState<Unit>("mm");
  const [size2, setSize2] = useState("10");
  const [size2Unit, setSize2Unit] = useState<Unit>("mm");
  const [thickness, setThickness] = useState("2");
  const [thicknessUnit, setThicknessUnit] = useState<Unit>("mm");
  const [flange, setFlange] = useState("50");
  const [flangeUnit, setFlangeUnit] = useState<Unit>("mm");
  const [flangeThickness, setFlangeThickness] = useState("5");
  const [flangeThicknessUnit, setFlangeThicknessUnit] = useState<Unit>("mm");
  const [web, setWeb] = useState("5");
  const [webUnit, setWebUnit] = useState<Unit>("mm");
  const [customLength, setCustomLength] = useState("1000");
  const [customLengthUnit, setCustomLengthUnit] = useState<Unit>("mm");
  const [customQuantity, setCustomQuantity] = useState("1");

  const familySections = useMemo(() => steelSections.filter(s => s.family === family), [family]);
  const selectedStandard = steelSections.find(s => s.designation === designation) ?? familySections[0];

  const standardResult = useMemo(() => {
    const meters = toMm(length, lengthUnit) / 1000;
    const pieces = Math.max(1, Math.floor(positive(quantity)));
    const kgPerM = selectedStandard?.massKgPerM ?? 0;
    const pieceKg = kgPerM * meters;
    return { meters, pieces, kgPerM, pieceKg, totalKg: pieceKg * pieces };
  }, [designation, length, lengthUnit, quantity, selectedStandard]);

  const customResult = useMemo(() => {
    const a = toMm(size, sizeUnit);
    const b = toMm(size2, size2Unit);
    const t = toMm(thickness, thicknessUnit);
    const f = toMm(flange, flangeUnit);
    const ft = toMm(flangeThickness, flangeThicknessUnit);
    const w = toMm(web, webUnit);
    const l = toMm(customLength, customLengthUnit);
    let area = 0;

    if (["round", "wire"].includes(shape)) area = Math.PI * (a / 2) ** 2;
    if (shape === "square") area = a ** 2;
    if (["rectangle"].includes(shape)) area = a * b;
    if (["flat", "plate"].includes(shape)) area = a * b;
    if (shape === "hex") area = (3 * Math.sqrt(3) * a ** 2) / 8;
    if (shape === "octagon") area = 2 * (1 + Math.sqrt(2)) * (a / 2) ** 2;
    if (shape === "pipe") area = Math.PI * ((a / 2) ** 2 - Math.max(0, (a - 2 * t) / 2) ** 2);
    if (shape === "tube") area = a * b - Math.max(0, a - 2 * t) * Math.max(0, b - 2 * t);
    if (shape === "angle") area = 2 * a * t + 2 * b * t - t ** 2;
    if (["channel", "i-beam", "h-beam"].includes(shape)) area = 2 * f * ft + Math.max(0, a - 2 * ft) * w;
    if (shape === "tee") area = f * ft + Math.max(0, a - ft) * w;
    if (shape === "z") area = 2 * f * ft + Math.max(0, a - 2 * ft) * w;

    const pieces = Math.max(1, Math.floor(positive(customQuantity)));
    const valid = a > 0 && l > 0 && area > 0;
    const pieceKg = valid ? area * l * materials[material] / 1e9 : 0;
    return { pieceKg, totalKg: pieceKg * pieces, tonnes: (pieceKg * pieces) / 1000, pieces };
  }, [material, shape, size, sizeUnit, size2, size2Unit, thickness, thicknessUnit, flange, flangeUnit, flangeThickness, flangeThicknessUnit, web, webUnit, customLength, customLengthUnit, customQuantity]);

  const reset = () => {
    setMode("standard"); setFamily("ISMB"); setDesignation("ISMB 200"); setQuantity("1"); setLength("6"); setLengthUnit("m");
    setMaterial("Steel"); setShape("round"); setSize("25"); setSizeUnit("mm"); setSize2("10"); setSize2Unit("mm");
    setThickness("2"); setThicknessUnit("mm"); setFlange("50"); setFlangeUnit("mm"); setFlangeThickness("5"); setFlangeThicknessUnit("mm");
    setWeb("5"); setWebUnit("mm"); setCustomLength("1000"); setCustomLengthUnit("mm"); setCustomQuantity("1");
  };

  const structural = ["angle", "channel", "i-beam", "h-beam", "tee", "z"].includes(shape);
  const hollow = ["pipe", "tube"].includes(shape);
  const twoDimensions = ["rectangle", "flat", "plate", "tube"].includes(shape);
  const shapeLabel = shapes.find(s => s.value === shape)?.label;

  return <ToolShell title="Metal Weight Calculator" description="Calculate metal weight using standard Indian rolled sections or flexible custom dimensions for common metals and stock shapes.">
    <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => setMode("standard")} className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${mode === "standard" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"}`}>Standard steel sections</button>
        <button type="button" onClick={() => setMode("custom")} className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${mode === "custom" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"}`}>Custom dimensions</button>
      </div>
    </div>

    {mode === "standard" ? <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold text-slate-950">Standard rolled section</h2><p className="mt-1 text-sm text-slate-500">Choose a catalogue section; its standard mass per metre is used.</p></div><button type="button" onClick={reset} className="text-sm font-medium text-slate-500 hover:text-slate-950">Reset</button></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Section family<select value={family} onChange={e => { const next = e.target.value as typeof family; setFamily(next); setDesignation(steelSections.find(s => s.family === next)?.designation ?? ""); }} className={inputClass}>{sectionFamilies.map(f => <option key={f} value={f}>{f}</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">Section designation<select value={designation} onChange={e => setDesignation(e.target.value)} className={inputClass}>{familySections.map(s => <option key={s.designation} value={s.designation}>{s.designation} · {s.massKgPerM} kg/m</option>)}</select></label>
          <DimensionInput label="Length per piece" value={length} unit={lengthUnit} onValue={setLength} onUnit={setLengthUnit} />
          <label className="text-sm font-medium text-slate-700">Number of pieces<input inputMode="numeric" min="1" step="1" value={quantity} onChange={e => setQuantity(e.target.value)} className={inputClass} /></label>
        </div>
        <div className="mt-7 grid gap-3 rounded-2xl bg-slate-50 p-4 text-sm sm:grid-cols-3"><div><p className="text-xs text-slate-400">Standard mass</p><p className="mt-1 font-semibold text-slate-900">{selectedStandard?.massKgPerM ?? 0} kg/m</p></div><div><p className="text-xs text-slate-400">Nominal depth</p><p className="mt-1 font-semibold text-slate-900">{selectedStandard?.depthMm ? `${selectedStandard.depthMm} mm` : "—"}</p></div><div><p className="text-xs text-slate-400">Nominal width</p><p className="mt-1 font-semibold text-slate-900">{selectedStandard?.widthMm ? `${selectedStandard.widthMm} mm` : "—"}</p></div></div>
        <p className="mt-5 text-xs leading-5 text-slate-500">Catalogue values are intended for quantity and weight estimation. For fabrication, procurement or structural design, verify the applicable standard and mill certificate.</p>
      </section>
      <aside className="h-fit rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-7 lg:sticky lg:top-6"><p className="text-sm text-slate-400">Total estimated weight</p><div className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{standardResult.totalKg.toFixed(3)} <span className="text-lg font-medium text-slate-400">kg</span></div><p className="mt-2 text-sm text-slate-500">{(standardResult.totalKg / 1000).toFixed(4)} tonnes</p><div className="mt-7 border-t border-slate-800 pt-5 text-sm"><div className="flex justify-between gap-4"><span className="text-slate-400">Section</span><span>{selectedStandard?.designation}</span></div><div className="mt-3 flex justify-between"><span className="text-slate-400">Piece weight</span><span>{standardResult.pieceKg.toFixed(3)} kg</span></div><div className="mt-3 flex justify-between"><span className="text-slate-400">Quantity</span><span>{standardResult.pieces}</span></div></div></aside>
    </div> : <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold text-slate-950">Custom dimensions</h2><p className="mt-1 text-sm text-slate-500">Select a shape and only the dimensions that shape needs will appear.</p></div><button type="button" onClick={reset} className="text-sm font-medium text-slate-500 hover:text-slate-950">Reset</button></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Material<select value={material} onChange={e => setMaterial(e.target.value as Material)} className={inputClass}>{Object.entries(materials).map(([name, density]) => <option key={name} value={name}>{name} · {density.toLocaleString()} kg/m³</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">Shape<select value={shape} onChange={e => setShape(e.target.value as Shape)} className={inputClass}>{shapes.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}</select></label>

          {shape === "round" || shape === "wire" ? <DimensionInput label={shape === "wire" ? "Diameter" : "Diameter"} value={size} unit={sizeUnit} onValue={setSize} onUnit={setSizeUnit} /> : null}
          {shape === "square" ? <DimensionInput label="Side" value={size} unit={sizeUnit} onValue={setSize} onUnit={setSizeUnit} /> : null}
          {shape === "rectangle" ? <><DimensionInput label="Side A / Width" value={size} unit={sizeUnit} onValue={setSize} onUnit={setSizeUnit} /><DimensionInput label="Side B / Height" value={size2} unit={size2Unit} onValue={setSize2} onUnit={setSize2Unit} /></> : null}
          {shape === "flat" || shape === "plate" ? <><DimensionInput label="Width" value={size} unit={sizeUnit} onValue={setSize} onUnit={setSizeUnit} /><DimensionInput label="Thickness" value={size2} unit={size2Unit} onValue={setSize2} onUnit={setSize2Unit} /></> : null}
          {shape === "hex" ? <DimensionInput label="Across corners" value={size} unit={sizeUnit} onValue={setSize} onUnit={setSizeUnit} /> : null}
          {shape === "octagon" ? <DimensionInput label="Across flats" value={size} unit={sizeUnit} onValue={setSize} onUnit={setSizeUnit} /> : null}
          {shape === "pipe" ? <><DimensionInput label="Outside diameter" value={size} unit={sizeUnit} onValue={setSize} onUnit={setSizeUnit} /><DimensionInput label="Wall thickness" value={thickness} unit={thicknessUnit} onValue={setThickness} onUnit={setThicknessUnit} /></> : null}
          {shape === "tube" ? <><DimensionInput label="Outside width" value={size} unit={sizeUnit} onValue={setSize} onUnit={setSizeUnit} /><DimensionInput label="Outside height" value={size2} unit={size2Unit} onValue={setSize2} onUnit={setSize2Unit} /><DimensionInput label="Wall thickness" value={thickness} unit={thicknessUnit} onValue={setThickness} onUnit={setThicknessUnit} /></> : null}
          {shape === "angle" ? <><DimensionInput label="Side A" value={size} unit={sizeUnit} onValue={setSize} onUnit={setSizeUnit} /><DimensionInput label="Side B" value={size2} unit={size2Unit} onValue={setSize2} onUnit={setSize2Unit} /><DimensionInput label="Thickness" value={thickness} unit={thicknessUnit} onValue={setThickness} onUnit={setThicknessUnit} /></> : null}
          {structural && shape !== "angle" ? <><DimensionInput label="Overall depth / height" value={size} unit={sizeUnit} onValue={setSize} onUnit={setSizeUnit} /><DimensionInput label="Flange width" value={flange} unit={flangeUnit} onValue={setFlange} onUnit={setFlangeUnit} /><DimensionInput label="Flange thickness" value={flangeThickness} unit={flangeThicknessUnit} onValue={setFlangeThickness} onUnit={setFlangeThicknessUnit} /><DimensionInput label="Web thickness" value={web} unit={webUnit} onValue={setWeb} onUnit={setWebUnit} /></> : null}

          <DimensionInput label="Length" value={customLength} unit={customLengthUnit} onValue={setCustomLength} onUnit={setCustomLengthUnit} />
          <label className="text-sm font-medium text-slate-700">Number of pieces<input inputMode="numeric" min="1" step="1" value={customQuantity} onChange={e => setCustomQuantity(e.target.value)} className={inputClass} /></label>
        </div>

        <div className="mt-7 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600"><p className="font-medium text-slate-800">Flexible units</p><p className="mt-1 leading-6">Every dimension has its own unit selector. You can mix mm, cm, m, inches and feet—for example, 50 mm × 2 in × 6 ft.</p></div>
        <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900"><p className="font-medium">Engineering note</p><p className="mt-1 leading-6">Custom mode uses idealized geometry × material density. Rolled structural profiles can differ because of fillets, slopes and manufacturing tolerances; use a verified catalogue mass when an exact standard section is available.</p></div>
      </section>
      <aside className="h-fit rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-7 lg:sticky lg:top-6"><p className="text-sm text-slate-400">Estimated weight</p><div className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{customResult.totalKg.toFixed(3)} <span className="text-lg font-medium text-slate-400">kg</span></div><p className="mt-2 text-sm text-slate-500">{customResult.tonnes.toFixed(4)} tonnes</p><div className="mt-7 border-t border-slate-800 pt-5 text-sm"><div className="flex justify-between gap-4"><span className="text-slate-400">Material</span><span>{material}</span></div><div className="mt-3 flex justify-between gap-4"><span className="text-slate-400">Shape</span><span>{shapeLabel}</span></div><div className="mt-3 flex justify-between gap-4"><span className="text-slate-400">Piece weight</span><span>{customResult.pieceKg.toFixed(3)} kg</span></div><div className="mt-3 flex justify-between gap-4"><span className="text-slate-400">Quantity</span><span>{customResult.pieces}</span></div></div></aside>
    </div>}

    <section className="mt-8 max-w-3xl"><h2 className="text-xl font-semibold text-slate-950">How the calculator works</h2><p className="mt-2 text-sm leading-6 text-slate-600">The interface changes with the selected shape, so users only see the dimensions required for that geometry. All dimensions are converted internally to millimetres before area, volume and weight are calculated.</p></section>
  </ToolShell>;
}
