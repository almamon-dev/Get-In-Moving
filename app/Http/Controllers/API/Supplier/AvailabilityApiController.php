<?php

namespace App\Http\Controllers\API\Supplier;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Supplier\SupplierAvailabilityResource;
use App\Http\Resources\API\Supplier\SupplierAvailabilityListResource;
use App\Models\SupplierAvailability;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AvailabilityApiController extends Controller
{
    use ApiResponse;

    /**
     * Get availabilities for the authenticated supplier.
     */
    public function index(Request $request)
    {
        $month = $request->input('month'); // e.g., 2026-02

        $baseQuery = SupplierAvailability::where('supplier_id', auth()->id());

        if ($month) {
            $date = Carbon::parse($month.'-01');
            $baseQuery->where(function ($q) use ($date) {
                $q->whereMonth('start_date', $date->month)
                    ->whereYear('start_date', $date->year)
                    ->orWhere(function ($sub) use ($date) {
                        $sub->where('type', 'recurring')
                            ->where('start_date', '<=', $date->endOfMonth())
                            ->where(function ($final) use ($date) {
                                $final->whereNull('end_date')
                                    ->orWhere('end_date', '>=', $date->startOfMonth());
                            });
                    });
            });
        }

        // 1. Data for Calendar
        $allAvailabilities = (clone $baseQuery)->latest()->get();
        $calendar = $allAvailabilities->map(function ($item) {
            $resource = (new SupplierAvailabilityListResource($item))->toArray(request());
            return [
                'date' => $resource['date'],
                'note' => $resource['calendar_note'],
                'color' => $resource['status_clr'],
            ];
        });

        // 2. Paginated data for History Table
        $paginated = $baseQuery->latest()->paginate($request->input('per_page', 10));
        $historyData = SupplierAvailabilityListResource::collection($paginated->getCollection());

        return $this->sendResponse([
            'calendar' => $calendar,
            'history' => $historyData,
            'pagination' => [
                'total' => $paginated->total(),
                'per_page' => $paginated->perPage(),
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'from' => $paginated->firstItem(),
                'to' => $paginated->lastItem(),
            ],
        ], 'Supplier availabilities retrieved successfully.');
    }

    /**
     * Store new availability.
     */
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|in:standard,recurring',
            'pickup_region' => 'required|string', // Pickup Country
            'delivery_region' => 'required|string', // Delivery Country
            'trailer_type' => 'nullable|string',
            'notes' => 'nullable|string',

            // Date-based specific
            'start_date' => 'required_if:type,standard|nullable|date',
            'capacity_limit' => 'required_if:type,standard|nullable|numeric',

            // Route-based specific
            'route_name' => 'required_if:type,recurring|nullable|string',
            'days_of_week' => 'required_if:type,recurring|nullable|array',
            'price' => 'nullable|numeric|min:0', // Keeping it optional if needed
        ]);

        $availability = SupplierAvailability::create([
            'supplier_id' => auth()->id(),
            'type' => $request->type,
            'route_name' => $request->route_name,
            'service_type' => $request->trailer_type ?? 'N/A', // Mapping to service_type
            'trailer_type' => $request->trailer_type,
            'pickup_region' => $request->pickup_region,
            'delivery_region' => $request->delivery_region,
            'start_date' => $request->type === 'standard' ? $request->start_date : now(), // Recurring starts from now or specific
            'days_of_week' => $request->days_of_week,
            'price' => $request->price ?? 0,
            'capacity_limit' => $request->capacity_limit,
            'notes' => $request->notes,
            'status' => 'active',
        ]);

        return $this->sendResponse(
            new SupplierAvailabilityResource($availability),
            'Availability created successfully.',
            null,
            201
        );
    }

    /**
     * Update availability.
     */
    public function update(Request $request, $id)
    {
        $availability = SupplierAvailability::where('supplier_id', auth()->id())->find($id);

        if (! $availability) {
            return $this->sendError('Availability not found.', [], 404);
        }

        $request->validate([
            'service_type' => 'sometimes|string',
            'pickup_region' => 'nullable|string',
            'delivery_region' => 'nullable|string',
            'start_date' => 'sometimes|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'days_of_week' => 'nullable|array',
            'start_time' => 'nullable',
            'end_time' => 'nullable',
            'price' => 'sometimes|numeric|min:0',
            'capacity_limit' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:active,inactive',
        ]);

        $availability->update($request->all());

        return $this->sendResponse(
            new SupplierAvailabilityResource($availability),
            'Availability updated successfully.'
        );
    }

    /**
     * Delete availability.
     */
    public function destroy($id)
    {
        $availability = SupplierAvailability::where('supplier_id', auth()->id())->find($id);

        if (! $availability) {
            return $this->sendError('Availability not found.', [], 404);
        }

        $availability->delete();

        return $this->sendResponse(null, 'Availability deleted successfully.');
    }

    /**
     * Toggle status.
     */
    public function toggleStatus($id)
    {
        $availability = SupplierAvailability::where('supplier_id', auth()->id())->find($id);

        if (! $availability) {
            return $this->sendError('Availability not found.', [], 404);
        }

        $availability->status = $availability->status === 'active' ? 'inactive' : 'active';
        $availability->save();

        return $this->sendResponse(
            new SupplierAvailabilityResource($availability),
            'Availability status toggled.'
        );
    }
}
