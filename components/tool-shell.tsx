import Link from "next/link";

export function ToolShell({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white"><div className="container flex h-16 items-center"><Link href="/" className="text-lg font-bold tracking-tight text-slate-950">Any<span className="text-blue-600">Tools</span></Link></div></header>
      <div className="container py-10 sm:py-14">
        <div className="mb-8 max-w-2xl"><Link href="/" className="text-sm font-medium text-blue-600">← All tools</Link><h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1><p className="mt-3 text-base leading-7 text-slate-500">{description}</p></div>
        {children}
      </div>
    </main>
  );
}
