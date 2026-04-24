@extends('emails.layout')

@section('content')
    <div class="text">Hi {{ $notifiable->name }},</div>

    <div class="text">
        Congratulations! Your account has been verified by our admin team.
    </div>

    <div class="text">
        You now have full access to all features and services as a {{ $userType }}.
    </div>
    
    <div class="info-box">
        <div class="text" style="font-size: 14px; margin-bottom: 5px; color: #666;">Account Status:</div>
        <div class="text" style="margin-bottom: 0; color: #14a800; font-weight: bold;">Verified</div>
    </div>

    <div class="button-container">
        <a href="{{ config('app.frontend_url') }}/auth/login" class="button">
            Log In to Your Account
        </a>
    </div>
@endsection
