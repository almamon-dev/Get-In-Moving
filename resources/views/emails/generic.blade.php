@extends('emails.layout')

@section('content')
    <div class="text">Hi {{ $notifiable->name ?? 'there' }},</div>

    @foreach($introLines as $line)
        <div class="text">{!! $line !!}</div>
    @endforeach

    @if(isset($actionUrl))
        <div class="button-container">
            <a href="{{ $actionUrl }}" class="button">
                {{ $actionText }}
            </a>
        </div>
    @endif

    @foreach($outroLines as $line)
        <div class="text">{!! $line !!}</div>
    @endforeach
@endsection
