import Link from "next/link";
import { site } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="site-footer">
        <div className="shell footer-top">
          <Link className="brand brand-footer" href="/#top" aria-label={`${site.name} home`}>
            <span className="brand-mark" aria-hidden="true">
              <i></i>
              <b></b>
            </span>
            <span className="brand-type">
              <strong>PRO TECH</strong>
              <small>COLLISION</small>
            </span>
          </Link>
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
