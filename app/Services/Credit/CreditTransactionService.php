<?php

namespace App\Services\Credit;

use App\Models\CustomerCreditAccount;
use App\Models\CreditTransaction;
use App\Models\CreditAuditLog;
use Illuminate\Support\Facades\DB;
use Exception;

class CreditTransactionService
{
    /**
     * Record a transaction in the credit ledger with atomic row locking.
     */
    public function recordTransaction(array $data): CreditTransaction
    {
        return DB::transaction(function () use ($data) {
            /** @var CustomerCreditAccount $account */
            $account = CustomerCreditAccount::where('id', $data['customer_credit_account_id'])
                ->lockForUpdate()
                ->firstOrFail();

            $type = $data['type'];
            $amount = (float) $data['amount'];
            $oldAvailable = $account->available_credit;
            $oldUsed = $account->used_credit;

            switch ($type) {
                case 'credit_approved':
                case 'limit_increase':
                    $account->credit_limit += $amount;
                    $account->available_credit += $amount;
                    break;

                case 'limit_decrease':
                    $account->credit_limit = max(0, $account->credit_limit - $amount);
                    $account->available_credit = max(0, $account->credit_limit - $account->used_credit);
                    break;

                case 'order_purchase':
                    if ($amount > $account->available_credit) {
                        throw new Exception("Order amount (€{$amount}) exceeds customer available credit (€{$account->available_credit}).");
                    }
                    $account->used_credit += $amount;
                    $account->available_credit -= $amount;
                    break;

                case 'payment_received':
                case 'refund':
                    $account->used_credit = max(0, $account->used_credit - $amount);
                    $account->available_credit = min($account->credit_limit, $account->available_credit + $amount);
                    break;

                case 'manual_adjustment':
                    if (isset($data['new_limit'])) {
                        $account->credit_limit = (float) $data['new_limit'];
                    }
                    if (isset($data['new_used'])) {
                        $account->used_credit = (float) $data['new_used'];
                    }
                    $account->available_credit = max(0, $account->credit_limit - $account->used_credit);
                    break;
            }

            $account->save();

            // Create ledger entry
            $transaction = CreditTransaction::create([
                'customer_credit_account_id' => $account->id,
                'user_id' => $account->user_id,
                'invoice_id' => $data['invoice_id'] ?? null,
                'order_id' => $data['order_id'] ?? null,
                'type' => $type,
                'amount' => $amount,
                'balance_after' => $account->used_credit,
                'available_credit_after' => $account->available_credit,
                'reference_number' => $data['reference_number'] ?? ('TXN-' . strtoupper(uniqid())),
                'description' => $data['description'] ?? null,
                'created_by' => $data['created_by'] ?? auth()->id(),
            ]);

            // Audit log
            CreditAuditLog::create([
                'customer_credit_account_id' => $account->id,
                'user_id' => $account->user_id,
                'action' => 'credit_transaction_' . $type,
                'performed_by' => auth()->id(),
                'old_values' => ['available_credit' => $oldAvailable, 'used_credit' => $oldUsed],
                'new_values' => ['available_credit' => $account->available_credit, 'used_credit' => $account->used_credit],
                'ip_address' => request()->ip(),
            ]);

            return $transaction;
        });
    }
}
