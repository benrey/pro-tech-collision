"use client";

import Image from "next/image";
import { useId, useState } from "react";

type Props = {
  beforeUrl: string;
  afterUrl: string;
  title: string;
  vehicle?: string | null;
  description?: string | null;
};

/**
 * Before/after comparison slider.
 *
 * Built on a range input rather than pointer events so it's keyboard
 * accessible and works with assistive tech for free — arrow keys move the
 * divider. The visible thumb is drawn separately; the input itself is
 * transparent and stretched across the image (see .ba-range in globals.css).
 */
export default function BeforeAfter({ beforeUrl, afterUrl, title, vehicle, description }: Props) {
  const [position, setPosition] = useState(50);
  const labelId = useId();

  return (
    <figure className="overflow-hidden rounded-2xl border border-border-subtle bg-surface-raised">
      <div className="relative aspect-4/3 w-full select-none overflow-hidden bg-surface">
        {/* After image sits underneath, fully visible */}
        <Image
          src={afterUrl}
          alt={`${title} — after repair`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />

        {/* Before image clipped to the slider position */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={beforeUrl}
            alt={`${title} — before repair`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>

        {/* Corner labels */}
        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
          Before
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-contrast">
          After
        </span>

        {/* Divider line + handle */}
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.25)]"
          style={{ left: `${position}%` }}
        >
          <span className="absolute top-1/2 left-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-lg">
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-800" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m9 6-4 6 4 6M15 6l4 6-4 6" />
            </svg>
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(e) => setPosition(Number(e.target.value))}
          className="ba-range absolute inset-0 h-full w-full"
          aria-labelledby={labelId}
          aria-valuetext={`${position}% of the before image shown`}
        />
      </div>

      <figcaption className="p-4">
        <h3 id={labelId} className="text-base font-semibold text-foreground">
          {title}
        </h3>
        {vehicle && <p className="mt-0.5 text-sm font-medium text-accent">{vehicle}</p>}
        {description && <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{description}</p>}
      </figcaption>
    </figure>
  );
}
