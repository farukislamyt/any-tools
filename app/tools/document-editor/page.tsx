"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlignCenter, AlignLeft, AlignRight, Bold, Copy, FileDown, Highlighter, ImagePlus,
  IndentDecrease, IndentIncrease, Italic, Link2, List, ListOrdered, Minus,
  Printer, Redo2, Save, Search, Strikethrough, Subscript, Superscript,
  Table2, Trash2, Underline, Undo2, X
} from "lucide-react";
import { ToolShell } from "@/components/tool-shell";

const STORAGE_KEY = "anytools-document-editor-documents";
const LEGACY_STORAGE_KEY = "anytools-document-editor";
type DocumentItem = { id: string; title: string; html: string; createdAt: number; updatedAt: number };
type ButtonProps = { label: string; onClick: () => void; children: React.ReactNode };

function ToolbarButton({ label, onClick, children }: ButtonProps) {
  return <button type="button" title={label} aria-label={label} onMouseDown={(e) => e.preventDefault()} onClick={onClick} className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-slate-700 transition hover:bg-slate-100 active:bg-slate-200">{children}</button>;
}
function ActionButton({ label, onClick, children, danger = false }: ButtonProps & { danger?: boolean }) {
  return <button type="button" title={label} aria-label={label} onMouseDown={(e) => e.preventDefault()} onClick={onClick} className={`inline-flex h-8 shrink-0 items-center gap-1.5 px-2 text-xs font-medium transition ${danger ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-slate-100"}`}>{children}<span className="hidden md:inline">{label}</span></button>;
}
function makeDocument(title = "Untitled document", html = "<p><br></p>"): DocumentItem {
  const now = Date.now();
  return { id: `${now}-${Math.random().toString(36).slice(2, 8)}`, title, html, createdAt: now, updatedAt: now };
}
function escapeHtml(value: string) { return value.replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char] ?? char)); }

