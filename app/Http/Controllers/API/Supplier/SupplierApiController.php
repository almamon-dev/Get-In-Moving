<?php

namespace App\Http\Controllers\API\Supplier;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Supplier\SubmitQuoteRequest;
use App\Http\Resources\API\Supplier\InvoiceResource;
use App\Http\Resources\API\Supplier\OrderResource;
use App\Http\Resources\API\Supplier\PodResource;
use App\Http\Resources\API\Supplier\QuoteRequestDetailResource;
use App\Http\Resources\API\Supplier\QuoteRequestResource;
use App\Http\Resources\API\Supplier\QuoteResource;
use App\Http\Resources\API\Supplier\SupplierProfileResource;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\Quote;
use App\Models\QuoteRequest;
use App\Models\QuoteRequestView;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class SupplierApiController extends Controller
{
    use ApiResponse;

    /**
     * Get quote requests for the supplier dashboard with stats and filters.
     */
    public function getAvailableRequests(Request $request)
    {
        $user = $request->user();
        $tab = $request->input('tab', 'new');
        $search = $request->input('search');

        $query = QuoteRequest::with(['items', 'user'])
            ->withCount('quotes')
            ->where('status', 'active');

        // Search by location or service type
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('pickup_address', 'like', "%$search%")
                    ->orWhere('delivery_address', 'like', "%$search%")
                    ->orWhere('service_type', 'like', "%$search%");
            });
        }

        // Filtering based on supplier engagement
        $viewedIds = QuoteRequestView::where('user_id', $user->id)->pluck('quote_request_id');
        $quotedIds = Quote::where('user_id', $user->id)->pluck('quote_request_id');

        if ($tab === 'new') {
            $query->whereNotIn('id', $viewedIds)->whereNotIn('id', $quotedIds);
        } elseif ($tab === 'viewed') {
            $query->whereIn('id', $viewedIds)->whereNotIn('id', $quotedIds);
        } elseif ($tab === 'quoted') {
            $query->whereIn('id', $quotedIds);
        }

        $requests = $query->latest()->get();

        // Stats calculation
        $stats = [
            'total' => QuoteRequest::where('status', 'active')->count(),
            'new' => QuoteRequest::where('status', 'active')
                ->whereNotIn('id', $viewedIds)
                ->whereNotIn('id', $quotedIds)
                ->count(),
            'viewed' => QuoteRequestView::where('user_id', $user->id)
                ->whereNotIn('quote_request_id', $quotedIds)
                ->count(),
            'quoted' => Quote::where('user_id', $user->id)->count(),
        ];

        return $this->sendResponse([
            'stats' => $stats,
            'requests' => QuoteRequestResource::collection($requests),
        ], 'Supplier dashboard data retrieved.');
    }

    /**
     * Get details of a specific quote request and mark as viewed.
     */
    public function getRequestDetails(Request $request, $id)
    {
        $quoteRequest = QuoteRequest::with(['items', 'user'])->find($id);

        if (! $quoteRequest) {
            return $this->sendError('Quote request not found.', [], 404);
        }

        // Mark as viewed
        QuoteRequestView::firstOrCreate([
            'user_id' => $request->user()->id,
            'quote_request_id' => $id,
        ]);

        return $this->sendResponse(new QuoteRequestDetailResource($quoteRequest), 'Quote request details retrieved.');
    }

    /**
     * Submit a quote for a request.
     */
    public function submitQuote(SubmitQuoteRequest $request, $id)
    {
        $quoteRequest = QuoteRequest::find($id);

        if (! $quoteRequest) {
            return $this->sendError('Quote request not found.', [], 404);
        }

        if ($quoteRequest->status !== 'active') {
            return $this->sendError('This request is no longer active.', [], 422);
        }

        $user = $request->user();

        // Check if already quoted - if so, submit as a revision
        $existing = Quote::where('quote_request_id', $id)
            ->where('user_id', $user->id)
            ->first();

        if ($existing) {
            $existing->update([
                'revised_amount' => $request->amount,
                'revised_estimated_time' => $request->estimated_time,
                'revision_status' => 'pending',
            ]);

            // Notify the customer about the revised offer
            $customer = $quoteRequest->user;
            if ($customer) {
                $customer->notify(new \App\Notifications\RevisedQuoteNotification($existing));

                // Add a message to the chat history about this revision
                \App\Models\Message::create([
                    'sender_id' => $user->id,
                    'receiver_id' => $customer->id,
                    'quote_id' => $existing->id,
                    'message' => 'I have submitted a revised offer of $'.number_format($request->amount, 0).' with estimated delivery: '.$request->estimated_time,
                ]);
            }

            return $this->sendResponse(new QuoteResource($existing->load('user')), 'Revised offer submitted successfully.', null, 200);
        }

        $quote = Quote::create([
            'quote_request_id' => $id,
            'user_id' => $user->id,
            'amount' => $request->amount,
            'estimated_time' => $request->estimated_time,
            'status' => 'pending',
        ]);

        // Notify the customer
        $customer = $quoteRequest->user;
        if ($customer) {
            $customer->notify(new \App\Notifications\NewQuoteSubmittedNotification($quote));
        }

        return $this->sendResponse(new QuoteResource($quote->load('user')), 'Quote submitted successfully.', null, 201);
    }

    /**
     * Get quotes submitted by the authenticated supplier.
     */
    public function getMyQuotes(Request $request)
    {
        $user = $request->user();

        $quotes = Quote::with(['quoteRequest.items', 'quoteRequest.user'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();

        return $this->sendResponse(QuoteResource::collection($quotes), 'Your quotes retrieved successfully.');
    }

    /**
     * Submit a revised quote/offer for an existing quote.
     */
    public function submitRevision(Request $request, $quoteId)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'estimated_time' => 'nullable|string',
            'message' => 'nullable|string',
        ]);

        $user = $request->user();
        $quote = Quote::with('quoteRequest.user')->where('id', $quoteId)
            ->where('user_id', $user->id)
            ->first();

        if (! $quote) {
            return $this->sendError('Quote not found or you do not have permission to revise this quote.', [], 404);
        }

        $quote->update([
            'revised_amount' => $request->amount,
            'revised_estimated_time' => $request->estimated_time ?? $quote->estimated_time,
            'revision_status' => 'pending',
        ]);

        // Notify the customer
        $customer = $quote->quoteRequest->user;
        if ($customer) {
            $customer->notify(new \App\Notifications\RevisedQuoteNotification($quote));

            // Add the "Optional Sms/Message" to chat history if provided
            $chatMessage = 'I have submitted a revised offer of $'.number_format($request->amount, 0);
            if ($request->message) {
                $chatMessage .= "\n\nNote: ".$request->message;
            }

            \App\Models\Message::create([
                'sender_id' => $user->id,
                'receiver_id' => $customer->id,
                'quote_id' => $quote->id,
                'message' => $chatMessage,
            ]);
        }

        return $this->sendResponse(new QuoteResource($quote), 'Revised offer submitted successfully.');
    }

    /**
     * Get orders assigned to the supplier.
     */
    public function getMyOrders(Request $request)
    {
        $status = $request->input('status');
        $search = $request->input('search');

        $query = Order::with(['customer', 'invoice'])
            ->where('supplier_id', auth()->id());

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where('order_number', 'LIKE', "%{$search}%");
        }

        $orders = $query->latest()->paginate($request->input('per_page', 10));

        $orders->setCollection(OrderResource::collection($orders->getCollection())->collection);

        return $this->sendResponse($orders, 'Supplier orders retrieved.');
    }

    /**
     * Get details of a specific order.
     */
    public function getOrderDetails($id)
    {
        $order = Order::with(['items', 'customer', 'quote.quoteRequest', 'invoice'])->find($id);

        if (! $order || $order->supplier_id !== auth()->id()) {
            return $this->sendError('Order not found.', [], 404);
        }

        return $this->sendResponse(new OrderResource($order), 'Order details retrieved.');
    }

    /**
     * Update order status.
     */
    public function updateOrderStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,in_progress,picked_up,delivered,completed,cancelled',
            'note' => 'nullable|string',
            'proof' => 'required_if:status,delivered|image|max:20048',
        ], [
            'proof.required_if' => 'Proof of delivery is required when marking the order as delivered.',
        ]);

        $order = Order::find($id);

        if (! $order || $order->supplier_id !== auth()->id()) {
            return $this->sendError('Order not found.', [], 404);
        }

        $updateData = ['status' => $request->status];

        if ($request->has('note')) {
            $updateData['status_note'] = $request->note;
        }

        if ($request->hasFile('proof')) {
            $path = $request->file('proof')->store('orders/proofs', 'public');
            $updateData['proof_of_delivery'] = $path;
            $updateData['pod_status'] = 'pending';
        }

        $order->update($updateData);

        return $this->sendResponse(new OrderResource($order), "Order status updated to {$request->status}.");
    }

    /**
     * Get invoices for the supplier.
     */
    public function getMyInvoices(Request $request)
    {
        $status = $request->input('status');

        $query = Invoice::whereHas('order', function ($q) {
            $q->where('supplier_id', auth()->id());
        })->with('order');

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $invoices = $query->latest()->paginate($request->input('per_page', 10));

        $invoices->setCollection(InvoiceResource::collection($invoices->getCollection())->collection);

        return $this->sendResponse($invoices, 'Supplier invoices retrieved.');
    }

    /**
     * Get details of a specific invoice.
     */
    public function getInvoiceDetails($id)
    {
        $invoice = Invoice::with(['order.customer', 'order.items'])->find($id);

        if (! $invoice || $invoice->order->supplier_id !== auth()->id()) {
            return $this->sendError('Invoice not found.', [], 404);
        }

        return $this->sendResponse(new InvoiceResource($invoice), 'Invoice details retrieved.');
    }

    /**
     * Get orders with POD status.
     */
    public function getPodOrders(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status');

        $query = Order::with('customer')
            ->where('supplier_id', auth()->id())
            ->whereIn('status', ['delivered', 'picked_up', 'completed', 'in_progress']);

        if ($search) {
            $query->where('order_number', 'LIKE', "%{$search}%");
        }

        if ($status && $status !== 'all') {
            $query->where('pod_status', $status);
        }

        $orders = $query->latest()->paginate($request->input('per_page', 10));

        $orders->setCollection(PodResource::collection($orders->getCollection())->collection);

        return $this->sendResponse($orders, 'POD orders retrieved.');
    }

    /**
     * Reupload Proof of Delivery.
     */
    public function reuploadPod(Request $request, $id)
    {
        $request->validate([
            'proof' => 'required|image|max:20048',
        ]);

        $order = Order::where('supplier_id', auth()->id())->find($id);

        if (! $order) {
            return $this->sendError('Order not found.', [], 404);
        }

        $path = $request->file('proof')->store('orders/proofs', 'public');

        $order->update([
            'proof_of_delivery' => $path,
            'pod_status' => 'pending',
        ]);

        return $this->sendResponse(new PodResource($order), 'Proof of Delivery reuploaded successfully.');
    }

    /**
     * Get supplier profile / settings.
     */
    public function getProfile()
    {
        return $this->sendResponse(new SupplierProfileResource(auth()->user()), 'Profile retrieved successfully.');
    }

    /**
     * Update company information / profile.
     */
    public function updateProfile(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'business_address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'zip_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
        ]);

        $user->update($request->only([
            'name', 'phone_number', 'company_name',
            'business_address', 'city', 'state', 'zip_code', 'country',
        ]));

        return $this->sendResponse(new SupplierProfileResource($user), 'Profile updated successfully.');
    }

    /**
     * Update profile picture / logo.
     */
    public function updateLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|max:5120',
        ]);

        $user = auth()->user();
        $path = $request->file('logo')->store('profile_pictures', 'public');

        $user->update(['profile_picture' => $path]);

        return $this->sendResponse(new SupplierProfileResource($user), 'Logo updated successfully.');
    }

    /**
     * Remove profile picture / logo.
     */
    public function removeLogo()
    {
        $user = auth()->user();
        $user->update(['profile_picture' => null]);

        return $this->sendResponse(new SupplierProfileResource($user), 'Logo removed successfully.');
    }

    /**
     * Update insurance document.
     */
    public function updateInsurance(Request $request)
    {
        $request->validate([
            'document' => 'required|file|mimes:pdf,jpg,png,jpeg|max:10240',
            'expiry_date' => 'required|date|after:today',
        ]);

        $user = auth()->user();
        $path = $request->file('document')->store('compliance/insurance', 'public');

        $user->update([
            'insurance_document' => $path,
            'policy_expiry_date' => $request->expiry_date,
            'insurance_status' => 'pending',
            'insurance_uploaded_at' => now(),
            'is_compliance_verified' => false,
        ]);

        return $this->sendResponse(new SupplierProfileResource($user), 'Insurance document updated and pending verification.');
    }

    /**
     * Update driver license.
     */
    public function updateLicense(Request $request)
    {
        $request->validate([
            'document' => 'required|file|mimes:pdf,jpg,png,jpeg|max:10240',
            'expiry_date' => 'required|date|after:today',
        ]);

        $user = auth()->user();
        $path = $request->file('document')->store('compliance/license', 'public');

        $user->update([
            'license_document' => $path,
            'license_expiry_date' => $request->expiry_date,
            'license_status' => 'pending',
            'license_uploaded_at' => now(),
            'is_compliance_verified' => false,
        ]);

        return $this->sendResponse(new SupplierProfileResource($user), 'License document updated and pending verification.');
    }

    /**
     * Change user password.
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = auth()->user();

        if (! Hash::check($request->current_password, $user->password)) {
            return $this->sendError('Current password does not match.', [], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return $this->sendResponse(null, 'Password changed successfully.');
    }

    /**
     * Request account deletion.
     */
    public function requestDeletion()
    {
        $user = auth()->user();
        $user->update(['deletion_requested_at' => now()]);

        return $this->sendResponse(null, 'Account deletion requested. This will be processed by administrative team.');
    }
}
