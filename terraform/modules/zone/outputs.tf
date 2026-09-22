# terraform/modules/zone/outputs.tf

output "zone_id" {
  # Resource branch uses .id (a managed cloudflare_zone has no separate zone_id
  # attribute); data-source branch uses .zone_id, the field the provider
  # round-trips. Both yield the same value.
  description = "Cloudflare zone ID, whether the zone was created or looked up"
  value       = var.create_zone ? cloudflare_zone.this[0].id : data.cloudflare_zone.existing[0].zone_id
}

output "name_servers" {
  description = "Cloudflare-assigned nameservers (only populated when Terraform creates the zone)"
  value       = var.create_zone ? cloudflare_zone.this[0].name_servers : []
}
