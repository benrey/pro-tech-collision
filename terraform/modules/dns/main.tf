# terraform/modules/dns/main.tf
# Cloudflare DNS + zone settings for ptcollisioninc.com.
#
# Scope: the WEBSITE records only (apex + www) and zone-wide settings. The mail
# records are managed by the AWS/SES side — see the mail note below before
# adding anything here that touches TXT/MX.
#
# Origin is GitHub Pages (benrey.github.io). Both records are PROXIED (orange
# cloud), so Cloudflare pulls from Pages and serves the static site from its own
# edge — which is the point: Pages is the build target, Cloudflare is the CDN.
#
# Proxying means Cloudflare terminates TLS with its own Universal SSL cert, so
# the origin leg (Cloudflare -> github.io) is what `ssl = "full"` below covers.
# GitHub Pages serves valid TLS for the *.github.io apex, so "full" works
# without Pages having issued a cert for the custom domain yet.

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

# Root: apex CNAME to the Pages host. Cloudflare flattens apex CNAMEs to A
# records automatically, so this is legal at the zone root.
resource "cloudflare_dns_record" "root" {
  zone_id = var.cloudflare_zone_id
  name    = "@"
  type    = "CNAME"
  content = var.pages_cname_target
  proxied = true
  ttl     = 1
}

resource "cloudflare_dns_record" "www" {
  zone_id = var.cloudflare_zone_id
  name    = "www"
  type    = "CNAME"
  content = var.pages_cname_target
  proxied = true
  ttl     = 1
}

# --- Mail: deliberately NOT managed here ---
#
# This domain sends and receives real mail — Amazon SES outbound, WorkMail
# inbound. Those records (MX, the three DKIM CNAMEs, _amazonses, autodiscover,
# SPF, DMARC) were created by the AWS setup and are managed there, not here.
#
# An earlier version of this file declared SPF "v=spf1 -all" and DMARC
# "p=reject" on the assumption that the domain sent no mail. That assumption is
# no longer true. Applying those records would overwrite the live SES values and
# tell every receiving server to reject the shop's legitimate mail — including
# estimates sent to customers. Do not reintroduce them.
#
# Terraform only manages the two website records below, so an apply cannot touch
# the mail records: it neither knows nor asserts anything about them.
#
# If you ever do want SPF/DMARC under Terraform, import the existing records
# first so their current values become the baseline:
#   terraform import module.dns.cloudflare_dns_record.spf <zone_id>/<record_id>

# --- Zone settings ---

resource "cloudflare_zone_setting" "always_use_https" {
  zone_id    = var.cloudflare_zone_id
  setting_id = "always_use_https"
  value      = "on"
}

# "full" (not "strict"): the origin is github.io, whose cert is valid for
# *.github.io but not for ptcollisioninc.com. Strict would fail the SNI check.
resource "cloudflare_zone_setting" "ssl" {
  zone_id    = var.cloudflare_zone_id
  setting_id = "ssl"
  value      = "full"
}

resource "cloudflare_zone_setting" "min_tls_version" {
  zone_id    = var.cloudflare_zone_id
  setting_id = "min_tls_version"
  value      = "1.2"
}

resource "cloudflare_zone_setting" "automatic_https_rewrites" {
  zone_id    = var.cloudflare_zone_id
  setting_id = "automatic_https_rewrites"
  value      = "on"
}

resource "cloudflare_zone_setting" "brotli" {
  zone_id    = var.cloudflare_zone_id
  setting_id = "brotli"
  value      = "on"
}

# Static site — let Cloudflare hold assets at the edge rather than revalidating
# against Pages on every request.
resource "cloudflare_zone_setting" "browser_cache_ttl" {
  zone_id    = var.cloudflare_zone_id
  setting_id = "browser_cache_ttl"
  value      = 14400
}

# Redirect www -> apex at the edge, before the request ever reaches Pages.
# One canonical hostname keeps OpenGraph/canonical URLs in src/lib/site.ts honest.
resource "cloudflare_ruleset" "redirect_www" {
  zone_id = var.cloudflare_zone_id
  name    = "www to apex redirect"
  kind    = "zone"
  phase   = "http_request_dynamic_redirect"

  rules = [{
    ref         = "redirect_www_to_apex"
    description = "Redirect www.${var.domain_name} to ${var.domain_name}"
    expression  = "(http.host eq \"www.${var.domain_name}\")"
    action      = "redirect"

    action_parameters = {
      from_value = {
        status_code = 301
        target_url = {
          expression = "concat(\"https://${var.domain_name}\", http.request.uri.path)"
        }
        preserve_query_string = true
      }
    }
  }]
}
