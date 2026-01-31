<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class NegotiationApiController extends Controller
{
    use ApiResponse;

    /**
     * Get all active negotiations/conversations with latest messages.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->user_type === 'customer') {
            // Customer sees all quotes they received with latest messages
            $quotes = \App\Models\Quote::with(['user', 'quoteRequest'])
                ->whereHas('quoteRequest', function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                })
                ->get();
        } else {
            // Supplier sees all their submitted quotes with latest messages
            $quotes = \App\Models\Quote::with(['user', 'quoteRequest.user'])
                ->where('user_id', $user->id)
                ->get();
        }

        // For each quote, get the latest message
        $negotiations = $quotes->map(function ($quote) use ($user) {
            $latestMessage = \App\Models\Message::where('quote_id', $quote->id)
                ->latest()
                ->first();

            // Determine the other party
            $otherParty = $user->user_type === 'customer'
                ? $quote->user  // Supplier
                : $quote->quoteRequest->user; // Customer

            // Get the most recent notification related to this quote
            $latestNotification = $user->notifications()
                ->whereIn('type', [
                    \App\Notifications\NewQuoteSubmittedNotification::class,
                    \App\Notifications\RevisedQuoteNotification::class,
                    \App\Notifications\NewMessageNotification::class,
                ])
                ->where('data->quote_id', $quote->id)
                ->latest()
                ->first();

            $lastActivityTime = $latestNotification?->created_at ?? $quote->created_at;

            return [
                'id' => $quote->id,
                'quote_id' => $quote->id,
                'sender_id' => $otherParty->id,
                'sender_name' => $otherParty->name,
                'company_name' => $otherParty->company_name ?? null,
                'profile_picture' => $otherParty->profile_picture ?? 'https://ui-avatars.com/api/?name='.urlencode($otherParty->name).'&color=7F9CF5&background=EBF4FF',
                'message_snippet' => $latestMessage?->message ?? 'No messages yet',
                'time_ago' => $lastActivityTime->diffForHumans(),
                'service_type' => $quote->quoteRequest->service_type,
                'amount' => $quote->amount,
                'revised_amount' => $quote->revised_amount ?? '',
                'revised_estimated_time' => $quote->revised_estimated_time ?? '',
                'unread_count' => \App\Models\Message::where('quote_id', $quote->id)
                    ->where('receiver_id', $user->id)
                    ->whereNull('read_at')
                    ->count(),
            ];
        })->sortByDesc('last_activity_timestamp')->values();

        return $this->sendResponse($negotiations, 'Negotiations retrieved successfully.');
    }

    /**
     * Mark a specific negotiation/notification as read.
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return $this->sendResponse(null, 'Negotiation marked as read.');
    }

    /**
     * Mark all negotiations as read.
     */
    public function markAllAsRead(Request $request)
    {
        $request->user()->unreadNotifications()
            ->whereIn('type', [
                \App\Notifications\NewQuoteSubmittedNotification::class,
                \App\Notifications\RevisedQuoteNotification::class,
                \App\Notifications\NewMessageNotification::class,
            ])
            ->get()
            ->markAsRead();

        return $this->sendResponse([], 'All negotiations marked as read.');
    }
}
