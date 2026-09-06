import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metal Weight Calculator",
  description: "Calculate the approximate weight of common metal shapes from dimensions and material density.",
};

export default function MetalWeightLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
