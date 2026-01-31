<?php

namespace App\Http\Resources\Auth;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RegisterResource extends JsonResource
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
            'name' => $this->name,
            'email' => $this->email,
            'user_type' => $this->user_type,
            'email_verified_at' => $this->email_verified_at,
            'is_verified' => $this->is_verified ?? false,
            $this->mergeWhen($this->user_type === 'supplier', [
                'is_compliance_verified' => $this->is_compliance_verified ?? false,
                'compliance_verified_at' => $this->compliance_verified_at,
            ]),
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
