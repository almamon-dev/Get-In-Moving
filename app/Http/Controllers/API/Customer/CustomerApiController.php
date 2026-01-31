<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\CreateQuoteRequest;
use App\Http\Resources\API\Customer\QuoteRequestDetailResource;
use App\Http\Resources\API\Customer\QuoteRequestResource;
use App\Http\Resources\API\Customer\QuoteResource;
use App\Models\Quote;
use App\Models\QuoteRequest;
use App\Models\QuoteRequestItem;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CustomerApiController extends Controller
{
    use ApiResponse;

    /**
     * Create a new quote request.
     */
    public function createQuoteRequest(CreateQuoteRequest $request)
    {
        DB::beginTransaction();
        try {
            $quoteRequest = QuoteRequest::create([
                'user_id' => $request->user()->id,
                'service_type' => $request->service_type,
                'pickup_address' => $request->pickup_address,
                'delivery_address' => $request->delivery_address,
                'pickup_date' => $request->pickup_date,
                'pickup_time_from' => $request->pickup_time_from,
                'pickup_time_till' => $request->pickup_time_till,
                'additional_notes' => $request->additional_notes,
                'status' => 'active',
            ]);

            foreach ($request->items as $item) {
                QuoteRequestItem::create([
                    'quote_request_id' => $quoteRequest->id,
                    'item_type' => $item['item_type'],
                    'quantity' => $item['quantity'],
                    'length' => $item['length'] ?? null,
                    'width' => $item['width'] ?? null,
                    'height' => $item['height'] ?? null,
                    'weight' => $item['weight'] ?? null,
                ]);
            }

            DB::commit();

            return $this->sendResponse(new QuoteRequestResource($quoteRequest->load('items')), 'Quote request created successfully.', null, 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return $this->sendError('Failed to create quote request.', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Get list of quote requests created by the customer.
     */
    public function getMyQuoteRequests(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $requests = QuoteRequest::withCount('quotes')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->paginate($perPage);

        $requests->setCollection(QuoteRequestResource::collection($requests->getCollection())->collection);

        return $this->sendResponse($requests, 'Your quote requests retrieved.');
    }

    /**
     * Get quotes received for a specific request.
     */
    public function getRequestQuotes($id)
    {
        $quoteRequest = QuoteRequest::with(['items', 'user'])->where('id', $id)
            ->where('user_id', auth()->id())
            ->first();

        if (! $quoteRequest) {
            return $this->sendError('Quote request not found.', [], 404);
        }

        $quotes = Quote::with('user')
            ->where('quote_request_id', $id)
            ->latest()
            ->get();

        return $this->sendResponse([
            'request' => new QuoteRequestDetailResource($quoteRequest),
            'quotes' => QuoteResource::collection($quotes),
        ], 'Quotes retrieved for this request.');
    }

    /**
     * Accept a quote.
     */
    public function acceptQuote($id)
    {
        $quote = Quote::with('quoteRequest')->find($id);

        if (! $quote || $quote->quoteRequest->user_id !== auth()->id()) {
            return $this->sendError('Quote not found.', [], 404);
        }

        DB::beginTransaction();
        try {
            $quote->update(['status' => 'accepted']);

            Quote::where('quote_request_id', $quote->quote_request_id)
                ->where('id', '!=', $id)
                ->update(['status' => 'rejected']);

            $quote->quoteRequest->update(['status' => 'completed']);

            DB::commit();

            return $this->sendResponse(new QuoteResource($quote), 'Quote accepted and others rejected.');

        } catch (\Exception $e) {
            DB::rollBack();

            return $this->sendError('Failed to accept quote.', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Accept a revised quote/offer.
     */
    public function acceptRevision($id)
    {
        $quote = Quote::with('quoteRequest')->findOrFail($id);

        if ($quote->quoteRequest->user_id !== auth()->id()) {
            return $this->sendError('Unauthorized.', [], 403);
        }

        if ($quote->revision_status !== 'pending') {
            return $this->sendError('No pending revision to accept.', [], 422);
        }

        $quote->update([
            'amount' => $quote->revised_amount,
            'estimated_time' => $quote->revised_estimated_time,
            'revised_amount' => null,
            'revised_estimated_time' => null,
            'revision_status' => 'accepted',
        ]);

        return $this->sendResponse(new QuoteResource($quote), 'Revised offer accepted.');
    }

    /**
     * Reject a revised quote/offer.
     */
    public function rejectRevision($id)
    {
        $quote = Quote::with('quoteRequest')->findOrFail($id);

        if ($quote->quoteRequest->user_id !== auth()->id()) {
            return $this->sendError('Unauthorized.', [], 403);
        }

        $quote->update([
            'revised_amount' => null,
            'revised_estimated_time' => null,
            'revision_status' => 'rejected',
        ]);

        return $this->sendResponse(new QuoteResource($quote), 'Revised offer rejected.');
    }

    /**
     * Get customer profile information.
     */
    public function getProfile(Request $request)
    {
        $user = $request->user();

        return $this->sendResponse([
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'company_name' => $user->company_name,
            'profile_picture' => $user->profile_picture,
        ], 'Profile retrieved successfully.');
    }

    /**
     * Update customer profile information.
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'company_name' => 'nullable|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = $request->user();

        $data = $request->only(['name', 'phone', 'company_name']);

        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            $file = $request->file('profile_picture');
            $filename = time().'_'.$file->getClientOriginalName();
            $path = $file->storeAs('profile_pictures', $filename, 'public');
            $data['profile_picture'] = '/storage/'.$path;
        }

        $user->update($data);

        return $this->sendResponse([
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'company_name' => $user->company_name,
            'profile_picture' => $user->profile_picture,
        ], 'Profile updated successfully.');
    }

    /**
     * Change customer password.
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        // Verify current password
        if (! Hash::check($request->current_password, $user->password)) {
            return $this->sendError('Current password is incorrect.', [], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return $this->sendResponse(null, 'Password changed successfully.');
    }

    /**
     * Delete customer account.
     */
    public function deleteAccount(Request $request)
    {
        $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        // Verify password
        if (! \Hash::check($request->password, $user->password)) {
            return $this->sendError('Password is incorrect.', [], 422);
        }

        // Delete user's tokens
        $user->tokens()->delete();

        // Soft delete the user
        $user->delete();

        return $this->sendResponse(null, 'Account deleted successfully.');
    }
}
