<?php

namespace App\Console\Commands;

use App\Models\CreditTransaction;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class ProcessPayLaterInvoices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:process-pay-later-invoices';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically charge saved credit cards for due Pay Later invoices';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for due Pay Later invoices...');

        // Find due or overdue invoices
        $invoices = Invoice::with(['user', 'order'])
            ->whereIn('status', ['due', 'overdue'])
            ->whereDate('due_date', '<=', now()->toDateString())
            ->get();

        if ($invoices->isEmpty()) {
            $this->info('No due Pay Later invoices found.');
            return 0;
        }

        $stripeSecret = config('services.stripe.secret') ?? env('STRIPE_SECRET');
        if ($stripeSecret) {
            Stripe::setApiKey($stripeSecret);
        }

        $processedCount = 0;
        $failedCount = 0;

        foreach ($invoices as $invoice) {
            $user = $invoice->user ?? $invoice->order?->customer;
            if (!$user) {
                Log::warning("ProcessPayLaterInvoices: Invoice #{$invoice->invoice_number} has no associated customer.");
                continue;
            }

            $pmId = $user->pay_later_pm_id ?? $user->pm_type; // saved payment method
            $stripeId = $user->stripe_id;

            $this->info("Processing Invoice #{$invoice->invoice_number} for User #{$user->id} (Amount: €{$invoice->total_amount})");

            if ($stripeSecret && $pmId && $stripeId) {
                try {
                    // Off-session charge via Stripe Payment Intent
                    $intent = PaymentIntent::create([
                        'amount' => (int) round($invoice->total_amount * 100),
                        'currency' => 'eur',
                        'customer' => $stripeId,
                        'payment_method' => $pmId,
                        'off_session' => true,
                        'confirm' => true,
                        'description' => "Auto-charge settlement for Pay Later Invoice #{$invoice->invoice_number}",
                    ]);

                    if ($intent->status === 'succeeded') {
                        $this->markInvoicePaid($invoice, $user, $intent->id, 'stripe_autocharge');
                        $processedCount++;
                        $this->info("Successfully charged saved card for Invoice #{$invoice->invoice_number}");
                        continue;
                    }
                } catch (\Exception $e) {
                    Log::error("ProcessPayLaterInvoices: Stripe charge failed for Invoice #{$invoice->invoice_number}: " . $e->getMessage());
                    $this->warn("Stripe charge failed for Invoice #{$invoice->invoice_number}: " . $e->getMessage());
                }
            } else {
                Log::info("ProcessPayLaterInvoices: User #{$user->id} does not have a saved card for auto-charge on Invoice #{$invoice->invoice_number}");
            }

            // If auto-charge fails or no card saved, mark invoice as overdue
            $invoice->update(['status' => 'overdue']);
            $failedCount++;
        }

        $this->info("Pay Later invoice processing complete. Charged: {$processedCount}, Overdue: {$failedCount}");
        return 0;
    }

    private function markInvoicePaid(Invoice $invoice, $user, string $transactionId, string $method)
    {
        $invoice->update([
            'status' => 'paid',
            'paid_at' => now(),
        ]);

        if ($invoice->order) {
            $invoice->order->update([
                'payment_status' => 'paid',
            ]);
        }

        Payment::create([
            'invoice_id' => $invoice->id,
            'user_id' => $user->id,
            'transaction_id' => $transactionId,
            'amount' => $invoice->total_amount,
            'currency' => 'EUR',
            'status' => 'succeeded',
            'payment_type' => 'invoice',
            'payment_method' => $method,
        ]);

        CreditTransaction::create([
            'user_id' => $user->id,
            'invoice_id' => $invoice->id,
            'order_id' => $invoice->order_id,
            'type' => 'repayment',
            'amount' => $invoice->total_amount,
            'available_credit_after' => max(0, (float) ($user->pay_later_available_credit ?? 0)),
            'description' => "Auto settlement of Pay Later Invoice #{$invoice->invoice_number}",
        ]);
    }
}
