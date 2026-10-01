import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/account", "/favorites"],
    },
    sitemap: "https://askmirra.ai/sitemap.xml",
  };
}
