# terraform/envs/prod/backend.tf
#
# Local state, deliberately.
#
# pluggdn keeps state in S3 + a DynamoDB lock table because that stack is large
# and CI applies it on every push. This stack is a zone, six records and a
# handful of zone settings, applied by hand from a laptop when DNS changes —
# and protech has no AWS account to host a state bucket in.
#
# terraform.tfstate is gitignored (see terraform/.gitignore): it contains the
# zone ID and, depending on provider version, token-adjacent metadata. If a
# second person ever needs to apply this, move to a remote backend first —
# Cloudflare R2 speaks the S3 API and works here:
#
#   terraform {
#     backend "s3" {
#       bucket                      = "protech-tf-state"
#       key                         = "envs/prod/terraform.tfstate"
#       region                      = "auto"
#       endpoints                   = { s3 = "https://<account-id>.r2.cloudflarestorage.com" }
#       skip_credentials_validation = true
#       skip_region_validation      = true
#       skip_requesting_account_id  = true
#       skip_s3_checksum            = true
#       use_path_style              = true
#     }
#   }
#
# with AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY set to an R2 API token pair.
