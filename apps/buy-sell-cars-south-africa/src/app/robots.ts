import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin"],
    },
    sitemap: "https://buysellcars.co.zw/sitemap.xml",
    host: "https://buysellcars.co.zw",
  };
}
