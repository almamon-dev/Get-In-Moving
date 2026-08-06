<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SupplierAvailability;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class PublicApiController extends Controller
{
    use ApiResponse;

    /**
     * Get all active supplier availabilities for public viewing.
     */
    public function getSupplierAvailabilities(Request $request)
    {
        $availabilities = SupplierAvailability::with('supplier:id,name,company_name,profile_picture')
            ->where('status', 'active')
            ->where(function($query) {
                $query->whereNull('end_date')
                      ->orWhere('end_date', '>=', now());
            })
            ->latest()
            ->paginate($request->input('per_page', 8));

        $data = $availabilities->map(function ($item) {
            return [
                'id' => $item->id,
                'supplier_name' => $item->supplier->company_name ?? $item->supplier->name ?? 'Unknown Supplier',
                'supplier_image' => $item->supplier->profile_picture ?? null,
                'type' => $item->type,
                'pickup_region' => $item->pickup_region,
                'delivery_region' => $item->delivery_region,
                'trailer_type' => $item->trailer_type,
                'start_date' => $item->start_date ? $item->start_date->format('Y-m-d') : null,
                'end_date' => $item->end_date ? $item->end_date->format('Y-m-d') : null,
                'days_of_week' => $item->days_of_week,
                'capacity_limit' => $item->capacity_limit,
                'price' => $item->price,
                'notes' => $item->notes,
            ];
        });

        return $this->sendResponse([
            'availabilities' => $data,
            'pagination' => [
                'total' => $availabilities->total(),
                'per_page' => $availabilities->perPage(),
                'current_page' => $availabilities->currentPage(),
                'last_page' => $availabilities->lastPage(),
            ],
        ], 'Public supplier availabilities retrieved successfully.');
    }

    /**
     * Handle public contact us form submission and dispatch email to official business email.
     */
    public function submitContact(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'email' => 'required|email|max:191',
            'phone' => 'nullable|string|max:30',
            'subject' => 'nullable|string|max:200',
            'message' => 'required|string|max:5000',
        ]);

        $officialEmail = \App\Models\Setting::where('key', 'company_email')->value('value')
            ?? \App\Models\Setting::where('key', 'official_email')->value('value')
            ?? \App\Models\Setting::where('key', 'business_email')->value('value')
            ?? \App\Models\Setting::where('key', 'contact_email')->value('value')
            ?? config('mail.from.address');

        try {
            if ($officialEmail) {
                \Illuminate\Support\Facades\Mail::to($officialEmail)->send(new \App\Mail\ContactFormMail($validated));
            }

            return $this->sendResponse(null, 'Thank you for reaching out! Your message has been sent successfully.');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Contact Us email failed to send: ' . $e->getMessage());

            return $this->sendResponse(null, 'Thank you! Your message has been recorded and our team will get back to you soon.');
        }
    }
}
