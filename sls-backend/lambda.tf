data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "lambda_exec" {
  name = "socinize-lambda-exec"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

data "aws_iam_policy_document" "lambda_policy" {
  statement {
    actions = [
      "dynamodb:*"
    ]
    resources = [
      aws_dynamodb_table.users.arn,
      aws_dynamodb_table.posts.arn,
      aws_dynamodb_table.social_accounts.arn
    ]
  }
  statement {
    actions = [
      "s3:*"
    ]
    resources = [
      aws_s3_bucket.media_uploads.arn,
      "${aws_s3_bucket.media_uploads.arn}/*"
    ]
  }
  statement {
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["arn:aws:logs:*:*:*"]
  }
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "socinize-lambda-policy"
  role = aws_iam_role.lambda_exec.id
  policy = data.aws_iam_policy_document.lambda_policy.json
}

data "archive_file" "post_confirmation_zip" {
  type        = "zip"
  source_file  = "${path.module}/lambdas/build/post-confirmation/index.js"
  output_path = "${path.module}/lambdas/build/post-confirmation/post-confirmation.zip"
}

data "archive_file" "social_connect_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambdas/build/social-connect"
  output_path = "${path.module}/lambdas/build/social-connect/social-connect.zip"
}

data "archive_file" "create_draft_zip" {
  type        = "zip"
  source_file = "${path.module}/lambdas/build/create-draft/index.js"
  output_path = "${path.module}/lambdas/build/create-draft/create-draft.zip"
}

data "archive_file" "generate_presigned_url_zip" {
  type        = "zip"
  source_file = "${path.module}/lambdas/build/generate-presigned-url/index.js"
  output_path = "${path.module}/lambdas/build/generate-presigned-url/generate-presigned-url.zip"
}

resource "aws_lambda_layer_version" "node_modules" {
  filename            = "${path.module}/lambda-layer/lambda-layer.zip"
  layer_name          = "socinize-node-modules"
  compatible_runtimes = ["nodejs20.x"]
}

resource "aws_lambda_function" "post_confirmation" {
  function_name    = "PostConfirmationFunction"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  filename         = data.archive_file.post_confirmation_zip.output_path
  source_code_hash = data.archive_file.post_confirmation_zip.output_base64sha256
  timeout          = 10
  memory_size      = 128
  environment {
    variables = {
      USERS_TABLE = aws_dynamodb_table.users.name
    }
  }
  layers = [aws_lambda_layer_version.node_modules.arn]
}

resource "aws_lambda_function" "social_connect" {
  function_name    = "SocialConnectFunction"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  filename         = data.archive_file.social_connect_zip.output_path
  source_code_hash = data.archive_file.social_connect_zip.output_base64sha256
  timeout          = 30
  memory_size      = 256
  environment {
    variables = {
      SOCIAL_ACCOUNTS_TABLE = aws_dynamodb_table.social_accounts.name
      TWITTER_CLIENT_ID     = var.twitter_client_id
      TWITTER_CLIENT_SECRET = var.twitter_client_secret
    }
  }
  layers = [aws_lambda_layer_version.node_modules.arn]
}

resource "aws_lambda_function" "create_draft" {
  function_name    = "CreateDraftFunction"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  filename         = data.archive_file.create_draft_zip.output_path
  source_code_hash = data.archive_file.create_draft_zip.output_base64sha256
  timeout          = 10
  memory_size      = 128
  environment {
    variables = {
      POSTS_TABLE = aws_dynamodb_table.posts.name
    }
  }
  layers = [aws_lambda_layer_version.node_modules.arn]
}

resource "aws_lambda_function" "generate_presigned_url" {
  function_name    = "GeneratePresignedUrlFunction"
  role             = aws_iam_role.lambda_exec.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  filename         = data.archive_file.generate_presigned_url_zip.output_path
  source_code_hash = data.archive_file.generate_presigned_url_zip.output_base64sha256
  timeout          = 10
  memory_size      = 128
  environment {
    variables = {
      MEDIA_UPLOADS_BUCKET = aws_s3_bucket.media_uploads.bucket
    }
  }
  layers = [aws_lambda_layer_version.node_modules.arn]
}

resource "aws_lambda_permission" "post_confirmation" {
  statement_id  = "AllowCognitoInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.post_confirmation.function_name
  principal     = "cognito-idp.amazonaws.com"
  source_arn    = aws_cognito_user_pool.this.arn
}