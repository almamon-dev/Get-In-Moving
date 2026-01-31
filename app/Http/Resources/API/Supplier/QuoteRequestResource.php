<?php

namespace App\Http\Resources\API\Supplier;

use App\Http\Resources\API\Customer\QuoteRequestItemResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            'pickup_address' => $this->pickup_address,
            'delivery_address' => $this->delivery_address,
            'pickup_date' => $this->pickup_date,
            'service_type' => $this->service_type,
            'client_name' => $this->user?->name,
            'items_summary' => $this->getItemsSummary(),
            'total_weight' => $this->items()->sum('weight').' kg',
            'supplier_status' => $this->getSupplierStatus(auth()->id()),
            'received_at_human' => 'receive '.$this->created_at?->diffForHumans(),
            // Fields for details view
            'pickup_time' => $this->pickup_time_from.' - '.$this->pickup_time_till,
            'additional_notes' => $this->additional_notes,
            'items' => QuoteRequestItemResource::collection($this->whenLoaded('items')),
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
