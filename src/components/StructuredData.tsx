import { businessLd, websiteLd } from "@/lib/seo";
import JsonLd from "./JsonLd";

/** The homepage's structured data: the shop itself, and the site it owns. */
export default function StructuredData() {
  return (
    <>
      <JsonLd data={businessLd()} />
      <JsonLd data={websiteLd()} />
    </>
  );
}
