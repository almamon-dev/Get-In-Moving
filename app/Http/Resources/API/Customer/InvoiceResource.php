<?php

namespace App\Http\Resources\API\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InvoiceResource extends JsonResource
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
            'invoice_number' => $this->invoice_number,
            'order_id' => $this->order?->order_number,
            'order_internal_id' => $this->order_id,
            'supplier' => [
                'id' => $this->order?->supplier?->id,
                'name' => $this->order?->supplier?->name,
                'company_name' => $this->order?->supplier?->company_name,
            ],
            'amount' => (float) $this->total_amount,
            'amount_formatted' => '$'.number_format($this->total_amount, 2),
            'supplier_amount' => (float) $this->supplier_amount,
            'supplier_amount_formatted' => '$'.number_format($this->supplier_amount, 2),
            'platform_fee' => (float) $this->platform_fee,
            'platform_fee_formatted' => '$'.number_format($this->platform_fee, 2),
            'status' => $this->status,
            'due_date' => $this->due_date,
            'due_date_formatted' => \Carbon\Carbon::parse($this->due_date)->format('j M Y'),
            'invoice_date' => $this->created_at?->format('j F Y'),
            'paid_at' => $this->paid_at,
            'order_details' => [
                'service_type' => $this->order?->service_type,
                'pickup_address' => $this->order?->pickup_address,
                'delivery_address' => $this->order?->delivery_address,
                'pickup_date' => $this->order?->pickup_date,
                'estimated_time' => $this->order?->estimated_time,
                'items_count' => $this->order?->items()->count(),
            ],
        ];
    }
}
