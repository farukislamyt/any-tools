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
type Result = ReturnType<typeof calculateMetalWeightKg>;

const materials = {
  Steel: 7850, "Carbon steel": 7850, "Mild steel": 7850,
  "Stainless steel 304": 8000, "Stainless steel 316": 8000, "Galvanized steel": 7850,
  "Cast iron": 7200, "Wrought iron": 7750, Aluminum: 2700, "Aluminum 6061": 2700,
  "Aluminum 7075": 2810, Copper: 8960, Brass: 8500, Bronze: 8800, Zinc: 7140,
  Tin: 7310, Lead: 11340, Nickel: 8900, Titanium: 4500, Magnesium: 1740,
  Chromium: 7190, Cobalt: 8900, Manganese: 7210, Silver: 10490, Gold: 19320, Platinum: 21450,
} as const;

const initialDimensions = (): DimensionState => ({
  diameter: { value: "25", unit: "mm" }, side: { value: "25", unit: "mm" }, width: { value: "2", unit: "in" }, height: { value: "5", unit: "mm" }, length: { value: "4", unit: "ft" },
  acrossCorners: { value: "25", unit: "mm" }, acrossFlats: { value: "25", unit: "mm" }, outerDiameter: { value: "50", unit: "mm" }, wallThickness: { value: "2", unit: "mm" },
  sideA: { value: "3", unit: "in" }, sideB: { value: "2", unit: "in" }, depth: { value: "100", unit: "mm" }, flangeWidth: { value: "50", unit: "mm" }, flangeThickness: { value: "5", unit: "mm" }, webThickness: { value: "5", unit: "mm" },
});

const inputClass = "mt-1.5 h-11 w-full border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100";

function DimensionInput({ label, state, onChange }: { label: string; state: { value: string; unit: MetalWeightUnit }; onChange: (next: { value: string; unit: MetalWeightUnit }) => void }) {
  return <label className="text-sm font-medium text-slate-700">
    {label}
    <div className="mt-1.5 grid grid-cols-[minmax(0,1fr)_72px] gap-1.5">
      <input aria-label={label} inputMode="decimal" min="0" value={state.value} onChange={e => onChange({ ...state, value: e.target.value })} className="h-11 w-full min-w-0 border border-slate-200 bg-white px-3 text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100" />
      <select aria-label={`${label} unit`} value={state.unit} onChange={e => onChange({ ...state, unit: e.target.value as MetalWeightUnit })} className="h-11 min-w-0 border border-slate-200 bg-white px-1.5 text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100">
        {metalWeightUnits.map(unit => <option key={unit.value} value={unit.value}>{unit.label}</option>)}
      </select>
    </div>
  </label>;
}

