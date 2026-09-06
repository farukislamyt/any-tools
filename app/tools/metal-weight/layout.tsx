import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Metal Weight Calculator — Steel, Aluminum & More",
  description: "Calculate metal and steel weight from standard sections or custom dimensions. Supports common materials, shapes and mixed units.",
  alternates: { canonical: "/tools/metal-weight" },
  keywords: [
    "metal weight calculator",
    "steel weight calculator",
    "steel section weight calculator",
    "metal weight calculator kg",
    "steel weight per meter",
    "MS weight calculator",
    "aluminum weight calculator",
  ],
  openGraph: {
    title: "Metal Weight Calculator | AnyTools",
    description: "Calculate steel and metal weight from standard sections or custom dimensions.",
    url: "/tools/metal-weight",
    type: "website",
  },
};

export default function MetalWeightLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
