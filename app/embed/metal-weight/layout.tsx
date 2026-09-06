import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Steel Weight Calculator Widget",
  description: "Embeddable AnyTools steel section weight calculator.",
  robots: { index: false, follow: false },
};

export default function MetalWeightEmbedLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
