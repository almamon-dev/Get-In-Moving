@extends('emails.layout')

@section('content')
    <div class="text">Hi {{ $notifiable->name }},</div>

    <div class="text">
        Update on your <strong>{{ $type }}</strong> for <strong>{{ $palletType }}</strong>.
    </div>

    <div class="text">
        Unfortunately, the client has selected another offer and your {{ $type }} has been rejected.
    </div>

    <div class="button-container">
        <a href="{{ config('app.frontend_url') }}/supplier/quotes" class="button">
            View My Quotes
        </a>
    </div>

    <div class="text">
        Don't worry, there are many other requests waiting for your bid!
    </div>
@endsection
