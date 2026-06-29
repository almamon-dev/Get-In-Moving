<?php

namespace App\Http\Resources\API\Supplier;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplierProfileResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray(Request $request): array
    {
        $now = \Carbon\Carbon::now();
        $policyExpiry = $this->policy_expiry_date ? \Carbon\Carbon::parse($this->policy_expiry_date) : null;
        $licenseExpiry = $this->license_expiry_date ? \Carbon\Carbon::parse($this->license_expiry_date) : null;

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
                    'status' => $this->is_compliance_verified ? 'verified' : ($this->insurance_status ?? 'pending'),
                    'document_url' => \App\Helpers\Helper::generateURL($this->insurance_document),
                    'uploaded_at' => $this->insurance_uploaded_at instanceof \Carbon\Carbon ? $this->insurance_uploaded_at->format('j M Y') : ($this->insurance_uploaded_at ? date('j M Y', strtotime($this->insurance_uploaded_at)) : null),
                    'expiry_at' => $policyExpiry ? $policyExpiry->format('j M Y') : null,
                    'raw_expiry' => $this->policy_expiry_date,
                    'days_until_expiry' => $policyExpiry ? $now->diffInDays($policyExpiry, false) : null,
                ],
                'license' => [
                    'status' => $this->is_compliance_verified ? 'verified' : ($this->license_status ?? 'pending'),
                    'document_url' => \App\Helpers\Helper::generateURL($this->license_document),
                    'uploaded_at' => $this->license_uploaded_at instanceof \Carbon\Carbon ? $this->license_uploaded_at->format('j M Y') : ($this->license_uploaded_at ? date('j M Y', strtotime($this->license_uploaded_at)) : null),
                    'expiry_at' => $licenseExpiry ? $licenseExpiry->format('j M Y') : null,
                    'raw_expiry' => $this->license_expiry_date,
                    'days_until_expiry' => $licenseExpiry ? $now->diffInDays($licenseExpiry, false) : null,
                ],
                'is_verified' => (bool) $this->is_compliance_verified,
            ],
            'deletion_requested' => $this->deletion_requested_at !== null,
            'status' => $this->status,
            'is_verified' => (bool) $this->is_verified,
            'stripe_account_id' => $this->stripe_account_id,
            'is_stripe_connected' => (bool) $this->is_stripe_connected,
        ];
    }
}
