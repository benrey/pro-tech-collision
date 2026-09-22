# terraform/envs/prod/backend.tf
#
# Remote state in Cloudflare R2 (S3-compatible), enabled by setting the
# R2_ACCOUNT_ID / bucket below and passing R2 credentials as AWS_ACCESS_KEY_ID
# and AWS_SECRET_ACCESS_KEY.
#
# Why this is required, not optional: CI runners are ephemeral. With local
# state every run starts empty, tries to create all resources from scratch and
# fails on the ones that already exist (Cloudflare 81053, "record already
# exists"). Persisting state is what lets an apply be a no-op when nothing
# changed, and what makes `terraform import` stick.
#
# Bootstrap (once, from the Cloudflare dashboard):
#   R2 -> Create bucket -> "protech-tf-state"
#   R2 -> Manage API tokens -> Create (Object Read & Write, that bucket)
#   then save the pair as GitHub secrets in the dev environment:
#     gh secret set R2_ACCESS_KEY_ID --env dev
#     gh secret set R2_SECRET_ACCESS_KEY --env dev
#     gh variable set R2_ACCOUNT_ID --env dev --body "<cloudflare account id>"
#
# The workflow passes -backend-config at init, so the account id is not
# hardcoded here.

terraform {
  backend "s3" {
    key    = "envs/prod/terraform.tfstate"
    region = "auto"

    # R2 is S3-compatible but not S3, so the AWS-specific preflight checks
    # have to be skipped or init fails before it ever reaches the bucket.
    skip_credentials_validation = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
    skip_s3_checksum            = true
    skip_metadata_api_check     = true
    use_path_style              = true
  }
}
