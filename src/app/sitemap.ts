import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Required for `output: export` (the GitHub Pages showcase build).
export const dynamic = "force-static";

/** Pages that should be found by search. The owner dashboard is left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  // Date only: the build day, not a timestamp that changes on every request.
  const built = new Date().toISOString().slice(0, 10);
  return [
    { url: site.url, lastModified: built },
    { url: `${site.url}/privacy`, lastModified: built },
    { url: `${site.url}/terms`, lastModified: built },
  ];
}
