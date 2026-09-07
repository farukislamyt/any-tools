"use client";

import { useEffect, useState } from "react";
import { ToolShell } from "@/components/tool-shell";

const STORAGE_KEY = "anytools-note";

export default function NotesPage() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setNote(localStorage.getItem(STORAGE_KEY) ?? "");
  }, []);

  function update(value: string) {
    setNote(value);
    localStorage.setItem(STORAGE_KEY, value);
    setSaved(true);
  }

  function clear() {
    setNote("");
    localStorage.removeItem(STORAGE_KEY);
    setSaved(false);
  }

  return (
    <ToolShell title="Notes" description="Write and save a quick note in your browser." category="Writing">
      <div className="border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
          <span className="text-sm font-semibold text-slate-700">Quick note</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">{saved ? "Saved" : "Ready"}</span>
            <button type="button" onClick={clear} className="px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-950">Clear</button>
          </div>
        </div>
        <textarea
          value={note}
          onChange={(event) => update(event.target.value)}
          placeholder="Start typing..."
          aria-label="Note"
          className="min-h-[60vh] w-full resize-y border-0 bg-white p-4 text-base leading-7 text-slate-900 outline-none focus:ring-0"
          spellCheck
        />
      </div>
    </ToolShell>
  );
}
