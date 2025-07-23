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

  backend "s3" {
    bucket  = "socinize-terraform-state"
    key     = "prod/terraform.tfstate"
    region  = "ap-south-1"
    encrypt = true
  }
}
provider "aws" {
  region = var.region
  profile = var.aws_profile
}

resource "random_id" "random-id" {
  byte_length = 8
}

