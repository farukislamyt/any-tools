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
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight text-slate-950">
            Any<span className="text-blue-600">Tools</span>
          </Link>
          <nav aria-label="Tool navigation" className="flex items-center gap-1 text-sm font-semibold">
            <Link href="/" className="px-2 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-950">Home</Link>
            <Link href="/#tools" className="px-2 py-1.5 text-slate-600 hover:bg-slate-100 hover:text-slate-950">All tools</Link>
          </nav>
        </div>
      </header>

      <div className="container py-6 sm:py-8">
        <nav aria-label="Breadcrumb" className="mb-5 flex min-w-0 items-center gap-1 overflow-x-auto whitespace-nowrap text-xs font-medium text-slate-500">
          <Link href="/" className="inline-flex shrink-0 items-center gap-1 hover:text-slate-950">
            <Home size={13} aria-hidden="true" /> Home
          </Link>
          <ChevronRight size={13} className="shrink-0 text-slate-300" aria-hidden="true" />
          <Link href="/#tools" className="shrink-0 hover:text-slate-950">Tools</Link>
          {category && <><ChevronRight size={13} className="shrink-0 text-slate-300" aria-hidden="true" /><Link href="/#tools" className="shrink-0 hover:text-slate-950">{category}</Link></>}
          <ChevronRight size={13} className="shrink-0 text-slate-300" aria-hidden="true" />
          <span className="truncate text-slate-900" aria-current="page">{title}</span>
        </nav>

        <div className="mb-6 max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">{description}</p>
        </div>
        {children}
      </div>
    </main>
  );
}
