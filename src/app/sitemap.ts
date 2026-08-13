import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Required for `output: export` (the GitHub Pages showcase build).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
