variable "region" {
  type    = string
  default = "ap-south-1"
}

variable "aws_profile" {
  description = "AWS CLI profile to use for deployment"
  type    = string
  default = "default"
}