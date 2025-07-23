variable "region" {
  type    = string
  default = "ap-south-1"
}

variable "aws_profile" {
  description = "AWS CLI profile to use for deployment"
  type    = string
  default = "default"
}

variable "twitter_client_id" {
  description = "Twitter OAuth Client ID"
  type        = string
  default     = "UXdpNVhWdE10SlhLTUo1VnZxQ1Y6MTpjaQ"
}

variable "twitter_client_secret" {
  description = "Twitter OAuth Client Secret"
  type        = string
  default     = "vfucHWGnrXuzAo6Z9XpMGRHdH2Td8mx49gVhPxkfx5w46CtAmx"
  sensitive   = true
}