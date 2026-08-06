<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Customer\InvoiceDetailResource;
use App\Http\Resources\API\Customer\InvoiceResource;
use App\Models\Invoice;
use App\Models\Payment;
use App\Services\InvoicePaymentService;
use App\Traits\ApiResponse;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CustomerInvoiceController extends Controller
{
    use ApiResponse;

    protected $paymentService;

    public function __construct(InvoicePaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
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

        $statsQuery = Invoice::whereHas('order', function ($q) {
            $q->where('customer_id', auth()->id());
        });

        $stats = [
            'total_spent' => '€'.number_format((clone $statsQuery)->where('status', 'paid')->sum('total_amount')),
            'total_outstanding' => '€'.number_format((clone $statsQuery)->whereIn('status', ['due', 'overdue'])->sum('total_amount')),
            'total_invoices' => (clone $statsQuery)->count(),
            'invoices_due' => (clone $statsQuery)->where('status', 'due')->count(),
            'invoices_paid' => (clone $statsQuery)->where('status', 'paid')->count(),
        ];

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

        return $this->sendResponse(new InvoiceDetailResource($invoice), 'Invoice details retrieved.');
    }

    /**
     * Download invoice as PDF.
     */
    public function downloadInvoice($id)
    {
        $invoice = Invoice::with(['order.supplier', 'order.customer', 'order.items', 'order.quote.extraCharges'])->find($id);

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
            Log::error('payInvoice Error: '.$e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return $this->sendError('Failed to create payment session: '.$e->getMessage(), ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Pay an invoice using the Pay Later facility.
     */
    public function payInvoiceWithPayLater($id)
    {
        $user = auth()->user();
        
        if ($user->pay_later_status !== 'approved') {
            return $this->sendError('Your account is not approved for Pay Later.', [], 403);
        }

        if (!$user->pay_later_pm_id) {
            return $this->sendError('You must add a card for Pay Later before using this facility.', [], 422);
        }

        $invoice = Invoice::with('order')->find($id);

        if (! $invoice || $invoice->order->customer_id !== $user->id) {
            return $this->sendError('Invoice not found.', [], 404);
        }

        if ($invoice->status === 'paid') {
            return $this->sendError('Invoice is already paid.', [], 422);
        }

        if ((float)$invoice->total_amount > (float)$user->pay_later_available_credit) {
            return $this->sendError(
                sprintf(
                    'Insufficient Pay Later credit. Your available credit is €%s, but the invoice amount is €%s. Please settle existing balance first or pay upfront.',
                    number_format($user->pay_later_available_credit, 2),
                    number_format($invoice->total_amount, 2)
                ),
                [],
                422
            );
        }

        try {
            DB::beginTransaction();

            $invoice->update([
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            $payment = Payment::create([
                'invoice_id' => $invoice->id,
                'user_id' => $user->id,
                'transaction_id' => 'PAYLATER_' . uniqid(),
                'amount' => $invoice->total_amount,
                'currency' => 'EUR',
                'status' => 'succeeded',
                'payment_type' => 'order',
                'payment_method' => 'pay_later',
                'available_at' => now()->addMinutes((int) env('FUND_HOLD_MINUTES', 5)),
                'metadata' => [
                    'pm_id' => $user->pay_later_pm_id,
                    'pm_last_four' => $user->pay_later_pm_last_four,
                    'note' => 'Paid using Pay Later facility.'
                ]
            ]);

            $facility = \App\Models\PayLaterFacility::firstOrCreate(['user_id' => $user->id]);
            \App\Models\PayLaterTransaction::create([
                'user_id' => $user->id,
                'pay_later_facility_id' => $facility->id,
                'invoice_id' => $invoice->id,
                'order_id' => $invoice->order_id,
                'type' => 'deduction',
                'amount' => $invoice->total_amount,
                'available_credit_after' => max(0, $user->pay_later_available_credit - $invoice->total_amount),
                'description' => "Deferred Pay Later order settlement for Invoice #{$invoice->invoice_number}",
            ]);

            if ($invoice->order && $invoice->order->supplier_id) {
                \App\Models\SupplierTransaction::create([
                    'supplier_id' => $invoice->order->supplier_id,
                    'order_id' => $invoice->order->id,
                    'amount' => $invoice->supplier_amount,
                    'type' => 'earning',
                    'status' => 'pending',
                    'available_at' => $payment->available_at,
                    'description' => "Earnings held in escrow for Order #{$invoice->order->order_number} (Available: {$payment->available_at->format('d M Y, h:i A')})",
                ]);
            }

            if ($invoice->order) {
                if (in_array($invoice->order->status, ['pending', 'accepted', 'assigned'])) {
                    $invoice->order->update(['status' => 'in_progress']);

                    $invoice->order->updates()->create([
                        'status' => 'in_progress',
                        'title' => 'Payment Successful & Order Started',
                        'description' => "Payment for this order has been successfully processed via Pay Later. The order is now in progress.",
                    ]);
                }

                if ($invoice->order->supplier) {
                    try {
                        $invoice->order->supplier->notify(new \App\Notifications\PaymentReceivedNotification($invoice));
                    } catch (\Exception $e) {
                        Log::error('Failed to notify supplier of payment: '.$e->getMessage());
                    }
                }
            }

            DB::commit();

            return $this->sendResponse([
                'invoice' => new InvoiceDetailResource($invoice->fresh()),
            ], 'Invoice paid successfully using Pay Later.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in payInvoiceWithPayLater: ' . $e->getMessage());
            return $this->sendError('Failed to pay invoice via Pay Later.', ['error' => $e->getMessage()], 500);
        }
    }
}
