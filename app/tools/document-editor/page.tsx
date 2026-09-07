"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlignCenter, AlignLeft, AlignRight, Bold, FileDown, Highlighter, ImagePlus,
  IndentDecrease, IndentIncrease, Italic, Link2, List, ListOrdered, Minus,
  Printer, Redo2, Strikethrough, Table2, Underline, Undo2
} from "lucide-react";
import { ToolShell } from "@/components/tool-shell";

const STORAGE_KEY = "anytools-document-editor";

type CommandButtonProps = { label: string; onClick: () => void; children: React.ReactNode };
function ToolbarButton({ label, onClick, children }: CommandButtonProps) {
  return <button type="button" title={label} aria-label={label} onMouseDown={(e) => e.preventDefault()} onClick={onClick} className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-slate-700 transition hover:bg-slate-100 active:bg-slate-200">{children}</button>;
}

export default function DocumentEditorPage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("Untitled document");
  const [saved, setSaved] = useState(true);
  const [stats, setStats] = useState({ words: 0, characters: 0 });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const data = JSON.parse(raw) as { title?: string; html?: string };
      if (data.title) setTitle(data.title);
      if (editorRef.current && data.html) editorRef.current.innerHTML = data.html;
      updateStats(data.html ?? "");
    } catch { localStorage.removeItem(STORAGE_KEY); }
  }, []);

  const updateStats = (html = editorRef.current?.innerHTML ?? "") => {
    const text = editorRef.current?.innerText ?? html.replace(/<[^>]+>/g, " ");
    setStats({ words: text.trim() ? text.trim().split(/\s+/).length : 0, characters: text.length });
  };

  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, html: editorRef.current?.innerHTML ?? "" }));
    setSaved(true);
  };

  const command = (name: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(name, false, value);
    updateStats();
    setSaved(false);
  };

  const formatBlock = (tag: string) => command("formatBlock", tag);

  const insertLink = () => {
    const url = window.prompt("Enter URL");
    if (url) command("createLink", url);
  };

  const insertTable = () => {
    const rows = Math.min(10, Math.max(1, Number(window.prompt("Rows", "3")) || 3));
    const cols = Math.min(8, Math.max(1, Number(window.prompt("Columns", "3")) || 3));
    const table = document.createElement("table");
    table.className = "editor-table";
    for (let r = 0; r < rows; r++) {
      const tr = table.insertRow();
      for (let c = 0; c < cols; c++) {
        const cell = tr.insertCell();
        cell.innerHTML = r === 0 ? `<strong>Header ${c + 1}</strong>` : "&nbsp;";
      }
    }
    editorRef.current?.focus();
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    const range = selection.getRangeAt(0);
    range.collapse(false);
    range.insertNode(table);
    const p = document.createElement("p");
    p.innerHTML = "<br>";
    table.after(p);
    updateStats();
    setSaved(false);
  };

  const insertPageBreak = () => {
    editorRef.current?.focus();
    const pageBreak = document.createElement("div");
    pageBreak.className = "document-page-break";
    pageBreak.setAttribute("contenteditable", "false");
    pageBreak.innerHTML = "<span>Page break</span>";
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    const range = selection.getRangeAt(0);
    range.collapse(false);
    range.insertNode(pageBreak);
    const p = document.createElement("p");
    p.innerHTML = "<br>";
    pageBreak.after(p);
    updateStats();
    setSaved(false);
  };

  const insertImage = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      editorRef.current?.focus();
      const img = document.createElement("img");
      img.src = String(reader.result);
      img.alt = file.name;
      img.className = "editor-image";
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      const selection = window.getSelection();
      if (selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        range.collapse(false);
        range.insertNode(img);
        const p = document.createElement("p"); p.innerHTML = "<br>"; img.after(p);
      }
      updateStats(); setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const newDocument = () => {
    setTitle("Untitled document");
    if (editorRef.current) editorRef.current.innerHTML = "<p><br></p>";
    updateStats(""); localStorage.removeItem(STORAGE_KEY); setSaved(true);
  };

  const exportHtml = () => {
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>body{font-family:Arial,sans-serif;line-height:1.7;max-width:850px;margin:40px auto}table{border-collapse:collapse;width:100%}td{border:1px solid #999;padding:8px}.document-page-break{page-break-after:always;border:0!important}</style></head><body>${editorRef.current?.innerHTML ?? ""}</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = `${title || "document"}.html`; a.click(); URL.revokeObjectURL(url);
  };

  return <ToolShell title="Document Editor" description="A lightweight Word-style document editor." category="Writing">
    <div className="w-full">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <input value={title} onChange={(e) => { setTitle(e.target.value); setSaved(false); }} onBlur={save} aria-label="Document title" className="min-w-0 flex-1 bg-transparent px-1 py-1 text-lg font-bold outline-none placeholder:text-slate-400" placeholder="Document title" />
        <div className="flex items-center gap-1 text-xs text-slate-500"><span>{saved ? "Saved" : "Unsaved changes"}</span><button type="button" onClick={save} className="px-2 py-1 font-semibold text-slate-700 hover:bg-slate-100">Save</button><button type="button" onClick={newDocument} className="px-2 py-1 font-semibold text-slate-700 hover:bg-slate-100">New</button><button type="button" onClick={() => window.print()} className="inline-flex h-8 w-8 items-center justify-center text-slate-700 hover:bg-slate-100" aria-label="Print document" title="Print"><Printer size={16}/></button><button type="button" onClick={exportHtml} className="inline-flex h-8 w-8 items-center justify-center text-slate-700 hover:bg-slate-100" aria-label="Export HTML" title="Export HTML"><FileDown size={16}/></button></div>
      </div>

      <div className="flex w-full flex-wrap items-center gap-0.5 border-y border-slate-200 bg-white px-1 py-1 print:hidden">
        <ToolbarButton label="Undo" onClick={() => command("undo")}><Undo2 size={16}/></ToolbarButton><ToolbarButton label="Redo" onClick={() => command("redo")}><Redo2 size={16}/></ToolbarButton><span className="mx-1 h-5 w-px bg-slate-200" />
        <select aria-label="Text style" defaultValue="p" onChange={(e) => formatBlock(e.target.value)} className="h-8 w-28 bg-transparent px-1 text-xs outline-none hover:bg-slate-100"><option value="p">Normal</option><option value="h1">Heading 1</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="blockquote">Quote</option></select>
        <select aria-label="Font family" defaultValue="Arial" onChange={(e) => command("fontName", e.target.value)} className="h-8 w-24 bg-transparent px-1 text-xs outline-none hover:bg-slate-100"><option>Arial</option><option>Georgia</option><option>Times New Roman</option><option>Verdana</option><option>Courier New</option></select>
        <select aria-label="Font size" defaultValue="3" onChange={(e) => command("fontSize", e.target.value)} className="h-8 w-14 bg-transparent px-1 text-xs outline-none hover:bg-slate-100"><option value="1">10</option><option value="2">12</option><option value="3">14</option><option value="4">18</option><option value="5">24</option><option value="6">32</option><option value="7">48</option></select><span className="mx-1 h-5 w-px bg-slate-200" />
        <ToolbarButton label="Bold" onClick={() => command("bold")}><Bold size={16}/></ToolbarButton><ToolbarButton label="Italic" onClick={() => command("italic")}><Italic size={16}/></ToolbarButton><ToolbarButton label="Underline" onClick={() => command("underline")}><Underline size={16}/></ToolbarButton><ToolbarButton label="Strikethrough" onClick={() => command("strikeThrough")}><Strikethrough size={16}/></ToolbarButton>
        <label title="Text color" className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-sm font-bold text-slate-700 hover:bg-slate-100">A<input type="color" className="sr-only" onChange={(e) => command("foreColor", e.target.value)}/></label><label title="Highlight" className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-slate-700 hover:bg-slate-100"><Highlighter size={16}/><input type="color" defaultValue="#fff59d" className="sr-only" onChange={(e) => command("hiliteColor", e.target.value)}/></label><span className="mx-1 h-5 w-px bg-slate-200" />
        <ToolbarButton label="Align left" onClick={() => command("justifyLeft")}><AlignLeft size={16}/></ToolbarButton><ToolbarButton label="Align center" onClick={() => command("justifyCenter")}><AlignCenter size={16}/></ToolbarButton><ToolbarButton label="Align right" onClick={() => command("justifyRight")}><AlignRight size={16}/></ToolbarButton><ToolbarButton label="Bulleted list" onClick={() => command("insertUnorderedList")}><List size={16}/></ToolbarButton><ToolbarButton label="Numbered list" onClick={() => command("insertOrderedList")}><ListOrdered size={16}/></ToolbarButton><ToolbarButton label="Decrease indent" onClick={() => command("outdent")}><IndentDecrease size={16}/></ToolbarButton><ToolbarButton label="Increase indent" onClick={() => command("indent")}><IndentIncrease size={16}/></ToolbarButton>
        <ToolbarButton label="Insert link" onClick={insertLink}><Link2 size={16}/></ToolbarButton><ToolbarButton label="Insert table" onClick={insertTable}><Table2 size={16}/></ToolbarButton><ToolbarButton label="Insert page break" onClick={insertPageBreak}><Minus size={16}/></ToolbarButton><ToolbarButton label="Insert image" onClick={() => imageInputRef.current?.click()}><ImagePlus size={16}/></ToolbarButton>
        <input ref={imageInputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if (file) insertImage(file); e.currentTarget.value = ""; }} />
      </div>

      <div className="overflow-x-auto bg-slate-100 px-2 py-4 sm:px-4 sm:py-6">
        <article className="mx-auto min-h-[70vh] w-full max-w-[850px] bg-white px-7 py-8 shadow-sm sm:min-h-[1050px] sm:px-16 sm:py-14 print:min-h-0 print:max-w-none print:px-0 print:py-0 print:shadow-none">
          <div ref={editorRef} contentEditable suppressContentEditableWarning spellCheck className="document-editor min-h-[60vh] text-[15px] leading-7 text-slate-900 outline-none sm:min-h-[950px]" onInput={() => { updateStats(); setSaved(false); }} onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); save(); } }} aria-label="Document editor"><p><br/></p></div>
        </article>
      </div>
      <div className="mt-2 flex items-center justify-end gap-4 px-1 text-xs text-slate-500 print:hidden"><span>{stats.words} words</span><span>{stats.characters} characters</span></div>
    </div>
  </ToolShell>;
}

function escapeHtml(value: string) { return value.replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char] ?? char)); }
