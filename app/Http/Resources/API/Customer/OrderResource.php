<?php

namespace App\Http\Resources\API\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'order_number' => $this->order_number,
            'total_amount' => (float) $this->total_amount,
            'total_amount_formatted' => '$' . number_format($this->total_amount, 2),
            'service_type' => $this->service_type,
            'status' => $this->status,
            'pickup_address' => $this->pickup_address,
            'delivery_address' => $this->delivery_address,
            'pickup_date' => $this->pickup_date,
            'estimated_time' => $this->estimated_time,
            'supplier' => [
                'id' => $this->supplier?->id,
                'name' => $this->supplier?->name,
                'company_name' => $this->supplier?->company_name,
            ],
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
