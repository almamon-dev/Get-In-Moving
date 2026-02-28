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
            'service_type' => $this->service_type,
            'location' => [
                'origin' => $this->pickup_address,
                'destination' => $this->delivery_address,
            ],
            'quotes_received' => ($this->quotes_count ?? $this->quotes()->count()).' Quotes',
            'attachment_path' => $this->attachment_path ? asset($this->attachment_path) : null,
            'last_updated' => ($this->quotes()->latest()->first()?->created_at ?? $this->updated_at)?->diffForHumans(),
        ];
    }
}
