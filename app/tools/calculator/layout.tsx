import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Calculator",
  description: "Use this free online calculator for addition, subtraction, multiplication and division. Fast, simple and mobile friendly.",
  alternates: { canonical: "/tools/calculator" },
  openGraph: {
    title: "Free Online Calculator | AnyTools",
    description: "A fast, simple online calculator for everyday arithmetic.",
    url: "/tools/calculator",
    type: "website",
  },
};

export default function CalculatorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
