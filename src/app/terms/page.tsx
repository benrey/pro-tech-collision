import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: `The terms for using the ${site.name} website.`,
  path: "/terms",
});

/**
 * These terms cover the website only. Do not describe the repair guarantee,
 * pricing, or insurance arrangements here beyond the client's own wording in
 * site.ts: those are set by the shop's paperwork, not by this page.
 */
export default function TermsPage() {
  const { address, phone } = site;

  return (
    <LegalPage
      title="Terms of service"
      effective="November 14, 2026"
      intro={`These terms cover your use of the ${site.name} website. Repair work is covered by the paperwork you receive at the shop, not by this page.`}
    >
      <h2>Using this website</h2>
      <p>
        This website is run by {site.name}, {address.street}, {address.city}, {address.state}{" "}
        {address.zip}. By using it you agree to these terms. If you do not agree, please do not
        use the site; you are always welcome to call or visit instead.
      </p>

      <h2>What the website is for</h2>
      <p>
        The site describes our shop and services and lets you ask for an estimate. We work to keep
        it accurate, but details such as services and hours can change, and the site may contain
        mistakes. Please call to confirm anything you are relying on.
      </p>

      <h2>Estimate requests</h2>
      <ul>
        <li>
          Sending a request through the site asks us to contact you. It is not an appointment, a
          price quote, or a contract, and neither of us is obligated by it.
        </li>
        <li>
          Any figure discussed before we have inspected the vehicle is preliminary. Damage often
          cannot be fully assessed until the vehicle is seen in person.
        </li>
        <li>
          The information you send should be accurate and your own to give. How we handle it is
          described in our <Link href="/privacy">privacy policy</Link>.
        </li>
      </ul>

      <h2>Repair work</h2>
      <p>
        Any repair we do for you is covered by the written estimate, repair order, and other
        documents you receive from the shop. Those documents, not these website terms, set the
        price, the scope of the work, and what is guaranteed. If this website and your shop
        paperwork ever differ, the paperwork controls.
      </p>

      <h2>Insurance</h2>
      <p>
        Whether a repair is covered, and how much is paid, is decided by your insurance company
        and your policy. Nothing on this site is a promise that a particular claim or insurer
        will be accepted; please call us about yours.
      </p>

      <h2>Photos and reviews</h2>
      <p>
        Photos on the site are there to illustrate our work. Every vehicle and every repair is
        different, so they are not a promise of a particular result. Reviews reflect the
        experience of the people who wrote them.
      </p>

      <h2>Our content</h2>
      <p>
        The text, photos, logo, and design of this site belong to {site.name} or are used with
        permission. You may view and share the site for personal use. Please do not copy it for
        commercial use without asking us first.
      </p>

      <h2>Acceptable use</h2>
      <p>Please do not:</p>
      <ul>
        <li>send false, abusive, or automated requests through the form;</li>
        <li>try to break into, overload, or interfere with the site;</li>
        <li>use the site in any way that breaks the law.</li>
      </ul>

      <h2>Links to other sites</h2>
      <p>
        The site links to services we do not control, such as Google Maps. Their own terms and
        privacy policies apply when you use them.
      </p>

      <h2>No warranties about the website</h2>
      <p>
        The website is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; To the extent
        the law allows, we make no warranties about the website itself, including that it will
        always be available or free of errors. This section is about the website only. It does
        not change any guarantee we give you on repair work.
      </p>

      <h2>Limit of liability</h2>
      <p>
        To the extent the law allows, {site.name} is not liable for indirect, incidental, or
        consequential damages arising from your use of this website. Nothing in these terms
        limits any right you have that cannot be limited by law.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of the State of Texas. Any dispute about the website
        will be brought in the state or federal courts serving Midland County, Texas.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms. The new version takes effect when it is posted here with a new
        effective date.
      </p>

      <h2>Contact us</h2>
      <address>
        {site.name}
        <br />
        {address.street}
        <br />
        {address.city}, {address.state} {address.zip}
        <br />
        <a href={phone.href}>{phone.display}</a>
      </address>
    </LegalPage>
  );
}
