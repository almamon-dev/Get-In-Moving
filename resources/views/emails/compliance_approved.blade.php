@extends('emails.layout')

@section('content')
    <div class="text">Hi {{ $notifiable->name }},</div>

    <div class="text">
        Great news! Your compliance documents (insurance and license) have been reviewed and approved.
    </div>

    <div class="text">
        You can now access all supplier features and start providing services on our platform.
    </div>

    <div class="info-box">
        <div class="text" style="font-size: 14px; margin-bottom: 5px; color: #666;">Compliance Status:</div>
        <div class="text" style="margin-bottom: 0; color: #14a800; font-weight: bold;">Approved</div>
    </div>
@endsection
