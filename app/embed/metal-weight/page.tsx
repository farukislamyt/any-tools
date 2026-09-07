"use client";

import { useEffect, useState } from "react";

const input = "mt-1 h-11 w-full border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100";

export default function MetalWeightEmbed() {
  const [width, setWidth] = useState("8");
  const [length, setLength] = useState("4");
  const [thickness, setThickness] = useState("1.2");
  const [quantity, setQuantity] = useState("1");
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedTheme = params.get("theme");
    if (requestedTheme === "dark" || requestedTheme === "light") setTheme(requestedTheme);
    if (params.get("width")) setWidth(params.get("width")!);
    if (params.get("length")) setLength(params.get("length")!);
    if (params.get("thickness")) setThickness(params.get("thickness")!);
    if (params.get("quantity")) setQuantity(params.get("quantity")!);

    const sendHeight = () => {
      const targetOrigin = document.referrer ? new URL(document.referrer).origin : "*";
      window.parent.postMessage({ type: "anytools-resize", height: document.documentElement.scrollHeight }, targetOrigin);
    };
    sendHeight();
    window.addEventListener("load", sendHeight);
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.documentElement);
    return () => { window.removeEventListener("load", sendHeight); observer.disconnect(); };
  }, []);

  const widthMm = Number(width) * 304.8;
  const lengthMm = Number(length) * 304.8;
  const thicknessMm = Number(thickness);
  const qty = Math.max(0, Math.floor(Number(quantity) || 0));
  const total = Number.isFinite(widthMm) && Number.isFinite(lengthMm) && Number.isFinite(thicknessMm) && widthMm > 0 && lengthMm > 0 && thicknessMm > 0 ? widthMm * lengthMm * thicknessMm * 7850 / 1e9 * qty : 0;

  return (
    <main className={theme === "dark" ? "min-h-screen bg-slate-950 p-4 text-white" : "min-h-screen bg-slate-50 p-4 text-slate-950"}>
      <div className="mx-auto max-w-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5"><p className="text-xs font-semibold uppercase tracking-wider text-slate-400">AnyTools</p><h1 className="mt-1 text-xl font-bold">Sheet Weight Calculator</h1><p className="mt-1 text-sm text-slate-500">Steel sheet: width × length × thickness × density × quantity</p></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">Width (ft)<input className={input} type="number" min="0" step="any" value={width} onChange={e => setWidth(e.target.value)} /></label>
          <label className="text-sm font-medium">Length (ft)<input className={input} type="number" min="0" step="any" value={length} onChange={e => setLength(e.target.value)} /></label>
          <label className="text-sm font-medium">Thickness (mm)<input className={input} type="number" min="0" step="any" value={thickness} onChange={e => setThickness(e.target.value)} /></label>
          <label className="text-sm font-medium">Quantity<input className={input} type="number" min="1" step="1" value={quantity} onChange={e => setQuantity(e.target.value)} /></label>
        </div>
        <div className="mt-5 bg-slate-950 p-5 text-white"><p className="text-sm text-slate-400">Estimated total weight</p><p className="mt-1 text-4xl font-bold">{total.toFixed(4)} <span className="text-base font-medium text-slate-400">kg</span></p><div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800 pt-4 text-sm"><div><span className="block text-slate-500">Tonnes</span>{(total / 1000).toFixed(4)}</div><div><span className="block text-slate-500">Pounds</span>{(total * 2.20462262185).toFixed(4)} lb</div></div></div>
        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-400"><span>Theoretical weight using steel density 7850 kg/m³.</span><a href="/tools/metal-weight" target="_blank" rel="noreferrer" className="font-medium text-slate-600 hover:text-slate-950">Open full calculator ↗</a></div>
      </div>
    </main>
  );
}
