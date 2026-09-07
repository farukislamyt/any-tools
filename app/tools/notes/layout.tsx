import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notes — Free Online Note Tool",
  description: "Write and save quick notes locally in your browser with this simple free notes tool.",
  alternates: { canonical: "/tools/notes" },
};

export default function NotesLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
