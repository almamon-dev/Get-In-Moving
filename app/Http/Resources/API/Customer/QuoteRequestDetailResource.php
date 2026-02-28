<?php

namespace App\Http\Resources\API\Customer;

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
            'distance_miles' => '210 Miles',
            'items_summary' => $this->getItemsSummary(),
            'total_weight' => 'Total weight : '.$this->items()->sum('weight').' kg',
            'dimensions_summary' => 'Dimensions per unit: '.$this->getDimensionsSummary(),
            'service_type' => $this->service_type,
            'attachment_path' => $this->attachment_path ? asset($this->attachment_path) : null,
            'requested_date' => $this->created_at?->format('j M Y'),
            'estimated_price_range' => $this->getEstimatedPriceRange(),
            'status' => $this->status,
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

        return "{$firstItem->length} x {$firstItem->width} x {$firstItem->height} cm";
    }

    private function getEstimatedPriceRange(): string
    {
        $min = $this->quotes()->min('amount');
        $max = $this->quotes()->max('amount');

        if (! $min) {
            return 'N/A';
        }
        if ($min == $max) {
            return '$'.number_format($min, 0);
        }

        return '$'.number_format($min, 0).'-$'.number_format($max, 0);
    }
}
