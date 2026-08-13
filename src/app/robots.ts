import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Required for `output: export` (the GitHub Pages showcase build).
export const dynamic = "force-static";

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
