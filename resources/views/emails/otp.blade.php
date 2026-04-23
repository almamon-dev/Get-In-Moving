@extends('emails.layout')

@section('content')
    <div class="text">Hi {{ $user->name }},</div>
    <div class="text">
        Please use the following code to verify your {{ strtolower($purpose) }}:  <strong class="text-primary">{{ $otp }}</strong>
    </div>
@endsection
