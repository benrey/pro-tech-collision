"use client";

import { useEffect, useRef, useState } from "react";
import { asset } from "@/lib/assets";
import { site } from "@/lib/site";

/**
 * Footer link that opens the shop's QR code for print.
 *
 * The codes are generated at build time by scripts/generate-qr.mjs, so this is
 * just a viewer — nothing is encoded in the browser. The SVG is what gets
 * handed to a printer (vector, so it stays sharp at any size); the PNG is
 * offered alongside for the places that reject SVG uploads.
 *
 * Uses a native <dialog> for focus trapping and Escape-to-close rather than
 * hand-rolling either.
 */
export default function QrCode() {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // The copy confirmation is transient; reset it so reopening is never stale.
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(site.url);
      setCopied(true);
    } catch {
      // Clipboard is blocked in some browsers over plain HTTP or without a
      // user gesture; the URL is printed below, so it stays copyable by hand.
    }
  }

  return (
    <>
      <button type="button" className="qr-link" onClick={() => setOpen(true)}>
        QR code
      </button>

      <dialog ref={ref} className="qr-dialog" onClose={() => setOpen(false)}>
        <div className="qr-card">
          <button
            type="button"
            className="qr-close"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            ×
          </button>

          <p className="eyebrow">Scan to visit</p>
          <h2>
            Put us on a<br />
            <em>business card.</em>
          </h2>
          <p className="qr-blurb">
            This code opens {site.shortName}&rsquo;s website. Print it on cards,
            invoices, or the shop door — it never expires.
          </p>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="qr-image"
            src={asset("/qr/site.svg")}
            alt={`QR code linking to ${site.url}`}
            width={240}
            height={240}
          />

          <p className="qr-url">{site.url.replace(/^https:\/\//, "")}</p>

          <div className="qr-actions">
            <a href={asset("/qr/site.svg")} download="ptcollision-qr.svg">
              Download SVG
            </a>
            <a href={asset("/qr/site.png")} download="ptcollision-qr.png">
              Download PNG
            </a>
            <button type="button" onClick={copyUrl}>
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>

          <p className="qr-note">
            SVG for print — it stays sharp at any size. PNG for anything that
            won&rsquo;t take an SVG.
          </p>
        </div>
      </dialog>
    </>
  );
}
