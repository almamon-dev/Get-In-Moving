<?php

namespace App\Http\Resources\API\Supplier;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $statusTimeline = [
            'pending' => 0, 'confirmed' => 1, 'in_progress' => 2,
            'picked_up' => 3, 'delivered' => 4, 'completed' => 5,
        ];

        $nextActions = [
            'pending' => ['text' => 'Confirm Order', 'target' => 'confirmed'],
            'confirmed' => ['text' => 'Mark as in Progress', 'target' => 'in_progress'],
            'in_progress' => ['text' => 'Mark as Picked Up', 'target' => 'picked_up'],
            'picked_up' => ['text' => 'Mark as Delivered', 'target' => 'delivered'],
            'delivered' => ['text' => 'Mark as Completed', 'target' => 'completed'],
        ];

        return [
            'id' => $this->id,
            'order_no' => $this->order_number,
            'status' => $this->status,

            'client' => [
                'name' => $this->customer?->name,
                'avatar' => $this->customer?->profile_picture,
            ],

            'payment' => [
                'total' => (float) $this->total_amount,
                'formatted' => '$'.number_format($this->total_amount, 2),
                'is_paid' => $this->invoice?->status === 'paid',
            ],

            'shipping' => [
                'service' => $this->service_type,
                'route' => $this->getLocationSummary(),
                'pickup_at' => $this->pickup_date ? Carbon::parse($this->pickup_date)->format('d M Y') : null,
                'from' => $this->pickup_address,
                'to' => $this->delivery_address,
                'instructions' => $this->quote?->quoteRequest?->additional_notes,
            ],

            'tracking' => [
                'current_step' => $statusTimeline[$this->status] ?? 0,
                'steps' => ['Confirm', 'In Progress', 'Picked Up', 'Delivered'],
                'note' => $this->status_note,
                'proof' => $this->proof_of_delivery ? asset('storage/'.$this->proof_of_delivery) : null,
            ],

            'next_step' => $nextActions[$this->status] ?? null,

            'items_count' => $this->items()->count(),
            'date' => $this->created_at?->format('d M Y, h:i A'),
        ];
    }

    private function getLocationSummary()
    {
        $pickup = explode(',', $this->pickup_address);
        $delivery = explode(',', $this->delivery_address);

        return trim(end($pickup)).' to '.trim(end($delivery));
    }
}
