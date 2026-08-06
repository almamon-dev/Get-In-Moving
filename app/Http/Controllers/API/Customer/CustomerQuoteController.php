<?php

namespace App\Http\Controllers\API\Customer;

use App\Exports\QuoteItemsTemplateExport;
use App\Http\Controllers\Controller;
use App\Http\Requests\API\Customer\CreateQuoteRequest;
use App\Http\Resources\API\Customer\QuoteDetailResource;
use App\Http\Resources\API\Customer\QuoteRequestResource;
use App\Http\Resources\API\Customer\QuoteResource;
use App\Imports\QuoteRequestItemsImport;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Quote;
use App\Models\QuoteRequest;
use App\Models\QuoteRequestItem;
use App\Notifications\NewQuoteRequestAvailableNotification;
use App\Notifications\QuoteAcceptedNotification;
use App\Notifications\QuoteRejectedNotification;
use App\Services\AiExtractionService;
use App\Traits\ApiResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class CustomerQuoteController extends Controller
{
    use ApiResponse;

    protected $aiService;

    public function __construct(AiExtractionService $aiService)
    {
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
                'pickup_address' => $request->pickup_address,
                'pickup_country' => $request->pickup_country,
                'pickup_state' => $request->pickup_state,
                'pickup_city' => $request->pickup_city,
                'pickup_zip' => $request->pickup_zip,
                'delivery_address' => $request->delivery_address,
                'delivery_country' => $request->delivery_country,
                'delivery_state' => $request->delivery_state,
                'delivery_city' => $request->delivery_city,
                'delivery_zip' => $request->delivery_zip,
                'pickup_date' => $request->pickup_date,
                'delivery_date' => $request->delivery_date,
                'pickup_time_from' => $request->pickup_time_from,
                'pickup_time_till' => $request->pickup_time_till,
                'delivery_time_from' => $request->delivery_time_from,
                'delivery_time_till' => $request->delivery_time_till,
                'additional_notes' => $request->additional_notes,
                'status' => 'active',
            ]);

            // Handle items from array
            if ($request->has('items') && is_array($request->items)) {
                foreach ($request->items as $item) {
                    QuoteRequestItem::create([
                        'quote_request_id' => $quoteRequest->id,
                        'item_type' => $item['item_type'] ?? $request->pallet_type ?? $request->service_type ?? 'Euro pallets',
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

                $path = \App\Helpers\Helper::uploadFile('quote_attachments', $file);
                $quoteRequest->update(['attachment_path' => '/'.$path]);

                if (in_array(strtolower($extension), ['csv', 'xlsx', 'xls'])) {
                    Log::info('Starting Excel import for QuoteRequest: '.$quoteRequest->id);
                    Excel::import(new QuoteRequestItemsImport($quoteRequest->id), $file);
                } else {
                    Log::warning('Uploaded file is not a supported spreadsheet format.', ['extension' => $extension]);
                }
            }

            DB::commit();

            // Direct Notification to Suppliers
            $this->notifySuppliersForQuoteRequest($quoteRequest);

            return $this->sendResponse(new QuoteRequestResource($quoteRequest->load('items')), 'Quote request created successfully.', null, 201);

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
     * Get a quote request for editing.
     */
    public function editQuoteRequest($id)
    {
        $quoteRequest = QuoteRequest::with('items')->where('user_id', auth()->id())->find($id);

        if (!$quoteRequest) {
            return $this->sendError('Quote request not found.', [], 404);
        }

        return $this->sendResponse($quoteRequest, 'Quote request retrieved for editing.');
    }

    /**
     * Update an existing quote request.
     */
    public function updateQuoteRequest(CreateQuoteRequest $request, $id)
    {
        Log::info('Entering updateQuoteRequest.', [
            'id' => $id,
            'input_keys' => array_keys($request->all()),
        ]);

        $quoteRequest = QuoteRequest::where('user_id', $request->user()->id)->find($id);

        if (!$quoteRequest) {
            return $this->sendError('Quote request not found.', [], 404);
        }

        DB::beginTransaction();
        try {
            $quoteRequest->update([
                'pickup_address' => $request->pickup_address,
                'delivery_address' => $request->delivery_address,
                'pickup_date' => $request->pickup_date,
                'delivery_date' => $request->delivery_date,
                'pickup_time_from' => $request->pickup_time_from,
                'pickup_time_till' => $request->pickup_time_till,
                'delivery_time_from' => $request->delivery_time_from,
                'delivery_time_till' => $request->delivery_time_till,
                'additional_notes' => $request->additional_notes,
            ]);

            // Handle items from array
            if ($request->has('items') && is_array($request->items)) {
                $quoteRequest->items()->delete();
                foreach ($request->items as $item) {
                    QuoteRequestItem::create([
                        'quote_request_id' => $quoteRequest->id,
                        'item_type' => $item['item_type'] ?? $request->pallet_type ?? $request->service_type ?? 'Euro pallets',
                        'quantity' => $item['quantity'],
                        'length' => $item['length'] ?? null,
                        'width' => $item['width'] ?? null,
                        'height' => $item['height'] ?? null,
                        'weight' => $item['weight'] ?? null,
                    ]);
                }
            }

            DB::commit();
            return $this->sendResponse(new QuoteRequestResource($quoteRequest->load('items')), 'Quote request updated successfully.', null, 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in updateQuoteRequest: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return $this->sendError('Failed to update quote request.', ['error' => $e->getMessage()], 500);
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

            $path = \App\Helpers\Helper::uploadFile('quote_attachments', $file);
            $attachmentPath = '/'.$path;

            $import = new QuoteRequestItemsImport(null, auth()->id(), $attachmentPath);
            Excel::import($import, public_path($path));
            DB::commit();

            foreach ($import->getCreatedRequests() as $createdRequest) {
                $this->notifySuppliersForQuoteRequest($createdRequest);
            }

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
        $quoteRequest = new QuoteRequest;
        $quoteRequest->id = 'TEMPLATE';
        $quoteRequest->pallet_type = 'Euro pallets (or custom)';
        $quoteRequest->pickup_address = 'e.g. 123 Main St, New York, NY';
        $quoteRequest->delivery_address = 'e.g. 456 Market St, Boston, MA';
        $quoteRequest->pickup_date = 'YYYY-MM-DD';
        $quoteRequest->pickup_time_from = '09:00:00';
        $quoteRequest->pickup_time_till = '17:00:00';
        $quoteRequest->delivery_date = 'YYYY-MM-DD';
        $quoteRequest->delivery_time_from = '09:00:00';
        $quoteRequest->delivery_time_till = '17:00:00';

        $user = new \stdClass;
        $user->name = '[Customer Name]';
        $quoteRequest->setRelation('user', $user);

        $item1 = new QuoteRequestItem([
            'item_type' => 'Euro pallets',
            'quantity' => 1,
            'length' => 120,
            'width' => 80,
            'height' => 100,
            'weight' => 100,
        ]);
        $quoteRequest->setRelation('items', collect([$item1]));

        $pdf = Pdf::loadView('pdf.quote_request', compact('quoteRequest'));

        return $pdf->download('QuoteRequest-Template.pdf');
    }

    /**
     * Download Quote Request Items Template Excel (.xlsx).
     */
    public function downloadTemplate()
    {
        return Excel::download(new QuoteItemsTemplateExport, '', \Maatwebsite\Excel\Excel::XLSX);
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

    public function deleteQuoteRequest(Request $request, $id)
    {
        $quoteRequest = QuoteRequest::where('user_id', $request->user()->id)->find($id);

        if (!$quoteRequest) {
            return $this->sendError('Quote request not found.', [], 404);
        }

        $quoteRequest->delete();

        return $this->sendResponse([], 'Quote request deleted successfully.');
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

        $quotes = Quote::with(['supplier', 'extraCharges'])
            ->where('quote_request_id', $id)
            ->latest()
            ->get();

        return $this->sendResponse([
            'quote_details' => new QuoteDetailResource($quoteRequest),
            'quotes_request' => QuoteResource::collection($quotes),
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
            <p>Date: 2026-03-27</p>
            <p>Time: 09:00:00 to 17:00:00</p>
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
    public function acceptQuote($id, Request $request)
    {
        $quote = Quote::with('quoteRequest')->find($id);

        if (! $quote || $quote->quoteRequest->user_id !== auth()->id()) {
            return $this->sendError('Quote not found.', [], 404);
        }

        if ($quote->quoteRequest->status !== 'active') {
            return $this->sendError('This request is no longer active and already has an accepted quote.', [], 422);
        }

        $user = auth()->user();
        $paymentMethod = $request->input('payment_method', 'pay_later');

        $systemChargePercent = (float) env('SYSTEM_CHARGE', 10);
        $halfChargePercent = $systemChargePercent / 2;
        $customerAddon = $quote->amount * ($halfChargePercent / 100);
        $supplierFee = $quote->amount * ($halfChargePercent / 100);
        $totalOrderAmount = $quote->amount + $customerAddon;

        if ($paymentMethod === 'pay_later') {
            if ($user->pay_later_status !== 'approved' && $user->pay_later_status !== 'Approved') {
                return $this->sendError('Your account is not approved for the Pay Later facility. Please apply for credit or pay upfront.', [], 422);
            }

            $hasCard = (bool) ($user->pay_later_pm_id || $user->pay_later_pm_last_four || $user->credit_card_last_four);
            if (! $hasCard) {
                return $this->sendError('A valid credit card must be saved before using the Pay Later facility.', [], 422);
            }

            $availableCredit = $user->pay_later_available_credit;
            if ($totalOrderAmount > $availableCredit) {
                return $this->sendError(
                    sprintf(
                        'Insufficient available credit. Your available credit is €%s, but the total order amount is €%s. Please settle your balance or choose Pay Now.',
                        number_format($availableCredit, 2),
                        number_format($totalOrderAmount, 2)
                    ),
                    [],
                    422
                );
            }
        }

        DB::beginTransaction();
        try {
            if ($quote->revision_status === 'pending') {
                $quote->update([
                    'amount' => $quote->revised_amount,
                    'estimated_time' => $quote->revised_estimated_time,
                    'revised_amount' => null,
                    'revised_estimated_time' => null,
                    'revision_status' => 'accepted',
                    'status' => 'accepted',
                ]);
            } else {
                $quote->update(['status' => 'accepted']);
            }

            $rejectedQuotes = Quote::where('quote_request_id', $quote->quote_request_id)
                ->where('id', '!=', $id)
                ->get();

            foreach ($rejectedQuotes as $rejected) {
                $rejected->update(['status' => 'rejected']);
                if ($rejected->user) {
                    $rejected->user->notify(new QuoteRejectedNotification($rejected));
                }
            }

            $quote->quoteRequest->update(['status' => 'completed']);

            $isPayNow = ($paymentMethod === 'pay_now');

            $order = Order::create([
                'order_number' => 'ORD-'.strtoupper(Str::random(4)).'-'.(Order::count() + 10001),
                'quote_id' => $quote->id,
                'customer_id' => $quote->quoteRequest->user_id,
                'supplier_id' => $quote->user_id,
                'total_amount' => $totalOrderAmount,
                'payment_method' => $paymentMethod,
                'payment_status' => $isPayNow ? 'paid' : 'unpaid',
                'reserved_credit_amount' => $isPayNow ? 0.00 : $totalOrderAmount,
                'pallet_type' => $quote->quoteRequest->getPalletType(),
                'pickup_address' => $quote->quoteRequest->pickup_address,
                'delivery_address' => $quote->quoteRequest->delivery_address,
                'pickup_date' => $quote->quoteRequest->pickup_date,
                'estimated_time' => $quote->estimated_time,
                'status' => 'confirmed',
            ]);

            $supplierName = $order->supplier?->company_name ?? $order->supplier?->name ?? 'Supplier';
            $order->updates()->create([
                'status' => 'confirmed',
                'title' => 'Order Confirmed',
                'description' => $isPayNow 
                    ? "Order confirmed & paid upfront. Assigned to {$supplierName}."
                    : "Order confirmed via Pay Later credit line. Total €" . number_format($totalOrderAmount, 2) . " reserved.",
            ]);

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

            $invoice = Invoice::create([
                'order_id' => $order->id,
                'invoice_number' => 'INV-'.(Invoice::count() + 202545),
                'supplier_amount' => $quote->amount,
                'platform_fee' => $customerAddon,
                'supplier_fee' => $supplierFee,
                'total_amount' => $totalOrderAmount,
                'status' => $isPayNow ? 'paid' : 'due',
                'paid_at' => $isPayNow ? now() : null,
                'due_date' => now()->addDays((int) env('PAY_LATER_DAYS', 30)),
            ]);

            if ($isPayNow) {
                $payment = Payment::create([
                    'invoice_id' => $invoice->id,
                    'user_id' => $user->id,
                    'transaction_id' => 'PAYNOW_' . uniqid(),
                    'amount' => $totalOrderAmount,
                    'currency' => 'EUR',
                    'status' => 'succeeded',
                    'payment_type' => 'order',
                    'payment_method' => 'stripe',
                    'available_at' => now()->addMinutes((int) env('FUND_HOLD_MINUTES', 5)),
                ]);

                if ($order->supplier_id) {
                    \App\Models\SupplierTransaction::create([
                        'supplier_id' => $order->supplier_id,
                        'order_id' => $order->id,
                        'amount' => $quote->amount,
                        'type' => 'earning',
                        'status' => 'pending',
                        'available_at' => $payment->available_at,
                        'description' => "Earnings held in escrow for Order #{$order->order_number}",
                    ]);
                }
            } else {
                $facility = \App\Models\PayLaterFacility::firstOrCreate(['user_id' => $user->id]);
                \App\Models\PayLaterTransaction::create([
                    'user_id' => $user->id,
                    'pay_later_facility_id' => $facility->id,
                    'invoice_id' => $invoice->id,
                    'order_id' => $order->id,
                    'type' => 'deduction',
                    'amount' => $totalOrderAmount,
                    'available_credit_after' => max(0, $user->pay_later_available_credit),
                    'description' => "Credit reserved for Order #{$order->order_number} (Invoice #{$invoice->invoice_number})",
                ]);
            }

            DB::commit();

            if ($quote->user) {
                try {
                    $quote->user->notify(new QuoteAcceptedNotification($quote));
                } catch (\Exception $e) {
                    Log::error('Failed to notify supplier of accepted quote: '.$e->getMessage());
                }
            }

            return $this->sendResponse([
                'quote' => new QuoteResource($quote),
                'order' => $order,
                'invoice' => $invoice,
            ], 'Quote accepted and order created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Failed to accept quote.', ['error' => $e->getMessage()], 500);
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
            $path = \App\Helpers\Helper::uploadFile('quote_attachments', $file);
            $attachmentPath = '/'.$path;

            $extractedRows = $this->aiService->extractFromPdf(public_path($path), $file->getClientOriginalName());

            if (! is_array($extractedRows) || empty($extractedRows)) {
                Log::warning('AI extraction returned no data or invalid format.', ['result' => $extractedRows]);

                return $this->sendError('Failed to extract data from PDF. Please ensure the PDF is clear and contains shipping details.', [], 422);
            }

            $createdRequests = [];

            foreach ($extractedRows as $row) {
                $groupKey = md5(($row['pickup_address'] ?? '').($row['delivery_address'] ?? '').($row['pickup_date'] ?? '').($row['delivery_date'] ?? ''));

                if (! isset($createdRequests[$groupKey])) {
                    $quoteRequest = QuoteRequest::create([
                        'user_id' => auth()->id(),
                        'pickup_address' => $row['pickup_address'] ?? null,
                        'delivery_address' => $row['delivery_address'] ?? null,
                        'pickup_date' => $row['pickup_date'] ?? null,
                        'delivery_date' => $row['delivery_date'] ?? null,
                        'pickup_time_from' => $row['pickup_time_from'] ?? null,
                        'pickup_time_till' => $row['pickup_time_till'] ?? null,
                        'delivery_time_from' => $row['delivery_time_from'] ?? null,
                        'delivery_time_till' => $row['delivery_time_till'] ?? null,
                        'additional_notes' => $row['additional_notes'] ?? null,
                        'attachment_path' => $attachmentPath,
                        'status' => 'active',
                    ]);
                    $createdRequests[$groupKey] = $quoteRequest;
                }

                QuoteRequestItem::create([
                    'quote_request_id' => $createdRequests[$groupKey]->id,
                    'item_type' => $row['item_type'] ?? $row['pallet_type'] ?? 'Euro pallets',
                    'quantity' => $row['quantity'] ?? 1,
                    'length' => $row['length_cm'] ?? null,
                    'width' => $row['width_cm'] ?? null,
                    'height' => $row['height_cm'] ?? null,
                    'weight' => $row['weight_kg'] ?? null,
                ]);
            }

            DB::commit();

            foreach ($createdRequests as $createdRequest) {
                $this->notifySuppliersForQuoteRequest($createdRequest);
            }

            return $this->sendResponse([], 'Successfully extracted quote requests.');

        } catch (\Exception $e) {
            DB::rollBack();
            $message = $e->getMessage();
            Log::error('Error in uploadPdf: '.$message);

            $lowerMsg = strtolower($message);

            if (str_contains($lowerMsg, 'incorrect api key') || str_contains($lowerMsg, 'invalid_api_key') || str_contains($lowerMsg, 'api key not configured')) {
                return $this->sendError('Invalid or missing OpenAI API key. Please configure a valid OpenAI API key in your server environment settings.', [], 422);
            }

            if (str_contains($lowerMsg, 'quota') || str_contains($lowerMsg, 'billing') || str_contains($lowerMsg, 'insufficient_quota')) {
                return $this->sendError('AI search quota exceeded. Please check your OpenAI billing or plan limits.', [], 422);
            }

            return $this->sendError('Failed to process PDF: '.$message, [], 422);
        }
    }

    /**
     * Send direct notifications to matching suppliers for a quote request.
     */
    protected function notifySuppliersForQuoteRequest(QuoteRequest $quoteRequest)
    {
        try {
            $allSuppliers = \App\Models\User::where('user_type', 'supplier')
                ->where('status', 'active')
                ->get();

            $suppliers = $allSuppliers->filter(function($supplier) use ($quoteRequest) {
                $pickup = strtolower($quoteRequest->pickup_address ?? '');
                $delivery = strtolower($quoteRequest->delivery_address ?? '');
                
                $matchesCity = !empty($supplier->city) && (str_contains($pickup, strtolower($supplier->city)) || str_contains($delivery, strtolower($supplier->city)));
                $matchesZip = !empty($supplier->zip_code) && (str_contains($pickup, strtolower($supplier->zip_code)) || str_contains($delivery, strtolower($supplier->zip_code)));
                $matchesCountry = !empty($supplier->country) && (str_contains($pickup, strtolower($supplier->country)) || str_contains($delivery, strtolower($supplier->country)));
                
                return $matchesCity || $matchesZip || $matchesCountry;
            });

            if ($suppliers->isNotEmpty()) {
                Notification::send($suppliers, new NewQuoteRequestAvailableNotification($quoteRequest->load('user')));
                Log::info('Notifications sent to ' . $suppliers->count() . ' matched suppliers for QuoteRequest: ' . $quoteRequest->id);
            }
        } catch (\Exception $notifyEx) {
            Log::error('Failed to send supplier notifications: ' . $notifyEx->getMessage());
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

        if ($quote->quoteRequest->status !== 'active') {
            return $this->sendError('This request is no longer active and already has an accepted quote.', [], 422);
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

            $rejectedQuotes = Quote::where('quote_request_id', $quote->quote_request_id)
                ->where('id', '!=', $id)
                ->get();

            foreach ($rejectedQuotes as $rejected) {
                $rejected->update(['status' => 'rejected']);
                if ($rejected->user) {
                    $rejected->user->notify(new QuoteRejectedNotification($rejected));
                }
            }

            $quote->quoteRequest->update(['status' => 'completed']);

            $order = Order::create([
                'order_number' => 'ORD-'.strtoupper(Str::random(4)).'-'.(Order::count() + 10001),
                'quote_id' => $quote->id,
                'customer_id' => $quote->quoteRequest->user_id,
                'supplier_id' => $quote->user_id,
                'total_amount' => $quote->amount + ($quote->amount * ((env('SYSTEM_CHARGE', 10) / 2) / 100)),
                'pallet_type' => $quote->quoteRequest->getPalletType(),
                'pickup_address' => $quote->quoteRequest->pickup_address,
                'delivery_address' => $quote->quoteRequest->delivery_address,
                'pickup_date' => $quote->quoteRequest->pickup_date,
                'estimated_time' => $quote->estimated_time,
                'status' => 'confirmed',
            ]);

            $supplierName = $order->supplier?->company_name ?? $order->supplier?->name ?? 'Supplier';
            $order->updates()->create([
                'status' => 'confirmed',
                'title' => 'Order Confirmed',
                'description' => "Your order has been confirmed by {$supplierName}.",
            ]);

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

            $systemChargePercent = (float) env('SYSTEM_CHARGE', 10);
            $halfChargePercent = $systemChargePercent / 2;
            $customerAddon = $quote->amount * ($halfChargePercent / 100);
            $supplierFee = $quote->amount * ($halfChargePercent / 100);

            Invoice::create([
                'order_id' => $order->id,
                'invoice_number' => 'INV-'.(Invoice::count() + 202545),
                'supplier_amount' => $quote->amount,
                'platform_fee' => $customerAddon,
                'supplier_fee' => $supplierFee,
                'total_amount' => $quote->amount + $customerAddon,
                'status' => 'due',
                'due_date' => now()->addDays((int) env('PAY_LATER_DAYS', 30)),
            ]);

            DB::commit();

            if ($quote->user) {
                $quote->user->notify(new QuoteAcceptedNotification($quote));
            }

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

        $rejectedAmount = $quote->revised_amount;

        $quote->update([
            'revised_amount' => null,
            'revised_estimated_time' => null,
            'revision_status' => 'rejected',
        ]);
        if ($quote->user) {
            try {
                $quote->user->notify(new QuoteRejectedNotification($quote, true));
            } catch (\Exception $e) {
                Log::error('Failed to notify supplier of rejected revision: '.$e->getMessage());
            }
        }

        if ($rejectedAmount) {
            \App\Models\Message::create([
                'sender_id' => auth()->id(),
                'receiver_id' => $quote->user_id,
                'quote_id' => $quote->id,
                'message' => "❌ I have declined your revised offer of €" . number_format($rejectedAmount, 0) . ". Let's stick to the original quote or propose a new one.",
            ]);
        }

        return $this->sendResponse(new QuoteResource($quote), 'Revised offer rejected.');
    }
}