export default function DocumentEditorPage() {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const selectionRef = useRef<Range | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [title, setTitle] = useState("Untitled document");
  const [saved, setSaved] = useState(true);
  const [stats, setStats] = useState({ words: 0, characters: 0 });
  const [findOpen, setFindOpen] = useState(false);
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [matchCount, setMatchCount] = useState(0);

  const updateStats = useCallback((html = editorRef.current?.innerHTML ?? "") => {
    const text = editorRef.current?.innerText ?? html.replace(/<[^>]+>/g, " ");
    setStats({ words: text.trim() ? text.trim().split(/\s+/).length : 0, characters: text.length });
  }, []);

  const save = useCallback(() => {
    if (!activeId || !editorRef.current) return;
    const html = editorRef.current.innerHTML;
    const now = Date.now();
    setDocuments((current) => {
      const next = current.map((doc) => doc.id === activeId ? { ...doc, title: title.trim() || "Untitled document", html, updatedAt: now } : doc);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setSaved(true);
  }, [activeId, title]);

  const scheduleSave = useCallback(() => {
    setSaved(false);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(save, 700);
  }, [save]);

  useEffect(() => {
    let loaded: DocumentItem[] = [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as DocumentItem[];
        if (Array.isArray(parsed)) loaded = parsed.filter((item) => item?.id && typeof item.html === "string").map((item) => ({ ...item, title: item.title || "Untitled document", createdAt: item.createdAt || Date.now(), updatedAt: item.updatedAt || Date.now() }));
      } catch { localStorage.removeItem(STORAGE_KEY); }
    }
    if (!loaded.length) {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        try { const legacy = JSON.parse(legacyRaw) as { title?: string; html?: string }; loaded = [makeDocument(legacy.title || "Untitled document", legacy.html || "<p><br></p>")]; } catch { /* ignore malformed legacy data */ }
      }
    }
    if (!loaded.length) loaded = [makeDocument()];
    loaded.sort((a, b) => b.updatedAt - a.updatedAt);
    setDocuments(loaded); setActiveId(loaded[0].id); setTitle(loaded[0].title);
    if (editorRef.current) editorRef.current.innerHTML = loaded[0].html;
    updateStats(loaded[0].html);
  }, [updateStats]);

  useEffect(() => () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); }, []);

  const rememberSelection = () => { const selection = window.getSelection(); if (selection?.rangeCount) selectionRef.current = selection.getRangeAt(0).cloneRange(); };
  const restoreSelection = () => { const range = selectionRef.current; if (!range) return; const selection = window.getSelection(); selection?.removeAllRanges(); selection?.addRange(range); };
  const command = (name: string, value?: string) => { restoreSelection(); editorRef.current?.focus(); document.execCommand(name, false, value); updateStats(); scheduleSave(); };

  const selectDocument = (doc: DocumentItem) => {
    if (doc.id === activeId) return;
    if (!saved) save();
    setActiveId(doc.id); setTitle(doc.title);
    if (editorRef.current) editorRef.current.innerHTML = doc.html;
    updateStats(doc.html); setSaved(true); setFindText(""); setMatchCount(0);
  };
  const createDocument = () => {
    if (!saved) save();
    const doc = makeDocument(); const next = [doc, ...documents];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setDocuments(next); setActiveId(doc.id); setTitle(doc.title);
    if (editorRef.current) editorRef.current.innerHTML = doc.html; updateStats(doc.html); setSaved(true);
  };
  const renameDocument = (documentId = activeId) => {
    const current = documents.find((doc) => doc.id === documentId); if (!current) return;
    const nextTitle = window.prompt("Document name", current.title); if (nextTitle === null) return;
    const clean = nextTitle.trim() || "Untitled document";
    const next = documents.map((doc) => doc.id === documentId ? { ...doc, title: clean, updatedAt: Date.now() } : doc);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setDocuments(next); if (documentId === activeId) setTitle(clean); setSaved(true);
  };
  const duplicateDocument = () => {
    if (!saved) save();
    const source = documents.find((doc) => doc.id === activeId); if (!source) return;
    const copy = makeDocument(`${source.title} copy`, editorRef.current?.innerHTML ?? source.html); const next = [copy, ...documents];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setDocuments(next); setActiveId(copy.id); setTitle(copy.title);
    if (editorRef.current) editorRef.current.innerHTML = copy.html; updateStats(copy.html); setSaved(true);
  };
  const deleteDocument = () => {
    if (documents.length <= 1) return window.alert("Keep at least one document in the editor.");
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
    const remaining = documents.filter((doc) => doc.id !== activeId).sort((a, b) => b.updatedAt - a.updatedAt); const next = remaining[0];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining)); setDocuments(remaining); setActiveId(next.id); setTitle(next.title);
    if (editorRef.current) editorRef.current.innerHTML = next.html; updateStats(next.html); setSaved(true);
  };

  const insertLink = () => { rememberSelection(); const url = window.prompt("Enter URL"); if (url) command("createLink", url.trim()); };
  const insertTable = () => {
    restoreSelection(); const rows = Math.min(10, Math.max(1, Number(window.prompt("Rows", "3")) || 3)); const cols = Math.min(8, Math.max(1, Number(window.prompt("Columns", "3")) || 3));
    const table = document.createElement("table"); table.className = "editor-table";
    for (let r = 0; r < rows; r++) { const tr = table.insertRow(); for (let c = 0; c < cols; c++) { const cell = tr.insertCell(); cell.innerHTML = r === 0 ? `<strong>Header ${c + 1}</strong>` : "&nbsp;"; } }
    editorRef.current?.focus(); const selection = window.getSelection(); if (!selection?.rangeCount) return; const range = selection.getRangeAt(0); range.collapse(false); range.insertNode(table); const p = document.createElement("p"); p.innerHTML = "<br>"; table.after(p); updateStats(); scheduleSave();
  };
  const insertPageBreak = () => {
    restoreSelection(); editorRef.current?.focus(); const pageBreak = document.createElement("div"); pageBreak.className = "document-page-break"; pageBreak.setAttribute("contenteditable", "false"); pageBreak.innerHTML = "<span>Page break</span>";
    const selection = window.getSelection(); if (!selection?.rangeCount) return; const range = selection.getRangeAt(0); range.collapse(false); range.insertNode(pageBreak); const p = document.createElement("p"); p.innerHTML = "<br>"; pageBreak.after(p); updateStats(); scheduleSave();
  };
  const insertImage = (file: File) => {
    if (!file.type.startsWith("image/")) return; const reader = new FileReader(); reader.onload = () => { restoreSelection(); editorRef.current?.focus(); const img = document.createElement("img"); img.src = String(reader.result); img.alt = file.name; img.className = "editor-image"; img.style.maxWidth = "100%"; img.style.height = "auto"; const selection = window.getSelection(); if (selection?.rangeCount) { const range = selection.getRangeAt(0); range.collapse(false); range.insertNode(img); const p = document.createElement("p"); p.innerHTML = "<br>"; img.after(p); } updateStats(); scheduleSave(); }; reader.readAsDataURL(file);
  };
  const findMatches = (query: string) => {
    if (!query) return 0; const text = editorRef.current?.innerText ?? ""; const source = matchCase ? text : text.toLocaleLowerCase(); const target = matchCase ? query : query.toLocaleLowerCase(); let count = 0; let index = 0;
    while ((index = source.indexOf(target, index)) !== -1) { count++; index += target.length || 1; } return count;
  };
  const replaceAll = () => {
    if (!findText || !editorRef.current) return; const walker = document.createTreeWalker(editorRef.current, NodeFilter.SHOW_TEXT); const nodes: Text[] = []; let node: Node | null;
    while ((node = walker.nextNode())) nodes.push(node as Text); const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); const regex = new RegExp(escaped, matchCase ? "g" : "gi"); let replaced = 0;
    nodes.forEach((textNode) => { const before = textNode.nodeValue ?? ""; const after = before.replace(regex, () => { replaced++; return replaceText; }); if (after !== before) textNode.nodeValue = after; });
    setMatchCount(replaced); updateStats(); if (replaced) scheduleSave();
  };
  useEffect(() => { setMatchCount(findMatches(findText)); }, [findText, matchCase, activeId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!editorRef.current?.contains(document.activeElement)) return;
      const mod = event.ctrlKey || event.metaKey;
      if (mod && event.key.toLowerCase() === "s") { event.preventDefault(); save(); }
      if (mod && event.key.toLowerCase() === "f") { event.preventDefault(); rememberSelection(); setFindOpen(true); }
    };
    window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown);
  }, [save]);

  const exportHtml = () => {
    save(); const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>body{font-family:Arial,sans-serif;line-height:1.7;max-width:850px;margin:40px auto}table{border-collapse:collapse;width:100%}td{border:1px solid #999;padding:8px}.document-page-break{page-break-after:always;border:0!important}</style></head><body>${editorRef.current?.innerHTML ?? ""}</body></html>`;
    const blob = new Blob([html], { type: "text/html" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${title || "document"}.html`; a.click(); URL.revokeObjectURL(url);
  };
  const printDocument = () => { save(); window.print(); };

  const toolbar = [
    ["Bold", () => command("bold"), <Bold size={15}/>], ["Italic", () => command("italic"), <Italic size={15}/>], ["Underline", () => command("underline"), <Underline size={15}/>], ["Strikethrough", () => command("strikeThrough"), <Strikethrough size={15}/>],
    ["Superscript", () => command("superscript"), <Superscript size={15}/>], ["Subscript", () => command("subscript"), <Subscript size={15}/>], ["Align left", () => command("justifyLeft"), <AlignLeft size={15}/>], ["Align center", () => command("justifyCenter"), <AlignCenter size={15}/>], ["Align right", () => command("justifyRight"), <AlignRight size={15}/>],
    ["Bulleted list", () => command("insertUnorderedList"), <List size={15}/>], ["Numbered list", () => command("insertOrderedList"), <ListOrdered size={15}/>], ["Decrease indent", () => command("outdent"), <IndentDecrease size={15}/>], ["Increase indent", () => command("indent"), <IndentIncrease size={15}/>],
    ["Undo", () => command("undo"), <Undo2 size={15}/>], ["Redo", () => command("redo"), <Redo2 size={15}/>], ["Clear formatting", () => command("removeFormat"), <Minus size={15}/>], ["Insert link", insertLink, <Link2 size={15}/>], ["Insert table", insertTable, <Table2 size={15}/>], ["Insert page break", insertPageBreak, <Minus size={15}/>], ["Insert image", () => imageInputRef.current?.click(), <ImagePlus size={15}/>], ["Find & replace", () => { rememberSelection(); setFindOpen(true); }, <Search size={15}/>],
  ] as const;

  return (
    <ToolShell title="Document Editor" description="A lightweight Word-style document editor." category="Writing">
      <div className="document-editor-app flex min-h-0 w-full flex-col">
        <div className="mb-2 flex min-h-10 shrink-0 items-end border-b border-slate-200 bg-white print:hidden">
          <div className="flex min-w-0 flex-1 items-end overflow-x-auto" role="tablist" aria-label="Open documents">
            {documents.map((doc) => <button key={doc.id} type="button" role="tab" aria-selected={doc.id === activeId} onClick={() => selectDocument(doc)} onDoubleClick={() => renameDocument(doc.id)} title={`${doc.title} — double-click to rename`} className={`relative flex h-10 max-w-56 min-w-28 shrink-0 items-center border-r border-slate-200 px-3 text-left text-xs ${doc.id === activeId ? "bg-white font-semibold text-slate-900" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}><span className="min-w-0 flex-1 truncate">{doc.title}</span>{doc.id === activeId && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600" />}{doc.id === activeId && !saved && <span className="ml-1.5 size-1.5 shrink-0 bg-amber-500" title="Unsaved changes" />}</button>)}
            <button type="button" onClick={createDocument} className="inline-flex h-10 w-9 shrink-0 items-center justify-center text-lg text-slate-600 hover:bg-slate-100" aria-label="New document" title="New document">+</button>
          </div>
          <div className="ml-auto flex shrink-0 items-center border-l border-slate-200 bg-white px-1 print:hidden">
            <span className={`hidden lg:inline px-2 text-[11px] ${saved ? "text-emerald-600" : "text-amber-600"}`}>{saved ? "Saved" : "Unsaved"}</span>
            <ActionButton label="Save" onClick={save}><Save size={15}/></ActionButton><ActionButton label="Duplicate" onClick={duplicateDocument}><Copy size={15}/></ActionButton><ActionButton label="Delete" onClick={deleteDocument} danger><Trash2 size={15}/></ActionButton><ActionButton label="Print" onClick={printDocument}><Printer size={15}/></ActionButton><ActionButton label="Export HTML" onClick={exportHtml}><FileDown size={15}/></ActionButton>
          </div>
        </div>

        <div className="mb-2 flex min-h-0 shrink-0 flex-col border-y border-slate-200 bg-white print:hidden">
          <div className="flex w-full flex-wrap items-center gap-0.5 px-1 py-1">
            <select aria-label="Text style" defaultValue="p" onChange={(e) => command("formatBlock", e.target.value)} className="h-8 border-r border-slate-200 bg-white px-2 text-xs outline-none"><option value="p">Paragraph</option><option value="h1">Heading 1</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="blockquote">Quote</option></select>
            <select aria-label="Font" defaultValue="Arial" onChange={(e) => command("fontName", e.target.value)} className="h-8 border-r border-slate-200 bg-white px-2 text-xs outline-none"><option>Arial</option><option>Georgia</option><option>Times New Roman</option><option>Verdana</option><option>Courier New</option></select>
            <select aria-label="Font size" defaultValue="3" onChange={(e) => command("fontSize", e.target.value)} className="h-8 border-r border-slate-200 bg-white px-2 text-xs outline-none"><option value="2">Small</option><option value="3">Normal</option><option value="4">Large</option><option value="5">XL</option><option value="6">XXL</option></select>
            {toolbar.map(([label, onClick, icon]) => <ToolbarButton key={label} label={label} onClick={onClick}>{icon}</ToolbarButton>)}
            <label className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-slate-700 hover:bg-slate-100" title="Text color"><input type="color" className="absolute size-px opacity-0" onChange={(e) => command("foreColor", e.target.value)} /><span className="text-sm font-bold">A</span></label>
            <label className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-slate-700 hover:bg-slate-100" title="Highlight"><input type="color" defaultValue="#fff59d" className="absolute size-px opacity-0" onChange={(e) => command("hiliteColor", e.target.value)} /><Highlighter size={15}/></label>
          </div>
        </div>

        {findOpen && <div className="mb-2 flex flex-wrap items-center gap-2 border border-slate-200 bg-white p-2 print:hidden"><input autoFocus value={findText} onChange={(e) => setFindText(e.target.value)} placeholder="Find" className="h-8 w-40 border border-slate-200 px-2 text-xs outline-none focus:border-blue-400" /><input value={replaceText} onChange={(e) => setReplaceText(e.target.value)} placeholder="Replace with" className="h-8 w-40 border border-slate-200 px-2 text-xs outline-none focus:border-blue-400" /><label className="inline-flex items-center gap-1 text-xs text-slate-600"><input type="checkbox" checked={matchCase} onChange={(e) => setMatchCase(e.target.checked)} /> Match case</label><span className="text-xs text-slate-500">{matchCount} match{matchCount === 1 ? "" : "es"}</span><button type="button" onClick={replaceAll} className="h-8 bg-slate-900 px-3 text-xs font-semibold text-white">Replace all</button><button type="button" onClick={() => { setFindOpen(false); setFindText(""); setMatchCount(0); }} className="inline-flex h-8 w-8 items-center justify-center text-slate-600 hover:bg-slate-100" aria-label="Close find"><X size={15}/></button></div>}

        <div className="document-print-area min-h-0 flex-1 overflow-y-auto bg-slate-100 px-2 py-3 sm:px-4 sm:py-5">
          <div ref={editorRef} contentEditable suppressContentEditableWarning spellCheck className="document-editor mx-auto min-h-[60vh] w-full max-w-[850px] bg-white px-6 py-8 text-[15px] leading-7 shadow-sm outline-none sm:min-h-[950px] sm:px-12 sm:py-12" onInput={() => { updateStats(); scheduleSave(); }} onKeyUp={rememberSelection} onBlur={rememberSelection} aria-label="Document editor" />
        </div>
        <div className="flex h-8 shrink-0 items-center justify-between border-t border-slate-200 bg-white px-2 text-[11px] text-slate-500 print:hidden"><span>{stats.words} words · {stats.characters} characters</span><span>Ctrl/Cmd+S Save · Ctrl/Cmd+F Find</span></div>
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) insertImage(file); e.currentTarget.value = ""; }} />
      </div>
    </ToolShell>
  );
}
