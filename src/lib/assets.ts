/**
 * Prefixes a public-asset path with the deploy basePath.
 *
 * next/image passes `src` through verbatim when the optimizer is off (the
 * static GitHub Pages build), so /images/… would 404 under /repo-name/.
 * NEXT_PUBLIC_BASE_PATH is inlined at build time; empty for normal deploys.
 */
export function asset(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
