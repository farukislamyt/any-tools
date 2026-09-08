import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Online Unit Converter",
  description: "Convert length, weight, temperature, area and volume units online for free.",
  alternates: { canonical: "/tools/unit-converter" },
};

export default function UnitConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
