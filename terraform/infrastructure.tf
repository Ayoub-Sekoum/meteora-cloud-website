# 1. S3 Bucket per il sito statico origin (Next.js Export)
resource "aws_s3_bucket" "website_bucket" {
  bucket = "www.${var.domain_name}"
}

resource "aws_s3_bucket_public_access_block" "website_bucket_pab" {
  bucket                  = aws_s3_bucket.website_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# OAI per permettere solo a CloudFront di leggere il bucket
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI per ${var.domain_name}"
}

resource "aws_s3_bucket_policy" "allow_cloudfront_read" {
  bucket = aws_s3_bucket.website_bucket.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "s3:GetObject"
        Effect    = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.oai.iam_arn
        }
        Resource  = "${aws_s3_bucket.website_bucket.arn}/*"
      }
    ]
  })
}

# 2. AWS WAFv2 (Protezione Enterprise)
resource "aws_wafv2_web_acl" "main_waf" {
  provider    = aws.us_east_1
  name        = "meteora-waf"
  description = "Regole WAF CloudFront"
  scope       = "CLOUDFRONT"

  default_action {
    allow {}
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "MeteoraWafMetrics"
    sampled_requests_enabled   = true
  }

  # AWS Managed Rules: Core rule set (SQLi, XSS, ecc)
  rule {
    name     = "AWSCoreRuleSet"
    priority = 1
    override_action {
      none {}
    }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSCoreRuleSet"
      sampled_requests_enabled   = true
    }
  }

  # Rate Limiting per Endpoint /api/contact (Limita spam dei bot sul form)
  rule {
    name     = "RateLimitContactAPI"
    priority = 2
    action {
      block {}
    }
    statement {
      rate_based_statement {
        limit              = 100 # Max 100 richieste in 5 minuti dallo stesso IP
        aggregate_key_type = "IP"
        scope_down_statement {
          byte_match_statement {
            search_string = "/api/contact" # L'endpoint del API Gateway
            field_to_match {
              uri_path {}
            }
            text_transformation {
              priority = 0
              type     = "NONE"
            }
            positional_constraint = "STARTS_WITH"
          }
        }
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitContactAPI"
      sampled_requests_enabled   = true
    }
  }
}

# 3. Funzione Edge (CloudFront Function) per Router i18n
resource "aws_cloudfront_function" "i18n_router" {
  name    = "i18n-viewer-request"
  runtime = "cloudfront-js-1.0"
  comment = "Reindirizza in base all'header Accept-Language e appende /index.html alle cartelle"
  publish = true
  code    = <<EOF
function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // Se stiamo richiedendo la root nuda
    if (uri === '/') {
        var acceptLang = request.headers['accept-language'];
        var lang = 'en'; // Default
        
        if (acceptLang && acceptLang.value) {
            var value = acceptLang.value.toLowerCase();
            if (value.startsWith('it')) lang = 'it';
            else if (value.startsWith('de')) lang = 'de';
        }
        
        return {
            statusCode: 302,
            statusDescription: 'Found',
            headers: {
                'location': { value: '/' + lang + '/' }
            }
        };
    }

    // Rewrite delle cartelle per l'export statico Next.js (SSG)
    // es: /it/ -> /it.html o /it/index.html (dipende dalla build)
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    } else if (!uri.includes('.')) {
        request.uri += '.html';
    }

    return request;
}
EOF
}

# 4. CloudFront Distribution
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.website_bucket.bucket_regional_domain_name
    origin_id   = "S3-${aws_s3_bucket.website_bucket.bucket}"

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  # Integrazione API Gateway (Serverless Form Contact Backend)
  origin {
    domain_name = "${aws_api_gateway_rest_api.contact_api.id}.execute-api.${var.aws_region}.amazonaws.com"
    origin_id   = "APIGateway-Contact"
    origin_path = "/prod"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  web_acl_id          = aws_wafv2_web_acl.main_waf.arn

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${aws_s3_bucket.website_bucket.bucket}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.i18n_router.arn
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  # Cache behavior specifico per bypassare CloudFront e contattare l'API Lambda del form
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "APIGateway-Contact"

    forwarded_values {
      query_string = true
      headers      = ["Authorization"]
      cookies {
        forward = "all"
      }
    }

    viewer_protocol_policy = "https-only"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }

  price_class = "PriceClass_100"

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    # acm_certificate_arn = aws_acm_certificate.cert.arn
    # ssl_support_method  = "sni-only"
  }
}
