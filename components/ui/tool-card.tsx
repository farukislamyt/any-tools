import Link from "next/link";
import { ArrowLeftRight, Banknote, Calculator, Calendar, Percent, Scale, ArrowUpRight } from "lucide-react";
import type { Tool } from "@/lib/tools";

const icons = { calculator: Calculator, scale: Scale, "arrow-left-right": ArrowLeftRight, percent: Percent, calendar: Calendar, banknote: Banknote };

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = icons[tool.icon as keyof typeof icons] ?? Calculator;
  return (
    <Link href={tool.href} className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
      <div className="flex items-start justify-between gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-blue-600 group-hover:text-white">
          <Icon size={20} strokeWidth={1.9} />
        </div>
        <ArrowUpRight size={18} className="text-slate-300 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slate-600" />
      </div>
      <p className="mt-5 text-xs font-bold uppercase tracking-wider text-blue-600">{tool.category}</p>
      <h3 className="mt-1 text-base font-bold tracking-tight text-slate-950">{tool.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{tool.description}</p>
    </Link>
  );
}
