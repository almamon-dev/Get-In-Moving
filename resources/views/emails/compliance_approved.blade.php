@extends('emails.layout')

@section('content')
    <div class="text">Hi {{ $notifiable->name }},</div>

    <div class="text">
        Great news! Your compliance documents (insurance and license) have been reviewed and approved.
    </div>

    <div class="text">
        You can now access all supplier features and start providing services on our platform.
    </div>
@endsection
