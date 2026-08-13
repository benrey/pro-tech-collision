"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades/slides children in when they enter the viewport.
 *
 * Works by toggling a class rather than React state: the observer adds
 * `is-visible` directly, so there's no re-render and no setState-in-effect.
 * CSS in globals.css owns the animation; prefers-reduced-motion disables it.
 */
export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  /** Stagger offset in ms. */
  delay?: number;
  as?: "div" | "section" | "li" | "span" | "figure";
  className?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      // Ref type is intentionally loose across the small set of allowed tags.
      ref={ref as React.Ref<never>}
      className={`reveal ${className}`}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
