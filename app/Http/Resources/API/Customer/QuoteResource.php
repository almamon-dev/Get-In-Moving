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
        $supplierUser = $this->supplier?->user;
        $rating = \App\Models\Review::where('supplier_id', $supplierUser?->id)->avg('rating') ?? 0.0;
        $completedOrders = \App\Models\Order::where('supplier_id', $this->supplier_id)->where('status', 'completed')->count() ?? 0;

        return [
            'id' => $this->id,
            'amount' => '$'.number_format($this->amount, 0),
            'supplier_name' => $supplierUser->name ?? 'Swift Transport Co.',
            'rating' => round($rating, 1),
            'completed_orders' => "{$completedOrders} completed orders",
            'available_capacity' => 'Available Capacity : 15 Pallets',
            'pickup_date' => $this->pickup_date ? \Carbon\Carbon::parse($this->pickup_date)->format('j M Y') : '2 Jan 2026',
            'service_type' => 'Road Freight',
            'estimated_delivery' => '2-3 days',
        ];
    }
}
