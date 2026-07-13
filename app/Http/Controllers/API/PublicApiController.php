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
}
