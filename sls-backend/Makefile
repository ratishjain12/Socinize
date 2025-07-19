# Terraform Makefile for Socinize Backend
# Usage: make <command> AWS_PROFILE=<profile_name>

# Default AWS profile
AWS_PROFILE ?= default
AWS_REGION ?= ap-south-1

# Terraform commands
.PHONY: init plan apply destroy output clean build-lambdas

# Initialize Terraform with backend
init:
	@echo "Initializing Terraform with AWS profile: $(AWS_PROFILE)"
	AWS_PROFILE=$(AWS_PROFILE) terraform init

# Plan changes
plan:
	@echo "Planning Terraform changes with AWS profile: $(AWS_PROFILE)"
	AWS_PROFILE=$(AWS_PROFILE) terraform plan -var="aws_profile=$(AWS_PROFILE)" -var="region=$(AWS_REGION)"

# Apply changes
apply:
	@echo "Applying Terraform changes with AWS profile: $(AWS_PROFILE)"
	AWS_PROFILE=$(AWS_PROFILE) terraform apply -var="aws_profile=$(AWS_PROFILE)" -var="region=$(AWS_REGION)" -auto-approve

# Apply with confirmation
apply-confirm:
	@echo "Applying Terraform changes with AWS profile: $(AWS_PROFILE)"
	AWS_PROFILE=$(AWS_PROFILE) terraform apply -var="aws_profile=$(AWS_PROFILE)" -var="region=$(AWS_REGION)"

# Destroy infrastructure
destroy:
	@echo "Destroying infrastructure with AWS profile: $(AWS_PROFILE)"
	AWS_PROFILE=$(AWS_PROFILE) terraform destroy -var="aws_profile=$(AWS_PROFILE)" -var="region=$(AWS_REGION)" -auto-approve

# Show outputs
output:
	@echo "Showing Terraform outputs with AWS profile: $(AWS_PROFILE)"
	AWS_PROFILE=$(AWS_PROFILE) terraform output

# Clean up local files
clean:
	@echo "Cleaning up local files..."
	rm -rf .terraform
	rm -f terraform.tfstate
	rm -f terraform.tfstate.backup
	rm -f *.tfplan

# Build Lambda functions
build-lambdas:
	@echo "Building Lambda functions..."
	cd lambdas && npm run build

# Full deployment (build + plan + apply)
deploy: build-lambdas plan apply

# Quick commands for common profiles
plan-personal:
	@make plan AWS_PROFILE=ratish-personal

apply-personal:
	@make apply AWS_PROFILE=ratish-personal

plan-default:
	@make plan AWS_PROFILE=default

apply-default:
	@make apply AWS_PROFILE=default

# Help
help:
	@echo "Available commands:"
	@echo "  init              - Initialize Terraform"
	@echo "  plan              - Plan changes (use AWS_PROFILE=<profile>)"
	@echo "  apply             - Apply changes (use AWS_PROFILE=<profile>)"
	@echo "  apply-confirm     - Apply with confirmation"
	@echo "  destroy           - Destroy infrastructure"
	@echo "  output            - Show outputs"
	@echo "  clean             - Clean local files"
	@echo "  build-lambdas     - Build Lambda functions"
	@echo "  deploy            - Full deployment (build + plan + apply)"
	@echo ""
	@echo "Quick commands:"
	@echo "  plan-personal     - Plan with ratish-personal profile"
	@echo "  apply-personal    - Apply with ratish-personal profile"
	@echo "  plan-default      - Plan with default profile"
	@echo "  apply-default     - Apply with default profile"
	@echo ""
	@echo "Examples:"
	@echo "  make plan AWS_PROFILE=ratish-personal"
	@echo "  make apply AWS_PROFILE=ratish-personal"
	@echo "  make plan-personal"
	@echo "  make apply-personal" 