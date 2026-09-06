import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://any-tools.vercel.app"),
  title: {
    default: "AnyTools — Simple tools for everyday life",
    template: "%s | AnyTools",
  },
  description: "Fast, free and easy-to-use calculators, converters and practical tools for everyday life.",
  keywords: ["online tools", "calculator", "unit converter", "metal weight calculator", "everyday tools"],
  robots: { index: true, follow: true },
  openGraph: {
    title: "AnyTools — Simple tools for everyday life",
    description: "Fast, free and easy-to-use calculators, converters and practical tools.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
