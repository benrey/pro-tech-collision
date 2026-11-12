import { llmsText } from "@/lib/seo";

// Required for `output: export` (the GitHub Pages build).
export const dynamic = "force-static";

/** A plain-text summary of the shop for AI assistants. */
export function GET() {
  return new Response(llmsText(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
