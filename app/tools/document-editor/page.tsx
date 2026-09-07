"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlignCenter, AlignLeft, AlignRight, Bold, Copy, Eraser, FileDown, Highlighter,
  ImagePlus, IndentDecrease, IndentIncrease, Italic, Link2, List, ListOrdered,
  Minus, Printer, Redo2, Search, Strikethrough, Table2, Underline, Undo2,
} from "lucide-react";
import { ToolShell } from "@/components/tool-shell";

const STORAGE_KEY = "anytools-document-editor-v3";
type Doc = { id: string; title: string; html: string; updatedAt: number };
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function ToolbarButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" title={label} aria-label={label} onMouseDown={(e) => e.preventDefault()} onClick={onClick} className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-slate-700 transition hover:bg-slate-100 active:bg-slate-200">{children}</button>;
}

export default function DocumentEditorPage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [activeId, setActiveId] = useState("");
  const [title, setTitle] = useState("Untitled document");
  const [saved, setSaved] = useState(true);
  const [stats, setStats] = useState({ words: 0, characters: 0 });
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [showFind, setShowFind] = useState(false);
  const [lineSpacing, setLineSpacing] = useState("1.75");
  const [paragraphSpacing, setParagraphSpacing] = useState("0.35em");
  const [pageSize, setPageSize] = useState("A4");
  const [orientation, setOrientation] = useState("portrait");
  const [margins, setMargins] = useState("normal");
  const [showHeader, setShowHeader] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  const [pageNumber, setPageNumber] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    let loaded: Doc[] = [];
    try { loaded = raw ? JSON.parse(raw) as Doc[] : []; } catch { loaded = []; }
    if (!loaded.length) {
      const legacy = localStorage.getItem("anytools-document-editor");
      try {
        const old = legacy ? JSON.parse(legacy) as { title?: string; html?: string } : {};
        loaded = [{ id: uid(), title: old.title || "Untitled document", html: old.html || "<p><br></p>", updatedAt: Date.now() }];
      } catch { loaded = [{ id: uid(), title: "Untitled document", html: "<p><br></p>", updatedAt: Date.now() }]; }
    }
    setDocs(loaded); setActiveId(loaded[0].id); setTitle(loaded[0].title);
    requestAnimationFrame(() => { if (editorRef.current) editorRef.current.innerHTML = loaded[0].html; updateStats(loaded[0].html); });
  }, []);

  const updateStats = (html = editorRef.current?.innerHTML ?? "") => {
    const text = editorRef.current?.innerText ?? html.replace(/<[^>]+>/g, " ");
    setStats({ words: text.trim() ? text.trim().split(/\s+/).length : 0, characters: text.length });
  };

  const persistDocs = (next: Doc[]) => { setDocs(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); };

  const save = () => {
    if (!activeId) return;
    const next = docs.map((doc) => doc.id === activeId ? { ...doc, title, html: editorRef.current?.innerHTML ?? "", updatedAt: Date.now() } : doc);
    persistDocs(next); setSaved(true);
  };

  useEffect(() => {
    if (!activeId || saved) return;
    const timer = window.setTimeout(save, 900);
    return () => window.clearTimeout(timer);
  }, [title, saved, activeId]);

  const command = (name: string, value?: string) => {
    editorRef.current?.focus(); document.execCommand(name, false, value); updateStats(); setSaved(false);
  };

  const formatBlock = (tag: string) => command("formatBlock", tag);
  const insertLink = () => { const url = window.prompt("Enter URL"); if (url) command("createLink", url); };

  const clearFormatting = () => { command("removeFormat"); command("formatBlock", "p"); };
  const replaceAll = () => {
    if (!find) return;
    const root = editorRef.current; if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = []; let node: Node | null;
    while ((node = walker.nextNode())) nodes.push(node as Text);
    nodes.forEach((text) => { if (text.data.includes(find)) text.data = text.data.split(find).join(replace); });
    updateStats(); setSaved(false);
  };

  const insertTable = () => {
    const rows = Math.min(10, Math.max(1, Number(window.prompt("Rows", "3")) || 3));
    const cols = Math.min(8, Math.max(1, Number(window.prompt("Columns", "3")) || 3));
    const table = document.createElement("table"); table.className = "editor-table";
    for (let r = 0; r < rows; r++) { const tr = table.insertRow(); for (let c = 0; c < cols; c++) { const cell = tr.insertCell(); cell.innerHTML = r === 0 ? `<strong>Header ${c + 1}</strong>` : "&nbsp;"; } }
    insertNode(table, true);
  };

  const insertPageBreak = () => { const pageBreak = document.createElement("div"); pageBreak.className = "document-page-break"; pageBreak.setAttribute("contenteditable", "false"); pageBreak.innerHTML = "<span>Page break</span>"; insertNode(pageBreak, true); };

  const insertNode = (node: Node, addParagraph: boolean) => {
    editorRef.current?.focus(); const selection = window.getSelection(); if (!selection?.rangeCount) return;
    const range = selection.getRangeAt(0); range.collapse(false); range.insertNode(node);
    if (addParagraph) { const p = document.createElement("p"); p.innerHTML = "<br>"; node.parentNode?.insertBefore(p, node.nextSibling); }
    updateStats(); setSaved(false);
  };

  const insertImage = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader(); reader.onload = () => { const img = document.createElement("img"); img.src = String(reader.result); img.alt = file.name; img.className = "editor-image"; img.style.maxWidth = "100%"; img.style.height = "auto"; insertNode(img, true); }; reader.readAsDataURL(file);
  };

  const switchDocument = (id: string) => {
    if (id === activeId) return;
    if (!saved && !window.confirm("You have unsaved changes. Switch documents anyway?")) return;
    const target = docs.find((d) => d.id === id); if (!target) return;
    setActiveId(id); setTitle(target.title); setSaved(true); if (editorRef.current) editorRef.current.innerHTML = target.html; updateStats(target.html);
  };

  const newDocument = () => {
    if (!saved && !window.confirm("Discard unsaved changes and create a new document?")) return;
    const doc = { id: uid(), title: "Untitled document", html: "<p><br></p>", updatedAt: Date.now() };
    const next = [doc, ...docs]; persistDocs(next); setActiveId(doc.id); setTitle(doc.title); setSaved(true); if (editorRef.current) editorRef.current.innerHTML = doc.html; updateStats(doc.html);
  };

  const duplicateDocument = () => {
    const source = docs.find((d) => d.id === activeId); if (!source) return;
    const doc = { ...source, id: uid(), title: `${title} copy`, updatedAt: Date.now() }; const next = [doc, ...docs]; persistDocs(next); setActiveId(doc.id); setTitle(doc.title); setSaved(true);
  };

  const renameDocument = () => { const nextTitle = window.prompt("Document name", title)?.trim(); if (!nextTitle) return; setTitle(nextTitle); setSaved(false); };
  const deleteDocument = () => {
    if (docs.length === 1) return window.alert("Keep at least one document.");
    if (!window.confirm(`Delete “${title}”?`)) return;
    const next = docs.filter((d) => d.id !== activeId); const target = next[0]; persistDocs(next); setActiveId(target.id); setTitle(target.title); setSaved(true); if (editorRef.current) editorRef.current.innerHTML = target.html; updateStats(target.html);
  };

  const exportHtml = () => download(`${title || "document"}.html`, `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>body{font-family:Arial,sans-serif;line-height:${lineSpacing};max-width:850px;margin:40px auto}table{border-collapse:collapse;width:100%}td{border:1px solid #999;padding:8px}.document-page-break{page-break-after:always;border:0!important}</style></head><body>${editorRef.current?.innerHTML ?? ""}</body></html>`, "text/html");
  };
  const exportTxt = () => download(`${title || "document"}.txt`, editorRef.current?.innerText ?? "", "text/plain");
  const download = (name: string, content: string, type: string) => { const a = document.createElement("a"); const url = URL.createObjectURL(new Blob([content], { type })); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url); };

  return <ToolShell title="Document Editor" description="A lightweight Word-style document editor." category="Writing">
    <div className="w-full">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <input value={title} onChange={(e) => { setTitle(e.target.value); setSaved(false); }} onBlur={save} aria-label="Document title" className="min-w-0 flex-1 bg-transparent px-1 py-1 text-lg font-bold outline-none placeholder:text-slate-400" placeholder="Document title" />
        <div className="flex items-center gap-0.5 text-xs text-slate-500"><span className="mr-1">{saved ? "Saved" : "Saving…"}</span><button type="button" onClick={save} className="px-2 py-1 font-semibold text-slate-700 hover:bg-slate-100">Save</button><button type="button" onClick={newDocument} className="px-2 py-1 font-semibold text-slate-700 hover:bg-slate-100">New</button><button type="button" onClick={duplicateDocument} className="inline-flex h-8 w-8 items-center justify-center text-slate-700 hover:bg-slate-100" title="Duplicate"><Copy size={15}/></button><button type="button" onClick={renameDocument} className="px-2 py-1 font-semibold text-slate-700 hover:bg-slate-100">Rename</button><button type="button" onClick={deleteDocument} className="px-2 py-1 font-semibold text-red-600 hover:bg-red-50">Delete</button><button type="button" onClick={() => window.print()} className="inline-flex h-8 w-8 items-center justify-center text-slate-700 hover:bg-slate-100" aria-label="Print"><Printer size={16}/></button></div>
      </div>

      <div className="mb-2 flex gap-1 overflow-x-auto border-y border-slate-200 bg-white p-1 print:hidden">
        <button type="button" onClick={() => setShowFind((v) => !v)} className="inline-flex h-8 items-center gap-1 px-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"><Search size={14}/>Find</button>
        <span className="mx-1 h-6 w-px bg-slate-200"/><select aria-label="Line spacing" value={lineSpacing} onChange={(e) => setLineSpacing(e.target.value)} className="h-8 bg-transparent px-1 text-xs"><option value="1.2">Line 1.2</option><option value="1.5">Line 1.5</option><option value="1.75">Line 1.75</option><option value="2">Line 2</option></select><select aria-label="Paragraph spacing" value={paragraphSpacing} onChange={(e) => setParagraphSpacing(e.target.value)} className="h-8 bg-transparent px-1 text-xs"><option value="0">Para 0</option><option value="0.35em">Para 0.35</option><option value="0.7em">Para 0.7</option><option value="1em">Para 1</option></select>
        <select aria-label="Page size" value={pageSize} onChange={(e) => setPageSize(e.target.value)} className="h-8 bg-transparent px-1 text-xs"><option>A4</option><option>Letter</option></select><select aria-label="Orientation" value={orientation} onChange={(e) => setOrientation(e.target.value)} className="h-8 bg-transparent px-1 text-xs"><option value="portrait">Portrait</option><option value="landscape">Landscape</option></select><select aria-label="Margins" value={margins} onChange={(e) => setMargins(e.target.value)} className="h-8 bg-transparent px-1 text-xs"><option value="normal">Margins: Normal</option><option value="narrow">Margins: Narrow</option><option value="wide">Margins: Wide</option></select>
        <label className="inline-flex h-8 items-center gap-1 px-2 text-xs"><input type="checkbox" checked={showHeader} onChange={(e) => setShowHeader(e.target.checked)}/>Header</label><label className="inline-flex h-8 items-center gap-1 px-2 text-xs"><input type="checkbox" checked={showFooter} onChange={(e) => setShowFooter(e.target.checked)}/>Footer</label><label className="inline-flex h-8 items-center gap-1 px-2 text-xs"><input type="checkbox" checked={pageNumber} onChange={(e) => setPageNumber(e.target.checked)}/>Page #</label>
        <span className="ml-auto"/><button type="button" onClick={exportTxt} className="px-2 text-xs font-semibold text-slate-700 hover:bg-slate-100">TXT</button><button type="button" onClick={exportHtml} className="inline-flex items-center gap-1 px-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"><FileDown size={14}/>HTML</button>
      </div>

      {showFind && <div className="mb-2 flex flex-wrap items-center gap-1 border border-slate-200 bg-white p-2 print:hidden"><input value={find} onChange={(e) => setFind(e.target.value)} placeholder="Find" className="h-8 w-36 border border-slate-200 px-2 text-xs outline-none"/><input value={replace} onChange={(e) => setReplace(e.target.value)} placeholder="Replace with" className="h-8 w-36 border border-slate-200 px-2 text-xs outline-none"/><button type="button" onClick={replaceAll} className="h-8 bg-slate-900 px-3 text-xs font-semibold text-white">Replace all</button></div>}

      <div className="mb-1 flex w-full flex-wrap items-center gap-0.5 border-b border-slate-200 bg-white px-1 py-1 print:hidden">
        <ToolbarButton label="Undo" onClick={() => command("undo")}><Undo2 size={16}/></ToolbarButton><ToolbarButton label="Redo" onClick={() => command("redo")}><Redo2 size={16}/></ToolbarButton><span className="mx-1 h-5 w-px bg-slate-200"/>
        <select aria-label="Text style" defaultValue="p" onChange={(e) => formatBlock(e.target.value)} className="h-8 w-28 bg-transparent px-1 text-xs"><option value="p">Normal</option><option value="h1">Heading 1</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="blockquote">Quote</option></select><select aria-label="Font family" defaultValue="Arial" onChange={(e) => command("fontName", e.target.value)} className="h-8 w-24 bg-transparent px-1 text-xs"><option>Arial</option><option>Georgia</option><option>Times New Roman</option><option>Verdana</option><option>Courier New</option></select><select aria-label="Font size" defaultValue="3" onChange={(e) => command("fontSize", e.target.value)} className="h-8 w-14 bg-transparent px-1 text-xs"><option value="1">10</option><option value="2">12</option><option value="3">14</option><option value="4">18</option><option value="5">24</option><option value="6">32</option><option value="7">48</option></select><span className="mx-1 h-5 w-px bg-slate-200"/>
        <ToolbarButton label="Bold" onClick={() => command("bold")}><Bold size={16}/></ToolbarButton><ToolbarButton label="Italic" onClick={() => command("italic")}><Italic size={16}/></ToolbarButton><ToolbarButton label="Underline" onClick={() => command("underline")}><Underline size={16}/></ToolbarButton><ToolbarButton label="Strikethrough" onClick={() => command("strikeThrough")}><Strikethrough size={16}/></ToolbarButton><ToolbarButton label="Superscript" onClick={() => command("superscript")}><span className="text-xs">x²</span></ToolbarButton><ToolbarButton label="Subscript" onClick={() => command("subscript")}><span className="text-xs">x₂</span></ToolbarButton><ToolbarButton label="Clear formatting" onClick={clearFormatting}><Eraser size={16}/></ToolbarButton>
        <label title="Text color" className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-sm font-bold text-slate-700 hover:bg-slate-100">A<input type="color" className="sr-only" onChange={(e) => command("foreColor", e.target.value)}/></label><label title="Highlight" className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-slate-700 hover:bg-slate-100"><Highlighter size={16}/><input type="color" defaultValue="#fff59d" className="sr-only" onChange={(e) => command("hiliteColor", e.target.value)}/></label><span className="mx-1 h-5 w-px bg-slate-200"/>
        <ToolbarButton label="Align left" onClick={() => command("justifyLeft")}><AlignLeft size={16}/></ToolbarButton><ToolbarButton label="Align center" onClick={() => command("justifyCenter")}><AlignCenter size={16}/></ToolbarButton><ToolbarButton label="Align right" onClick={() => command("justifyRight")}><AlignRight size={16}/></ToolbarButton><ToolbarButton label="Bulleted list" onClick={() => command("insertUnorderedList")}><List size={16}/></ToolbarButton><ToolbarButton label="Numbered list" onClick={() => command("insertOrderedList")}><ListOrdered size={16}/></ToolbarButton><ToolbarButton label="Decrease indent" onClick={() => command("outdent")}><IndentDecrease size={16}/></ToolbarButton><ToolbarButton label="Increase indent" onClick={() => command("indent")}><IndentIncrease size={16}/></ToolbarButton><ToolbarButton label="Insert link" onClick={insertLink}><Link2 size={16}/></ToolbarButton><ToolbarButton label="Insert table" onClick={insertTable}><Table2 size={16}/></ToolbarButton><ToolbarButton label="Insert page break" onClick={insertPageBreak}><Minus size={16}/></ToolbarButton><ToolbarButton label="Insert image" onClick={() => imageInputRef.current?.click()}><ImagePlus size={16}/></ToolbarButton><input ref={imageInputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if (file) insertImage(file); e.currentTarget.value = ""; }}/>
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-2 py-1 print:hidden">{docs.map((doc) => <button key={doc.id} type="button" onClick={() => switchDocument(doc.id)} className={`shrink-0 px-2 py-1 text-xs font-semibold ${doc.id === activeId ? "bg-slate-100 text-slate-950" : "text-slate-500 hover:bg-slate-50"}`}>{doc.title}</button>)}</div>

      <div className="overflow-x-auto bg-slate-100 px-2 py-4 sm:px-4 sm:py-6">
        <article className={`document-paper mx-auto w-full bg-white shadow-sm print:shadow-none ${pageSize === "A4" ? "document-a4" : "document-letter"} ${orientation === "landscape" ? "document-landscape" : ""} document-margin-${margins}`}>
          {showHeader && <div className="document-header">Header — {title}</div>}
          <div ref={editorRef} contentEditable suppressContentEditableWarning spellCheck className="document-editor min-h-[60vh] text-[15px] text-slate-900 outline-none" style={{ lineHeight: lineSpacing }} onInput={() => { updateStats(); setSaved(false); }} onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); save(); } if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") { e.preventDefault(); setShowFind(true); } }} aria-label="Document editor"><p><br/></p></div>
          {showFooter && <div className="document-footer">{pageNumber ? "Page 1" : ""}</div>}
        </article>
      </div>
      <div className="mt-2 flex items-center justify-end gap-4 px-1 text-xs text-slate-500 print:hidden"><span>{stats.words} words</span><span>{stats.characters} characters</span></div>
    </div>
    <style jsx global>{`.document-editor p{margin:${paragraphSpacing} 0}.document-editor h1,.document-editor h2,.document-editor h3{margin:${paragraphSpacing} 0}.document-paper{min-height:1050px}.document-a4{max-width:850px}.document-letter{max-width:850px}.document-landscape{max-width:1100px}.document-margin-narrow{padding:36px 48px}.document-margin-normal{padding:56px 64px}.document-margin-wide{padding:72px 100px}.document-header,.document-footer{font-size:11px;color:#64748b;padding:0 0 10px}.document-footer{padding:10px 0 0;text-align:center}.document-editor h1{margin-top:1.1em;font-size:2em;line-height:1.2;font-weight:700}.document-editor h2{font-size:1.5em;line-height:1.25;font-weight:700}.document-editor h3{font-size:1.25em;line-height:1.3;font-weight:700}.document-editor blockquote{margin:1em 0;border-left:3px solid #cbd5e1;padding-left:1rem;color:#475569;font-style:italic}.document-editor ul{list-style:disc;padding-left:1.5rem}.document-editor ol{list-style:decimal;padding-left:1.5rem}.editor-table{width:100%;border-collapse:collapse;margin:1rem 0;table-layout:fixed}.editor-table td{border:1px solid #cbd5e1;min-width:60px;padding:.45rem .55rem;vertical-align:top}.editor-image{display:block;max-width:100%;margin:.75rem 0}.document-page-break{margin:1.5rem 0;border-top:1px dashed #94a3b8;height:1px;position:relative}.document-page-break span{position:absolute;left:50%;top:-9px;transform:translateX(-50%);background:white;padding:0 .5rem;color:#94a3b8;font-size:10px;text-transform:uppercase;letter-spacing:.08em}@media print{.document-paper{min-height:0!important;max-width:none!important;padding:0!important;box-shadow:none!important}.document-page-break{border:0;height:0;page-break-after:always}.document-page-break span{display:none}.editor-table td{border-color:#777}}`}</style>
  </ToolShell>;
}

function escapeHtml(value: string) { return value.replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char] ?? char)); }
