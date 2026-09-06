"use client";

import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool-shell";
import { sectionFamilies, steelSections } from "@/lib/steel-sections";
import {
  calculateMetalWeightKg,
  calculatePlateWeightKg,
  metalWeightUnits,
  shapeDefinitions,
  shapeOptions,
  toMillimetres,
  type DimensionKey,
  type MetalWeightShape,
  type MetalWeightUnit,
} from "@/lib/metal-weight";

type Mode = "standard" | "custom";
type Material = keyof typeof materials;
type DimensionState = Record<DimensionKey, { value: string; unit: MetalWeightUnit }>;

const materials = {
  Steel: 7850, "Carbon steel": 7850, "Mild steel": 7850,
  "Stainless steel 304": 8000, "Stainless steel 316": 8000, "Galvanized steel": 7850,
  "Cast iron": 7200, "Wrought iron": 7750, Aluminum: 2700, "Aluminum 6061": 2700,
  "Aluminum 7075": 2810, Copper: 8960, Brass: 8500, Bronze: 8800, Zinc: 7140,
  Tin: 7310, Lead: 11340, Nickel: 8900, Titanium: 4500, Magnesium: 1740,
  Chromium: 7190, Cobalt: 8900, Manganese: 7210, Silver: 10490, Gold: 19320, Platinum: 21450,
} as const;

const initialDimensions = (): DimensionState => ({
  diameter: { value: "25", unit: "mm" }, side: { value: "25", unit: "mm" },
  width: { value: "50", unit: "mm" }, height: { value: "10", unit: "mm" }, length: { value: "1000", unit: "mm" },
  acrossCorners: { value: "25", unit: "mm" }, acrossFlats: { value: "25", unit: "mm" },
  outerDiameter: { value: "50", unit: "mm" }, wallThickness: { value: "2", unit: "mm" },
  sideA: { value: "50", unit: "mm" }, sideB: { value: "50", unit: "mm" }, depth: { value: "100", unit: "mm" },
  flangeWidth: { value: "50", unit: "mm" }, flangeThickness: { value: "5", unit: "mm" }, webThickness: { value: "5", unit: "mm" },
});

const inputClass = "mt-1.5 h-11 w-full border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100";

function DimensionInput({ label, state, onChange }: { label: string; state: { value: string; unit: MetalWeightUnit }; onChange: (next: { value: string; unit: MetalWeightUnit }) => void }) {
  return <label className="text-sm font-medium text-slate-700">
    {label}
    <div className="mt-1.5 grid grid-cols-[minmax(0,1fr)_82px] gap-1.5">
      <input inputMode="decimal" min="0" value={state.value} onChange={e => onChange({ ...state, value: e.target.value })} className="h-11 w-full border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100" />
      <select value={state.unit} onChange={e => onChange({ ...state, unit: e.target.value as MetalWeightUnit })} className="h-11 border border-slate-200 bg-white px-2 text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100">
        {metalWeightUnits.map(unit => <option key={unit.value} value={unit.value}>{unit.label}</option>)}
      </select>
    </div>
  </label>;
}

