import type { MetadataRoute } from "next";
import { asset } from "@/lib/assets";
import { site } from "@/lib/site";

// Required for `output: export` (the GitHub Pages build).
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: `Collision repair in ${site.address.city}, Texas.`,
    start_url: asset("/"),
    display: "browser",
    background_color: "#f5f1eb",
    theme_color: "#20252a",
    icons: [
      { src: asset("/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: asset("/icons/icon-512.png"), sizes: "512x512", type: "image/png" },
    ],
  };
}
