import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://any-tools.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/embed/"],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
