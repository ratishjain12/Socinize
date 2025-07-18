terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
      version = "6.4.0"
    }

    random = {
      source = "hashicorp/random"
      version = "3.6.1"
    }
  }
}
provider "aws" {
  region = var.region
  profile = var.aws_profile
}

resource "random_id" "random-id" {
  byte_length = 8
}

