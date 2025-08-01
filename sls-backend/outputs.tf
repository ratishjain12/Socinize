output "users_table_name" {
  value = aws_dynamodb_table.users.name
}
output "posts_table_name" {
  value = aws_dynamodb_table.posts.name
}
output "social_accounts_table_name" {
  value = aws_dynamodb_table.social_accounts.name
}
output "media_uploads_bucket" {
  value = aws_s3_bucket.media_uploads.bucket
}

output "create_draft_lambda_arn" {
  value = aws_lambda_function.create_draft.arn
}

output "generate_presigned_url_lambda_arn" {
  value = aws_lambda_function.generate_presigned_url.arn
}

output "api_endpoint" {
  value = aws_apigatewayv2_api.api.api_endpoint
}

output "user_pool_id" {
  description = "The ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.this.id
}

output "user_pool_client_id" {
  description = "The ID of the Cognito User Pool Client"
  value       = aws_cognito_user_pool_client.this.id
}

output "user_pool_arn" {
  description = "The ARN of the Cognito User Pool"
  value       = aws_cognito_user_pool.this.arn
}

output "identity_pool_id" {
  value = aws_cognito_identity_pool.this.id
}

output "social_connect_lambda_arn" {
  description = "The ARN of the Social Connect Lambda function"
  value       = aws_lambda_function.social_connect.arn
}

output "api_gateway_url" {
  description = "The URL of the API Gateway"
  value       = "${aws_apigatewayv2_stage.default.invoke_url}"
}
