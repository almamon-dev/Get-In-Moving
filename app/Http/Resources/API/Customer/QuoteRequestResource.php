<?php

namespace App\Http\Resources\API\Customer;

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
            'status' => $this->status,
            'service_type' => $this->service_type,
            'pickup_date' => $this->pickup_date ? \Carbon\Carbon::parse($this->pickup_date)->format('j M Y') : '',
            'delivery_date' => $this->delivery_date ? \Carbon\Carbon::parse($this->delivery_date)->format('j M Y') : '',
            'created_at' => $this->created_at,
            'quotes_count' => $this->quotes_count ?? $this->quotes()->count(),
        ];
    }
}
