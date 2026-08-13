# Pro Tech Collision — website

Marketing site for Pro Tech Collision Inc. (Midland, TX) with an owner
dashboard for uploading before/after repair photos and managing reviews.

Built with Next.js 16, React 19, Tailwind v4, and Supabase.

---

## ⚠️ Before you launch: replace the placeholder business data

**Only the business name and map coordinates were verified.** The phone number,
street address, email, hours, certifications, insurance carriers, and warranty
in [`src/lib/site.ts`](src/lib/site.ts) are **invented placeholders**.

Publishing a wrong phone number sends customers to a dead line, and claiming
certifications the shop doesn't hold is a legal problem. Fix these first:

```bash
npm run check:content   # lists everything still unverified
```

Edit `src/lib/site.ts`, then flip each `verified: false` flag to `true`. The
command exits non-zero until every placeholder is gone, so you can wire it into
CI as a launch gate.

Specifically confirm with the owner:

| Field | Where | Why it matters |
|---|---|---|
| Phone number | `site.phone` | Currently `(432) 555-0100` — a fake number |
| Street address + ZIP | `site.address` | Shows on the page **and** in schema.org data |
| Email | `site.email` | Currently `REPLACE-ME@example.com` |
| Hours | `site.hours` | Must match the Google Business Profile or local SEO suffers |
| Certifications | `site.certifications` | **Remove any the shop doesn't actually hold** |
| Insurance carriers | `site.insurance.carriers` | Confirm which they really work with |
| Warranty terms | `site.warranty` | Confirm what's actually offered in writing |
| Years in business | `site.yearsInBusiness` | Currently a guess |

---

## Setup

### 1. Install and configure

```bash
npm install
cp .env.example .env.local
```

### 2. Create a Supabase project

1. Sign up at [supabase.com](https://supabase.com) (free tier is plenty here).
2. Create a new project.
3. Go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Paste both into `.env.local`.

### 3. Create the database tables

Open **SQL Editor → New query** in the Supabase dashboard, paste the entire
contents of [`supabase/schema.sql`](supabase/schema.sql), and run it. This creates:

- `gallery_items` — before/after photo pairs
- `testimonials` — customer reviews
- `quote_requests` — submissions from the contact form
- `admins` — the owner allowlist
- a public `gallery` storage bucket
- row level security policies on everything

It's safe to re-run.

### 4. Create the owner's login

1. Start the site: `npm run dev`
2. In Supabase, go to **Authentication → Users → Add user**, and create the
   owner's account with an email and password. (Or let them sign up, then
   confirm the email.)
3. Grant admin rights by running this in the SQL Editor:

   ```sql
   insert into public.admins (email) values ('owner@example.com');
   ```

4. They can now sign in at `/admin`.

Without step 3 the account can sign in but sees "Access not enabled" — and more
importantly, the database itself rejects any write. Signing up alone grants
nothing.

### 5. Run it

```bash
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # eslint
```

---

## How the owner uses it

Everything lives at **`/admin`** (also linked from the footer as "Owner login").

**Photos tab** — pick a before photo and an after photo, add a title and vehicle,
and upload. They appear on the site immediately in a slider customers can drag.
Hide or delete any of them later. Accepts JPG, PNG, WEBP, and HEIC (straight
from an iPhone) up to 10MB each.

**Reviews tab** — paste in real customer reviews with the customer's name and a
star rating.

> **On Google reviews:** the site links to the live Google listing, but reviews
> are entered by hand rather than scraped. Google's terms don't permit scraping
> their review content, and their API doesn't expose full review text for
> arbitrary businesses. Copying real reviews manually with attribution is both
> permitted and more durable.

**Quote Requests tab** — submissions from the website's contact form, with
click-to-call numbers and a handled/unread toggle.

---

## Deploying

The easiest path is [Vercel](https://vercel.com), which is free for a site
this size:

1. Push this repo to GitHub.
2. Import it at [vercel.com/new](https://vercel.com/new).
3. Add the three environment variables from `.env.local` under
   **Settings → Environment Variables**, setting `NEXT_PUBLIC_SITE_URL` to the
   real domain.
4. Deploy.

To use a custom domain, add it under **Settings → Domains** and point the
registrar's DNS at Vercel.

### After deploying

- Set `NEXT_PUBLIC_SITE_URL` to the live URL so canonical links, the sitemap,
  and OpenGraph tags are correct.
- Submit the sitemap (`/sitemap.xml`) in
  [Google Search Console](https://search.google.com/search-console).
- Add the website URL to the shop's Google Business Profile — this is the
  single highest-impact local SEO step.
- Validate the structured data with the
  [Rich Results Test](https://search.google.com/test/rich-results).

---

## Structure

```
src/
  app/
    page.tsx              # homepage, composes the sections
    layout.tsx            # metadata, fonts, no-flash theme script
    robots.ts             # crawler rules
    sitemap.ts            # sitemap.xml
    admin/
      page.tsx            # owner dashboard (tabbed)
      login/page.tsx      # sign in
  components/
    sections/             # Hero, Services, Credibility, Process,
                          # Gallery, Testimonials, Contact
    admin/                # GalleryManager, TestimonialManager,
                          # RequestInbox, AdminShell
    BeforeAfter.tsx       # the draggable comparison slider
    QuoteForm.tsx         # contact form → quote_requests
    StructuredData.tsx    # schema.org AutoBodyShop JSON-LD
  lib/
    site.ts               # ⚠️ all business data lives here
    types.ts              # shared record shapes
    useRecords.ts         # shared load/refresh hook for admin lists
    supabase/             # browser + server clients
  proxy.ts                # session refresh, /admin guard
supabase/schema.sql       # database + RLS + storage setup
scripts/check-content.mjs # placeholder data checker
```

---

## Notes on a few decisions

**Why the site works before Supabase is configured.** The server client returns
`null` when env vars are missing, so the public pages render with empty gallery
and testimonial states instead of crashing. You can style and review the whole
site before touching a database.

**Security posture.** The anon key is public by design — row level security is
what enforces access. Non-admins can only read *published* gallery items and
testimonials, and can only *insert* quote requests, never read them back. That
last asymmetry matters: without it, anyone could read every customer's name and
phone number. The `/admin` route guard in `proxy.ts` is convenience only; the
real boundary is in the database.

**Adding a customer login later.** Supabase Auth is already wired up, so adding
customer accounts (e.g. to check repair status) means adding a `customers` table
with its own RLS policies — no new infrastructure.

**Progressive Web App.** Since this is a plain web app, it can be installed to a
phone home screen by adding a manifest and service worker later — no app store,
no separate codebase.
