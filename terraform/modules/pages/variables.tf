variable "repository" {
  description = "Repository name that serves the site, e.g. pro-tech-collision"
  type        = string
}

variable "domain_name" {
  description = "Custom domain for GitHub Pages"
  type        = string
}

variable "https_enforced" {
  description = "Enforce HTTPS on the Pages origin. Requires the Pages certificate to be provisioned."
  type        = bool
  default     = true
}
