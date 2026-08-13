"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import Brand from "./Brand";

const navLinks = [
  { href: "/#services", label: "Services" },
  { href: "/#paint-booth", label: "Paint & refinishing" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/#visit", label: "Visit us" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="topline">
        <p>
          <span className="top-dot" />
          Midland&apos;s collision &amp; refinishing shop
        </p>
        <a href={site.phone.href}>
          Call <span>{site.phone.display}</span>
        </a>
      </div>

      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <Brand />

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <a
            className="text-action"
            href={site.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Directions <span aria-hidden="true">↗</span>
          </a>
          <a className="ebutton ebutton-small" href={site.phone.href}>
            Start a repair <span aria-hidden="true">↗</span>
          </a>
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close navigation" : "Open navigation"}</span>
          <i></i>
          <i></i>
        </button>
      </header>

      <nav
        className={`mobile-menu ${open ? "is-open" : ""}`}
        id="mobile-menu"
        aria-label="Mobile navigation"
      >
        {navLinks.map((link, index) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label} <span>{String(index + 1).padStart(2, "0")}</span>
          </Link>
        ))}
        <a className="ebutton" href={site.phone.href}>
          Call the shop <span aria-hidden="true">↗</span>
        </a>
      </nav>
    </>
  );
}
