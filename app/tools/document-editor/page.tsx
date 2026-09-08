"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlignCenter, AlignLeft, AlignRight, Bold, Copy, FileDown, Highlighter, ImagePlus,
  IndentDecrease, IndentIncrease, Italic, Link2, List, ListOrdered, Minus,
  MoreHorizontal, Printer, Redo2, Save, Search, Strikethrough, Subscript, Superscript,
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

function escapeHtml(value: string) {
  return value.replace(/[&<>\"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char] ?? char));
}

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

  const persistDocuments = useCallback((next: DocumentItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setDocuments(next);
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
        if (Array.isArray(parsed)) loaded = parsed.filter((item) => item?.id && typeof item.html === "string");
      } catch { localStorage.removeItem(STORAGE_KEY); }
    }
    if (!loaded.length) {
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        try {
          const legacy = JSON.parse(legacyRaw) as { title?: string; html?: string };
          loaded = [makeDocument(legacy.title || "Untitled document", legacy.html || "<p><br></p>")];
        } catch { /* ignore malformed legacy data */ }
      }
    }
    if (!loaded.length) loaded = [makeDocument()];
    loaded.sort((a, b) => b.updatedAt - a.updatedAt);
    setDocuments(loaded);
    setActiveId(loaded[0].id);
    setTitle(loaded[0].title);
    if (editorRef.current) editorRef.current.innerHTML = loaded[0].html;
    updateStats(loaded[0].html);
  }, [updateStats]);

  useEffect(() => () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); }, []);

  const rememberSelection = () => {
    const selection = window.getSelection();
    if (selection?.rangeCount) selectionRef.current = selection.getRangeAt(0).cloneRange();
  };

  const restoreSelection = () => {
    const range = selectionRef.current;
    if (!range) return;
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  const command = (name: string, value?: string) => {
    restoreSelection();
    editorRef.current?.focus();
    document.execCommand(name, false, value);
    updateStats();
    scheduleSave();
  };

  const selectDocument = (doc: DocumentItem) => {
    if (doc.id === activeId) return;
    if (!saved) save();
    setActiveId(doc.id);
    setTitle(doc.title);
    if (editorRef.current) editorRef.current.innerHTML = doc.html;
    updateStats(doc.html);
    setSaved(true);
    setFindText("");
    setMatchCount(0);
  };

  const createDocument = () => {
    if (!saved) save();
    const doc = makeDocument();
    persistDocuments([doc, ...documents]);
    setActiveId(doc.id);
    setTitle(doc.title);
    if (editorRef.current) editorRef.current.innerHTML = doc.html;
    updateStats(doc.html);
    setSaved(true);
  };

  const renameDocument = (documentId = activeId) => {
    const current = documents.find((doc) => doc.id === documentId);
    if (!current) return;
    const nextTitle = window.prompt("Document name", current.title);
    if (nextTitle === null) return;
    const clean = nextTitle.trim() || "Untitled document";
    persistDocuments(documents.map((doc) => doc.id === documentId ? { ...doc, title: clean, updatedAt: Date.now() } : doc));
    if (documentId === activeId) setTitle(clean);
    setSaved(true);
  };

  const duplicateDocument = () => {
    const source = documents.find((doc) => doc.id === activeId);
    if (!source) return;
    const copy = makeDocument(`${source.title} copy`, source.html);
    persistDocuments([copy, ...documents]);
    setActiveId(copy.id);
    setTitle(copy.title);
    if (editorRef.current) editorRef.current.innerHTML = copy.html;
    updateStats(copy.html);
    setSaved(true);
  };

  const deleteDocument = () => {
    if (documents.length <= 1) return window.alert("Keep at least one document in the editor.");
    if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) return;
    const remaining = documents.filter((doc) => doc.id !== activeId).sort((a, b) => b.updatedAt - a.updatedAt);
    persistDocuments(remaining);
    const next = remaining[0];
    setActiveId(next.id);
    setTitle(next.title);
    if (editorRef.current) editorRef.current.innerHTML = next.html;
    updateStats(next.html);
    setSaved(true);
  };

  const insertLink = () => { rememberSelection(); const url = window.prompt("Enter URL"); if (url) command("createLink", url.trim()); };

  const insertTable = () => {
    restoreSelection();
    const rows = Math.min(10, Math.max(1, Number(window.prompt("Rows", "3")) || 3));
    const cols = Math.min(8, Math.max(1, Number(window.prompt("Columns", "3")) || 3));
    const table = document.createElement("table");
    table.className = "editor-table";
    for (let r = 0; r < rows; r++) {
      const tr = table.insertRow();
      for (let c = 0; c < cols; c++) { const cell = tr.insertCell(); cell.innerHTML = r === 0 ? `<strong>Header ${c + 1}</strong>` : "&nbsp;"; }
    }
    editorRef.current?.focus();
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    const range = selection.getRangeAt(0); range.collapse(false); range.insertNode(table);
    const p = document.createElement("p"); p.innerHTML = "<br>"; table.after(p);
    updateStats(); scheduleSave();
  };

  const insertPageBreak = () => {
    restoreSelection(); editorRef.current?.focus();
    const pageBreak = document.createElement("div");
    pageBreak.className = "document-page-break"; pageBreak.setAttribute("contenteditable", "false"); pageBreak.innerHTML = "<span>Page break</span>";
    const selection = window.getSelection(); if (!selection?.rangeCount) return;
    const range = selection.getRangeAt(0); range.collapse(false); range.insertNode(pageBreak);
    const p = document.createElement("p"); p.innerHTML = "<br>"; pageBreak.after(p);
    updateStats(); scheduleSave();
  };

  const insertImage = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      restoreSelection(); editorRef.current?.focus();
      const img = document.createElement("img"); img.src = String(reader.result); img.alt = file.name; img.className = "editor-image"; img.style.maxWidth = "100%"; img.style.height = "auto";
      const selection = window.getSelection();
      if (selection?.rangeCount) { const range = selection.getRangeAt(0); range.collapse(false); range.insertNode(img); const p = document.createElement("p"); p.innerHTML = "<br>"; img.after(p); }
      updateStats(); scheduleSave();
    };
    reader.readAsDataURL(file);
  };

  const findMatches = (query: string) => {
    if (!query) return 0;
    const text = editorRef.current?.innerText ?? "";
    const source = matchCase ? text : text.toLocaleLowerCase();
    const target = matchCase ? query : query.toLocaleLowerCase();
    let count = 0; let index = 0;
    while ((index = source.indexOf(target, index)) !== -1) { count++; index += target.length || 1; }
    return count;
  };

  const replaceAll = () => {
    if (!findText || !editorRef.current) return;
    const walker = document.createTreeWalker(editorRef.current, NodeFilter.SHOW_TEXT);
    const nodes: Text[] = []; let node: Node | null;
    while ((node = walker.nextNode())) nodes.push(node as Text);
    const escaped = findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, matchCase ? "g" : "gi");
    let replaced = 0;
    nodes.forEach((textNode) => { const before = textNode.nodeValue ?? ""; const after = before.replace(regex, () => { replaced++; return replaceText; }); if (after !== before) textNode.nodeValue = after; });
    setMatchCount(replaced); updateStats(); if (replaced) scheduleSave();
  };

  useEffect(() => { setMatchCount(findMatches(findText)); }, [findText, matchCase, documents, activeId]);

  const exportHtml = () => {
    save();
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>body{font-family:Arial,sans-serif;line-height:1.7;max-width:850px;margin:40px auto}table{border-collapse:collapse;width:100%}td{border:1px solid #999;padding:8px}.document-page-break{page-break-after:always;border:0!important}</style></head><body>${editorRef.current?.innerHTML ?? ""}</body></html>`;
    const blob = new Blob([html], { type: "text/html" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${title || "document"}.html`; a.click(); URL.revokeObjectURL(url);
  };

  const printDocument = () => { save(); window.print(); };

  return (
    <ToolShell title="Document Editor" description="A lightweight Word-style document editor." category="Writing">
      <div className="document-editor-app flex min-h-0 w-full flex-col">
        <div className="mb-2 flex min-h-10 shrink-0 items-end border-b border-slate-200 bg-white print:hidden">
          <div className="flex min-w-0 flex-1 items-end overflow-x-auto" role="tablist" aria-label="Open documents">
            {documents.map((doc) => (
              <button key={doc.id} type="button" role="tab" aria-selected={doc.id === activeId} onClick={() => selectDocument(doc)} onDoubleClick={() => renameDocument(doc.id)} title={`${doc.title} — double-click to rename`} className={`group relative flex h-10 max-w-56 min-w-28 shrink-0 items-center border-r border-slate-200 px-3 text-left text-xs transition ${doc.id === activeId ? "bg-white font-semibold text-slate-900" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>
                <span className="min-w-0 flex-1 truncate">{doc.title}</span>
                {doc.id === activeId ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600" /> : null}
              </button>
            ))}
            <button type="button" onClick={createDocument} className="inline-flex h-10 w-9 shrink-0 items-center justify-center text-lg text-slate-600 hover:bg-slate-100" aria-label="New document" title="New document">+</button>
          </div>
          <div className="ml-auto flex shrink-0 items-center border-l border-slate-200 bg-white px-1 print:hidden">
            <ActionButton label="Save" onClick={save}><Save size={15}/></ActionButton>
            <ActionButton label="Duplicate" onClick={duplicateDocument}><Copy size={15}/></ActionButton>
            <ActionButton label="Delete" onClick={deleteDocument} danger><Trash2 size={15}/></ActionButton>
            <ActionButton label="Print" onClick={printDocument}><Printer size={15}/></ActionButton>
            <ActionButton label="Export HTML" onClick={exportHtml}><FileDown size={15}/></ActionButton>
          </div>
        </div>

        <div className="mb-2 flex min-h-0 shrink-0 flex-col border-y border-slate-200 bg-white">
          <div className="flex w-full flex-wrap items-center gap-0.5 px-1 py-1 print:hidden">
            <ToolbarButton label="Undo" onClick={() => command("undo")}><Undo2 size={16}/></ToolbarButton>
            <ToolbarButton label="Redo" onClick={() => command("redo")}><Redo2 size={16}/></ToolbarButton>
            <ToolbarButton label="Find and replace" onClick={() => { rememberSelection(); setFindOpen((value) => !value); }}><Search size={16}/></ToolbarButton>
            <span className="mx-1 h-5 w-px bg-slate-200" />
            <select aria-label="Text style" defaultValue="p" onMouseDown={rememberSelection} onChange={(e) => command("formatBlock", e.target.value)} className="h-8 w-28 bg-transparent px-1 text-xs outline-none hover:bg-slate-100"><option value="p">Normal</option><option value="h1">Heading 1</option><option value="h2">Heading 2</option><option value="h3">Heading 3</option><option value="blockquote">Quote</option></select>
            <select aria-label="Font family" defaultValue="Arial" onMouseDown={rememberSelection} onChange={(e) => command("fontName", e.target.value)} className="h-8 w-24 bg-transparent px-1 text-xs outline-none hover:bg-slate-100"><option>Arial</option><option>Georgia</option><option>Times New Roman</option><option>Verdana</option><option>Courier New</option></select>
            <select aria-label="Font size" defaultValue="3" onMouseDown={rememberSelection} onChange={(e) => command("fontSize", e.target.value)} className="h-8 w-14 bg-transparent px-1 text-xs outline-none hover:bg-slate-100"><option value="1">10</option><option value="2">12</option><option value="3">14</option><option value="4">18</option><option value="5">24</option><option value="6">32</option><option value="7">48</option></select>
            <span className="mx-1 h-5 w-px bg-slate-200" />
            <ToolbarButton label="Bold" onClick={() => command("bold")}><Bold size={16}/></ToolbarButton><ToolbarButton label="Italic" onClick={() => command("italic")}><Italic size={16}/></ToolbarButton><ToolbarButton label="Underline" onClick={() => command("underline")}><Underline size={16}/></ToolbarButton><ToolbarButton label="Strikethrough" onClick={() => command("strikeThrough")}><Strikethrough size={16}/></ToolbarButton><ToolbarButton label="Superscript" onClick={() => command("superscript")}><Superscript size={16}/></ToolbarButton><ToolbarButton label="Subscript" onClick={() => command("subscript")}><Subscript size={16}/></ToolbarButton>
            <label title="Text color" className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-sm font-bold text-slate-700 hover:bg-slate-100">A<input type="color" className="sr-only" onMouseDown={rememberSelection} onChange={(e) => command("foreColor", e.target.value)}/></label><label title="Highlight" className="inline-flex h-8 w-8 cursor-pointer items-center justify-center text-slate-700 hover:bg-slate-100"><Highlighter size={16}/><input type="color" defaultValue="#fff59d" className="sr-only" onMouseDown={rememberSelection} onChange={(e) => command("hiliteColor", e.target.value)}/></label><ToolbarButton label="Clear formatting" onClick={() => command("removeFormat")}><MoreHorizontal size={16}/></ToolbarButton>
            <span className="mx-1 h-5 w-px bg-slate-200" /><ToolbarButton label="Align left" onClick={() => command("justifyLeft")}><AlignLeft size={16}/></ToolbarButton><ToolbarButton label="Align center" onClick={() => command("justifyCenter")}><AlignCenter size={16}/></ToolbarButton><ToolbarButton label="Align right" onClick={() => command("justifyRight")}><AlignRight size={16}/></ToolbarButton><ToolbarButton label="Bulleted list" onClick={() => command("insertUnorderedList")}><List size={16}/></ToolbarButton><ToolbarButton label="Numbered list" onClick={() => command("insertOrderedList")}><ListOrdered size={16}/></ToolbarButton><ToolbarButton label="Decrease indent" onClick={() => command("outdent")}><IndentDecrease size={16}/></ToolbarButton><ToolbarButton label="Increase indent" onClick={() => command("indent")}><IndentIncrease size={16}/></ToolbarButton><ToolbarButton label="Insert link" onClick={insertLink}><Link2 size={16}/></ToolbarButton><ToolbarButton label="Insert table" onClick={insertTable}><Table2 size={16}/></ToolbarButton><ToolbarButton label="Insert page break" onClick={insertPageBreak}><Minus size={16}/></ToolbarButton><ToolbarButton label="Insert image" onClick={() => imageInputRef.current?.click()}><ImagePlus size={16}/></ToolbarButton>
            <input ref={imageInputRef} type="file" accept="image/*" className="sr-only" onChange={(e) => { const file = e.target.files?.[0]; if (file) insertImage(file); e.currentTarget.value = ""; }} />
          </div>
          {findOpen ? <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 bg-slate-50 px-2 py-2 text-xs"><input autoFocus value={findText} onChange={(e) => setFindText(e.target.value)} placeholder="Find" className="h-8 w-40 bg-white px-2 outline-none ring-1 ring-slate-200 focus:ring-slate-400"/><input value={replaceText} onChange={(e) => setReplaceText(e.target.value)} placeholder="Replace with" className="h-8 w-40 bg-white px-2 outline-none ring-1 ring-slate-200 focus:ring-slate-400"/><button type="button" onClick={replaceAll} className="h-8 px-2 font-semibold text-slate-700 hover:bg-slate-200">Replace all</button><label className="flex items-center gap-1 px-1"><input type="checkbox" checked={matchCase} onChange={(e) => setMatchCase(e.target.checked)}/> Match case</label><span className="text-slate-500">{findText ? `${matchCount} match${matchCount === 1 ? "" : "es"}` : ""}</span><button type="button" onClick={() => { setFindOpen(false); setFindText(""); }} className="ml-auto inline-flex h-8 w-8 items-center justify-center hover:bg-slate-200" aria-label="Close find and replace"><X size={16}/></button></div> : null}
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-slate-100 px-2 py-4 sm:px-4 sm:py-6">
          <article className="mx-auto min-h-[70vh] w-full max-w-[850px] bg-white px-7 py-8 shadow-sm sm:min-h-[1050px] sm:px-16 sm:py-14 print:min-h-0 print:max-w-none print:px-0 print:py-0 print:shadow-none">
            <div ref={editorRef} contentEditable suppressContentEditableWarning spellCheck className="document-editor min-h-[60vh] text-[15px] leading-7 text-slate-900 outline-none sm:min-h-[950px]" onInput={() => { updateStats(); scheduleSave(); }} onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); save(); } if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") { e.preventDefault(); rememberSelection(); setFindOpen(true); } }} onMouseUp={rememberSelection} onKeyUp={rememberSelection} onBlur={rememberSelection} aria-label="Document editor"><p><br/></p></div>
          </article>
        </div>
        <div className="mt-2 flex shrink-0 items-center justify-end gap-4 px-1 text-xs text-slate-500 print:hidden"><span>{stats.words} words</span><span>{stats.characters} characters</span><span>{documents.length} document{documents.length === 1 ? "" : "s"}</span></div>
      </div>
    </ToolShell>
  );
}
