<?php

namespace App\Http\Resources\API\Supplier;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\QuoteRequest
 */
class QuoteRequestDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $supplierQuote = $this->quotes()->where('user_id', auth()->id())->first();

        $statusLabel = 'Awaiting client response';
        if ($supplierQuote && $supplierQuote->status === 'accepted') {
            $statusLabel = 'Accepted by client';
        } elseif ($supplierQuote && $supplierQuote->status === 'rejected') {
            $statusLabel = 'Rejected by client';
        }

        return [
            'id' => $this->id,
            'quote_details' => [
                'origin' => $this->pickup_address,
                'destination' => $this->delivery_address,
                'distance_miles' => $this->distance_miles ?? '210 Miles',
                'items_summary' => $this->getItemsSummary(),
                'total_weight' => 'Total weight : '.number_format($this->items()->sum('weight'), 0).' kg',
                'dimensions_summary' => 'Dimensions per unit: '.$this->getDimensionsSummary(),
                'client_name' => $this->user?->name ?? 'Unknown',
                'pickup_date' => !empty($this->pickup_date) ? \Carbon\Carbon::parse($this->pickup_date)->format('j M Y') : 'N/A',
                'delivery_date' => !empty($this->delivery_date) ? \Carbon\Carbon::parse($this->delivery_date)->format('j M Y') : 'N/A',
                'service_type' => $this->service_type ?? 'Road Freight',
                'received_at_human' => 'Receive '.($this->created_at?->diffForHumans() ?? 'recently'),
            ],
            'quote_submitted' => $supplierQuote ? [
                'status_label' => $statusLabel,
                'submitted_price' => '$'.number_format($supplierQuote->amount, 0),
                'estimated_time' => $supplierQuote->estimated_time ?? '2-3 days',
            ] : [],
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
