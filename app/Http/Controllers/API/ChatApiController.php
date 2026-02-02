<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\MessageResource;
use App\Models\Message;
use App\Models\Quote;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ChatApiController extends Controller
{
    use ApiResponse;

    /**
     * Get messages for a specific quote negotiation.
     */
    public function getMessages($quoteId)
    {
        $user = auth()->user();
        $quote = Quote::with('quoteRequest')->findOrFail($quoteId);

        // Security check: only the quote owner (supplier) or the request owner (customer) can see messages
        if ($quote->user_id !== $user->id && $quote->quoteRequest->user_id !== $user->id) {
            return $this->sendError('Unauthorized access to this chat.', [], 403);
        }

        $messages = Message::where('quote_id', $quoteId)
            ->oldest()
            ->get();

        $originalQuote = [
            'price' => '$'.number_format($quote->amount, 0),
            'location' => $quote->quoteRequest?->pickup_address,
            'estimated_delivery' => $quote->estimated_time,
            'service_type' => $quote->quoteRequest?->service_type,
        ];

        $revisedQuote = [];
        if ($quote->revision_status === 'pending') {
            $revisedQuote = [
                'price' => '$'.number_format($quote->revised_amount, 0),
                'location' => $quote->quoteRequest?->pickup_address,
                'estimated_delivery' => $quote->revised_estimated_time,
                'service_type' => $quote->quoteRequest?->service_type,
                'status' => $quote->revision_status,
            ];
        }

        return $this->sendResponse([
            'original_quote' => $originalQuote,
            'revised_quote' => $revisedQuote,
            'my_messages' => MessageResource::collection($messages->where('sender_id', $user->id)->values()),
            'receiver_messages' => MessageResource::collection($messages->where('sender_id', '!=', $user->id)->values()),
        ], 'Messages and quote details retrieved successfully.');
    }

    /**
     * Send a new message.
     */
    public function sendMessage(Request $request)
    {
        $request->validate([
            'quote_id' => 'required|exists:quotes,id',
            'message' => 'required|string',
        ]);

        $user = auth()->user();
        $quote = Quote::with('quoteRequest')->findOrFail($request->quote_id);

        // Determine the receiver
        if ($user->id === $quote->quoteRequest->user_id) {
            // Sender is customer, receiver is supplier
            $receiverId = $quote->user_id;
        } elseif ($user->id === $quote->user_id) {
            // Sender is supplier, receiver is customer
            $receiverId = $quote->quoteRequest->user_id;
        } else {
            return $this->sendError('You cannot send a message in this negotiation.', [], 403);
        }

        $message = Message::create([
            'sender_id' => $user->id,
            'receiver_id' => $receiverId,
            'quote_id' => $quote->id,
            'message' => $request->message,
        ]);

        // Broadcast real-time message
        broadcast(new \App\Events\MessageSent($message))->toOthers();

        // Notify the receiver about the new message
        $receiver = \App\Models\User::find($receiverId);
        if ($receiver) {
            $receiver->notify(new \App\Notifications\NewMessageNotification($message));
        }

        return $this->sendResponse(
            new MessageResource($message),
            'Message sent successfully.'
        );
    }
}
