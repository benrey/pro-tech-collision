# terraform/envs/prod/main.tf
# ptcollisioninc.com — Cloudflare DNS + edge, fronting GitHub Pages.
#
# Pathway (same shape as the pluggdn repo: a `dns` module holding every record,
# a Cloudflare provider fed by a scoped API token, records checked into git so
# the zone is never edited by hand in the dashboard):
#
#   GitHub Actions builds the static export  ->  pushes to GitHub Pages
#   Cloudflare proxies ptcollisioninc.com  ->  pulls from Pages, serves at edge
#
# Unlike pluggdn there is no AWS here: no ACM cert (Cloudflare Universal SSL
# covers the edge, GitHub Pages covers the origin leg), no ALB, no CloudFront.

terraform {
  required_version = ">= 1.5"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# In CI this reads GITHUB_TOKEN from the environment; the workflow passes the
# built-in token, which can manage this repository's own Pages settings.
provider "github" {
  owner = var.github_owner
}

# The zone module is only needed when the zone id isn't supplied directly.
# CI passes vars.ZONE_ID (same convention as pluggdn), which skips the lookup
# and means the API token needs no account-level read permission.
module "zone" {
  source = "../../modules/zone"
  count  = var.cloudflare_zone_id == "" ? 1 : 0

  domain_name           = var.domain_name
  cloudflare_account_id = var.cloudflare_account_id
  create_zone           = var.create_zone
}

module "dns" {
  source = "../../modules/dns"

  cloudflare_zone_id = var.cloudflare_zone_id != "" ? var.cloudflare_zone_id : module.zone[0].zone_id
  domain_name        = var.domain_name
  pages_cname_target = var.pages_cname_target
}

# GitHub Pages settings — the custom domain and HTTPS enforcement that were
# previously set by hand in the repo settings.
module "pages" {
  source = "../../modules/pages"

  repository     = var.github_repository
  domain_name    = var.domain_name
  https_enforced = var.pages_https_enforced
}
