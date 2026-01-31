<?php

namespace App\Http\Requests\API\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterApiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => ['nullable', 'string', 'max:255'],
            'company_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone_number' => ['required', 'string', 'max:20'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'user_type' => ['required', Rule::in(['customer', 'supplier'])],
            'pricing_plan_id' => ['required', 'exists:pricing_plans,id'],
            'terms' => ['required', 'accepted'],
        ];

        // If user_type is supplier, add extra compliance fields
        if ($this->input('user_type') === 'supplier') {
            $rules['insurance_type'] = ['required', 'string', 'max:255'];
            $rules['insurance_provider_name'] = ['required', 'string', 'max:255'];
            $rules['policy_number'] = ['required', 'string', 'max:255'];
            $rules['policy_expiry_date'] = ['required', 'date', 'after:today'];
            $rules['insurance_document'] = ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'];
            $rules['license_document'] = ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'pricing_plan_id.required' => 'Please select a valid subscription plan.',
            'terms.accepted' => 'You must accept the terms and conditions.',
            'company_name.required' => 'Company name is mandatory.',
        ];
    }
}
