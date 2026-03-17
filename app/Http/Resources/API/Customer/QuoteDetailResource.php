<?php

namespace App\Http\Resources\API\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuoteDetailResource extends JsonResource
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
            'origin' => $this->pickup_address,
            'destination' => $this->delivery_address,
            'distance_miles' => '210 Miles',
            'items_summary' => $this->getItemsSummary(),
            'total_weight' => 'Total weight : '.number_format($this->items()->sum('weight'), 0).' kg',
            'dimensions_summary' => 'Dimensions per unit: '.$this->getDimensionsSummary(),
            'requested_date' => $this->requested_date ? $this->requested_date->format('j M Y') : '',
            'pickup_date' => $this->pickup_date ? \Carbon\Carbon::parse($this->pickup_date)->format('j M Y') : '',
            'delivery_date' => $this->delivery_date ? \Carbon\Carbon::parse($this->delivery_date)->format('j M Y') : '',
            'pickup_time_from' => $this->pickup_time_from,
            'pickup_time_till' => $this->pickup_time_till,
            'delivery_time_from' => $this->delivery_time_from,
            'delivery_time_till' => $this->delivery_time_till,
            'estimated_price_range' => $this->getEstimatedPriceRange(),
        ];
    }

    private function getItemsSummary(): string
    {
        $count = $this->items()->sum('quantity');
        $firstItem = $this->items()->first();
        $type = $firstItem ? $firstItem->item_type : 'Items';

        // If all items are the same type, use it. Otherwise say "Mixed Items" or pluralize.
        $distinctTypes = $this->items()->pluck('item_type')->unique()->count();
        if ($distinctTypes > 1) {
            $type = 'Mixed Items';
        }

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
