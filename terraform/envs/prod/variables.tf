# terraform/envs/prod/variables.tf

variable "cloudflare_api_token" {
  description = "Cloudflare API token with Zone:Edit, DNS:Edit and Zone Settings:Edit"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID. CI passes this from vars.ZONE_ID; leave empty to look the zone up by name instead."
  type        = string
  default     = ""
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID that owns the zone. Only needed when creating/looking up the zone (i.e. cloudflare_zone_id is empty)."
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Apex domain"
  type        = string
  default     = "ptcollisioninc.com"
}

variable "pages_cname_target" {
  description = "GitHub Pages origin host (<user>.github.io — no repo path)"
  type        = string
  default     = "benrey.github.io"
}

variable "create_zone" {
  description = "true = Terraform creates the zone; false = adopt an existing one"
  type        = bool
  # The zone already exists (the domain is registered at Cloudflare and is
  # already serving mail), so adopt it. Creating would fail on a name clash.
  default = false
}
