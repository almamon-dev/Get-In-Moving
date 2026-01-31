<?php

namespace App\Http\Resources\API\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuoteRequestItemResource extends JsonResource
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
            'item_type' => $this->item_type,
            'quantity' => $this->quantity,
            'dimensions' => [
                'length' => (float) $this->length,
                'width' => (float) $this->width,
                'height' => (float) $this->height,
            ],
            'weight' => (float) $this->weight,
        ];
    }
}
