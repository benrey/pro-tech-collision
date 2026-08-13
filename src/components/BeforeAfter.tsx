"use client";

import Image from "next/image";
import { useId, useState } from "react";

type Props = {
  beforeUrl: string;
  afterUrl: string;
  title: string;
  index: string;
  className?: string;
};

/**
 * Before/after comparison slider, styled as an editorial gallery tile.
 *
 * Built on a range input so it's keyboard accessible — arrow keys move the
 * divider. The visible thumb is drawn separately; the input itself is
 * transparent and stretched across the image (see .ba-range in globals.css).
 */
export default function BeforeAfter({ beforeUrl, afterUrl, title, index, className = "" }: Props) {
  const [position, setPosition] = useState(50);
  const labelId = useId();

  return (
    <figure className={`gallery-tile gallery-tile-live ${className}`}>
      <div className="absolute inset-0 select-none">
        <Image
          src={afterUrl}
          alt={`${title} — after repair`}
          fill
          sizes="(max-width: 760px) 100vw, 40vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={beforeUrl}
            alt={`${title} — before repair`}
            fill
            sizes="(max-width: 760px) 100vw, 40vw"
            className="object-cover"
          />
        </div>

        {/* Divider line + handle */}
        <div
          className="pointer-events-none absolute inset-y-0 z-[2] w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.25)]"
          style={{ left: `${position}%` }}
        >
          <span className="absolute top-1/2 left-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white shadow-lg">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-slate-800"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
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
          className="ba-range absolute inset-0 z-[3] h-full w-full"
          aria-labelledby={labelId}
          aria-valuetext={`${position}% of the before image shown`}
        />
      </div>

      <figcaption id={labelId}>
        <span>{title}</span>
        <b>{index} · DRAG</b>
      </figcaption>
    </figure>
  );
}
