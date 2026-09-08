"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ToolShell } from "@/components/tool-shell";
import {
  calculateMetalWeightKg,
  calculatePlateWeightKg,
  isValidMetalGeometry,
  metalWeightUnits,
  shapeDefinitions,
  shapeOptions,
  toMillimetres,
  type DimensionKey,
  type MetalDimensions,
  type MetalWeightShape,
  type MetalWeightUnit,
} from "@/lib/metal-weight";

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

const presets: Record<MetalWeightShape, Partial<Record<DimensionKey, { value: string; unit: MetalWeightUnit }>>> = {
  round: { diameter: { value: "25", unit: "mm" } }, wire: { diameter: { value: "5", unit: "mm" } },
  square: { side: { value: "25", unit: "mm" } }, rectangle: { width: { value: "50", unit: "mm" }, height: { value: "25", unit: "mm" } },
  flat: { width: { value: "2", unit: "in" }, height: { value: "5", unit: "mm" } },
  plate: { width: { value: "8", unit: "ft" }, length: { value: "4", unit: "ft" }, height: { value: "1.2", unit: "mm" } },
  hex: { acrossCorners: { value: "25", unit: "mm" } }, octagon: { acrossFlats: { value: "25", unit: "mm" } },
  pipe: { outerDiameter: { value: "2", unit: "in" }, wallThickness: { value: "5", unit: "mm" } },
  tube: { width: { value: "2", unit: "in" }, height: { value: "1.5", unit: "in" }, wallThickness: { value: "2", unit: "mm" } },
  "equal-angle": { sideA: { value: "2", unit: "in" }, wallThickness: { value: "5", unit: "mm" } },
  angle: { sideA: { value: "3", unit: "in" }, sideB: { value: "2", unit: "in" }, wallThickness: { value: "5", unit: "mm" } },
  channel: { depth: { value: "100", unit: "mm" }, flangeWidth: { value: "50", unit: "mm" }, flangeThickness: { value: "5", unit: "mm" }, webThickness: { value: "5", unit: "mm" } },
  "i-beam": { depth: { value: "200", unit: "mm" }, flangeWidth: { value: "100", unit: "mm" }, flangeThickness: { value: "10", unit: "mm" }, webThickness: { value: "8", unit: "mm" } },
  "h-beam": { depth: { value: "200", unit: "mm" }, flangeWidth: { value: "200", unit: "mm" }, flangeThickness: { value: "12", unit: "mm" }, webThickness: { value: "8", unit: "mm" } },
  tee: { depth: { value: "100", unit: "mm" }, flangeWidth: { value: "50", unit: "mm" }, flangeThickness: { value: "6", unit: "mm" }, webThickness: { value: "6", unit: "mm" } },
  z: { depth: { value: "100", unit: "mm" }, flangeWidth: { value: "50", unit: "mm" }, flangeThickness: { value: "6", unit: "mm" }, webThickness: { value: "5", unit: "mm" } },
};

const initialDimensions = (): DimensionState => ({
  diameter: { value: "25", unit: "mm" }, side: { value: "25", unit: "mm" }, width: { value: "8", unit: "ft" }, height: { value: "1.2", unit: "mm" }, length: { value: "4", unit: "ft" },
  acrossCorners: { value: "25", unit: "mm" }, acrossFlats: { value: "25", unit: "mm" }, outerDiameter: { value: "2", unit: "in" }, wallThickness: { value: "2", unit: "mm" },
  sideA: { value: "2", unit: "in" }, sideB: { value: "2", unit: "in" }, depth: { value: "100", unit: "mm" }, flangeWidth: { value: "50", unit: "mm" }, flangeThickness: { value: "5", unit: "mm" }, webThickness: { value: "5", unit: "mm" },
});

