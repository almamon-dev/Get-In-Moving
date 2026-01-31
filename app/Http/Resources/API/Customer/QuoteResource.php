<?php

namespace App\Http\Resources\API\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuoteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'amount' => (float) $this->amount,
            'amount_formatted' => '$'.number_format($this->amount, 0),
            'estimated_delivery' => $this->estimated_time,
            'status' => $this->status,
            'revised_amount' => $this->revised_amount ? (float) $this->revised_amount : null,
            'revised_amount_formatted' => $this->revised_amount ? '$' . number_format($this->revised_amount, 0) : null,
            'revised_estimated_time' => $this->revised_estimated_time,
            'revision_status' => $this->revision_status,
            'chat_id' => $this->id, // Using Quote ID as Chat ID for now
            'pickup_date' => $this->quoteRequest?->pickup_date,
            'service_type' => $this->quoteRequest?->service_type,
            'supplier' => [
               'id' => $this->user?->id,
               'name' => $this->user?->name,
               'company_name' => $this->user?->company_name ?? $this->user?->name,
               'rating' => 4.9,
               'completed_orders' => '234 completed orders',
               'available_capacity' => '15 Pallets',
            ],
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
