terraform {
  required_providers {
    github = {
      source  = "integrations/github"
      version = "~> 6.0"
    }
  }
}

# GitHub Pages serves the static export; Cloudflare proxies it. The custom
# domain has to be set here too, or Pages 404s the proxied requests because it
# does not know it should answer for this hostname.
#
# The deploy workflow also writes out/CNAME on every build. Both mechanisms set
# the same thing; this one keeps it in code so it survives a repo re-create.
resource "github_repository_pages" "this" {
  repository = var.repository
  build_type = "workflow"
  cname      = var.domain_name

  # Cloudflare already terminates TLS at the edge, but this closes the
  # Cloudflare -> Pages leg and stops Pages answering plain HTTP directly.
  # Pages must finish provisioning its certificate before this can be true.
  https_enforced = var.https_enforced
}
