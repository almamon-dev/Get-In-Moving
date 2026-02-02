<?php

namespace App\Services;

use App\Models\Invoice;
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
                    'currency' => 'usd',
                    'product_data' => [
                        'name' => 'Invoice '.$invoice->invoice_number,
                        'description' => 'Payment for Order '.$invoice->order->order_number,
                    ],
                    'unit_amount' => (int) ($invoice->total_amount * 100),
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => url('/payment/success?session_id={CHECKOUT_SESSION_ID}'),
            'cancel_url' => url('/payment/cancel'),
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
                // 1. Create Payment Record
                \App\Models\Payment::create([
                    'invoice_id' => $invoice->id,
                    'transaction_id' => $session->payment_intent,
                    'session_id' => $session->id,
                    'amount' => $session->amount_total / 100,
                    'currency' => $session->currency,
                    'status' => 'succeeded',
                    'payment_method' => $session->payment_method_types[0] ?? 'card',
                    'metadata' => (array) $session->metadata,
                ]);

                // 2. Update Invoice
                $invoice->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);

                // 3. Update Order Status
                if ($invoice->order) {
                    $invoice->order->update([
                        'status' => 'in_progress',
                    ]);
                }
                Log::info("Stripe Webhook: Invoice {$invoice->invoice_number} marked as PAID. Transaction record created.");
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Stripe Webhook Error: '.$e->getMessage());
            throw $e;
        }
    }
}
