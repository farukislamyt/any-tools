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
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="container flex h-14 items-center justify-between gap-4">
          <Link href="/" className="shrink-0 text-lg font-extrabold tracking-tight" onClick={closeSidebar}>
            Any<span className="text-blue-600">Tools</span>
          </Link>

          <div className="flex items-center gap-1">
            <nav aria-label="Primary navigation" className="hidden items-center gap-1 text-sm font-semibold sm:flex">
              <Link href="/" className="px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
                Home
              </Link>
              <Link href="/#tools" className="px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
                Tools
              </Link>
            </nav>

            <button
              type="button"
              aria-label={sidebarOpen ? "Close tools menu" : "Open tools menu"}
              aria-expanded={sidebarOpen}
              aria-controls="tool-sidebar"
              onClick={() => setSidebarOpen((open) => !open)}
              className="inline-flex h-9 w-9 items-center justify-center text-slate-700 transition hover:bg-slate-100 sm:hidden"
            >
              {sidebarOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close tools menu"
          className="fixed inset-0 z-30 bg-slate-950/20 sm:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        id="tool-sidebar-mobile"
        aria-label="Tools menu"
        className={`fixed right-0 top-14 z-40 h-[calc(100vh-3.5rem)] w-[min(19rem,88vw)] border-l border-slate-200 bg-white p-4 shadow-xl transition-transform duration-200 sm:hidden ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ToolList currentTitle={title} onNavigate={closeSidebar} />
      </aside>

      {/* Main area */}
      <main className="container flex-1 py-6 sm:py-8">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex min-w-0 items-center gap-1 overflow-x-auto whitespace-nowrap text-xs font-medium text-slate-500"
        >
          <Link href="/" className="inline-flex shrink-0 items-center gap-1 transition hover:text-slate-950">
            <Home size={13} aria-hidden="true" />
            Home
          </Link>
          <ChevronRight size={13} className="shrink-0 text-slate-300" aria-hidden="true" />
          <Link href="/#tools" className="shrink-0 transition hover:text-slate-950">
            Tools
          </Link>
          {category && (
            <>
              <ChevronRight size={13} className="shrink-0 text-slate-300" aria-hidden="true" />
              <span className="shrink-0 text-slate-500">{category}</span>
            </>
          )}
          <ChevronRight size={13} className="shrink-0 text-slate-300" aria-hidden="true" />
          <span className="truncate text-slate-900" aria-current="page">
            {title}
          </span>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <section aria-labelledby="tool-title" className="min-w-0">
            <div className="mb-6 max-w-2xl">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">{category ?? "Tool"}</p>
              <h1 id="tool-title" className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">{description}</p>
            </div>

            {children}
          </section>

          {/* Right sidebar — desktop */}
          <aside id="tool-sidebar" aria-label="Tools sidebar" className="hidden border-l border-slate-200 pl-6 lg:block">
            <div className="sticky top-6">
              <ToolList currentTitle={title} />
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-950 text-slate-400">
        <div className="container flex flex-col gap-2 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="font-bold text-white" onClick={closeSidebar}>
            Any<span className="text-blue-400">Tools</span>
          </Link>
          <p>Free online tools for everyday calculations.</p>
          <p>© {new Date().getFullYear()} AnyTools</p>
        </div>
      </footer>
    </div>
  );
}

function ToolList({ currentTitle, onNavigate }: { currentTitle: string; onNavigate?: () => void }) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Tools</p>
      <nav aria-label="Tool navigation" className="space-y-1">
        {tools.map((tool) => {
          const active = tool.name === currentTitle;

          return (
            <Link
              key={tool.slug}
              href={tool.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={`block px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-slate-100 text-slate-950"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              <span className="block">{tool.name}</span>
              <span className="mt-0.5 block text-xs font-normal text-slate-400">{tool.category}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
