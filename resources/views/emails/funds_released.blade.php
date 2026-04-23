@extends('emails.layout')

@section('content')
    <div class="text">Hi {{ $notifiable->name }},</div>

    <div class="text">
        Good news! The escrowed funds for <strong>Order #{{ $orderNumber }}</strong> have been released to your available balance.
    </div>

    <div class="info-box">
        <div class="text" style="font-size: 14px; margin-bottom: 5px; color: #666;">Amount Released:</div>
        <div class="text" style="margin-bottom: 0; font-size: 24px; font-weight: bold; color: #14a800;">€{{ $amount }}</div>
    </div>

    <div class="button-container">
        <a href="{{ config('app.frontend_url') }}/supplier/finance/dashboard" class="button">
            View Finance Dashboard
        </a>
    </div>

    <div class="text">
        The funds are now available for withdrawal.
    </div>
@endsection
