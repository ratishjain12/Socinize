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
output "lambda_function_arn" {
  value = aws_lambda_function.hello_world.arn
}
output "api_endpoint" {
  value = aws_apigatewayv2_api.api.api_endpoint
}