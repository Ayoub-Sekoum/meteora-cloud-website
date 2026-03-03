terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "meteora-terraform-state-backend" # Sostituire con nome bucket reale
    key            = "meteora/prod/terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "meteora-terraform-state-locks" # Sostituire con nome tabella reale
    encrypt        = true
  }
}

provider "aws" {
  region = "eu-central-1" # Francoforte, ottimo per Europa
}

# Provider AWS per risorse Edge (CloudFront richiede us-east-1 per i certificati e WAF globale)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
