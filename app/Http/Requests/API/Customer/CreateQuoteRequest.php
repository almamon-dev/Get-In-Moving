<?php

namespace App\Http\Requests\API\Customer;

use Illuminate\Foundation\Http\FormRequest;

class CreateQuoteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->user_type === 'customer';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'service_type' => 'required_without:file|string',
            'pickup_address' => 'required_without:file|string',
            'delivery_address' => 'required_without:file|string',
            'pickup_date' => 'required_without:file|date',
            'pickup_time_from' => 'required_without:file',
            'pickup_time_till' => 'required_without:file',
            'additional_notes' => 'nullable|string',
            'file' => 'nullable|file|mimes:csv,txt,xlsx,xls,pdf|max:10240',
            'items' => 'required_without:file|array',
            'items.*.item_type' => 'required_with:items|string',
            'items.*.quantity' => 'required_with:items|integer|min:1',
            'items.*.length' => 'nullable|numeric|min:0',
            'items.*.width' => 'nullable|numeric|min:0',
            'items.*.height' => 'nullable|numeric|min:0',
            'items.*.weight' => 'nullable|numeric|min:0',
        ];
    }
}
