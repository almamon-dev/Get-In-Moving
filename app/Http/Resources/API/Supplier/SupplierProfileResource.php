<?php

namespace App\Http\Resources\API\Supplier;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class SupplierProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone_number' => $this->phone_number,
            'company_name' => $this->company_name,
            'profile_picture' => \App\Helpers\Helper::generateURL($this->profile_picture),
            'business_address' => $this->business_address,
            'city' => $this->city,
            'state' => $this->state,
            'zip_code' => $this->zip_code,
            'country' => $this->country,
            'compliance' => [
                'insurance' => [
                    'status' => $this->insurance_status ?? 'pending',
                    'document_url' => \App\Helpers\Helper::generateURL($this->insurance_document),
                    'uploaded_at' => $this->insurance_uploaded_at ? $this->insurance_uploaded_at->format('j M Y') : null,
                    'expiry_at' => $this->policy_expiry_date ? $this->policy_expiry_date->format('j M Y') : null,
                ],
                'license' => [
                    'status' => $this->license_status ?? 'pending',
                    'document_url' => \App\Helpers\Helper::generateURL($this->license_document),
                    'uploaded_at' => $this->license_uploaded_at ? $this->license_uploaded_at->format('j M Y') : null,
                    'expiry_at' => $this->license_expiry_date ? $this->license_expiry_date->format('j M Y') : null,
                ],
                'is_verified' => (bool)$this->is_compliance_verified,
            ],
            'deletion_requested' => $this->deletion_requested_at !== null,
            'status' => $this->status,
        ];
    }
}
