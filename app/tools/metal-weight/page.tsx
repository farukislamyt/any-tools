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
  return <label className="text-xs font-medium text-slate-700">{label}<div className="mt-1 grid grid-cols-[minmax(0,1fr)_60px] gap-1"><input aria-label={label} inputMode="decimal" min="0" value={state.value} onChange={e => onChange({ ...state, value: e.target.value })} className="h-9 w-full min-w-0 border border-slate-200 bg-white px-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100" /><select aria-label={`${label} unit`} value={state.unit} onChange={e => onChange({ ...state, unit: e.target.value as MetalWeightUnit })} className="h-9 min-w-0 border border-slate-200 bg-white px-1 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100">{metalWeightUnits.map(unit => <option key={unit.value} value={unit.value}>{unit.label}</option>)}</select></div></label>;
}

function DiagramFrame({ children, label }: { children: ReactNode; label: string }) { return <div className="mx-auto my-4 flex max-w-md justify-center border-y border-slate-100 bg-slate-50/60 px-4 py-4" aria-label={label}>{children}</div>; }
function ShapeDiagram({ shape }: { shape: MetalWeightShape }) {
  const common = { fill: "white", stroke: "currentColor", strokeWidth: 2 };
  if (shape === "plate") return <DiagramFrame label="Sheet dimensions diagram"><svg viewBox="0 0 360 170" className="h-auto w-full max-w-[360px]" role="img"><title>Sheet dimensions: T, W and L</title><polygon points="75,62 245,62 300,30 130,30" {...common}/><polygon points="75,62 245,62 245,95 75,95" {...common}/><polygon points="245,62 300,30 300,63 245,95" {...common}/><text x="160" y="133" textAnchor="middle">W</text><text x="287" y="91">L</text><text x="53" y="83">T</text></svg></DiagramFrame>;
  if (shape === "equal-angle" || shape === "angle") return <DiagramFrame label="Angle section dimensions diagram"><svg viewBox="0 0 360 190" className="h-auto w-full max-w-[360px]" role="img"><title>Angle section dimensions</title><path d="M90 145V45h28v72h150v28H90Z" {...common}/><text x="73" y="98">A</text><text x="190" y="166">{shape === "equal-angle" ? "A" : "B"}</text><text x="102" y="39">t</text></svg></DiagramFrame>;
  if (shape === "round" || shape === "wire") return <DiagramFrame label="Round bar diameter diagram"><svg viewBox="0 0 360 150" className="h-auto w-full max-w-[360px]" role="img"><title>Round bar diameter D</title><circle cx="120" cy="70" r="45" {...common}/><line x1="75" y1="70" x2="165" y2="70" stroke="currentColor"/><text x="120" y="55" textAnchor="middle">D</text><line x1="180" y1="70" x2="310" y2="70" stroke="currentColor"/><text x="245" y="60" textAnchor="middle">L</text></svg></DiagramFrame>;
  if (shape === "square") return <DiagramFrame label="Square bar dimensions diagram"><svg viewBox="0 0 360 150" className="h-auto w-full max-w-[360px]" role="img"><title>Square bar side A and length L</title><rect x="75" y="35" width="80" height="80" {...common}/><text x="115" y="28" textAnchor="middle">A</text><line x1="175" y1="75" x2="305" y2="75" stroke="currentColor"/><text x="240" y="65" textAnchor="middle">L</text></svg></DiagramFrame>;
  if (shape === "flat") return <DiagramFrame label="Flat bar dimensions diagram"><svg viewBox="0 0 360 150" className="h-auto w-full max-w-[360px]" role="img"><title>Flat bar width W, thickness T and length L</title><rect x="75" y="60" width="120" height="25" {...common}/><text x="135" y="52" textAnchor="middle">W</text><text x="60" y="77">T</text><line x1="205" y1="72" x2="310" y2="72" stroke="currentColor"/><text x="258" y="62" textAnchor="middle">L</text></svg></DiagramFrame>;
  if (shape === "pipe") return <DiagramFrame label="Pipe dimensions diagram"><svg viewBox="0 0 360 150" className="h-auto w-full max-w-[360px]" role="img"><title>Pipe outside diameter D and wall thickness T</title><circle cx="120" cy="70" r="48" {...common}/><circle cx="120" cy="70" r="34" fill="none" stroke="currentColor" strokeWidth="2"/><text x="120" y="57" textAnchor="middle">OD</text><text x="120" y="78" textAnchor="middle">ID</text><text x="175" y="50">T</text><line x1="180" y1="70" x2="310" y2="70" stroke="currentColor"/><text x="245" y="60" textAnchor="middle">L</text></svg></DiagramFrame>;
  if (shape === "tube" || shape === "rectangle") return <DiagramFrame label={`${shapeDefinitions[shape].label} dimensions diagram`}><svg viewBox="0 0 360 150" className="h-auto w-full max-w-[360px]" role="img"><title>{shapeDefinitions[shape].label} width W, height H and length L</title><rect x="70" y="35" width="100" height="75" {...common}/>{shape === "tube" && <rect x="83" y="48" width="74" height="49" fill="none" stroke="currentColor"/>}<text x="120" y="28" textAnchor="middle">W</text><text x="55" y="77">H</text><line x1="185" y1="72" x2="310" y2="72" stroke="currentColor"/><text x="248" y="62" textAnchor="middle">L</text></svg></DiagramFrame>;
  if (shape === "hex" || shape === "octagon") return <DiagramFrame label="Polygon bar dimensions diagram"><svg viewBox="0 0 360 150" className="h-auto w-full max-w-[360px]" role="img"><title>{shapeDefinitions[shape].label} dimension and length</title><polygon points="120,25 160,48 160,92 120,115 80,92 80,48" {...common}/><text x="120" y="77" textAnchor="middle">{shape === "hex" ? "AC" : "AF"}</text><line x1="185" y1="70" x2="310" y2="70" stroke="currentColor"/><text x="248" y="60" textAnchor="middle">L</text></svg></DiagramFrame>;
  return <DiagramFrame label={`${shapeDefinitions[shape].label} diagram`}><svg viewBox="0 0 360 160" className="h-auto w-full max-w-[360px]" role="img"><title>{shapeDefinitions[shape].label} dimensions</title><path d="M70 35h115v22h-65v23h65v22H70Z" {...common}/><text x="128" y="132" textAnchor="middle">Section dimensions</text><line x1="205" y1="80" x2="310" y2="80" stroke="currentColor"/><text x="258" y="70" textAnchor="middle">L</text></svg></DiagramFrame>;
}

