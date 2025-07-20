resource "aws_apigatewayv2_api" "api" {
  name          = "SocinizeApi"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_authorizer" "cognito_authorizer" {
  api_id           = aws_apigatewayv2_api.api.id
  authorizer_type  = "JWT"
  identity_sources = ["$request.header.Authorization"]
  name             = "cognito-authorizer"

  jwt_configuration {
    audience = [aws_cognito_user_pool_client.this.id]
    issuer   = "https://cognito-idp.${data.aws_region.current.name}.amazonaws.com/${aws_cognito_user_pool.this.id}"
  }
}

data "aws_region" "current" {}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id             = aws_apigatewayv2_api.api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.hello_world.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "social_connect_integration" {
  api_id             = aws_apigatewayv2_api.api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.social_connect.invoke_arn
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "hello_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /hello"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito_authorizer.id
}

resource "aws_apigatewayv2_route" "twitter_auth_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /connect/twitter/auth"
  target    = "integrations/${aws_apigatewayv2_integration.social_connect_integration.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito_authorizer.id
}

resource "aws_apigatewayv2_route" "twitter_callback_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /connect/twitter/callback"
  target    = "integrations/${aws_apigatewayv2_integration.social_connect_integration.id}"
  authorization_type = "NONE"
}

resource "aws_apigatewayv2_route" "twitter_refresh_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /connect/twitter/refresh"
  target    = "integrations/${aws_apigatewayv2_integration.social_connect_integration.id}"
  authorization_type = "JWT"
  authorizer_id      = aws_apigatewayv2_authorizer.cognito_authorizer.id
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.hello_world.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "social_connect_apigw" {
  statement_id  = "AllowAPIGatewayInvokeSocialConnect"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.social_connect.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true
}