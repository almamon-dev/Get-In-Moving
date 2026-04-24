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
            'success_url' => config('services.stripe.success_url') . '?type=quote',
            'cancel_url' => config('services.stripe.cancel_url') . '?type=quote',
            'metadata' => [
                'invoice_id' => $invoice->id,
                'type' => 'invoice_payment'
            ],
        ]);
    }

    /**
     * Handle the checkout.session.completed event.
     */
    public function handleCheckoutSessionCompleted($session)
    {
        $invoiceId = $session->metadata->invoice_id ?? null;
        $subscriptionId = $session->metadata->subscription_id ?? null;

        if (!$invoiceId && !$subscriptionId) {
            Log::error('Stripe Webhook: No invoice_id or subscription_id found in session metadata.');
            return;
        }

        if ($subscriptionId) {
            $this->handleSubscriptionPayment($session, $subscriptionId);
            return;
        }

        DB::beginTransaction();
        try {
            $invoice = Invoice::with('order')->find($invoiceId);

            if ($invoice && $invoice->status !== 'paid') {
                // ... (existing invoice logic)
                $payment = \App\Models\Payment::create([
                    'invoice_id' => $invoice->id,
                    'user_id' => $invoice->user_id ?? ($invoice->order ? $invoice->order->customer_id : null),
                    'transaction_id' => $session->payment_intent,
                    'session_id' => $session->id,
                    'amount' => $session->amount_total / 100,
                    'currency' => $session->currency,
                    'status' => 'succeeded',
                    'payment_method' => $session->payment_method_types[0] ?? 'card',
                    'payment_type' => 'order',
                    'metadata' => (array) $session->metadata,
                    'available_at' => now()->addMinutes((int) env('FUND_HOLD_MINUTES', 5)),
                ]);

                \App\Models\SupplierTransaction::create([
                    'supplier_id' => $invoice->order->supplier_id,
                    'order_id' => $invoice->order->id,
                    'amount' => $invoice->supplier_amount,
                    'type' => 'earning',
                    'status' => 'pending',
                    'available_at' => $payment->available_at,
                    'description' => "Earnings held in escrow for Order #{$invoice->order->order_number} (Available: {$payment->available_at->format('d M Y, h:i A')})",
                ]);

                $invoice->update([
                    'status' => 'paid',
                    'paid_at' => now(),
                ]);

                if ($invoice->order) {
                    $invoice->order->update([
                        'status' => 'in_progress',
                    ]);

                    $invoice->order->updates()->create([
                        'status' => 'in_progress',
                        'title' => 'Payment Successful & Order Started',
                        'description' => "Payment for this order has been successfully processed. The order is now in progress.",
                    ]);
                }
                Log::info("Stripe Webhook: Invoice {$invoice->invoice_number} paid.");

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

    protected function handleSubscriptionPayment($session, $subscriptionId)
    {
        $subscription = \App\Models\UserSubscription::with('pricingPlan')->find($subscriptionId);
        if ($subscription && $subscription->status !== 'active') {
            DB::beginTransaction();
            try {
                $subscription->update([
                    'status' => 'active',
                    'started_at' => now(),
                    'expires_at' => now()->addMonths($subscription->pricingPlan->billing_period == 'monthly' ? 1 : 12), // Added basic expiry logic
                ]);

                // Create an Invoice for the subscription (as requested by user)
                $invoice = \App\Models\Invoice::create([
                    'user_id' => $subscription->user_id,
                    'subscription_id' => $subscription->id,
                    'invoice_number' => 'SUB-' . strtoupper(uniqid()),
                    'supplier_amount' => 0,
                    'platform_fee' => $session->amount_total / 100,
                    'total_amount' => $session->amount_total / 100,
                    'status' => 'paid',
                    'due_date' => now(),
                    'paid_at' => now(),
                    'invoice_type' => 'subscription',
                ]);

                // Record the payment
                \App\Models\Payment::create([
                    'invoice_id' => $invoice->id,
                    'user_id' => $subscription->user_id,
                    'subscription_id' => $subscription->id,
                    'transaction_id' => $session->payment_intent,
                    'session_id' => $session->id,
                    'amount' => $session->amount_total / 100,
                    'currency' => $session->currency,
                    'status' => 'succeeded',
                    'payment_method' => $session->payment_method_types[0] ?? 'card',
                    'payment_type' => 'subscription',
                    'is_released' => true, // Subscription payments are immediate profit
                    'available_at' => now(),
                    'metadata' => array_merge((array) $session->metadata, [
                        'plan_name' => $subscription->pricingPlan->name,
                        'type' => 'subscription_payment'
                    ]),
                ]);

                DB::commit();
                Log::info("Stripe Webhook: Subscription {$subscriptionId} activated and recorded in invoices/payments for user {$subscription->user_id}");
            } catch (\Exception $e) {
                DB::rollBack();
                Log::error("Stripe Webhook: Error processing subscription payment: " . $e->getMessage());
                throw $e;
            }
        }
    }
}
