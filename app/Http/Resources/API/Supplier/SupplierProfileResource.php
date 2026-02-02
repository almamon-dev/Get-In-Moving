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
            'phone' => $this->phone_number,
            'company_name' => $this->company_name,
            'logo' => $this->profile_picture ? asset('storage/' . $this->profile_picture) : null,
            'address' => [
                'business_address' => $this->business_address,
                'city' => $this->city,
                'state' => $this->state,
                'zip_code' => $this->zip_code,
                'country' => $this->country,
            ],
            'compliance' => [
                'insurance' => [
                    'status' => $this->insurance_status ?? 'pending',
                    'document' => $this->insurance_document ? asset('storage/' . $this->insurance_document) : null,
                    'uploaded_at' => $this->insurance_uploaded_at ? $this->insurance_uploaded_at->format('d M Y') : null,
                    'expiry_at' => $this->policy_expiry_date ? $this->policy_expiry_date->format('d M Y') : null,
                ],
                'license' => [
                    'status' => $this->license_status ?? 'pending',
                    'document' => $this->license_document ? asset('storage/' . $this->license_document) : null,
                    'uploaded_at' => $this->license_uploaded_at ? $this->license_uploaded_at->format('d M Y') : null,
                    'expiry_at' => $this->license_expiry_date ? $this->license_expiry_date->format('d M Y') : null,
                ],
                'is_verified' => $this->is_compliance_verified,
            ],
            'deletion_requested' => $this->deletion_requested_at !== null,
            'status' => $this->status,
        ];
    }
}
