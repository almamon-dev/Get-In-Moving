<?php

namespace App\Http\Requests\API\Supplier;

use Illuminate\Foundation\Http\FormRequest;

class SubmitQuoteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->user_type === 'supplier';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'amount' => 'required|numeric|min:0.01',
            'estimated_time' => 'required|string', // e.g. "2-3 days"
            'notes' => 'nullable|string',
            'valid_until' => 'nullable|date|after:now',
        ];
    }
}
