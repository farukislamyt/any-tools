import type { Metadata } from "next";
import "./globals.css";

const siteName = "AnyTools";
const siteUrl = "https://any-tools.vercel.app";
const siteDescription =
  "Free online calculators, converters and practical tools for engineering, finance and everyday life.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AnyTools — Free Online Calculators & Useful Tools",
    template: "%s | AnyTools",
  },
  description: siteDescription,
  keywords: [
    "online tools",
    "free online calculator",
    "online calculator",
    "unit converter",
    "metal weight calculator",
    "steel weight calculator",
    "engineering calculator",
    "percentage calculator",
    "age calculator",
    "EMI calculator",
    "everyday tools",
  ],
  applicationName: siteName,
  authors: [{ name: "AnyTools" }],
  creator: "AnyTools",
  publisher: "AnyTools",
  category: "technology",
  classification: "Online tools and calculators",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "wkepnIps1_U_LQgccGzR8AXZiVZVfHeagYjgVQDpljk",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "AnyTools — Free Online Calculators & Useful Tools",
    description: siteDescription,
    url: siteUrl,
    siteName,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AnyTools — Free Online Calculators & Useful Tools",
    description: siteDescription,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
