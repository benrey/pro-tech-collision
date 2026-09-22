# terraform/envs/prod/backend.tf
#
# Local state, deliberately.
#
# There is no remote backend here. R2 would need a bucket that cannot itself be
# created by this stack (the backend must exist before `init` runs), an
# account-scoped API token — this stack's token is deliberately zone-scoped —
# and a paid plan. That is a lot of moving parts for nine resources.
#
# Instead the workflow makes each run self-sufficient: before planning, it looks
# up the ids of records that already exist in the zone and imports them, so an
# apply is a no-op when nothing has changed. See "Import existing records" in
# .github/workflows/terraform-dns.yml.
#
# If this stack ever grows enough to need real remote state, R2 speaks the S3
# API and works with the standard s3 backend — but create the bucket by hand
# first, and give the token account-level R2 permissions.
