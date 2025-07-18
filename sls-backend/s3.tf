resource "aws_s3_bucket" "media_uploads" {
  bucket        = "socinize-media-uploads-${random_id.random-id.hex}"
  force_destroy = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "default" {
  bucket = aws_s3_bucket.media_uploads.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
