import Link from "next/link";
import { ArrowLeftRight, Banknote, Calculator, Calendar, Percent, Scale } from "lucide-react";
import type { Tool } from "@/lib/tools";

const icons = { calculator: Calculator, scale: Scale, "arrow-left-right": ArrowLeftRight, percent: Percent, calendar: Calendar, banknote: Banknote };

export function ToolCard({ tool }: { tool: Tool }) {
  const Icon = icons[tool.icon as keyof typeof icons];
  return (
    <Link href={tool.href} className="tool-card block rounded-2xl border border-slate-200 bg-white p-5 no-underline">
      <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        <Icon size={21} strokeWidth={1.8} />
      </div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-blue-600">{tool.category}</p>
      <h2 className="text-base font-semibold text-slate-900">{tool.name}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500">{tool.description}</p>
    </Link>
  );
}
