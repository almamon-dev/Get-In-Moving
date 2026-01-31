<?php

namespace App\Http\Resources\API\Supplier;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuoteRequestDetailResource extends JsonResource
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
            'miles_placeholder' => '210 Miles', // Static for now as per image
            'client_name' => $this->user?->name,
            'service_type' => $this->service_type,
            'items_summary' => $this->getItemsSummary(),
            'total_weight' => 'Total weight : '.$this->items()->sum('weight').' kg',
            'dimensions_summary' => 'Dimensions per unit: '.$this->getDimensionsSummary(),
            'pickup_date' => $this->pickup_date,
            'pickup_date_formatted' => $this->pickup_date ? \Carbon\Carbon::parse($this->pickup_date)->format('j M Y') : null,
            'received_at_human' => 'Receive '.$this->created_at?->diffForHumans(),
            'supplier_status' => $this->getSupplierStatus(auth()->id()),
        ];
    }

    private function getItemsSummary(): string
    {
        $count = $this->items()->sum('quantity');
        $firstItem = $this->items()->first();
        $type = $firstItem ? $firstItem->item_type : 'Items';

        return "{$count} {$type}";
    }

    private function getDimensionsSummary(): string
    {
        $firstItem = $this->items()->first();
        if (! $firstItem || ! $firstItem->length) {
            return 'N/A';
        }

        return "{$firstItem->length} × {$firstItem->width} × {$firstItem->height} cm";
    }
}