function formulaFor(shape: MetalWeightShape) {
  switch (shape) {
    case "round": case "wire": return "Area = π × D² / 4";
    case "square": return "Area = A²";
    case "rectangle": return "Area = A × B";
    case "flat": return "Area = W × T";
    case "plate": return "Volume = W × L × T";
    case "hex": return "Area = 3√3 × AC² / 8";
    case "octagon": return "Area = AF² / [2 × (1 + √2)]";
    case "pipe": return "Area = π × (OD² − ID²) / 4";
    case "tube": return "Area = WH − (W − 2t)(H − 2t)";
    case "equal-angle": return "Area = t × (2A − t)";
    case "angle": return "Area = t × (A + B − t)";
    case "channel": case "i-beam": case "h-beam": case "z": return "Area = 2 × flange width × flange thickness + web area";
    case "tee": return "Area = flange area + web area";
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

  const updateDimension = (key: DimensionKey, next: { value: string; unit: MetalWeightUnit }) => {
    setDimensions(current => ({ ...current, [key]: next }));
    setCalculatedResult(null);
    setError("");
  };
  const selectShape = (next: MetalWeightShape) => {
    setShape(next);
    setDimensions(current => ({ ...current, ...presets[next] }));
    setCustomLength({ value: "20", unit: "ft" });
    setCalculatedResult(null);
    setError("");
  };
  const calculate = () => {
    if (!geometryValid) {
      setCalculatedResult(null);
      setError(shape === "pipe" ? "Enter a valid outside diameter and wall thickness. Wall thickness must be less than half the outside diameter." : shape === "tube" ? "Enter valid outside width, height and wall thickness. Wall thickness must be less than half of both outside dimensions." : "Enter positive values for all required dimensions and length.");
      return;
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      setCalculatedResult(null);
      setError("Quantity must be a whole number greater than or equal to 1.");
      return;
    }
    setError("");
    setCalculatedResult(currentResult);
  };
  const clear = () => { setCalculatedResult(null); setError(""); };
  const reset = () => { setMaterial("Steel"); setShape("plate"); setDimensions(initialDimensions()); setCustomLength({ value: "20", unit: "ft" }); setCustomQuantity("1"); setCalculatedResult(null); setError(""); };
  const result = calculatedResult;
  const totalKg = result?.totalKg ?? 0;
  const pounds = totalKg * 2.20462262185;
  const area = result?.areaMm2 ?? 0;
  const valid = result !== null && result.totalKg > 0 && result.pieces > 0;
  const resultPieceKg = result?.pieceKg ?? 0;
  const resultPieces = result?.pieces ?? 0;

  return <ToolShell title="Metal Weight Calculator" description="Calculate steel and metal weight from custom dimensions, material density and shape-specific formulas." category="Engineering">
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="mb-3 flex items-start justify-between gap-3"><div><h2 className="text-base font-semibold text-slate-950">Enter your values</h2><p className="mt-0.5 text-xs text-slate-500">Choose a material and shape, then enter the required dimensions.</p></div><button type="button" onClick={clear} className="text-xs font-medium text-slate-500 hover:text-slate-950">Clear</button></div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <label className="text-xs font-medium text-slate-700">Material<select value={material} onChange={e => { setMaterial(e.target.value as Material); setCalculatedResult(null); setError(""); }} className="mt-1 h-9 w-full border border-slate-200 bg-white px-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100">{Object.entries(materials).map(([name]) => <option key={name} value={name}>{name}{name === "Steel" ? " (default)" : ""}</option>)}</select></label>
          <label className="text-xs font-medium text-slate-700">Shape<select value={shape} onChange={e => selectShape(e.target.value as MetalWeightShape)} className="mt-1 h-9 w-full border border-slate-200 bg-white px-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100">{shapeOptions.map(option => <option key={option.value} value={option.value}>{option.label === "Sheet / plate" ? "Sheet" : option.label}</option>)}</select></label>
        </div>
        <ShapeDiagram shape={shape}/>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <label className="text-xs font-medium text-slate-700">Quantity<input aria-label="Quantity" inputMode="numeric" min="1" step="1" value={customQuantity} onChange={e => { setCustomQuantity(e.target.value); setCalculatedResult(null); setError(""); }} className="mt-1 h-9 w-full border border-slate-200 bg-white px-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"/></label>
          {definition.fields.map(field => <DimensionInput key={field.key} label={field.label} state={dimensions[field.key]} onChange={next => updateDimension(field.key, next)}/>)}
          {shape !== "plate" && <DimensionInput label="Length" state={customLength} onChange={next => { setCustomLength(next); setCalculatedResult(null); setError(""); }}/>} 
        </div>
        <div className="mt-3 border-t border-slate-200 pt-3"><p className="text-xs font-semibold text-slate-900">Formula</p><p className="mt-0.5 text-xs text-slate-600">{formulaFor(shape)}</p><p className="mt-0.5 text-[11px] text-slate-500">Weight = cross-sectional area × length × density × quantity.</p>{(shape === "equal-angle" || shape === "angle") && <p className="mt-1.5 text-[11px] text-slate-500">Theoretical sharp-corner geometry; rolled sections can differ because of fillets and manufacturing tolerances.</p>}{(shape === "channel" || shape === "i-beam" || shape === "h-beam" || shape === "tee" || shape === "z") && <p className="mt-1.5 text-[11px] text-slate-500">Custom structural-section geometry is an idealized rectangular model and does not include rolled-profile fillets or slopes.</p>}</div>
        {error && <p role="alert" className="mt-3 border border-red-200 bg-red-50 px-2.5 py-2 text-xs text-red-700">{error}</p>}
        <div className="mt-3 flex flex-wrap gap-1.5"><button type="button" onClick={calculate} className="min-h-9 bg-slate-950 px-5 text-xs font-semibold text-white hover:bg-slate-800">Calculate</button><button type="button" onClick={clear} className="min-h-9 border border-slate-300 bg-white px-5 text-xs font-semibold text-slate-700 hover:bg-slate-50">Clear</button><button type="button" onClick={reset} className="min-h-9 px-2.5 text-xs font-medium text-slate-500 hover:text-slate-950">Reset</button></div>
      </section>
      <ResultCard title="Results" totalKg={totalKg} details={[["Material", material],["Shape", definition.label],["Cross-section", valid ? `${area.toFixed(2)} mm²` : "—"],["Piece", valid ? `${resultPieceKg.toFixed(4)} kg` : "—"],["Quantity", valid ? String(resultPieces) : "—"],["Pounds", valid ? `${pounds.toFixed(4)} lb` : "—"]]} formula={formulaFor(shape)}/>
    </div>
  </ToolShell>;
}

function ResultCard({ title, totalKg, details, formula }: { title: string; totalKg: number; details: [string, string][]; formula: string }) {
  return <aside className="h-fit bg-slate-950 p-4 text-white shadow-sm sm:p-5 lg:sticky lg:top-4"><p className="text-xs text-slate-400">{title}</p><div className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{totalKg.toFixed(4)} <span className="text-base font-medium text-slate-400">kg</span></div><p className="mt-0.5 text-xs text-slate-500">{(totalKg / 1000).toFixed(4)} tonnes</p><div className="mt-4 border-t border-slate-800 pt-3 text-xs">{details.map(([label, value]) => <div key={label} className="mt-2 flex justify-between gap-3 first:mt-0"><span className="text-slate-400">{label}</span><span className="max-w-[55%] text-right">{value}</span></div>)}</div><div className="mt-4 border-t border-slate-800 pt-3"><p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Formula</p><p className="mt-1.5 text-[11px] leading-4 text-slate-300">{formula}</p></div></aside>;
}
