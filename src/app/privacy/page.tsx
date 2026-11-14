import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `What ${site.name} collects through this website, how it is used, and how to ask about it.`,
  path: "/privacy",
});

/**
 * Keep this page true to what the site actually does. If the estimate form,
 * the analytics, or the embedded map changes, update the matching section.
 */
export default function PrivacyPage() {
  const { address, phone } = site;

  return (
    <LegalPage
      title="Privacy policy"
      effective="November 14, 2026"
      intro={`This page explains what ${site.name} collects through this website, what we do with it, and how to reach us about it.`}
    >
      <h2>The short version</h2>
      <p>
        We collect what you send us in the estimate request form so we can get back to you about
        your vehicle. We do not sell your information, and we do not use advertising or tracking
        cookies.
      </p>

      <h2>What we collect</h2>
      <h3>Estimate requests</h3>
      <p>When you send an estimate request through this site, we receive what you enter:</p>
      <ul>
        <li>your name and phone number;</li>
        <li>your email address, if you give one;</li>
        <li>your vehicle&apos;s year, make and model, if you give them;</li>
        <li>your description of the damage, if you write one.</li>
      </ul>
      <p>
        Please do not put sensitive details in the form, such as your driver&apos;s license number,
        insurance policy number, or payment card details. We can take those in person if a repair
        needs them.
      </p>

      <h3>Visit statistics</h3>
      <p>
        We use Cloudflare Web Analytics to count visits. It tells us things like which page was
        viewed, the site that linked to us, and the type of browser and device, and the country a
        visit came from. It does not use cookies and it does not identify you or follow you to
        other websites.
      </p>

      <h3>Technical information</h3>
      <p>
        Like every website, this one receives your IP address and basic browser information in
        order to send you the page. The companies that host and deliver the site, Cloudflare and
        GitHub, process that information for delivery and security.
      </p>

      <h3>The map</h3>
      <p>
        The map on our home page is provided by Google Maps. When it loads, Google may collect
        information and set its own cookies under{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          Google&apos;s privacy policy
        </a>
        .
      </p>

      <h2>How we use it</h2>
      <ul>
        <li>to reply to your request and prepare an estimate;</li>
        <li>to schedule and carry out a repair you ask for;</li>
        <li>to keep the website working and see how it is used;</li>
        <li>to meet our legal and record-keeping obligations.</li>
      </ul>
      <p>We do not use your information to send marketing you did not ask for.</p>

      <h2>Who we share it with</h2>
      <p>We do not sell or rent your information. We share it only:</p>
      <ul>
        <li>
          with the service providers that run this website for us: Supabase, which stores estimate
          requests; Cloudflare and GitHub, which host and deliver the site; and Google, which
          provides the map;
        </li>
        <li>with others when you ask us to, such as your insurance company on a claim;</li>
        <li>when the law requires it, or to protect our rights, our customers, or the public.</li>
      </ul>

      <h2>How long we keep it</h2>
      <p>
        We keep estimate requests for as long as we need them to respond to you, to do the work,
        and for our business records. You can ask us to delete a request at any time.
      </p>

      <h2>Your choices</h2>
      <p>
        You can ask us what we have from your estimate request, ask us to correct it, or ask us to
        delete it. Call us at <a href={phone.href}>{phone.display}</a> or write to the address
        below. You can also skip the form entirely and call or visit instead.
      </p>

      <h2>Security</h2>
      <p>
        The site is served over an encrypted connection, and estimate requests can be read only
        by the shop. No website or storage system is perfectly secure, so we cannot promise
        absolute security.
      </p>

      <h2>Children</h2>
      <p>
        This website is for vehicle owners and is not directed to children under 13. We do not
        knowingly collect information from them.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If we change this policy we will post the new version here and update the effective date
        at the top of the page.
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
      <p>
        See also our <Link href="/terms">terms of service</Link>.
      </p>
    </LegalPage>
  );
}
