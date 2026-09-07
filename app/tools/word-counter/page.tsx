"use client";

import { useMemo, useState } from "react";
import { ToolShell } from "@/components/tool-shell";

export default function WordCounterPage() {
  const [text, setText] = useState("");

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const lines = text ? text.split(/\r?\n/).length : 0;
    const sentences = trimmed ? (trimmed.match(/[.!?]+(?=\s|$)/g) ?? []).length : 0;
    return { words, characters, charactersNoSpaces, lines, sentences };
  }, [text]);

  return (
    <ToolShell title="Word Counter" description="Count words, characters, lines and sentences instantly." category="Writing">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste or type your text here..."
          aria-label="Text to count"
          className="min-h-[60vh] w-full resize-y border border-slate-200 bg-white p-4 text-base leading-7 text-slate-900 outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
          spellCheck
        />
        <div className="grid grid-cols-2 gap-px self-start border border-slate-200 bg-slate-200 lg:grid-cols-1">
          <Stat label="Words" value={stats.words} />
          <Stat label="Characters" value={stats.characters} />
          <Stat label="Characters without spaces" value={stats.charactersNoSpaces} />
          <Stat label="Lines" value={stats.lines} />
          <Stat label="Sentences" value={stats.sentences} />
        </div>
      </div>
    </ToolShell>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="bg-white p-4"><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">{value.toLocaleString()}</p></div>;
}