function ShapeDiagram({ shape }: { shape: MetalWeightShape }) {
  if (shape === "flat") return <DiagramFrame label="Flat bar dimensions diagram"><svg viewBox="0 0 360 190" className="h-auto w-full max-w-[360px]" role="img"><title>Flat bar dimensions: width, thickness and length</title><polygon points="70,80 250,80 300,50 120,50" fill="white" stroke="currentColor" strokeWidth="2" /><polygon points="70,80 250,80 250,112 70,112" fill="white" stroke="currentColor" strokeWidth="2" /><polygon points="250,80 300,50 300,82 250,112" fill="white" stroke="currentColor" strokeWidth="2" /><line x1="72" y1="132" x2="248" y2="132" stroke="currentColor" strokeWidth="1.5" /><text x="160" y="151" textAnchor="middle" fontSize="14" fontWeight="600">W</text><line x1="56" y1="82" x2="56" y2="110" stroke="currentColor" strokeWidth="1.5" /><text x="43" y="100" textAnchor="middle" fontSize="14" fontWeight="600">T</text><line x1="258" y1="120" x2="309" y2="89" stroke="currentColor" strokeWidth="1.5" /><text x="286" y="119" textAnchor="middle" fontSize="14" fontWeight="600">L</text></svg></DiagramFrame>;
  if (shape === "plate") return <DiagramFrame label="Sheet dimensions diagram"><svg viewBox="0 0 360 190" className="h-auto w-full max-w-[360px]" role="img"><title>Sheet dimensions: thickness, width and length</title><polygon points="80,70 250,70 305,38 135,38" fill="white" stroke="currentColor" strokeWidth="2" /><polygon points="80,70 250,70 250,105 80,105" fill="white" stroke="currentColor" strokeWidth="2" /><polygon points="250,70 305,38 305,73 250,105" fill="white" stroke="currentColor" strokeWidth="2" /><line x1="82" y1="125" x2="248" y2="125" stroke="currentColor" strokeWidth="1.5" /><text x="165" y="143" textAnchor="middle" fontSize="14" fontWeight="600">W</text><line x1="260" y1="112" x2="313" y2="80" stroke="currentColor" strokeWidth="1.5" /><text x="289" y="105" textAnchor="middle" fontSize="14" fontWeight="600">L</text><line x1="62" y1="72" x2="62" y2="104" stroke="currentColor" strokeWidth="1.5" /><text x="49" y="92" textAnchor="middle" fontSize="14" fontWeight="600">T</text></svg></DiagramFrame>;
  if (shape === "equal-angle" || shape === "angle") return <DiagramFrame label={`${shape === "equal-angle" ? "Equal" : "Unequal"} angle dimensions diagram`}><svg viewBox="0 0 360 210" className="h-auto w-full max-w-[360px]" role="img"><title>{shape === "equal-angle" ? "Equal angle" : "Unequal angle"} dimensions</title><path d="M95 160 L95 55 L125 55 L125 130 L260 130 L260 160 Z" fill="white" stroke="currentColor" strokeWidth="2" /><line x1="76" y1="58" x2="76" y2="158" stroke="currentColor" strokeWidth="1.5" /><text x="62" y="112" textAnchor="middle" fontSize="14" fontWeight="600">A</text><line x1="127" y1="178" x2="258" y2="178" stroke="currentColor" strokeWidth="1.5" /><text x="193" y="197" textAnchor="middle" fontSize="14" fontWeight="600">{shape === "equal-angle" ? "A" : "B"}</text><text x="108" y="47" textAnchor="middle" fontSize="12">t</text></svg></DiagramFrame>;
  return null;
}

function DiagramFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mx-auto my-4 flex max-w-md justify-center border-y border-slate-100 bg-slate-50/60 px-4 py-5" aria-label={label}>{children}</div>;
}

