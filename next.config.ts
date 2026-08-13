import type { NextConfig } from "next";

// Allow next/image to optimize photos served from Supabase storage.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

/**
 * STATIC_EXPORT=1 builds a fully static site for GitHub Pages (the showcase
 * deploy). It disables the image optimizer (no server to run it) and applies
 * a basePath since Pages serves from /<repo-name>/. The normal build (Vercel
 * or `next start`) keeps server rendering, the auth proxy, and Supabase.
 */
const isExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  ...(isExport ? { output: "export" as const } : {}),
  ...(basePath ? { basePath } : {}),
  images: {
    ...(isExport ? { unoptimized: true } : {}),
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
