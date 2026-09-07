import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Percentage Calculator",
  description: "Free percentage calculator for finding percentages and percentage change.",
  alternates: { canonical: "/tools/percentage" },
};

export default function PercentageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
