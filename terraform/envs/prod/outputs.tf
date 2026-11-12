# terraform/envs/prod/outputs.tf

# The zone module is conditional (count), so these unwrap the single instance
# when it exists and fall back to the directly-supplied zone id otherwise.
output "zone_id" {
  description = "Cloudflare zone ID for the domain"
  value       = var.cloudflare_zone_id != "" ? var.cloudflare_zone_id : module.zone[0].zone_id
}

output "name_servers" {
  description = "Cloudflare nameservers — already set when the domain is registered at Cloudflare"
  value       = length(module.zone) > 0 ? module.zone[0].name_servers : []
}

output "site_url" {
  description = "Canonical site URL"
  value       = "https://${var.domain_name}"
}

output "web_analytics_token" {
  description = "Public Cloudflare Web Analytics token. Store it as the repository variable WEB_ANALYTICS_TOKEN; the deploy workflow writes it into /analytics.js."
  value       = one(cloudflare_web_analytics_site.site[*].site_token)
}
