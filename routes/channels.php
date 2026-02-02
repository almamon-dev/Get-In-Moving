<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('chat.quote.{quoteId}', function ($user, $quoteId) {
    $quote = \App\Models\Quote::with('quoteRequest')->find($quoteId);
    if (!$quote) return false;

    return $user->id === $quote->user_id || $user->id === $quote->quoteRequest->user_id;
});
