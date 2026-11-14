import Link from "next/link";
import Footer from "./Footer";
import Header from "./Header";

type Props = {
  title: string;
  /** Shown under the title, for example "November 14, 2026". */
  effective: string;
  /** One or two plain sentences saying what the page covers. */
  intro: string;
  children: React.ReactNode;
};

/**
 * Shared frame for the privacy policy and terms of service: the site header
 * over an ink masthead, then one narrow reading column on paper.
 */
export default function LegalPage({ title, effective, intro, children }: Props) {
  return (
    <div className="edt">
      <div className="page-noise" aria-hidden="true" />
      <Header />
      <main id="main">
        <div className="legal-masthead">
          <div className="shell">
            <p className="eyebrow eyebrow-light">
              <span></span> Effective {effective}
            </p>
            <h1>{title}</h1>
            <p className="legal-intro">{intro}</p>
          </div>
        </div>
        <article className="shell legal-body">
          {children}
          <p className="legal-back">
            <Link href="/">← Back to the home page</Link>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
