# terraform/modules/dns/variables.tf

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for the domain"
  type        = string
}

variable "domain_name" {
  description = "Apex domain, e.g. ptcollisioninc.com"
  type        = string
}

variable "pages_cname_target" {
  description = "GitHub Pages origin host, e.g. benrey.github.io"
  type        = string
}
