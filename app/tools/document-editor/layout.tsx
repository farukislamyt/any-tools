import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Document Editor — Free Online Word Processor",
  description: "Write, format, edit and print documents online with a lightweight Microsoft Word-style editor.",
  alternates: { canonical: "/tools/document-editor" },
};

export default function DocumentEditorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
