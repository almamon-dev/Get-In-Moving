<?php

namespace App\Services;

use App\Models\Invoice;
use App\Notifications\PaymentReceivedNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class InvoicePaymentService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Create a Stripe Checkout session for an invoice.
     */
    public function createCheckoutSession(Invoice $invoice)
    {
        return Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => 'Invoice '.$invoice->invoice_number,
                        'description' => 'Payment for Order '.$invoice->order->order_number,
                    ],
                    'unit_amount' => (int) ($invoice->total_amount * 100),
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => config('services.stripe.success_url'),
            'cancel_url' => config('services.stripe.cancel_url'),
            'metadata' => [
                'invoice_id' => $invoice->id,
            ],
        ]);
    }

    /**
     * Handle the checkout.session.completed event.
     */
    public function handleCheckoutSessionCompleted($session)
    {
        $invoiceId = $session->metadata->invoice_id ?? null;

        if (! $invoiceId) {
            Log::error('Stripe Webhook: No invoice_id found in session metadata.');

            return;
        }

        DB::beginTransaction();
        try {
            $invoice = Invoice::with('order')->find($invoiceId);

            if ($invoice && $invoice->status !== 'paid') {
                // 1. Create Payment Record (Escrow)
                $payment = \App\Models\Payment::create([
                    'invoice_id' => $invoice->id,
                    'transaction_id' => $session->payment_intent,
                    'session_id' => $session->id,
                    'amount' => $session->amount_total / 100,
                    'currency' => $session->currency,
                    'status' => 'succeeded',
                    'payment_method' => $session->payment_method_types[0] ?? 'card',
                    'metadata' => (array) $session->metadata,
                    'available_at' => now()->addMinutes((int) env('FUND_HOLD_MINUTES', 5)),
                ]);

                // 2. Create Pending Transaction Record (Visible but not in balance)
                \App\Models\SupplierTransaction::create([
                    'supplier_id' => $invoice->order->supplier_id,
                    'order_id' => $invoice->order->id,
                    'amount' => $invoice->supplier_amount,
                    'type' => 'earning',
                    'status' => 'pending',
                    'available_at' => $payment->available_at,
                    'description' => "Earnings held in escrow for Order #{$invoice->order->order_number} (Available: {$payment->available_at->format('d M Y, h:i A')})",
                ]);

                // 3. Update Invoice
                $invoice->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);

                // 4. Update Order Status
                if ($invoice->order) {
                    $invoice->order->update([
                        'status' => 'in_progress',
                    ]);

                    // Add to timeline
                    $invoice->order->updates()->create([
                        'status' => 'in_progress',
                        'title' => 'Payment Successful & Order Started',
                        'description' => "Payment for this order has been successfully processed. The order is now in progress.",
                    ]);
                }
                Log::info("Stripe Webhook: Invoice {$invoice->invoice_number} paid. Funds escrowed for 14 days.");

                // 5. Notify Supplier (Email & Database)
                if ($invoice->order && $invoice->order->supplier) {
                    try {
                        $invoice->order->supplier->notify(new \App\Notifications\PaymentReceivedNotification($invoice));
                    } catch (\Exception $e) {
                        Log::error("Failed to notify supplier of payment: " . $e->getMessage());
                    }
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Stripe Webhook Error: '.$e->getMessage());
            throw $e;
        }
    }
}
