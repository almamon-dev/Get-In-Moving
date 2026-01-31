<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $purpose }} - OTP Code</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background: linear-gradient(135deg, #FF5722 0%, #FF7043 100%);
            padding: 40px 20px;
            text-align: center;
            color: white;
        }
        .email-header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .email-body {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        .message {
            font-size: 15px;
            color: #666;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .otp-container {
            background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
            border: 2px dashed #FF5722;
        }
        .otp-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .otp-code {
            font-size: 42px;
            font-weight: bold;
            color: #FF5722;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
        }
        .expiry-notice {
            background-color: #FFF3E0;
            border-left: 4px solid #FF9800;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .expiry-notice p {
            margin: 0;
            font-size: 14px;
            color: #E65100;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 20px 30px;
            text-align: center;
            font-size: 13px;
            color: #999;
            border-top: 1px solid #eee;
        }
        .footer a {
            color: #FF5722;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>{{ $purpose }}</h1>
        </div>
        
        <div class="email-body">
            <div class="greeting">
                Hello {{ $user->name }},
            </div>
            
            <div class="message">
                <p>We received a request to verify your email address. Please use the OTP code below to complete the verification process.</p>
            </div>
            
            <div class="otp-container">
                <div class="otp-label">Your OTP Code</div>
                <div class="otp-code">{{ $otp }}</div>
            </div>
            
            <div class="expiry-notice">
                <p><strong>⏱️ Important:</strong> This OTP will expire in 60 minutes. Please use it as soon as possible.</p>
            </div>
            
            <div class="message">
                <p>If you didn't request this verification, please ignore this email or contact our support team if you have concerns.</p>
            </div>
        </div>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
            <p>Need help? <a href="mailto:support@example.com">Contact Support</a></p>
        </div>
    </div>
</body>
</html>
