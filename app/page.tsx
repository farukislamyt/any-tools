import { Search } from "lucide-react";
import { ToolCard } from "@/components/tool-card";
import { categories, tools } from "@/lib/tools";

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="text-lg font-bold tracking-tight text-slate-950">Any<span className="text-blue-600">Tools</span></a>
          <span className="hidden text-sm text-slate-500 sm:block">Simple tools. Zero clutter.</span>
        </div>
      </header>

      <section className="border-b border-slate-200 bg-white">
        <div className="container py-16 text-center sm:py-20">
          <p className="mb-3 text-sm font-semibold text-blue-600">FREE • FAST • PRACTICAL</p>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">Useful tools for everyday life.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">Calculators, converters and engineering utilities designed to be quick, accurate and easy to use.</p>
          <div className="mx-auto mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left shadow-sm">
            <Search size={19} className="shrink-0 text-slate-400" />
            <input aria-label="Search tools" placeholder="Search tools..." className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400" />
            <kbd className="hidden rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-400 sm:block">⌘ K</kbd>
          </div>
        </div>
      </section>

      <section className="container py-10 sm:py-14">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div><h2 className="text-2xl font-bold tracking-tight text-slate-950">All tools</h2><p className="mt-1 text-sm text-slate-500">Start with one of the tools below.</p></div>
          <span className="text-sm text-slate-400">{tools.length} tools</span>
        </div>
        <div className="mb-8 flex gap-2 overflow-x-auto pb-1">
          {categories.map((category, i) => <button key={category} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${i === 0 ? "bg-slate-950 text-white" : "border border-slate-200 bg-white text-slate-600"}`}>{category}</button>)}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => <ToolCard key={tool.slug} tool={tool} />)}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="container flex flex-col gap-2 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} AnyTools</p><p>Built for speed and simplicity.</p>
        </div>
      </footer>
    </main>
  );
}
