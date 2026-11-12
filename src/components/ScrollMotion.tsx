"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Scroll-linked motion for the public page. Renders nothing.
 *
 * Four things, all driven from one requestAnimationFrame loop:
 *
 * 1. Inertia scrolling (Lenis) — the wheel eases to a stop instead of jumping.
 *    Touch scrolling is left native, which is what phones do best already.
 * 2. `--hero-p` on .hero — 0 at the top of the page, 1 once the hero has
 *    scrolled away. CSS uses it to push the photo back and lift the copy.
 * 3. `--enter` on every section after the hero — 0 as its top edge reaches the
 *    bottom of the screen, 1 once it has travelled a little under half a
 *    screen. CSS fades the section with it, so sections arrive as you scroll
 *    down and recede again as you scroll back up. (Fade only: moving the
 *    section itself would throw off where menu links land.)
 * 4. Parallax — `[data-parallax]` images slide inside their frame, and
 *    `[data-drift="0.07"]` blocks travel a little faster or slower than the
 *    page. Both are written to the `translate` property, so they never fight
 *    the `transform` that hover states and <Reveal> use.
 *
 * Everything is skipped under prefers-reduced-motion: the page then scrolls
 * and looks exactly as it does without this component.
 */

/** Share of the viewport a section travels while it fades in. */
const ENTER_DISTANCE = 0.45;

/** How far a parallax image travels, as a share of its distance from centre. */
const IMAGE_SPEED = -0.1;
/** Must stay below the bleed that `scale` gives the image in globals.css. */
const IMAGE_BLEED = 0.075;

type Item = {
  el: HTMLElement;
  speed: number;
  /** Clamp to the image's bleed so its edge can never show. */
  clamp: boolean;
  /** Drifting blocks only move on wide layouts, where columns sit side by side. */
  wideOnly: boolean;
  visible: boolean;
  applied: number;
};

export default function ScrollMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    const wide = window.matchMedia("(min-width: 1001px)");
    const hero = document.querySelector<HTMLElement>(".hero");

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main > section:not(.hero)"),
      (el) => ({ el, enter: 1 }),
    );

    const items: Item[] = [
      ...Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"), (el) => ({
        el,
        speed: IMAGE_SPEED,
        clamp: true,
        wideOnly: false,
      })),
      ...Array.from(document.querySelectorAll<HTMLElement>("[data-drift]"), (el) => ({
        el,
        speed: Number(el.dataset.drift) || 0,
        clamp: false,
        wideOnly: true,
      })),
    ].map((item) => ({ ...item, visible: false, applied: 0 }));

    const byElement = new Map(items.map((item) => [item.el, item]));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const item = byElement.get(entry.target as HTMLElement);
          if (item) item.visible = entry.isIntersecting;
        }
        dirty = true;
      },
      { rootMargin: "25% 0px" },
    );
    for (const item of items) observer.observe(item.el);

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      // Menu links glide to their section and land exactly, in a fixed time.
      anchors: { duration: 1.2, easing: (t) => 1 - Math.pow(1 - t, 4) },
    });
    root.classList.add("has-scroll-motion");

    let dirty = true;
    const markDirty = () => {
      dirty = true;
    };
    lenis.on("scroll", markDirty);
    window.addEventListener("scroll", markDirty, { passive: true });
    window.addEventListener("resize", markDirty);

    const update = () => {
      const viewport = window.innerHeight;

      if (hero) {
        const p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, hero.offsetHeight)));
        hero.style.setProperty("--hero-p", p.toFixed(4));
      }

      // Read every position first, then write, so layout is measured once.
      const entering = sections.map((section) => {
        const rect = section.el.getBoundingClientRect();
        // Skip the maths for sections nowhere near the bottom edge.
        if (rect.bottom < 0) return 1;
        const t = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport * ENTER_DISTANCE)));
        return 1 - (1 - t) * (1 - t);
      });

      const next = items.map((item) => {
        if (!item.visible) return item.applied;
        if (item.wideOnly && !wide.matches) return 0;
        const rect = item.el.getBoundingClientRect();
        // The rect includes the offset applied last frame; take it back out.
        const fromCentre = rect.top + rect.height / 2 - item.applied - viewport / 2;
        const value = fromCentre * item.speed;
        if (!item.clamp) return value;
        const limit = rect.height * IMAGE_BLEED;
        return Math.min(limit, Math.max(-limit, value));
      });

      sections.forEach((section, index) => {
        const value = entering[index];
        if (Math.abs(value - section.enter) < 0.002) return;
        section.enter = value;
        section.el.style.setProperty("--enter", value.toFixed(3));
      });

      items.forEach((item, index) => {
        const value = next[index];
        if (Math.abs(value - item.applied) < 0.05) return;
        item.applied = value;
        item.el.style.translate = `0 ${value.toFixed(1)}px`;
      });
    };

    let frame = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      if (dirty) {
        dirty = false;
        update();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", markDirty);
      window.removeEventListener("resize", markDirty);
      lenis.destroy();
      root.classList.remove("has-scroll-motion");
      hero?.style.removeProperty("--hero-p");
      for (const item of items) item.el.style.translate = "";
      for (const section of sections) section.el.style.removeProperty("--enter");
    };
  }, []);

  return null;
}
