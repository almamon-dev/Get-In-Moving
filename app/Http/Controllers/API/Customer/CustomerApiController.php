<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\CreateQuoteRequest;
use App\Http\Resources\API\Customer\InvoiceResource;
use App\Http\Resources\API\Customer\OrderResource;
use App\Http\Resources\API\Customer\QuoteRequestDetailResource;
use App\Http\Resources\API\Customer\QuoteRequestResource;
use App\Http\Resources\API\Customer\QuoteResource;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Quote;
use App\Models\QuoteRequest;
use App\Models\QuoteRequestItem;
use App\Services\InvoicePaymentService;
use App\Traits\ApiResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CustomerApiController extends Controller
{
    use ApiResponse;

    protected $paymentService;

    public function __construct(InvoicePaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

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

            // Create Order
            $order = Order::create([
                'order_number' => 'ORD-'.strtoupper(Str::random(4)).'-'.(Order::count() + 10001),
                'quote_id' => $quote->id,
                'customer_id' => $quote->quoteRequest->user_id,
                'supplier_id' => $quote->user_id,
                'total_amount' => $quote->amount,
                'service_type' => $quote->quoteRequest->service_type,
                'pickup_address' => $quote->quoteRequest->pickup_address,
                'delivery_address' => $quote->quoteRequest->delivery_address,
                'pickup_date' => $quote->quoteRequest->pickup_date,
                'estimated_time' => $quote->estimated_time,
                'status' => 'confirmed',
            ]);

            // Copy items to OrderItems
            foreach ($quote->quoteRequest->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'item_type' => $item->item_type,
                    'quantity' => $item->quantity,
                    'length' => $item->length,
                    'width' => $item->width,
                    'height' => $item->height,
                    'weight' => $item->weight,
                ]);
            }

            // Create Invoice
            Invoice::create([
                'order_id' => $order->id,
                'invoice_number' => 'INV-'.(Invoice::count() + 202545),
                'supplier_amount' => $quote->amount,
                'platform_fee' => $quote->amount * 0.05,
                'total_amount' => $quote->amount * 1.05,
                'status' => 'due',
                'due_date' => now()->addDays(30),
            ]);

            DB::commit();

            return $this->sendResponse(new QuoteResource($quote), 'Quote accepted and order created successfully.');

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
        $quote = Quote::with(['quoteRequest.items'])->findOrFail($id);

        if ($quote->quoteRequest->user_id !== auth()->id()) {
            return $this->sendError('Unauthorized.', [], 403);
        }

        if ($quote->revision_status !== 'pending') {
            return $this->sendError('No pending revision to accept.', [], 422);
        }

        DB::beginTransaction();
        try {
            $quote->update([
                'amount' => $quote->revised_amount,
                'estimated_time' => $quote->revised_estimated_time,
                'revised_amount' => null,
                'revised_estimated_time' => null,
                'revision_status' => 'accepted',
                'status' => 'accepted',
            ]);

            // Reject other quotes for this request
            Quote::where('quote_request_id', $quote->quote_request_id)
                ->where('id', '!=', $id)
                ->update(['status' => 'rejected']);

            $quote->quoteRequest->update(['status' => 'completed']);

            // Create Order
            $order = Order::create([
                'order_number' => 'ORD-'.strtoupper(Str::random(4)).'-'.(Order::count() + 10001),
                'quote_id' => $quote->id,
                'customer_id' => $quote->quoteRequest->user_id,
                'supplier_id' => $quote->user_id,
                'total_amount' => $quote->amount,
                'service_type' => $quote->quoteRequest->service_type,
                'pickup_address' => $quote->quoteRequest->pickup_address,
                'delivery_address' => $quote->quoteRequest->delivery_address,
                'pickup_date' => $quote->quoteRequest->pickup_date,
                'estimated_time' => $quote->estimated_time,
                'status' => 'confirmed',
            ]);

            // Copy items to OrderItems
            foreach ($quote->quoteRequest->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'item_type' => $item->item_type,
                    'quantity' => $item->quantity,
                    'length' => $item->length,
                    'width' => $item->width,
                    'height' => $item->height,
                    'weight' => $item->weight,
                ]);
            }

            // Create Invoice
            Invoice::create([
                'order_id' => $order->id,
                'invoice_number' => 'INV-'.(Invoice::count() + 202545),
                'supplier_amount' => $quote->amount,
                'platform_fee' => $quote->amount * 0.05,
                'total_amount' => $quote->amount * 1.05,
                'status' => 'due',
                'due_date' => now()->addDays(30),
            ]);

            DB::commit();

            return $this->sendResponse(new QuoteResource($quote), 'Revised offer accepted and order created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();

            return $this->sendError('Failed to accept revised offer.', ['error' => $e->getMessage()], 500);
        }
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
     * Get list of orders for the customer.
     */
    public function getMyOrders(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $orders = Order::with('supplier')
            ->where('customer_id', $request->user()->id)
            ->latest()
            ->paginate($perPage);

        $orders->setCollection(OrderResource::collection($orders->getCollection())->collection);

        return $this->sendResponse($orders, 'Your orders retrieved.');
    }

    /**
     * Get details of a specific order.
     */
    public function getOrderDetails($id)
    {
        $order = Order::with(['items', 'supplier', 'quote.quoteRequest'])->find($id);

        if (! $order || $order->customer_id !== auth()->id()) {
            return $this->sendError('Order not found.', [], 404);
        }

        return $this->sendResponse(new OrderResource($order), 'Order details retrieved.');
    }

    /**
     * Get list of invoices for the customer.
     */
    public function getMyInvoices(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $status = $request->input('status');
        $search = $request->input('search');

        $query = Invoice::query()
            ->whereHas('order', function ($q) {
                $q->where('customer_id', auth()->id());
            })
            ->with(['order.supplier']);

        // Stats calculation
        $statsQuery = Invoice::whereHas('order', function ($q) {
            $q->where('customer_id', auth()->id());
        });

        $stats = [
            'total_spent' => (float) (clone $statsQuery)->where('status', 'paid')->sum('total_amount'),
            'total_outstanding' => (float) (clone $statsQuery)->whereIn('status', ['due', 'overdue'])->sum('total_amount'),
            'total_invoices_count' => (clone $statsQuery)->count(),
            'invoices_due_count' => (clone $statsQuery)->where('status', 'due')->count(),
            'invoices_paid_count' => (clone $statsQuery)->where('status', 'paid')->count(),
        ];

        // Filtering
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where('invoice_number', 'LIKE', "%{$search}%")
                ->orWhereHas('order', function ($q) use ($search) {
                    $q->where('order_number', 'LIKE', "%{$search}%");
                });
        }

        $invoices = $query->latest()->paginate($perPage);

        $invoices->setCollection(InvoiceResource::collection($invoices->getCollection())->collection);

        return $this->sendResponse([
            'stats' => $stats,
            'invoices' => $invoices,
        ], 'Your invoices retrieved.');
    }

    /**
     * Get details of a specific invoice.
     */
    public function getInvoiceDetails($id)
    {
        $invoice = Invoice::with(['order.supplier', 'order.items'])->find($id);

        if (! $invoice || $invoice->order->customer_id !== auth()->id()) {
            return $this->sendError('Invoice not found.', [], 404);
        }

        return $this->sendResponse(new InvoiceResource($invoice), 'Invoice details retrieved.');
    }

    /**
     * Download invoice as PDF.
     */
    public function downloadInvoice($id)
    {
        $invoice = Invoice::with(['order.supplier', 'order.items'])->find($id);

        if (! $invoice || $invoice->order->customer_id !== auth()->id()) {
            return response()->json(['message' => 'Invoice not found.'], 404);
        }

        $pdf = Pdf::loadView('pdf.invoice', compact('invoice'));

        return $pdf->download('Invoice-'.$invoice->invoice_number.'.pdf');
    }

    /**
     * Get Stripe Checkout URL for an invoice.
     */
    public function payInvoice($id)
    {
        $invoice = Invoice::with('order')->find($id);

        if (! $invoice || $invoice->order->customer_id !== auth()->id()) {
            return $this->sendError('Invoice not found.', [], 404);
        }

        if ($invoice->status === 'paid') {
            return $this->sendError('Invoice is already paid.', [], 422);
        }

        try {
            $session = $this->paymentService->createCheckoutSession($invoice);

            return $this->sendResponse(['checkout_url' => $session->url], 'Checkout URL generated.');

        } catch (\Exception $e) {
            return $this->sendError('Failed to create payment session.', ['error' => $e->getMessage()], 500);
        }
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
