import Link from "next/link";
import { ArrowRight, Check, Github, Zap } from "lucide-react";
import { ToolBrowser } from "@/components/home/tool-browser";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { categories, tools } from "@/lib/tools";

const siteUrl = "https://any-tools.vercel.app";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AnyTools",
  url: siteUrl,
  description: "Free online calculators, converters and practical tools for engineering, finance and everyday life.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

const softwareSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AnyTools",
  url: siteUrl,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-slate-950">Any<span className="text-blue-600">Tools</span></Link>
          <nav aria-label="Primary navigation" className="flex items-center gap-2">
            <a href="https://github.com/farukislamyt/any-tools" target="_blank" rel="noreferrer" aria-label="AnyTools on GitHub" className="inline-flex size-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"><Github size={18} /></a>
            <Link href="#tools" className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 sm:block">Browse tools</Link>
          </nav>
        </div>
      </header>

      <section className="relative border-b border-slate-200/80 bg-white" aria-labelledby="hero-title">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.12),transparent_42%)]" />
        <div className="container relative py-16 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <Badge tone="blue"><Zap size={13} className="mr-1.5" /> Free, fast & practical</Badge>
            <h1 id="hero-title" className="mx-auto mt-5 max-w-4xl text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-6xl lg:text-7xl">Useful tools.<br /><span className="text-blue-600">Zero clutter.</span></h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">Free online calculators, unit converters and engineering utilities built to answer everyday questions quickly—without accounts, noise or unnecessary steps.</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="#tools" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800">Explore tools <ArrowRight size={16} /></Link>
              <Link href="/tools/metal-weight" className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50">Steel Weight Calculator</Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-400"><span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> No sign-up</span><span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Fast in your browser</span><span className="inline-flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> Mobile friendly</span></div>
          </div>
        </div>
      </section>

      <section id="tools" className="container scroll-mt-8 py-12 sm:py-16" aria-labelledby="tools-title">
        <SectionHeading eyebrow="Toolbox" title="Free online calculators and useful tools" description="A growing collection of focused utilities for calculations, engineering, conversions, finance and everyday tasks. Search by name or narrow the list by category." action={<span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500 sm:inline-flex">{tools.length} available</span>} />
        <h2 id="tools-title" className="sr-only">AnyTools online tools</h2>
        <div className="mt-8"><ToolBrowser tools={tools} categories={categories} /></div>
      </section>

      <section className="border-y border-slate-200/80 bg-white" aria-labelledby="why-title">
        <div className="container py-12 sm:py-14">
          <h2 id="why-title" className="text-xl font-extrabold tracking-tight text-slate-950">Simple tools designed to get the job done</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            <div><p className="text-sm font-bold text-slate-950">Built for speed</p><p className="mt-2 text-sm leading-6 text-slate-500">Simple interfaces and lightweight interactions keep common calculations quick.</p></div>
            <div><p className="text-sm font-bold text-slate-950">Made to be useful</p><p className="mt-2 text-sm leading-6 text-slate-500">Every tool focuses on one job, with clear inputs and results you can understand.</p></div>
            <div><p className="text-sm font-bold text-slate-950">Growing every week</p><p className="mt-2 text-sm leading-6 text-slate-500">New calculators and engineering utilities can share the same reusable UI foundation.</p></div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400">
        <div className="container flex flex-col gap-3 py-8 text-sm sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} AnyTools</p><p>Free online tools for everyday calculations.</p></div>
      </footer>
    </main>
  );
}
