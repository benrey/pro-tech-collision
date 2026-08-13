"use client";

import { useCallback, type ReactNode } from "react";

/**
 * Wraps a grid of .spot-card elements and feeds each card the cursor position
 * as --mx/--my CSS variables, driving the radial glow in globals.css.
 *
 * One delegated mousemove on the container instead of a handler per card;
 * writing CSS vars directly avoids any React re-render on pointer move.
 */
export default function Spotlight({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const handleMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const cards = event.currentTarget.querySelectorAll<HTMLElement>(".spot-card");
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    }
  }, []);

  return (
    <div className={className} onMouseMove={handleMove}>
      {children}
    </div>
  );
}
