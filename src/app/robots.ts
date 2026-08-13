import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The owner dashboard has nothing useful for crawlers.
      disallow: "/admin",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