export default function MetalWeightPage() {
  const [mode, setMode] = useState<Mode>("custom");
  const [family, setFamily] = useState<(typeof sectionFamilies)[number]>("ISMB");
  const [designation, setDesignation] = useState("ISMB 200");
  const [standardLength, setStandardLength] = useState({ value: "6", unit: "m" as MetalWeightUnit });
  const [standardQuantity, setStandardQuantity] = useState("1");
  const [material, setMaterial] = useState<Material>("Steel");
  const [shape, setShape] = useState<MetalWeightShape>("flat");
  const [dimensions, setDimensions] = useState<DimensionState>(initialDimensions);
  const [customLength, setCustomLength] = useState({ value: "4", unit: "ft" as MetalWeightUnit });
  const [customQuantity, setCustomQuantity] = useState("1");
  const [calculatedResult, setCalculatedResult] = useState<Result | null>(null);

  const familySections = useMemo(() => steelSections.filter(s => s.family === family), [family]);
  const selectedStandard = steelSections.find(s => s.designation === designation) ?? familySections[0];
  const definition = shapeDefinitions[shape];
  const normalizedDimensions = useMemo(() => Object.fromEntries(Object.entries(dimensions).map(([key, state]) => [key, toMillimetres(state.value, state.unit)])) as Partial<Record<DimensionKey, number>>, [dimensions]);
  const currentResult = useMemo(() => shape === "plate" ? calculatePlateWeightKg(normalizedDimensions.width ?? 0, normalizedDimensions.length ?? 0, normalizedDimensions.height ?? 0, materials[material], Number(customQuantity)) : calculateMetalWeightKg(shape, normalizedDimensions, toMillimetres(customLength.value, customLength.unit), materials[material], Number(customQuantity)), [shape, normalizedDimensions, customLength, customQuantity, material]);
  const standardResult = useMemo(() => { const meters = toMillimetres(standardLength.value, standardLength.unit) / 1000; const pieces = Number.isFinite(Number(standardQuantity)) && Number(standardQuantity) > 0 ? Math.floor(Number(standardQuantity)) : 0; const kgPerM = selectedStandard?.massKgPerM ?? 0; const pieceKg = kgPerM * meters; return { meters, pieces, pieceKg, totalKg: pieceKg * pieces }; }, [standardLength, standardQuantity, selectedStandard]);

  const updateDimension = (key: DimensionKey, next: { value: string; unit: MetalWeightUnit }) => setDimensions(current => ({ ...current, [key]: next }));
  const selectShape = (next: MetalWeightShape) => {
    setShape(next); setCalculatedResult(null);
    if (next === "flat") { setDimensions(current => ({ ...current, width: { value: "2", unit: "in" }, height: { value: "5", unit: "mm" } })); setCustomLength({ value: "20", unit: "ft" }); }
    else if (next === "plate") { setDimensions(current => ({ ...current, width: { value: "8", unit: "ft" }, height: { value: "1.2", unit: "mm" }, length: { value: "4", unit: "ft" } })); setCustomLength({ value: "4", unit: "ft" }); }
    else if (next === "equal-angle") { setDimensions(current => ({ ...current, sideA: { value: "2", unit: "in" }, wallThickness: { value: "5", unit: "mm" } })); setCustomLength({ value: "20", unit: "ft" }); }
    else if (next === "angle") { setDimensions(current => ({ ...current, sideA: { value: "3", unit: "in" }, sideB: { value: "2", unit: "in" }, wallThickness: { value: "5", unit: "mm" } })); setCustomLength({ value: "20", unit: "ft" }); }
  };
  const calculate = () => setCalculatedResult(currentResult);
  const clear = () => setCalculatedResult(null);
  const reset = () => { setMode("custom"); setFamily("ISMB"); setDesignation("ISMB 200"); setStandardLength({ value: "6", unit: "m" }); setStandardQuantity("1"); setMaterial("Steel"); setShape("flat"); setDimensions(initialDimensions()); setCustomLength({ value: "20", unit: "ft" }); setCustomQuantity("1"); setCalculatedResult(null); };

  const result = calculatedResult;
  const totalKg = result?.totalKg ?? 0;
  const pounds = totalKg * 2.20462262185;
  const area = result?.areaMm2 ?? 0;

  return <ToolShell title="Metal Weight Calculator" description="Calculate steel and metal weight from standard sections or custom dimensions." category="Engineering">
    <div className="mb-4 border border-slate-200 bg-white p-1 shadow-sm"><div className="grid grid-cols-2 gap-1"><button type="button" onClick={() => setMode("standard")} className={`min-h-11 px-2 text-sm font-semibold transition ${mode === "standard" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"}`}>Standard sections</button><button type="button" onClick={() => setMode("custom")} className={`min-h-11 px-2 text-sm font-semibold transition ${mode === "custom" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-50"}`}>Custom dimensions</button></div></div>
    {mode === "standard" ? <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]"><section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="mb-4 flex items-start justify-between gap-3"><div><h2 className="text-lg font-semibold text-slate-950">Steel section</h2><p className="mt-1 text-sm text-slate-500">Select the section and length.</p></div><button type="button" onClick={reset} className="text-sm font-medium text-slate-500 hover:text-slate-950">Clear</button></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-slate-700">Family<select value={family} onChange={e => { const next = e.target.value as typeof family; setFamily(next); setDesignation(steelSections.find(s => s.family === next)?.designation ?? ""); }} className={inputClass}>{sectionFamilies.map(f => <option key={f}>{f}</option>)}</select></label><label className="text-sm font-medium text-slate-700">Designation<select value={designation} onChange={e => setDesignation(e.target.value)} className={inputClass}>{familySections.map(s => <option key={s.designation} value={s.designation}>{s.designation} · {s.massKgPerM} kg/m</option>)}</select></label><DimensionInput label="Length per piece" state={standardLength} onChange={setStandardLength} /><label className="text-sm font-medium text-slate-700">Pieces<input aria-label="Pieces" inputMode="numeric" min="1" step="1" value={standardQuantity} onChange={e => setStandardQuantity(e.target.value)} className={inputClass} /></label></div></section><ResultCard title="Total weight" totalKg={standardResult.totalKg} details={[["Section", selectedStandard?.designation ?? "—"],["Mass", `${selectedStandard?.massKgPerM ?? 0} kg/m`],["Piece", `${standardResult.pieceKg.toFixed(3)} kg`],["Quantity", String(standardResult.pieces)]]} formula="Total = section mass (kg/m) × length (m) × pieces" /></div> : <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]"><section className="border border-slate-200 bg-white p-4 shadow-sm sm:p-5"><div className="mb-4 flex items-start justify-between gap-3"><div><h2 className="text-lg font-semibold text-slate-950">Enter your values</h2><p className="mt-1 text-sm text-slate-500">Choose a material and shape, then enter the required dimensions.</p></div><button type="button" onClick={clear} className="text-sm font-medium text-slate-500 hover:text-slate-950">Clear</button></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-slate-700">Material<select value={material} onChange={e => { setMaterial(e.target.value as Material); setCalculatedResult(null); }} className={inputClass}>{Object.entries(materials).map(([name]) => <option key={name} value={name}>{name}{name === "Steel" ? " (default)" : ""}</option>)}</select></label><label className="text-sm font-medium text-slate-700">Shape<select value={shape} onChange={e => selectShape(e.target.value as MetalWeightShape)} className={inputClass}>{shapeOptions.map(option => <option key={option.value} value={option.value}>{option.label === "Sheet / plate" ? "Sheet" : option.label}</option>)}</select></label></div><ShapeDiagram shape={shape} /><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-medium text-slate-700">Quantity<input aria-label="Quantity" inputMode="numeric" min="1" step="1" value={customQuantity} onChange={e => { setCustomQuantity(e.target.value); setCalculatedResult(null); }} className={inputClass} /></label>{definition.fields.map(field => <DimensionInput key={field.key} label={field.label} state={dimensions[field.key]} onChange={next => { updateDimension(field.key, next); setCalculatedResult(null); }} />)}{shape !== "plate" && <DimensionInput label="Length" state={customLength} onChange={next => { setCustomLength(next); setCalculatedResult(null); }} />}</div>{shape === "flat" && <div className="mt-5 border-t border-slate-200 pt-4 text-sm text-slate-600"><p className="font-semibold text-slate-900">Flat bar formula</p><p className="mt-1">Area = Width × Thickness</p><p className="mt-1">Weight = Area × Length × Density</p></div>}{shape === "plate" && <p className="mt-4 text-xs text-slate-500">For sheets, Width and Length are the plan dimensions; Thickness is the material thickness.</p>}{(shape === "equal-angle" || shape === "angle") && <div className="mt-5 border-t border-slate-200 pt-4 text-sm text-slate-600"><p className="font-semibold text-slate-900">{shape === "equal-angle" ? "Equal angle" : "Unequal angle"} formula</p><p className="mt-1">Area = t × ({shape === "equal-angle" ? "2a" : "a + b"} − t)</p><p className="mt-1">Weight = Area × Length × Density</p><p className="mt-1 text-xs text-slate-500">Theoretical sharp-corner geometry. Rolled angles can differ slightly because of fillets and manufacturing tolerances.</p></div>}<div className="mt-5 flex flex-wrap gap-2"><button type="button" onClick={calculate} className="min-h-11 bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800">Calculate</button><button type="button" onClick={clear} className="min-h-11 border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Clear</button></div></section><ResultCard title="Results" totalKg={totalKg} details={[["Material", material],["Shape", definition.label],["Cross-section", area > 0 ? `${area.toFixed(2)} mm²` : "—"],["Piece", result ? `${result.pieceKg.toFixed(4)} kg` : "—"],["Quantity", result ? String(result.pieces) : "—"],["Pounds", result ? `${pounds.toFixed(4)} lb` : "—"]]} formula="Weight = cross-sectional area × length × density × quantity" /></div>}
  </ToolShell>;
}

function ResultCard({ title, totalKg, details, formula }: { title: string; totalKg: number; details: [string, string][]; formula: string }) {
  return <aside className="h-fit bg-slate-950 p-5 text-white shadow-sm sm:p-6 lg:sticky lg:top-4"><p className="text-sm text-slate-400">{title}</p><div className="mt-1.5 text-4xl font-bold tracking-tight sm:text-5xl">{totalKg.toFixed(4)} <span className="text-lg font-medium text-slate-400">kg</span></div><p className="mt-1 text-sm text-slate-500">{(totalKg / 1000).toFixed(4)} tonnes</p><div className="mt-5 border-t border-slate-800 pt-4 text-sm">{details.map(([label, value]) => <div key={label} className="mt-2.5 flex justify-between gap-4 first:mt-0"><span className="text-slate-400">{label}</span><span className="max-w-[55%] text-right">{value}</span></div>)}</div><div className="mt-5 border-t border-slate-800 pt-4"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Formula</p><p className="mt-2 text-xs leading-5 text-slate-300">{formula}</p></div></aside>;
}
