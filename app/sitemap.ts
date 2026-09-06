import type { MetadataRoute } from "next";
import { tools } from "@/lib/tools";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://any-tools.vercel.app";
  return [
    { url: base, changeFrequency: "weekly", priority: 1 },
    ...tools.map((tool) => ({ url: `${base}${tool.href}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
