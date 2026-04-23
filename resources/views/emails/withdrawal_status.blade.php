@extends('emails.layout')

@section('content')
    <div class="text">Hi {{ $notifiable->name }},</div>

    <div class="text">
        Your withdrawal request has been <strong>{{ $status }}</strong>.
    </div>

    <div class="info-box">
        <div class="text" style="font-size: 14px; margin-bottom: 5px; color: #666;">Withdrawal Details:</div>
        <div class="text" style="margin-bottom: 5px;"><strong>Amount:</strong> €{{ $amount }}</div>
        @if($status === 'completed' || $status === 'approved')
            <div class="text" style="margin-bottom: 0;"><strong>Account:</strong> {{ $paymentMethod }}</div>
        @else
            <div class="text" style="margin-bottom: 0; color: #cc0000;"><strong>Reason:</strong> {{ $adminNote }}</div>
        @endif
    </div>

    @if($status === 'rejected')
        <div class="text">
            The amount has been refunded to your account balance.
        </div>
    @endif

    <div class="button-container">
        <a href="{{ config('app.frontend_url') }}/supplier/finance/dashboard" class="button">
            View Finance Dashboard
        </a>
    </div>
@endsection