function DimensionInput({ label, state, onChange }: { label: string; state: { value: string; unit: MetalWeightUnit }; onChange: (next: { value: string; unit: MetalWeightUnit }) => void }) {
  return <label className="text-[11px] font-medium text-slate-700">{label}<div className="mt-0.5 grid grid-cols-[minmax(0,1fr)_52px] gap-1"><input aria-label={label} inputMode="decimal" min="0" value={state.value} onChange={e => onChange({ ...state, value: e.target.value })} className="h-8 w-full min-w-0 border border-slate-200 bg-white px-2 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-100" /><select aria-label={`${label} unit`} value={state.unit} onChange={e => onChange({ ...state, unit: e.target.value as MetalWeightUnit })} className="h-8 min-w-0 border border-slate-200 bg-white px-1 text-xs text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-100">{metalWeightUnits.map(unit => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>;
}

function DiagramFrame({ children, label }: { children: ReactNode; label: string }) {
  return <div className="flex h-[112px] items-center justify-center bg-slate-50/70 px-2 py-1" aria-label={label}>{children}</div>;
}

function ShapeDiagram({ shape }: { shape: MetalWeightShape }) {
  const common = { fill: "white", stroke: "currentColor", strokeWidth: 2 };
  const text = "fill-current text-[11px] font-medium";
  if (shape === "plate") return <DiagramFrame label="Sheet dimensions diagram"><svg viewBox="0 0 300 100" className="h-[100px] w-full max-w-[300px]" role="img"><title>Sheet dimensions W, L and T</title><polygon points="55,38 190,38 235,18 100,18" {...common}/><polygon points="55,38 190,38 190,62 55,62" {...common}/><polygon points="190,38 235,18 235,42 190,62" {...common}/><text x="122" y="80" textAnchor="middle" className={text}>W</text><text x="224" y="58" className={text}>L</text><text x="45" y="53" className={text}>T</text></svg></DiagramFrame>;
  if (shape === "round" || shape === "wire") return <DiagramFrame label="Round bar dimensions diagram"><svg viewBox="0 0 300 100" className="h-[100px] w-full max-w-[300px]" role="img"><title>Round bar diameter D and length L</title><circle cx="75" cy="50" r="30" {...common}/><line x1="45" y1="50" x2="105" y2="50" stroke="currentColor"/><text x="75" y="43" textAnchor="middle" className={text}>D</text><line x1="125" y1="50" x2="255" y2="50" stroke="currentColor"/><text x="190" y="43" textAnchor="middle" className={text}>L</text></svg></DiagramFrame>;
  if (shape === "square") return <DiagramFrame label="Square bar dimensions diagram"><svg viewBox="0 0 300 100" className="h-[100px] w-full max-w-[300px]" role="img"><title>Square bar side A and length L</title><rect x="45" y="20" width="55" height="55" {...common}/><text x="72" y="15" textAnchor="middle" className={text}>A</text><line x1="120" y1="48" x2="255" y2="48" stroke="currentColor"/><text x="188" y="41" textAnchor="middle" className={text}>L</text></svg></DiagramFrame>;
  if (shape === "flat") return <DiagramFrame label="Flat bar dimensions diagram"><svg viewBox="0 0 300 100" className="h-[100px] w-full max-w-[300px]" role="img"><title>Flat bar width W, thickness T and length L</title><rect x="42" y="38" width="85" height="22" {...common}/><text x="84" y="32" textAnchor="middle" className={text}>W</text><text x="32" y="53" className={text}>T</text><line x1="145" y1="49" x2="255" y2="49" stroke="currentColor"/><text x="200" y="42" textAnchor="middle" className={text}>L</text></svg></DiagramFrame>;
  if (shape === "pipe") return <DiagramFrame label="Pipe dimensions diagram"><svg viewBox="0 0 300 100" className="h-[100px] w-full max-w-[300px]" role="img"><title>Pipe OD, ID, wall thickness T and length L</title><circle cx="72" cy="50" r="34" {...common}/><circle cx="72" cy="50" r="24" fill="none" stroke="currentColor" strokeWidth="2"/><text x="72" y="46" textAnchor="middle" className={text}>OD</text><text x="72" y="59" textAnchor="middle" className={text}>ID</text><text x="108" y="29" className={text}>T</text><line x1="125" y1="50" x2="255" y2="50" stroke="currentColor"/><text x="190" y="43" textAnchor="middle" className={text}>L</text></svg></DiagramFrame>;
  if (shape === "tube") return <DiagramFrame label="Tube dimensions diagram"><svg viewBox="0 0 300 100" className="h-[100px] w-full max-w-[300px]" role="img"><title>Tube width W, height H, wall T and length L</title><rect x="42" y="18" width="75" height="58" {...common}/><rect x="51" y="27" width="57" height="40" fill="none" stroke="currentColor"/><text x="80" y="13" textAnchor="middle" className={text}>W</text><text x="29" y="50" className={text}>H</text><text x="116" y="32" className={text}>T</text><line x1="135" y1="48" x2="255" y2="48" stroke="currentColor"/><text x="195" y="41" textAnchor="middle" className={text}>L</text></svg></DiagramFrame>;
  if (shape === "rectangle") return <DiagramFrame label="Rectangle bar dimensions diagram"><svg viewBox="0 0 300 100" className="h-[100px] w-full max-w-[300px]" role="img"><title>Rectangle bar width A, height B and length L</title><rect x="42" y="20" width="75" height="58" {...common}/><text x="80" y="14" textAnchor="middle" className={text}>A</text><text x="29" y="51" className={text}>B</text><line x1="135" y1="49" x2="255" y2="49" stroke="currentColor"/><text x="195" y="42" textAnchor="middle" className={text}>L</text></svg></DiagramFrame>;
  if (shape === "hex" || shape === "octagon") return <DiagramFrame label="Polygon bar dimensions diagram"><svg viewBox="0 0 300 100" className="h-[100px] w-full max-w-[300px]" role="img"><title>Polygon bar section and length</title><polygon points="72,16 101,33 101,67 72,84 43,67 43,33" {...common}/><text x="72" y="53" textAnchor="middle" className={text}>{shape === "hex" ? "AC" : "AF"}</text><line x1="125" y1="50" x2="255" y2="50" stroke="currentColor"/><text x="190" y="43" textAnchor="middle" className={text}>L</text></svg></DiagramFrame>;
  if (shape === "equal-angle" || shape === "angle") return <DiagramFrame label="Angle section dimensions diagram"><svg viewBox="0 0 300 100" className="h-[100px] w-full max-w-[300px]" role="img"><title>Angle section dimensions</title><path d="M50 78V20h15v43h120v15H50Z" {...common}/><text x="40" y="51" className={text}>{shape === "angle" ? "A" : "A"}</text><text x="120" y="94" className={text}>{shape === "angle" ? "B" : "A"}</text><text x="57" y="16" className={text}>t</text></svg></DiagramFrame>;
  const paths: Record<string, string> = {
    channel: "M45 20h115v12H60v36h100v12H45Z",
    "i-beam": "M45 18h125v14h-54v36h54v14H45V68h54V32H45Z",
    "h-beam": "M45 18h125v14h-48v36h48v14H45V68h48V32H45Z",
    tee: "M45 18h125v14h-55v50H90V32H45Z",
    z: "M55 18h110v14H75v24h70v14H75v12H55V70h70V46H55Z",
  };
  return <DiagramFrame label={`${shapeDefinitions[shape].label} dimensions diagram`}><svg viewBox="0 0 300 100" className="h-[100px] w-full max-w-[300px]" role="img"><title>{shapeDefinitions[shape].label} dimensions</title><path d={paths[shape]} {...common}/><text x="185" y="28" className={text}>H</text><text x="102" y="94" className={text}>B</text><text x="122" y="48" className={text}>Tf</text><text x="98" y="63" className={text}>Tw</text></svg></DiagramFrame>;
}

function formulaFor(shape: MetalWeightShape) {
  switch (shape) {
    case "round": case "wire": return "A = πD² / 4";
    case "square": return "A = A²";
    case "rectangle": return "A = A × B";
    case "flat": return "A = W × T";
    case "plate": return "V = W × L × T";
    case "hex": return "A = 3√3 × AC² / 8";
    case "octagon": return "A = 2(√2 − 1) × AF²";
    case "pipe": return "A = π(OD² − ID²) / 4";
    case "tube": return "A = WH − (W − 2T)(H − 2T)";
    case "equal-angle": return "A = T(2A − T)";
    case "angle": return "A = T(A + B − T)";
    case "channel": case "i-beam": case "h-beam": case "z": return "A = 2BTf + (H − 2Tf)Tw";
    case "tee": return "A = BTf + (H − Tf)Tw";
  }
}

export default function MetalWeightPage() {
  const [material, setMaterial] = useState<Material>("Steel");
  const [shape, setShape] = useState<MetalWeightShape>("plate");
  const [dimensions, setDimensions] = useState<DimensionState>(initialDimensions);
  const [customLength, setCustomLength] = useState({ value: "20", unit: "ft" as MetalWeightUnit });
  const [customQuantity, setCustomQuantity] = useState("1");
  const [calculatedResult, setCalculatedResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  const definition = shapeDefinitions[shape];
  const normalizedDimensions = useMemo(() => Object.fromEntries(Object.entries(dimensions).map(([key, state]) => [key, toMillimetres(state.value, state.unit)])) as MetalDimensions, [dimensions]);
  const lengthMm = toMillimetres(customLength.value, customLength.unit);
  const quantity = Number(customQuantity);
  const geometryValid = shape === "plate"
    ? Boolean(normalizedDimensions.width && normalizedDimensions.length && normalizedDimensions.height)
    : isValidMetalGeometry(shape, normalizedDimensions) && lengthMm > 0;
  const currentResult = useMemo(() => shape === "plate"
    ? calculatePlateWeightKg(normalizedDimensions.width ?? 0, normalizedDimensions.length ?? 0, normalizedDimensions.height ?? 0, materials[material], quantity)
    : calculateMetalWeightKg(shape, normalizedDimensions, lengthMm, materials[material], quantity), [shape, normalizedDimensions, lengthMm, material, quantity]);

  const invalidate = () => { setCalculatedResult(null); setError(""); };
  const updateDimension = (key: DimensionKey, next: { value: string; unit: MetalWeightUnit }) => { setDimensions(current => ({ ...current, [key]: next })); invalidate(); };
  const selectShape = (next: MetalWeightShape) => { setShape(next); setDimensions(current => ({ ...current, ...presets[next] })); setCustomLength({ value: "20", unit: "ft" }); invalidate(); };
  const calculate = () => {
    if (!geometryValid) { setCalculatedResult(null); setError(shape === "pipe" ? "Use a wall thickness less than half the outside diameter." : shape === "tube" ? "Use a wall thickness less than half of both outside dimensions." : "Enter positive values for all required dimensions and length."); return; }
    if (!Number.isInteger(quantity) || quantity < 1) { setCalculatedResult(null); setError("Quantity must be a whole number of 1 or more."); return; }
    setError(""); setCalculatedResult(currentResult);
  };
  const reset = () => { setMaterial("Steel"); setShape("plate"); setDimensions(initialDimensions()); setCustomLength({ value: "20", unit: "ft" }); setCustomQuantity("1"); invalidate(); };
  const result = calculatedResult;
  const totalKg = result?.totalKg ?? 0;
  const valid = result !== null && result.totalKg > 0 && result.pieces > 0;
  const pounds = totalKg * 2.20462262185;

  return <ToolShell title="Metal Weight Calculator" description="Calculate steel and metal weight from custom dimensions, material density and shape-specific formulas." category="Engineering">
    <div className="grid gap-2 lg:grid-cols-[minmax(0,1fr)_270px]">
      <section className="border border-slate-200 bg-white p-2.5 shadow-sm sm:p-3">
        <div className="mb-2 flex items-center justify-between gap-2"><div><h2 className="text-sm font-semibold text-slate-950">Metal weight</h2><p className="text-[10px] text-slate-500">Select material, shape, quantity and dimensions.</p></div><button type="button" onClick={reset} className="text-[11px] font-medium text-slate-500 hover:text-slate-950">Reset</button></div>

        <div className="mb-2 border border-slate-200 bg-slate-50 p-1.5"><div className="mb-1 flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Shape diagram</span><span className="text-[10px] text-slate-500">{definition.label}</span></div><ShapeDiagram shape={shape}/></div>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="text-[11px] font-medium text-slate-700">Material<select value={material} onChange={e => { setMaterial(e.target.value as Material); invalidate(); }} className="mt-0.5 h-8 w-full border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-100">{Object.entries(materials).map(([name]) => <option key={name} value={name}>{name}{name === "Steel" ? " (default)" : ""}</option>)}</select></label>
          <label className="text-[11px] font-medium text-slate-700">Shape<select value={shape} onChange={e => selectShape(e.target.value as MetalWeightShape)} className="mt-0.5 h-8 w-full border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-100">{shapeOptions.map(option => <option key={option.value} value={option.value}>{option.label === "Sheet / plate" ? "Sheet / plate" : option.label}</option>)}</select></label>
        </div>

        <div className="mt-2 border-t border-slate-100 pt-2">
          <div className="mb-1 flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Quantity & dimensions</span><span className="text-[10px] text-slate-400">{definition.fields.length + (shape === "plate" ? 0 : 1)} inputs</span></div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-[11px] font-medium text-slate-700">Quantity<input aria-label="Quantity" inputMode="numeric" min="1" step="1" value={customQuantity} onChange={e => { setCustomQuantity(e.target.value); invalidate(); }} className="mt-0.5 h-8 w-full border border-slate-200 bg-white px-2 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-100"/></label>
            {definition.fields.map(field => <DimensionInput key={field.key} label={field.label} state={dimensions[field.key]} onChange={next => updateDimension(field.key, next)}/>) }
            {shape !== "plate" && <DimensionInput label="Length" state={customLength} onChange={next => { setCustomLength(next); invalidate(); }}/>} 
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2"><div><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Formula</p><p className="text-[11px] text-slate-700">{formulaFor(shape)}</p></div><button type="button" onClick={calculate} className="min-h-8 bg-slate-950 px-4 text-[11px] font-semibold text-white hover:bg-slate-800">Calculate weight</button></div>
        {error && <p role="alert" className="mt-2 border border-red-200 bg-red-50 px-2 py-1.5 text-[11px] text-red-700">{error}</p>}
      </section>

      <ResultCard totalKg={totalKg} material={material} shape={definition.label} area={result?.areaMm2 ?? 0} pieceKg={result?.pieceKg ?? 0} pieces={result?.pieces ?? 0} pounds={pounds} valid={valid} formula={formulaFor(shape)}/>
    </div>
  </ToolShell>;
}

function ResultCard({ totalKg, material, shape, area, pieceKg, pieces, pounds, valid, formula }: { totalKg: number; material: string; shape: string; area: number; pieceKg: number; pieces: number; pounds: number; valid: boolean; formula: string }) {
  return <aside className="h-fit bg-slate-950 p-3 text-white shadow-sm lg:sticky lg:top-3"><div className="flex items-baseline justify-between gap-2"><p className="text-[10px] uppercase tracking-wide text-slate-400">Total weight</p><p className="text-[10px] text-slate-500">{(totalKg / 1000).toFixed(3)} t</p></div><div className="mt-0.5 text-3xl font-bold tracking-tight">{totalKg.toFixed(3)} <span className="text-sm font-medium text-slate-400">kg</span></div><div className="mt-3 space-y-1.5 border-t border-slate-800 pt-2.5 text-[11px]"><div className="flex justify-between gap-2"><span className="text-slate-400">Material</span><span className="text-right">{material}</span></div><div className="flex justify-between gap-2"><span className="text-slate-400">Shape</span><span className="text-right">{shape}</span></div><div className="flex justify-between gap-2"><span className="text-slate-400">Area</span><span>{valid ? `${area.toFixed(2)} mm²` : "—"}</span></div><div className="flex justify-between gap-2"><span className="text-slate-400">Per piece</span><span>{valid ? `${pieceKg.toFixed(3)} kg` : "—"}</span></div><div className="flex justify-between gap-2"><span className="text-slate-400">Quantity</span><span>{valid ? pieces : "—"}</span></div><div className="flex justify-between gap-2"><span className="text-slate-400">Pounds</span><span>{valid ? `${pounds.toFixed(3)} lb` : "—"}</span></div></div><div className="mt-3 border-t border-slate-800 pt-2.5"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Formula</p><p className="mt-1 text-[11px] leading-4 text-slate-300">{formula}</p></div></aside>;
}
