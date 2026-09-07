import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word Counter — Free Online Word Count Tool",
  description: "Count words, characters, lines and sentences with a fast free online word counter.",
  alternates: { canonical: "/tools/word-counter" },
};

export default function WordCounterLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
