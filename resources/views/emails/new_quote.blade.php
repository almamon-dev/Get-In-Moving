@extends('emails.layout')

@section('content')
    <div class="text">Hi {{ $notifiable->name }},</div>

    <div class="text">
        A supplier has submitted a new quote for your request: <strong>{{ $palletType }}</strong>
    </div>

    <div class="info-box">
        <div class="text" style="font-size: 14px; margin-bottom: 5px; color: #666;">Quote Details:</div>
        <div class="text" style="margin-bottom: 5px;"><strong>Amount:</strong> €{{ $amount }}</div>
        <div class="text" style="margin-bottom: 0;"><strong>Estimated Delivery:</strong> {{ $estimatedTime }}</div>
    </div>

    <div class="button-container">
        <a href="{{ config('app.frontend_url') }}/customer/quote-requests/{{ $quoteRequestId }}" class="button">
            View Quote Details
        </a>
    </div>
@endsection
