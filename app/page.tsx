import Link from "next/link";
import { ArrowRight, Check, Github, Zap } from "lucide-react";
import { ToolBrowser } from "@/components/home/tool-browser";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { tools } from "@/lib/tools";

const siteUrl = "https://any-tools.vercel.app";

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AnyTools",
  url: siteUrl,
  description: "Free online calculators, converters and practical tools for engineering, finance and everyday life.",
  potentialAction: { "@type": "SearchAction", target: `${siteUrl}/?q={search_term_string}`, "query-input": "required name=search_term_string" },
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
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-slate-950">Any<span className="text-blue-600">Tools</span></Link>
          <nav aria-label="Primary navigation" className="flex items-center gap-1">
            <Link href="#tools" className="px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950">Tools</Link>
            <a href="https://github.com/farukislamyt/any-tools" target="_blank" rel="noreferrer" aria-label="AnyTools on GitHub" className="inline-flex size-8 items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-950"><Github size={17} /></a>
          </nav>
        </div>
      </header>

      <section className="relative border-b border-slate-200/80 bg-white" aria-labelledby="hero-title">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.12),transparent_42%)]" />
        <div className="container relative py-10 sm:py-14 lg:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <Badge tone="blue"><Zap size={13} className="mr-1.5" /> Free, fast & practical</Badge>
            <h1 id="hero-title" className="mx-auto mt-4 max-w-4xl text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-6xl">Useful tools.<br /><span className="text-blue-600">Zero clutter.</span></h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">Free online calculators, unit converters and engineering utilities built to answer everyday questions quickly—without accounts, noise or unnecessary steps.</p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-2 sm:flex-row sm:items-center">
              <Link href="#tools" className="inline-flex h-10 items-center justify-center gap-2 bg-slate-950 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800">Explore tools <ArrowRight size={16} /></Link>
              <Link href="/tools/metal-weight" className="inline-flex h-10 items-center justify-center border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50">Steel Weight Calculator</Link>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs font-medium text-slate-400"><span className="inline-flex items-center gap-1.5"><Check size={13} className="text-emerald-500" /> No sign-up</span><span className="inline-flex items-center gap-1.5"><Check size={13} className="text-emerald-500" /> Fast in your browser</span><span className="inline-flex items-center gap-1.5"><Check size={13} className="text-emerald-500" /> Mobile friendly</span></div>
          </div>
        </div>
      </section>

      <section id="tools" className="container scroll-mt-6 py-8 sm:py-10" aria-labelledby="tools-title">
        <SectionHeading eyebrow="Toolbox" title="Free online calculators and useful tools" description="Focused utilities for calculations, engineering, conversions, finance and everyday tasks. Search by name or category." action={<span className="hidden bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500 sm:inline-flex">{tools.length} available</span>} />
        <h2 id="tools-title" className="sr-only">AnyTools online tools</h2>
        <div className="mt-5"><ToolBrowser tools={tools} categories={["All", ...Array.from(new Set(tools.map((tool) => tool.category)))]} /></div>
      </section>

      <section className="border-y border-slate-200/80 bg-white" aria-labelledby="why-title">
        <div className="container py-8 sm:py-10">
          <h2 id="why-title" className="text-xl font-extrabold tracking-tight text-slate-950">Simple tools designed to get the job done</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <div><p className="text-sm font-bold text-slate-950">Built for speed</p><p className="mt-1 text-sm leading-6 text-slate-500">Simple interfaces and lightweight interactions keep common calculations quick.</p></div>
            <div><p className="text-sm font-bold text-slate-950">Made to be useful</p><p className="mt-1 text-sm leading-6 text-slate-500">Every tool focuses on one job, with clear inputs and results you can understand.</p></div>
            <div><p className="text-sm font-bold text-slate-950">Growing every week</p><p className="mt-1 text-sm leading-6 text-slate-500">New calculators and engineering utilities can share the same reusable UI foundation.</p></div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 text-slate-400">
        <div className="container flex flex-col gap-2 py-6 text-sm sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} AnyTools</p><p>Free online tools for everyday calculations.</p></div>
      </footer>
    </main>
  );
}
