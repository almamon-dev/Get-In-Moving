@extends('emails.layout')

@section('content')
    <div class="text">Hi {{ $notifiable->name }},</div>

    <div class="text">
        The supplier <strong>{{ $supplierName }}</strong> has submitted a revised offer for your request: <strong>{{ $palletType }}</strong>
    </div>

    <div class="info-box">
        <div class="text" style="font-size: 14px; margin-bottom: 5px; color: #666;">Revised Offer:</div>
        <div class="text" style="margin-bottom: 5px;"><strong>New Amount:</strong> €{{ $amount }}</div>
        <div class="text" style="margin-bottom: 0;"><strong>New Estimated Delivery:</strong> {{ $estimatedTime }}</div>
    </div>

    <div class="button-container">
        <a href="{{ config('app.frontend_url') }}/customer/negotiations" class="button">
            View and Respond to Offer
        </a>
    </div>
@endsection
