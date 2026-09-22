# terraform/modules/dns/outputs.tf

output "root_fqdn" {
  description = "Apex record FQDN"
  value       = cloudflare_dns_record.root.name
}

output "www_fqdn" {
  description = "www record FQDN"
  value       = cloudflare_dns_record.www.name
}
