<?php

namespace App\Http\Resources\API\Supplier;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\QuoteRequest
 */
class QuoteRequestResource extends JsonResource
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
            'location' => [
                'origin' => $this->pickup_address,
                'destination' => $this->delivery_address,
            ],
            'pickup_date' => $this->pickup_date ? 'Pickup: ' . \Carbon\Carbon::parse($this->pickup_date)->format('j M Y') : 'N/A',
            'delivery_date' => $this->pickup_date ? 'Delivery: ' . \Carbon\Carbon::parse($this->pickup_date)->format('j M Y') : 'N/A',
            'status' => ucfirst($this->getSupplierStatus(auth()->id())),
            'client_name' => $this->user?->name ?? 'Unknown',
            'items_summary' => $this->getItemsSummary() . ', ' . number_format($this->items()->sum('weight'), 0) . ' kg',
            'service_type' => $this->service_type ?? 'Road Freight',
            'time_ago' => 'receive ' . ($this->created_at?->diffForHumans() ?? 'recently'),
        ];
    }

    /**
     * Generate a summary like "10 Pallets"
     */
    private function getItemsSummary(): string
    {
        $count = $this->items()->sum('quantity');
        $firstItem = $this->items()->first();
        $type = $firstItem ? $firstItem->item_type : 'Items';

        return "{$count} {$type}";
    }
}
