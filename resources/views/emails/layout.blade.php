<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #f2f2f2;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        .wrapper {
            width: 100%;
            background-color: #f2f2f2;
            padding: 40px 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 50px 60px;
        }
        .logo {
            font-size: 32px;
            font-weight: 700;
            color: #14a800;
            margin-bottom: 45px;
            letter-spacing: -1.5px;
            text-transform: lowercase;
        }
        .heading {
            font-size: 26px;
            font-weight: 400;
            color: #001e00;
            margin-bottom: 35px;
            line-height: 1.2;
        }
        .text {
            font-size: 16px;
            color: #001e00;
            line-height: 1.6;
            margin-bottom: 25px;
        }
        .support-link {
            color: #14a800;
            text-decoration: underline;
        }
        .footer {
            margin-top: 40px;
            font-size: 16px;
            color: #001e00;
            line-height: 1.5;
        }
        .info-box {
            background: #f9f9f9; 
            padding: 20px; 
            border-radius: 8px; 
            margin-bottom: 25px; 
            border: 1px solid #eeeeee;
        }
        .text-primary {
            color: #14a800;
        }
        .button-container {
            text-align: center; 
            margin: 35px 0;
        }
        .button {
            background-color: #14a800; 
            color: #ffffff !important; 
            padding: 14px 30px; 
            text-decoration: none; 
            font-size: 16px; 
            font-weight: 500; 
            border-radius: 25px; 
            display: inline-block;
        }
        .otp-code {
            font-size: 32px;
            font-weight: bold;
            color: #14a800;
            letter-spacing: 5px;
            text-align: left;
            margin: 20px 0;
            display: inline-block;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="container">
            <div class="logo">{{ strtolower(config('app.name')) }}</div>
            
            @if(isset($heading))
                <div class="heading">{{ $heading }}</div>
            @endif

            @yield('content')

            <div class="text">
                Please contact <a href="{{ config('app.frontend_url') }}/contact-us" class="support-link">{{ config('app.name') }} Support</a> if you did not authorize this change or need assistance.
            </div>

            <div class="footer">
                Thanks for your time,<br>
                The {{ config('app.name') }} Team
            </div>
        </div>
    </div>
</body>
</html>
