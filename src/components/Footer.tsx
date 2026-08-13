import Link from "next/link";
import { site } from "@/lib/site";
import Brand from "./Brand";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="site-footer">
        <div className="shell footer-top">
          <div>
            <Brand />
          </div>
          <p>
            Quality repairs.
            <br />
            Superior service.
          </p>
          <div className="footer-links">
            <Link href="/#services">Services</Link>
            <Link href="/#reviews">Reviews</Link>
            <Link href="/#contact">Free estimate</Link>
            <Link href="/admin">Login</Link>
          </div>
        </div>
        <div className="shell footer-bottom">
          <span>
            © {year} {site.name}
          </span>
          <span>
            {site.address.city}, {site.address.state === "TX" ? "Texas" : site.address.state}
          </span>
          <a href={site.googleMapsUrl} target="_blank" rel="noopener noreferrer">
            Google Maps ↗
          </a>
        </div>
      </footer>

      <div className="mobile-callbar">
        <a href={site.phone.href}>Call now</a>
        <a href={site.googleMapsUrl} target="_blank" rel="noopener noreferrer">
          Directions ↗
        </a>
      </div>
    </>
  );
}
