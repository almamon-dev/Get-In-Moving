@extends('emails.layout')

@section('content')
    <div class="text">Hi {{ $notifiable->name }},</div>

    <div class="text">
        The customer has successfully made the payment for <strong>Order #{{ $orderNumber }}</strong>.
    </div>

    <div class="info-box">
        <div class="text" style="font-size: 14px; margin-bottom: 5px; color: #666;">Payment Details:</div>
        <div class="text" style="margin-bottom: 0;"><strong>Amount:</strong> €{{ $amount }}</div>
    </div>

    <div class="text">
        Your earnings have been added to your pending balance and will be available once the order is delivered and completed.
    </div>

    <div class="button-container">
        <a href="{{ config('app.frontend_url') }}/supplier/orders/{{ $orderId }}" class="button">
            View Order Details
        </a>
    </div>
@endsection
