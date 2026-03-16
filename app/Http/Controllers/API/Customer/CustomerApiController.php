<?php

namespace App\Http\Controllers\API\Customer;

use App\Exports\QuoteItemsTemplateExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\CreateQuoteRequest;
use App\Http\Resources\API\Customer\InvoiceResource;
use App\Http\Resources\API\Customer\NotificationResource;
use App\Http\Resources\API\Customer\OrderResource;
use App\Http\Resources\API\Customer\QuoteRequestResource;
use App\Imports\QuoteRequestItemsImport;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Quote;
use App\Models\QuoteRequest;
use App\Models\QuoteRequestItem;
use App\Models\Review;
use App\Services\AiExtractionService;
use App\Services\InvoicePaymentService;
use App\Traits\ApiResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class CustomerApiController extends Controller
{
    use ApiResponse;

    protected $paymentService;

    protected $aiService;

    public function __construct(InvoicePaymentService $paymentService, AiExtractionService $aiService)
    {
        $this->paymentService = $paymentService;
        $this->aiService = $aiService;
    }

    /**
     * Create a new quote request.
     */
    public function createQuoteRequest(CreateQuoteRequest $request)
    {
        Log::info('Entering createQuoteRequest.', [
            'has_file' => $request->hasFile('file'),
            'file_keys' => array_keys($request->allFiles()),
            'input_keys' => array_keys($request->all()),
        ]);

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

            // Handle items from array
            if ($request->has('items') && is_array($request->items)) {
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
            }

            // Handle File Upload
            if ($request->hasFile('file')) {
                $file = $request->file('file');
                $extension = $file->getClientOriginalExtension();
                Log::info('File upload detected in createQuoteRequest.', ['extension' => $extension, 'name' => $file->getClientOriginalName()]);

                $path = $file->store('quote_attachments', 'public');
                $quoteRequest->update(['attachment_path' => '/storage/'.$path]);

                if (in_array(strtolower($extension), ['csv', 'xlsx', 'xls'])) {
                    Log::info('Starting Excel import for QuoteRequest: '.$quoteRequest->id);
                    Excel::import(new QuoteRequestItemsImport($quoteRequest->id), $file);
                } else {
                    Log::warning('Uploaded file is not a supported spreadsheet format.', ['extension' => $extension]);
                }
            }

            DB::commit();

            return $this->sendResponse(new \App\Http\Resources\API\Customer\QuoteRequestResource($quoteRequest->load('items')), 'Quote request created successfully.', null, 201);

        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            DB::rollBack();
            Log::error('Excel Validation failed: ', ['failures' => $e->failures()]);

            return $this->sendError('Validation failed for some rows.', ['row_errors' => $e->failures()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in createQuoteRequest: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return $this->sendError('Failed to create quote request.', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Import Quote Request from CSV/Excel (Bulk Import).
     */
    public function importQuoteRequest(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:csv,txt,xlsx,xls|max:10240',
        ]);

        DB::beginTransaction();

        try {
            $file = $request->file('file');
            Log::info('Starting Bulk importQuoteRequest for user: '.auth()->id(), ['filename' => $file->getClientOriginalName()]);

            // Store the file and generate a link for reference in all created items
            $path = $file->store('quote_attachments', 'public');
            $attachmentPath = '/storage/'.$path;

            // Execute the Import logic (Passing null for quoteRequestId triggers new parent creation per row)
            Excel::import(new QuoteRequestItemsImport(null, auth()->id(), $attachmentPath), $file);
            // mamon
            DB::commit();

            return $this->sendResponse([], 'Bulk Import successful. All requests have been created.');

        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            DB::rollBack();
            Log::error('Bulk Excel Validation failed: ', ['failures' => $e->failures()]);

            return $this->sendError('Validation failed for some rows.', ['row_errors' => $e->failures()], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in importQuoteRequest: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);

            return $this->sendError('Failed to import: '.$e->getMessage(), [], 500);
        }
    }

    /**
     * Get a temporary signed download link for the template.
     */
    public function getTemplateLink()
    {
        $url = URL::temporarySignedRoute(
            'api.customer.template.download',
            now()->addHours(24)
        );

        return $this->sendResponse(['download_url' => $url], 'Download link generated.');
    }

    /**
     * Get a temporary signed download link for the PDF template.
     */
    public function getPdfTemplateLink()
    {
        $url = URL::temporarySignedRoute(
            'api.customer.quote-requests.pdf.template',
            now()->addHours(24)
        );

        return $this->sendResponse(['download_url' => $url], 'PDF template link generated.');
    }

    /**
     * Download a blank PDF Template for Quote Requests.
     */
    public function downloadPdfTemplate()
    {
        // Creating a blank request for the template view
        $quoteRequest = new QuoteRequest;
        $quoteRequest->id = '____';
        $quoteRequest->service_type = '________________';
        $quoteRequest->pickup_address = '________________';
        $quoteRequest->delivery_address = '________________';
        $quoteRequest->pickup_date = '________________';
        $quoteRequest->pickup_time_from = '________________';
        $quoteRequest->pickup_time_till = '________________';

        $user = new \stdClass;
        $user->name = '________________';
        $quoteRequest->setRelation('user', $user);

        $pdf = Pdf::loadView('pdf.quote_request', compact('quoteRequest'));

        return $pdf->download('QuoteRequest-Template.pdf');
    }

    /**
     * Download Quote Request Items Template Excel (.xlsx).
     */
    public function downloadTemplate()
    {
        return Excel::download(new QuoteItemsTemplateExport, 'quote_items_template.xlsx', \Maatwebsite\Excel\Excel::XLSX);
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

        $quotes = Quote::with('supplier')
            ->where('quote_request_id', $id)
            ->latest()
            ->get();

        return $this->sendResponse([
            'quote_details' => new \App\Http\Resources\API\Customer\QuoteDetailResource($quoteRequest),
            'quotes_request' => \App\Http\Resources\API\Customer\QuoteResource::collection($quotes),
        ], 'Quotes retrieved for this request.');
    }

    /**
     * Get a link to download the sample PDF for AI testing.
     */
    public function getSamplePdfLink()
    {
        $url = URL::temporarySignedRoute(
            'api.customer.sample-pdf.generate',
            now()->addMinutes(60)
        );

        return $this->sendResponse(['url' => $url], 'Sample PDF link generated.');
    }

    /**
     * Generate the actual sample PDF.
     */
    public function generateSamplePdf()
    {
        $html = "
        <div style='font-family: sans-serif; padding: 20px;'>
            <h1>Shipping Request Order</h1>
            <p><strong>Order ID:</strong> ORD-TEST-999</p>
            <p><strong>Service Type:</strong> Full Truckload</p>
            <hr>
            <h3>Pickup Details</h3>
            <p>Address: 123 Logistics Way, Brooklyn, NY 11201</p>
            <p>Date: 2026-03-25</p>
            <p>Time: 09:00:00 to 17:00:00</p>
            <hr>
            <h3>Delivery Details</h3>
            <p>Address: 456 Delivery Ave, Los Angeles, CA 90001</p>
            <hr>
            <h3>Items to Ship</h3>
            <table border='1' width='100%' cellpadding='5' style='border-collapse: collapse;'>
                <thead>
                    <tr>
                        <th>Item Type</th>
                        <th>Qty</th>
                        <th>Dimentions (LxWxH) cm</th>
                        <th>Weight (kg)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Euro Pallets</td>
                        <td>5</td>
                        <td>120 x 80 x 100</td>
                        <td>500</td>
                    </tr>
                    <tr>
                        <td>Cardboard Boxes</td>
                        <td>10</td>
                        <td>40 x 40 x 40</td>
                        <td>100</td>
                    </tr>
                    <tr>
                        <td>Wooden Crates</td>
                        <td>2</td>
                        <td>150 x 100 x 50</td>
                        <td>400</td>
                    </tr>
                    <tr>
                        <td>Plastic Drums</td>
                        <td>4</td>
                        <td>60 x 60 x 90</td>
                        <td>360</td>
                    </tr>
                    <tr>
                        <td>Metal Tubes</td>
                        <td>20</td>
                        <td>200 x 10 x 10</td>
                        <td>200</td>
                    </tr>
                </tbody>
            </table>
            <p><strong>Notes:</strong> Handle with care. Requires liftgate for delivery.</p>
        </div>
        ";

        $pdf = Pdf::loadHTML($html);

        return $pdf->download('sample-shipping-request.pdf');
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

            $rejectedQuotes = Quote::where('quote_request_id', $quote->quote_request_id)
                ->where('id', '!=', $id)
                ->get();

            foreach ($rejectedQuotes as $rejected) {
                $rejected->update(['status' => 'rejected']);
                if ($rejected->user) {
                    $rejected->user->notify(new \App\Notifications\QuoteRejectedNotification($rejected));
                }
            }

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

            // Add to timeline
            $supplierName = $order->supplier?->company_name ?? $order->supplier?->name ?? 'Supplier';
            $order->updates()->create([
                'status' => 'confirmed',
                'title' => 'Order Confirmed',
                'description' => "Your order has been confirmed by {$supplierName}.",
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
                'platform_fee' => 0,
                'total_amount' => $quote->amount,
                'status' => 'due',
                'due_date' => now()->addDays(30),
            ]);

            DB::commit();
            // Notify the supplier that their quote was accepted
            if ($quote->user) {
                $quote->user->notify(new \App\Notifications\QuoteAcceptedNotification($quote));
            }

            return $this->sendResponse(new \App\Http\Resources\API\Customer\QuoteResource($quote), 'Quote accepted and order created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();

            return $this->sendError('Failed to import data.', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Upload PDF and extract Quote Requests using AI (OpenAI).
     */
    public function uploadPdf(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf|max:10240',
        ]);

        DB::beginTransaction();
        try {
            $file = $request->file('file');
            $path = $file->store('quote_attachments', 'public');
            $attachmentPath = '/storage/'.$path;

            // Extract data using AI
            $extractedRows = $this->aiService->extractFromPdf($file->getRealPath(), $file->getClientOriginalName());

            $createdRequests = [];

            foreach ($extractedRows as $row) {
                // Generate a key to group items by pickup/delivery address
                $groupKey = md5(($row['pickup_address'] ?? '').($row['delivery_address'] ?? '').($row['pickup_date'] ?? ''));

                if (! isset($createdRequests[$groupKey])) {
                    // Create Parent only if it doesn't exist for this address group
                    $quoteRequest = QuoteRequest::create([
                        'user_id' => auth()->id(),
                        'service_type' => $row['service_type'] ?? 'General',
                        'pickup_address' => $row['pickup_address'] ?? 'N/A',
                        'delivery_address' => $row['delivery_address'] ?? 'N/A',
                        'pickup_date' => $row['pickup_date'] ?? null,
                        'pickup_time_from' => $row['pickup_time_from'] ?? null,
                        'pickup_time_till' => $row['pickup_time_till'] ?? null,
                        'additional_notes' => $row['additional_notes'] ?? null,
                        'attachment_path' => $attachmentPath,
                        'status' => 'active',
                    ]);
                    $createdRequests[$groupKey] = $quoteRequest;
                }

                // Create Item under the parent
                QuoteRequestItem::create([
                    'quote_request_id' => $createdRequests[$groupKey]->id,
                    'item_type' => $row['item_type'] ?? 'Item',
                    'quantity' => $row['quantity'] ?? 1,
                    'length' => $row['length_cm'] ?? null,
                    'width' => $row['width_cm'] ?? null,
                    'height' => $row['height_cm'] ?? null,
                    'weight' => $row['weight_kg'] ?? null,
                ]);
            }

            DB::commit();

            return $this->sendResponse([], 'Successfully extracted quote requests.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in uploadPdf: '.$e->getMessage());

            return $this->sendError('Failed to process PDF.', ['error' => $e->getMessage()], 500);
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
            $rejectedQuotes = Quote::where('quote_request_id', $quote->quote_request_id)
                ->where('id', '!=', $id)
                ->get();

            foreach ($rejectedQuotes as $rejected) {
                $rejected->update(['status' => 'rejected']);
                if ($rejected->user) {
                    $rejected->user->notify(new \App\Notifications\QuoteRejectedNotification($rejected));
                }
            }

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

            // Add to timeline
            $supplierName = $order->supplier?->company_name ?? $order->supplier?->name ?? 'Supplier';
            $order->updates()->create([
                'status' => 'confirmed',
                'title' => 'Order Confirmed',
                'description' => "Your order has been confirmed by {$supplierName}.",
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
                'platform_fee' => 0,
                'total_amount' => $quote->amount,
                'status' => 'due',
                'due_date' => now()->addDays(30),
            ]);

            DB::commit();

            // Notify the supplier that their revised quote was accepted
            if ($quote->user) {
                $quote->user->notify(new \App\Notifications\QuoteAcceptedNotification($quote));
            }

            return $this->sendResponse(new \App\Http\Resources\API\Customer\QuoteResource($quote), 'Revised offer accepted and order created successfully.');

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

        if ($quote->user) {
            $quote->user->notify(new \App\Notifications\QuoteRejectedNotification($quote, true));
        }

        return $this->sendResponse(new \App\Http\Resources\API\Customer\QuoteResource($quote), 'Revised offer rejected.');
    }

    /**
     * Get list of orders for the customer.
     */
    public function getMyOrders(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $orders = Order::with(['supplier', 'review', 'updates'])
            ->where('customer_id', $request->user()->id)
            ->latest()
            ->paginate($perPage);

        $orders->setCollection(OrderResource::collection($orders->getCollection())->collection);

        return $this->sendResponse($orders, 'Your orders retrieved.');
    }

    /**
     * Get dashboard overview for the customer.
     */
    public function getDashboardOverview()
    {
        $user = auth()->user();

        // 1. Stats
        $totalQuotes = Quote::whereHas('quoteRequest', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->count();

        $activeQuotesCount = QuoteRequest::where('user_id', $user->id)
            ->where('status', 'active')
            ->whereHas('quotes')
            ->count();

        $activeOrdersCount = Order::where('customer_id', $user->id)
            ->whereIn('status', ['confirmed', 'in_progress', 'picked_up', 'delivered'])
            ->count();

        $completedOrdersCount = Order::where('customer_id', $user->id)
            ->where('status', 'completed')
            ->count();

        $pendingActions = $user->unreadNotifications()->count();

        // 2. Active Orders (Latest 3)
        $activeOrders = Order::with(['supplier', 'updates'])
            ->where('customer_id', $user->id)
            ->whereIn('status', ['confirmed', 'in_progress', 'picked_up', 'delivered'])
            ->latest()
            ->limit(3)
            ->get();

        // 3. Active Quote Requests (Latest 3 that have quotes)
        $activeQuoteRequests = QuoteRequest::with(['quotes.supplier'])
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->whereHas('quotes')
            ->latest()
            ->limit(3)
            ->get();

        // 4. Recent Activity (Latest 5 Notifications)
        $recentActivity = $user->notifications()->latest()->limit(5)->get();

        return $this->sendResponse([
            'stats' => [
                'total_quotes' => $totalQuotes,
                'active_quotes' => $activeQuotesCount,
                'active_orders' => $activeOrdersCount,
                'completed_orders' => $completedOrdersCount,
                'pending_actions' => $pendingActions,
            ],
            'active_orders' => OrderResource::collection($activeOrders),
            'active_quotes' => QuoteRequestResource::collection($activeQuoteRequests),
            'recent_activity' => NotificationResource::collection($recentActivity),
        ], 'Dashboard overview retrieved successfully.');
    }

    /**
     * Get details of a specific order.
     */
    public function getOrderDetails($id)
    {
        $order = Order::with(['items', 'supplier', 'quote.quoteRequest', 'review', 'updates'])->find($id);

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
            'total_spent' => '$'.number_format((clone $statsQuery)->where('status', 'paid')->sum('total_amount')),
            'total_outstanding' => '$'.number_format((clone $statsQuery)->whereIn('status', ['due', 'overdue'])->sum('total_amount')),
            'total_invoices' => (clone $statsQuery)->count(),
            'invoices_due' => (clone $statsQuery)->where('status', 'due')->count(),
            'invoices_paid' => (clone $statsQuery)->where('status', 'paid')->count(),
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

        return $this->sendResponse($invoices, 'Your invoices retrieved.', [], 200, ['stats' => $stats]);
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

        return $this->sendResponse(new \App\Http\Resources\API\Customer\InvoiceDetailResource($invoice), 'Invoice details retrieved.');
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
            'phone' => $user->phone_number,
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
            'phone' => $user->phone_number,
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

    /**
     * Get paginated notifications for the customer.
     */
    public function getNotifications()
    {
        $notifications = auth()->user()->notifications()->latest()->get();

        return $this->sendResponse([
            'notifications' => NotificationResource::collection($notifications),
            'unread_count' => auth()->user()->unreadNotifications()->count(),
        ], 'Notifications retrieved successfully.');
    }

    /**
     * Mark a specific notification as read.
     */
    public function markNotificationRead($id)
    {
        $notification = auth()->user()->notifications()->find($id);

        if (! $notification) {
            return $this->sendError('Notification not found.', [], 404);
        }

        $notification->markAsRead();

        return $this->sendResponse([], 'Notification marked as read.');
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllNotificationsRead()
    {
        auth()->user()->unreadNotifications->markAsRead();

        return $this->sendResponse([], 'All notifications marked as read.');
    }

    /**
     * Download Proof of Delivery for an order.
     */
    public function downloadPod($id)
    {
        $order = Order::find($id);

        if (! $order || $order->customer_id !== auth()->id()) {
            return $this->sendError('Order not found.', [], 404);
        }

        if (! $order->proof_of_delivery) {
            return $this->sendError('Proof of Delivery not found.', [], 404);
        }

        $path = public_path($order->proof_of_delivery);

        if (! file_exists($path)) {
            return $this->sendError('File not found on server.', [], 404);
        }

        return response()->download($path);
    }

    /**
     * Approve Proof of Delivery.
     */
    public function approvePod($id)
    {
        $order = Order::find($id);

        if (! $order || $order->customer_id !== auth()->id()) {
            return $this->sendError('Order not found.', [], 404);
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($order) {
            $order->update([
                'status' => 'completed',
                'pod_status' => 'confirmed',
            ]);

            // Add to timeline
            $order->updates()->create([
                'status' => 'completed',
                'title' => 'Order Completed',
                'description' => 'The customer has approved the Proof of Delivery and the order is marked as completed.',
            ]);

            // No immediate fund release here anymore if it's already in escrow
            // The ReleaseSupplierFunds command will handle the pending earnings after 14 days
            $hasPendingTransaction = \App\Models\SupplierTransaction::where('order_id', $order->id)
                ->where('type', 'earning')
                ->where('status', 'pending')
                ->exists();

            if (!$hasPendingTransaction) {
                // If for some reason there was no pending transaction (e.g. manual payment), we handle it here or leave for admin
                 Log::info("POD approved for Order #{$order->order_number} but no pending transaction found.");
            }
        });

        return $this->sendResponse(new OrderResource($order), 'Proof of Delivery approved.');
    }

    /**
     * Raise an issue/Reject Proof of Delivery.
     */
    public function rejectPod(Request $request, $id)
    {
        $request->validate([
            'note' => 'nullable|string|max:1000',
        ]);

        $order = Order::find($id);

        if (! $order || $order->customer_id !== auth()->id()) {
            return $this->sendError('Order not found.', [], 404);
        }

        $order->update([
            'pod_status' => 'rejected',
            'status_note' => $request->note,
        ]);

        // Add to timeline
        $order->updates()->create([
            'status' => 'rejected',
            'title' => 'POD Rejected',
            'description' => $request->note ?? 'The customer has rejected the Proof of Delivery and requested a re-upload.',
        ]);

        return $this->sendResponse(new OrderResource($order), 'Issue raised and Proof of Delivery rejected.');
    }

    /**
     * Submit a review for a completed order.
     */
    public function submitReview(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $order = Order::with('review')->find($id);

        if (! $order || $order->customer_id !== auth()->id()) {
            return $this->sendError('Order not found.', [], 404);
        }

        if ($order->status !== 'completed' && $order->status !== 'delivered') {
            return $this->sendError('You can only review a delivered or completed order.', [], 422);
        }

        if ($order->review) {
            return $this->sendError('You have already reviewed this order.', [], 422);
        }

        $review = Review::create([
            'order_id' => $order->id,
            'customer_id' => auth()->id(),
            'supplier_id' => $order->supplier_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return $this->sendResponse($review, 'Thank you for your feedback! Your rating has been submitted.');
    }
}
