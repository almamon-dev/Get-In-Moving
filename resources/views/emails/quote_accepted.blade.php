@extends('emails.layout')

@section('content')
    <div class="text">Hi {{ $notifiable->name }},</div>

    <div class="text">
        Great news! A client has accepted your quote for: <strong>{{ $palletType }}</strong>
    </div>

    <div class="info-box">
        <div class="text" style="font-size: 14px; margin-bottom: 5px; color: #666;">Accepted Amount:</div>
        <div class="text" style="margin-bottom: 0; font-size: 24px; font-weight: bold; color: #14a800;">€{{ $amount }}</div>
    </div>

    <div class="text">
        A new order has been created. Please check your dashboard to proceed with the shipment.
    </div>

    <div class="button-container">
        <a href="{{ config('app.frontend_url') }}/supplier/orders" class="button">
            View My Orders
        </a>
    </div>
@endsection
