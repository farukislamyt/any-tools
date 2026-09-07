import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

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
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="text-lg font-extrabold tracking-tight">
            Any<span className="text-blue-600">Tools</span>
          </Link>
          <nav aria-label="Primary navigation" className="flex items-center gap-1 text-sm font-semibold">
            <Link href="/" className="px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
              Home
            </Link>
            <Link href="/#tools" className="px-3 py-1.5 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">
              Tools
            </Link>
          </nav>
        </div>
      </header>

      {/* Main area */}
      <main className="container py-6 sm:py-8">
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

        <div className="mb-6 max-w-2xl">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">{category ?? "Tool"}</p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">{description}</p>
        </div>

        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-slate-950 text-slate-400">
        <div className="container flex flex-col gap-2 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="font-bold text-white hover:text-slate-200">
            Any<span className="text-blue-400">Tools</span>
          </Link>
          <p>Free online tools for everyday calculations.</p>
          <p>© {new Date().getFullYear()} AnyTools</p>
        </div>
      </footer>
    </div>
  );
}
