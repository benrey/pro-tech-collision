# terraform/modules/zone/variables.tf

variable "domain_name" {
  description = "Apex domain, e.g. ptcollisioninc.com"
  type        = string
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID that owns the zone"
  type        = string
}

variable "create_zone" {
  description = "true = Terraform creates the zone; false = look up an existing one by name"
  type        = bool
  default     = true
}
