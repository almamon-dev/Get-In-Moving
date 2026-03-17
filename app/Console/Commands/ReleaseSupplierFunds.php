<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ReleaseSupplierFunds extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:release-supplier-funds';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Release escrowed funds to suppliers after the 14-day hold period.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $payments = \App\Models\Payment::where('status', 'succeeded')
            ->where('is_released', false)
            ->where('available_at', '<=', now())
            ->with(['invoice.order'])
            ->get();

        if ($payments->isEmpty()) {
            $this->info('No payments ready for release.');
            return;
        }

        foreach ($payments as $payment) {
            $invoice = $payment->invoice;
            if (!$invoice || !$invoice->order) {
                $this->warn("Payment ID {$payment->id} has no valid invoice or order.");
                continue;
            }

            $order = $invoice->order;
            /** @var \App\Models\User $supplier */
            $supplier = \App\Models\User::find($order->supplier_id);

            if (!$supplier) {
                $this->warn("Supplier not found for Order ID {$order->id}.");
                continue;
            }

            // The amount to release is the supplier_amount from the invoice
            $releaseAmount = $invoice->supplier_amount;

            \Illuminate\Support\Facades\DB::beginTransaction();
            try {
                // 1. Update Supplier Balance
                $supplier->increment('balance', $releaseAmount);

                // 2. Mark SupplierTransaction as Completed
                $transaction = \App\Models\SupplierTransaction::where('order_id', $order->id)
                    ->where('supplier_id', $supplier->id)
                    ->where('type', 'earning')
                    ->where('status', 'pending')
                    ->first();

                if ($transaction) {
                    $transaction->update([
                        'status' => 'completed',
                        'description' => "Earning released to balance for Order #{$order->order_number}",
                    ]);
                } else {
                    // Fail-safe: create transaction if not exists (though it should)
                    \App\Models\SupplierTransaction::create([
                        'supplier_id' => $supplier->id,
                        'order_id' => $order->id,
                        'amount' => $releaseAmount,
                        'type' => 'earning',
                        'status' => 'completed',
                        'description' => "Earning released for Order #{$order->order_number} (Auto-created)",
                    ]);
                }

                // 3. Mark Payment as Released
                $payment->update(['is_released' => true]);

                // 4. Notify Supplier
                try {
                    $supplier->notify(new \App\Notifications\FundsReleasedNotification($payment));
                } catch (\Exception $e) {
                    $this->warn("Failed to notify supplier for Payment ID {$payment->id}: " . $e->getMessage());
                }

                \Illuminate\Support\Facades\DB::commit();
                $this->info("Released {$releaseAmount} to Supplier {$supplier->name} for Payment ID {$payment->id}");
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\DB::rollBack();
                $this->error("Failed to release Payment ID {$payment->id}: " . $e->getMessage());
            }
        }

        $this->info('Fund release process completed.');
    }
}
