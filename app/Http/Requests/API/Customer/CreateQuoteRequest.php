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
            'service_type' => 'required|string',
            'pickup_address' => 'required|string',
            'delivery_address' => 'required|string',
            'pickup_date' => 'required|date|after_or_equal:today',
            'pickup_time_from' => 'required',
            'pickup_time_till' => 'required',
            'additional_notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.item_type' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.length' => 'nullable|numeric|min:0',
            'items.*.width' => 'nullable|numeric|min:0',
            'items.*.height' => 'nullable|numeric|min:0',
            'items.*.weight' => 'nullable|numeric|min:0',
        ];
    }
}
