@extends('emails.layout')

@section('content')
    <div class="heading">New Contact Request</div>

    <div class="text">
        You have received a new contact submission from the <strong>{{ config('app.name') }}</strong> contact form.
    </div>

    <div class="info-box">
        <div class="text" style="margin-bottom: 10px;"><strong>Name:</strong> {{ $contactData['first_name'] ?? '' }} {{ $contactData['last_name'] ?? '' }}</div>
        <div class="text" style="margin-bottom: 10px;"><strong>Email:</strong> <a href="mailto:{{ $contactData['email'] ?? '' }}" class="support-link">{{ $contactData['email'] ?? '' }}</a></div>
        @if(!empty($contactData['phone']))
            <div class="text" style="margin-bottom: 10px;"><strong>Phone:</strong> {{ $contactData['phone'] }}</div>
        @endif
        @if(!empty($contactData['subject']))
            <div class="text" style="margin-bottom: 0;"><strong>Subject:</strong> {{ $contactData['subject'] }}</div>
        @endif
    </div>
    <div class="text"><strong>Message Details:</strong></div>
    <div style="background: #f9f9f9; border-left: 4px solid #14a800; border-radius: 4px; padding: 18px 20px; font-size: 15px; line-height: 1.6; color: #001e00; margin-bottom: 25px; white-space: pre-wrap;">{{ $contactData['message'] ?? '' }}</div>
@endsection
