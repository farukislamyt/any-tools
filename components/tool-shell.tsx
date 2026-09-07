"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Home, Menu, X } from "lucide-react";
import { tools } from "@/lib/tools";

export function ToolShell({
  title,
  description,
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
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="container flex h-12 items-center justify-between gap-3">
          <Link href="/" className="shrink-0 text-base font-extrabold tracking-tight" onClick={closeSidebar}>
            Any<span className="text-blue-600">Tools</span>
          </Link>

          <div className="flex items-center gap-1">
            <nav aria-label="Primary navigation" className="hidden items-center gap-0.5 text-sm font-semibold sm:flex">
              <Link href="/" className="px-2.5 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">Home</Link>
              <Link href="/#tools" className="px-2.5 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">Tools</Link>
            </nav>
            <button
              type="button"
              aria-label={sidebarOpen ? "Close tools menu" : "Open tools menu"}
              aria-expanded={sidebarOpen}
              aria-controls="tool-sidebar-mobile"
              onClick={() => setSidebarOpen((open) => !open)}
              className="inline-flex h-8 w-8 items-center justify-center text-slate-700 transition hover:bg-slate-100 sm:hidden"
            >
              {sidebarOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {sidebarOpen && (
        <button type="button" aria-label="Close tools menu" className="fixed inset-0 z-40 bg-slate-950/20 sm:hidden" onClick={closeSidebar} />
      )}

      <aside
        id="tool-sidebar-mobile"
        aria-label="Tools menu"
        className={`fixed right-0 top-12 z-50 h-[calc(100vh-3rem)] w-[min(18rem,88vw)] border-l border-slate-200 bg-white p-3 shadow-xl transition-transform duration-200 sm:hidden ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <ToolList currentTitle={title} onNavigate={closeSidebar} />
      </aside>

      <main className="container flex-1 pb-6 pt-[4.25rem] sm:pb-8 sm:pt-[4.5rem]">
        <nav aria-label="Breadcrumb" className="mb-3 flex min-w-0 items-center gap-1 overflow-x-auto whitespace-nowrap text-xs font-medium text-slate-500">
          <Link href="/" className="inline-flex shrink-0 items-center gap-1 transition hover:text-slate-950"><Home size={12} aria-hidden="true" />Home</Link>
          <ChevronRight size={12} className="shrink-0 text-slate-300" aria-hidden="true" />
          <Link href="/#tools" className="shrink-0 transition hover:text-slate-950">Tools</Link>
          {category && <><ChevronRight size={12} className="shrink-0 text-slate-300" aria-hidden="true" /><span className="shrink-0">{category}</span></>}
          <ChevronRight size={12} className="shrink-0 text-slate-300" aria-hidden="true" />
          <span className="truncate text-slate-900" aria-current="page">{title}</span>
        </nav>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <section aria-labelledby="tool-title" className="min-w-0">
            <div className="mb-4 max-w-2xl">
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-blue-600">{category ?? "Tool"}</p>
              <h1 id="tool-title" className="text-2xl font-black tracking-tight sm:text-3xl">{title}</h1>
              <p className="mt-1.5 text-sm leading-5 text-slate-500 sm:text-[15px]">{description}</p>
            </div>
            {children}
          </section>

          <aside id="tool-sidebar" aria-label="Tools sidebar" className="hidden border-l border-slate-200 pl-4 lg:block">
            <div className="sticky top-16"><ToolList currentTitle={title} /></div>
          </aside>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-slate-950 text-slate-400">
        <div className="container flex flex-col gap-1.5 py-4 text-xs sm:flex-row sm:items-center sm:justify-between">
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
    <div>
      {Object.entries(grouped).map(([category, categoryTools]) => (
        <section key={category} className="mb-4 last:mb-0">
          <h2 className="mb-1.5 px-2 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">{category}</h2>
          <nav aria-label={`${category} tools`} className="space-y-0.5">
            {categoryTools.map((tool) => {
              const active = tool.name === currentTitle;
              return (
                <Link
                  key={tool.slug}
                  href={tool.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`block px-2 py-1.5 text-sm font-medium transition ${active ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}
                >
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