export default function MetalWeightPage() {
  const [mode, setMode] = useState<Mode>("standard");
  const [family, setFamily] = useState<(typeof sectionFamilies)[number]>("ISMB");
  const [designation, setDesignation] = useState("ISMB 200");
  const [standardLength, setStandardLength] = useState({ value: "6", unit: "m" as MetalWeightUnit });
  const [standardQuantity, setStandardQuantity] = useState("1");
  const [material, setMaterial] = useState<Material>("Steel");
  const [shape, setShape] = useState<MetalWeightShape>("round");
  const [dimensions, setDimensions] = useState<DimensionState>(initialDimensions);
  const [customLength, setCustomLength] = useState({ value: "1000", unit: "mm" as MetalWeightUnit });
  const [customQuantity, setCustomQuantity] = useState("1");

  const familySections = useMemo(() => steelSections.filter(s => s.family === family), [family]);
  const selectedStandard = steelSections.find(s => s.designation === designation) ?? familySections[0];
  const definition = shapeDefinitions[shape];

  const standardResult = useMemo(() => {
    const meters = toMillimetres(standardLength.value, standardLength.unit) / 1000;
    const pieces = Math.max(1, Math.floor(Number(standardQuantity) || 0));
    const kgPerM = selectedStandard?.massKgPerM ?? 0;
    const pieceKg = kgPerM * meters;
    return { meters, pieces, pieceKg, totalKg: pieceKg * pieces };
  }, [standardLength, standardQuantity, selectedStandard]);

  const normalizedDimensions = useMemo(() => Object.fromEntries(
    Object.entries(dimensions).map(([key, state]) => [key, toMillimetres(state.value, state.unit)]),
  ) as Partial<Record<DimensionKey, number>>, [dimensions]);

  const customResult = useMemo(() => {
    if (shape === "plate") {
      return calculatePlateWeightKg(
        normalizedDimensions.width ?? 0,
        normalizedDimensions.length ?? 0,
        normalizedDimensions.height ?? 0,
        materials[material],
        Number(customQuantity),
      );
    }

    return calculateMetalWeightKg(
      shape,
      normalizedDimensions,
      toMillimetres(customLength.value, customLength.unit),
      materials[material],
      Number(customQuantity),
    );
  }, [shape, normalizedDimensions, customLength, customQuantity, material]);

  const updateDimension = (key: DimensionKey, next: { value: string; unit: MetalWeightUnit }) => setDimensions(current => ({ ...current, [key]: next }));
  const reset = () => {
    setMode("standard"); setFamily("ISMB"); setDesignation("ISMB 200"); setStandardLength({ value: "6", unit: "m" }); setStandardQuantity("1");
    setMaterial("Steel"); setShape("round"); setDimensions(initialDimensions()); setCustomLength({ value: "1000", unit: "mm" }); setCustomQuantity("1");
  };

  return <ToolShell title="Metal Weight Calculator" description="Calculate metal weight with standard Indian rolled sections or flexible custom dimensions. Sheet and plate mode uses width × length × thickness directly." category="Engineering">
    <div className="mb-4 border border-slate-200 bg-white p-1.5 shadow-sm"><div className="grid grid-cols-2 gap-1">
      <button type="button" onClick={() => setMode("standard")} className={`px-3 py-2 text-sm font-semibold transition ${mode === "standard" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"}`}>Standard steel sections</button>
      <button type="button" onClick={() => setMode("custom")} className={`px-3 py-2 text-sm font-semibold transition ${mode === "custom" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"}`}>Custom dimensions</button>
    </div></div>

    {mode === "standard" ? <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3"><div><h2 className="text-lg font-semibold text-slate-950">Standard rolled section</h2><p className="mt-1 text-sm text-slate-500">Choose a catalogue section; its standard mass per metre is used.</p></div><button type="button" onClick={reset} className="text-sm font-medium text-slate-500 hover:text-slate-950">Reset</button></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Section family<select value={family} onChange={e => { const next = e.target.value as typeof family; setFamily(next); setDesignation(steelSections.find(s => s.family === next)?.designation ?? ""); }} className={inputClass}>{sectionFamilies.map(f => <option key={f}>{f}</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">Section designation<select value={designation} onChange={e => setDesignation(e.target.value)} className={inputClass}>{familySections.map(s => <option key={s.designation} value={s.designation}>{s.designation} · {s.massKgPerM} kg/m</option>)}</select></label>
          <DimensionInput label="Length per piece" state={standardLength} onChange={setStandardLength} />
          <label className="text-sm font-medium text-slate-700">Number of pieces<input inputMode="numeric" min="1" step="1" value={standardQuantity} onChange={e => setStandardQuantity(e.target.value)} className={inputClass} /></label>
        </div>
        <div className="mt-5 grid gap-3 bg-slate-50 p-3 text-sm sm:grid-cols-3"><div><p className="text-xs text-slate-400">Standard mass</p><p className="mt-1 font-semibold text-slate-900">{selectedStandard?.massKgPerM ?? 0} kg/m</p></div><div><p className="text-xs text-slate-400">Nominal depth</p><p className="mt-1 font-semibold text-slate-900">{selectedStandard?.depthMm ? `${selectedStandard.depthMm} mm` : "—"}</p></div><div><p className="text-xs text-slate-400">Nominal width</p><p className="mt-1 font-semibold text-slate-900">{selectedStandard?.widthMm ? `${selectedStandard.widthMm} mm` : "—"}</p></div></div>
        <p className="mt-4 text-xs leading-5 text-slate-500">Catalogue values are intended for quantity and weight estimation. For fabrication, procurement or structural design, verify the applicable standard and mill certificate.</p>
      </section>
      <ResultCard title="Total estimated weight" totalKg={standardResult.totalKg} details={[["Section", selectedStandard?.designation ?? "—"], ["Piece weight", `${standardResult.pieceKg.toFixed(3)} kg`], ["Quantity", String(standardResult.pieces)]]} />
    </div> : <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex items-start justify-between gap-3"><div><h2 className="text-lg font-semibold text-slate-950">Custom dimensions</h2><p className="mt-1 text-sm text-slate-500">For sheets and plates, enter width, length and thickness. Other shapes show only their required dimensions.</p></div><button type="button" onClick={reset} className="text-sm font-medium text-slate-500 hover:text-slate-950">Reset</button></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Material<select value={material} onChange={e => setMaterial(e.target.value as Material)} className={inputClass}>{Object.entries(materials).map(([name, density]) => <option key={name} value={name}>{name} · {density.toLocaleString()} kg/m³</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">Shape<select value={shape} onChange={e => setShape(e.target.value as MetalWeightShape)} className={inputClass}>{shapeOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
          {definition.fields.map(field => <DimensionInput key={field.key} label={field.label} state={dimensions[field.key]} onChange={next => updateDimension(field.key, next)} />)}
          {shape !== "plate" && <DimensionInput label="Length" state={customLength} onChange={setCustomLength} />}
          <label className="text-sm font-medium text-slate-700">Number of pieces<input inputMode="numeric" min="1" step="1" value={customQuantity} onChange={e => setCustomQuantity(e.target.value)} className={inputClass} /></label>
        </div>
        <div className="mt-5 bg-slate-50 p-3 text-sm text-slate-600"><p className="font-medium text-slate-800">Flexible units</p><p className="mt-1 leading-5">Every dimension has its own unit selector. You can mix mm, cm, m, inches and feet.</p></div>
        <div className="mt-3 border border-amber-100 bg-amber-50 p-3 text-sm text-amber-900"><p className="font-medium">Engineering note</p><p className="mt-1 leading-5">Sheet/plate weight uses volume = width × length × thickness and weight = volume × material density. Rolled structural profiles can differ from idealized geometry because of fillets, slopes and manufacturing tolerances.</p></div>
      </section>
      <ResultCard title="Estimated weight" totalKg={customResult.totalKg} details={[["Material", material], ["Shape", definition.label], ["Piece weight", `${customResult.pieceKg.toFixed(3)} kg`], ["Quantity", String(customResult.pieces)]]} />
    </div>}

    <section className="mt-6 max-w-3xl"><h2 className="text-xl font-semibold text-slate-950">How the calculator works</h2><p className="mt-1.5 text-sm leading-6 text-slate-600">Dimensions are converted to millimetres internally. For a sheet or plate, the exact rectangular volume model is width × length × thickness, then weight is volume × density.</p></section>
  </ToolShell>;
}

function ResultCard({ title, totalKg, details }: { title: string; totalKg: number; details: [string, string][] }) {
  return <aside className="h-fit bg-slate-950 p-5 text-white shadow-sm sm:p-6 lg:sticky lg:top-4"><p className="text-sm text-slate-400">{title}</p><div className="mt-1.5 text-4xl font-bold tracking-tight sm:text-5xl">{totalKg.toFixed(3)} <span className="text-lg font-medium text-slate-400">kg</span></div><p className="mt-1 text-sm text-slate-500">{(totalKg / 1000).toFixed(4)} tonnes</p><div className="mt-5 border-t border-slate-800 pt-4 text-sm">{details.map(([label, value]) => <div key={label} className="mt-2.5 flex justify-between gap-4 first:mt-0"><span className="text-slate-400">{label}</span><span className="text-right">{value}</span></div>)}</div></aside>;
}
