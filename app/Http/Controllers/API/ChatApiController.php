<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\MessageResource;
use App\Models\Message;
use App\Models\Quote;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ChatApiController extends Controller
{
    use ApiResponse;

    /**
     * Get messages for a specific quote negotiation.
     */
    public function getMessages($id)
    {
        try {
            $user = auth()->user();
            $quote = Quote::with('quoteRequest')->findOrFail($id);

            // Security check: only the quote owner (supplier) or the request owner (customer) can see messages
            $isSupplier = $quote->user_id === $user->id;
            $isCustomer = $quote->quoteRequest && $quote->quoteRequest->user_id === $user->id;

            if (! $isSupplier && ! $isCustomer) {
                return $this->sendError('Unauthorized access to this chat.', [], 403);
            }

            // Mark incoming messages as read first
            Message::where('quote_id', $id)
                ->where('receiver_id', $user->id)
                ->where('is_read', false)
                ->update([
                    'is_read' => true,
                    'read_at' => now(),
                ]);

            // Fetch all messages in chronological order
            $messages = Message::where('quote_id', $id)
                ->oldest()
                ->get();

            $originalQuote = [
                'price' => '€'.number_format($quote->amount, 0),
                'location' => $quote->quoteRequest?->pickup_address,
                'estimated_delivery' => $quote->estimated_time,
                'pallet_type' => $quote->quoteRequest?->pallet_type,
                'notes' => $quote->notes,
            ];

            $revisedQuote = [];
            if ($quote->revision_status === 'pending') {
                $revisedQuote = [
                    'price' => '€'.number_format($quote->revised_amount, 0),
                    'location' => $quote->quoteRequest?->pickup_address,
                    'estimated_delivery' => $quote->revised_estimated_time,
                    'pallet_type' => $quote->quoteRequest?->pallet_type,
                    'notes' => $quote->notes,
                    'status' => $quote->revision_status,
                ];
            }

            return $this->sendResponse([
                'original_quote' => $originalQuote,
                'revised_quote' => $revisedQuote,
                'my_messages' => MessageResource::collection($messages->where('sender_id', $user->id)->values())->resolve(),
                'receiver_messages' => MessageResource::collection($messages->where('sender_id', '!=', $user->id)->values())->resolve(),
                'all_messages' => MessageResource::collection($messages)->resolve(),
            ], 'Messages and quote details retrieved successfully.');
        } catch (\Exception $e) {
            Log::error('Chat GetMessages Error: '.$e->getMessage(), [
                'id' => $id,
                'user_id' => auth()->id(),
                'trace' => $e->getTraceAsString(),
            ]);

            return $this->sendError('Failed to retrieve messages: '.$e->getMessage(), [], 500);
        }
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

        // Notify the receiver about the new message
        $receiver = \App\Models\User::find($receiverId);
        if ($receiver) {
            try {
                $receiver->notify(new \App\Notifications\NewMessageNotification($message));
            } catch (\Exception $e) {
                Log::error('Failed to notify receiver of new message: '.$e->getMessage());
            }
        }

        return $this->sendResponse(
            new MessageResource($message),
            'Message sent successfully.'
        );
    }
}
