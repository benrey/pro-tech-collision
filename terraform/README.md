# Cloudflare provisioning — ptcollisioninc.com

DNS and edge config for the site, managed as code. Same pathway as the
`pluggdn` repo: a `dns` module holding every record, a Cloudflare provider fed
by a scoped API token, everything checked into git so the zone is never edited
by hand in the dashboard.

## How the site is served

```
  push to main
       |
       v
  GitHub Actions  (.github/workflows/deploy-pages.yml)
       |  next build with STATIC_EXPORT=1
       v
  GitHub Pages  (benrey.github.io, origin only)
       |
       v
  Cloudflare  (proxied / orange cloud — caches and serves from its edge)
       |
       v
  https://ptcollisioninc.com
```

The domain was registered at Cloudflare, so the nameservers already point at
Cloudflare — there is no registrar step. Terraform creates the zone, the
records and the zone settings.

Both records are **proxied**. That is the point of the setup: GitHub Pages is
the build target, Cloudflare is the CDN that actually answers visitors. TLS is
terminated by Cloudflare's Universal SSL cert; the Cloudflare→Pages leg is
covered by `ssl = "full"` (not `strict`, because the origin's cert is valid for
`*.github.io`, not for the custom domain).

## What differs from pluggdn

pluggdn's `dns` module points at AWS — ALB, API Gateway, CloudFront — and needs
an ACM cert per hostname, plus SES records for mail. None of that exists here:
static site, no AWS account, no mail. So this stack is the same *shape* with a
much smaller surface — zone, two content records, mail-null records, zone
settings, one redirect rule.

## Layout

```
terraform/
  envs/prod/          root module — providers, variables, wiring
  modules/zone/       the Cloudflare zone itself (create or adopt)
  modules/dns/        every record + zone setting + the www redirect
```

## First-time setup

### 1. Create an API token

Cloudflare dashboard → My Profile → API Tokens → Create Token → Custom token.

| Scope | Permission |
|---|---|
| Account → your account | — (include it under *Account Resources*) |
| Zone → Zone | Edit |
| Zone → DNS | Edit |
| Zone → Zone Settings | Edit |

Account Resources must include your account, otherwise Terraform cannot
*create* the zone. Zone Resources: all zones from that account.

### 2. Supply credentials (GitHub variables and secrets)

Config lives in GitHub, not in a local tfvars file — same convention as
pluggdn. Set it once:

```sh
gh secret set CLOUDFLARE_API_TOKEN            # prompts, never echoed
gh variable set ZONE_ID --body "<zone id>"    # Cloudflare dashboard, zone overview
```

Optional overrides (both have defaults in `variables.tf`):

```sh
gh variable set DOMAIN_NAME --body "ptcollisioninc.com"
gh variable set PAGES_CNAME_TARGET --body "benrey.github.io"
```

`ZONE_ID` is passed straight through, which skips the zone lookup — so the
token needs no account-level permission, only the three zone scopes above.

### 3. Apply

Run the **Terraform DNS** workflow (Actions → Terraform DNS → Run workflow)
and pick `plan` or `apply`. A push touching `terraform/**` runs a plan only,
so changes are visible without anything being applied.

```sh
gh workflow run terraform-dns.yml -f action=plan    # read this first
gh workflow run terraform-dns.yml -f action=apply
```

Every run includes a guard that inspects the plan and **fails if it would
touch any TXT or MX record**, because the shop's Amazon SES / WorkMail setup
shares this zone and is not managed by Terraform. See the mail note in
`modules/dns/main.tf`.

To plan locally instead, copy `envs/prod/terraform.tfvars.example` to
`terraform.tfvars` (gitignored) and run `terraform plan` from
`terraform/envs/prod`.

### 4. Point GitHub Pages at the domain

The workflow writes `out/CNAME` on every build, which is what tells Pages to
accept the custom domain. After the first deploy, confirm under
**repo → Settings → Pages** that the custom domain reads
`ptcollisioninc.com` and that *Enforce HTTPS* is enabled.

Leave *Enforce HTTPS* alone until Pages finishes provisioning its own
certificate — with Cloudflare proxying in front it may take a few minutes
before the checkbox is available.

## The zone already exists

It does — the domain is registered at Cloudflare and is already serving mail,
so the zone is there. Passing `ZONE_ID` (what CI does) uses it directly and
never goes near zone creation, so this is already handled.

`create_zone` now defaults to `false` and only matters on the fallback path
where no zone id is supplied and Terraform looks the zone up by name.

**Or import it into state** so Terraform manages the zone resource itself:

```sh
terraform import 'module.zone.cloudflare_zone.this[0]' <zone-id>
```

Existing records collide the same way. Import each one:

```sh
terraform import 'module.dns.cloudflare_dns_record.root' <zone-id>/<record-id>
```

List record IDs with:

```sh
curl -s -H "Authorization: Bearer $TF_VAR_cloudflare_api_token" \
  "https://api.cloudflare.com/client/v4/zones/<zone-id>/dns_records" \
  | python3 -m json.tool
```

## State

State is local and gitignored — see the comment in `envs/prod/backend.tf`,
which includes a ready-to-paste Cloudflare R2 backend block if this ever needs
to be shared between machines or run from CI.

## Verifying a deploy

```sh
# Cloudflare is answering (expect cf-ray and cf-cache-status headers)
curl -sI https://ptcollisioninc.com | grep -i 'cf-ray\|cf-cache-status\|server'

# www redirects to apex
curl -sI https://www.ptcollisioninc.com | grep -i 'location\|HTTP/'

# the apex is flattened to Cloudflare edge IPs, not GitHub's
dig +short ptcollisioninc.com
```

DNS changes propagate in about a minute; a newly proxied hostname can take a
few minutes more while Universal SSL issues.
