import Link from "next/link";
import { site } from "@/lib/site";

/**
 * The brand lockup: a crimson badge with a hand-drawn white slash and the
 * stacked PRO TECH / COLLISION type, per the owner's logo direction.
 * Self-colored, so it reads the same over the hero, the paper header pill,
 * and the footer.
 */
export default function Brand({ className = "" }: { className?: string }) {
  return (
    <Link className={`brand ${className}`} href="/#top" aria-label={`${site.name} home`}>
      <svg
        className="brand-slash"
        viewBox="0 0 26 96"
        fill="currentColor"
        aria-hidden="true"
      >
        {/* Near-vertical stroke with a slight lean and gentle bow, per the logo */}
        <path d="M8.5 2 C 8 33, 9.5 66, 12.5 94 L 17 93 C 14 64, 13 32, 13.5 3 Z" />
      </svg>
      <span className="brand-type">
        <strong>PRO&nbsp;TECH</strong>
        <small>COLLISION</small>
      </span>
    </Link>
  );
}
