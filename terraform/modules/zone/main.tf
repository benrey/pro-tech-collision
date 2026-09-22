# terraform/modules/zone/main.tf
# The Cloudflare zone itself.
#
# ptcollisioninc.com was registered AT Cloudflare, so registration and
# nameservers are already Cloudflare's — but the zone may or may not have been
# created alongside it. Two paths:
#
#   create_zone = true   Terraform creates the zone (fails if it already exists;
#                        import it instead — see terraform/README.md).
#   create_zone = false  Terraform looks the existing zone up by name.
#
# Either way the rest of the stack consumes `zone_id` from this module, so the
# DNS module never has to care which path was taken.

terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

resource "cloudflare_zone" "this" {
  count = var.create_zone ? 1 : 0

  name = var.domain_name

  account = {
    id = var.cloudflare_account_id
  }

  # "full" = Cloudflare is authoritative for the whole zone (the normal setup
  # for a domain registered at Cloudflare), as opposed to a partial/CNAME setup.
  type = "full"
}

data "cloudflare_zone" "existing" {
  count = var.create_zone ? 0 : 1

  filter = {
    name = var.domain_name
  }
}
