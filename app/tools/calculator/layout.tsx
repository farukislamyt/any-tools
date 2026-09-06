import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculator",
  description: "Free online calculator for fast everyday arithmetic.",
};

export default function CalculatorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
