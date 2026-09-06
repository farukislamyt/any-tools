"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ToolCard } from "@/components/ui/tool-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Tool } from "@/lib/tools";

export function ToolBrowser({ tools, categories }: { tools: Tool[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesCategory = category === "All" || tool.category === category;
      const matchesQuery = !normalized || `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [category, query, tools]);

  return (
    <div>
      <div className="sticky top-0 z-10 -mx-3 mb-7 border-y border-slate-200/80 bg-slate-50/95 px-3 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            {categories.map((item) => (
              <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${category === item ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950"}`}>
                {item}
              </button>
            ))}
          </div>
          <div className="relative w-full shrink-0 lg:w-72">
            <Search size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter tools..." aria-label="Filter tools" className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-9 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            {query && <button aria-label="Clear search" onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"><X size={16} /></button>}
          </div>
        </div>
      </div>

      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2"><SlidersHorizontal size={16} className="text-slate-400" /><span className="text-sm font-medium text-slate-600">{filtered.length} {filtered.length === 1 ? "tool" : "tools"}</span></div>
        {query && <Badge tone="blue">Searching “{query}”</Badge>}
      </div>

      {filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{filtered.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}</div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500"><Search size={20} /></div>
          <h3 className="mt-4 text-base font-bold text-slate-950">No tools found</h3>
          <p className="mt-1 text-sm text-slate-500">Try another search or category.</p>
          <Button variant="secondary" className="mt-5" onClick={() => { setQuery(""); setCategory("All"); }}>Reset filters</Button>
        </div>
      )}
    </div>
  );
}
