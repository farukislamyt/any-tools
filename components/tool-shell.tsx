"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Home, Menu, X } from "lucide-react";
import { tools } from "@/lib/tools";

export function ToolShell({
  title,
  description: _description,
  category,
  children,
}: {
  title: string;
  description: string;
  category?: string;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="tool-app flex h-[100dvh] w-full flex-col overflow-hidden bg-slate-50 text-slate-950">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="flex h-12 w-full items-center justify-between gap-3 px-3 sm:px-4">
          <Link href="/" className="shrink-0 text-base font-extrabold tracking-tight" onClick={closeSidebar}>
            Any<span className="text-blue-600">Tools</span>
          </Link>
          <div className="flex items-center gap-1">
            <nav aria-label="Primary navigation" className="hidden items-center gap-0.5 text-sm font-semibold sm:flex">
              <Link href="/" className="px-2.5 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">Home</Link>
              <Link href="/#tools" className="px-2.5 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">Tools</Link>
            </nav>
            <button type="button" aria-label={sidebarOpen ? "Close tools menu" : "Open tools menu"} aria-expanded={sidebarOpen} aria-controls="tool-sidebar-mobile" onClick={() => setSidebarOpen((open) => !open)} className="inline-flex h-8 w-8 items-center justify-center text-slate-700 transition hover:bg-slate-100 sm:hidden">
              {sidebarOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {sidebarOpen && <button type="button" aria-label="Close tools menu" className="fixed inset-0 z-40 bg-slate-950/20 sm:hidden" onClick={closeSidebar} />}

      <aside id="tool-sidebar-mobile" aria-label="Tools menu" className={`fixed left-0 top-12 z-50 h-[calc(100dvh-3rem)] w-fit min-w-[16rem] max-w-[88vw] overflow-y-auto border-r border-slate-200 bg-white p-3 shadow-xl transition-transform duration-200 sm:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <ToolList currentTitle={title} onNavigate={closeSidebar} />
      </aside>

      <main className="tool-main flex min-h-0 w-full flex-1 flex-col overflow-hidden pt-[3rem]">
        <nav aria-label="Breadcrumb" className="mb-2 flex min-h-[22px] w-full shrink-0 items-center gap-1 overflow-x-auto whitespace-nowrap px-3 pt-2 text-xs font-medium text-slate-500 sm:px-4">
          <Link href="/" className="inline-flex shrink-0 items-center gap-1 transition hover:text-slate-950"><Home size={12} aria-hidden="true" />Home</Link>
          <ChevronRight size={12} className="shrink-0 text-slate-300" aria-hidden="true" />
          <Link href="/#tools" className="shrink-0 transition hover:text-slate-950">Tools</Link>
          {category && <><ChevronRight size={12} className="shrink-0 text-slate-300" aria-hidden="true" /><span className="shrink-0">{category}</span></>}
          <ChevronRight size={12} className="shrink-0 text-slate-300" aria-hidden="true" />
          <span className="truncate text-slate-900" aria-current="page">{title}</span>
        </nav>

        <div className="tool-layout flex min-h-0 w-full flex-1 items-stretch gap-4 overflow-hidden px-3 pb-3 sm:gap-5 sm:px-4">
          <aside id="tool-sidebar" aria-label="Tools sidebar" className="hidden min-h-0 w-fit min-w-[11rem] max-w-[18rem] shrink-0 overflow-y-auto border-r border-slate-200 pr-4 lg:block">
            <div className="sticky top-0"><ToolList currentTitle={title} /></div>
          </aside>
          <section data-tool={title} className="tool-workspace min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain">
            {children}
          </section>
        </div>
      </main>

      <footer className="shrink-0 border-t border-slate-200 bg-slate-950 text-slate-400">
        <div className="flex w-full flex-col gap-1.5 px-3 py-2.5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <Link href="/" className="font-bold text-white" onClick={closeSidebar}>Any<span className="text-blue-400">Tools</span></Link>
          <p>Free online tools for everyday calculations.</p>
          <p>© {new Date().getFullYear()} AnyTools</p>
        </div>
      </footer>
    </div>
  );
}

function ToolList({ currentTitle, onNavigate }: { currentTitle: string; onNavigate?: () => void }) {
  const grouped = tools.reduce<Record<string, typeof tools>>((groups, tool) => {
    (groups[tool.category] ??= []).push(tool);
    return groups;
  }, {});

  return (
    <div className="w-max min-w-full">
      {Object.entries(grouped).map(([category, categoryTools]) => (
        <section key={category} className="mb-4 last:mb-0">
          <h2 className="mb-1.5 px-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{category}</h2>
          <nav aria-label={`${category} tools`} className="space-y-0.5">
            {categoryTools.map((tool) => {
              const active = tool.name === currentTitle;
              return (
                <Link key={tool.slug} href={tool.href} onClick={onNavigate} aria-current={active ? "page" : undefined} className={`block whitespace-nowrap px-2 py-1.5 text-sm font-medium transition ${active ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}>
                  {tool.name}
                </Link>
              );
            })}
          </nav>
        </section>
      ))}
    </div>
  );
}
