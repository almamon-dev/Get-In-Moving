@extends('emails.layout')

@section('content')
    <div class="text">Hi {{ $notifiable->name }},</div>

    <div class="text">
        Congratulations! Your account has been verified by our admin team.
    </div>

    <div class="text">
        You now have full access to all features and services as a {{ $userType }}.
    </div>
    <div class="text" style="font-size: 14px; margin-bottom: 5px; color: #666;">Account Status:Verified</div>
@endsection
