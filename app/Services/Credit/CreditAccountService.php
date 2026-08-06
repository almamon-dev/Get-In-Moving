<?php

namespace App\Services\Credit;

use App\Models\CustomerCreditAccount;
use App\Models\CreditAuditLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Exception;

class CreditAccountService
{
    protected CreditTransactionService $transactionService;

    public function __construct(CreditTransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    /**
     * Get or initialize credit account for user.
     */
    public function getOrCreateAccount(User $user, float $defaultLimit = 5000.00): CustomerCreditAccount
    {
        return CustomerCreditAccount::firstOrCreate(
            ['user_id' => $user->id],
            [
                'credit_limit' => $defaultLimit,
                'used_credit' => 0.00,
                'available_credit' => $defaultLimit,
                'status' => 'active',
                'payment_terms_days' => 14,
                'risk_level' => 'low',
            ]
        );
    }

    /**
     * Change credit account status (Active, Suspended, Revoked).
     */
    public function updateStatus(CustomerCreditAccount $account, string $status, string $reason = null): CustomerCreditAccount
    {
        $oldStatus = $account->status;
        $account->status = $status;
        $account->save();

        CreditAuditLog::create([
            'customer_credit_account_id' => $account->id,
            'user_id' => $account->user_id,
            'action' => 'status_changed_' . $status,
            'performed_by' => auth()->id(),
            'old_values' => ['status' => $oldStatus],
            'new_values' => ['status' => $status, 'reason' => $reason],
            'ip_address' => request()->ip(),
        ]);

        return $account;
    }

    /**
     * Adjust credit limit.
     */
    public function adjustLimit(CustomerCreditAccount $account, float $newLimit, string $description = null): CustomerCreditAccount
    {
        $oldLimit = $account->credit_limit;
        $diff = $newLimit - $oldLimit;

        if ($diff > 0) {
            $this->transactionService->recordTransaction([
                'customer_credit_account_id' => $account->id,
                'type' => 'limit_increase',
                'amount' => $diff,
                'description' => $description ?? "Credit limit increased from €{$oldLimit} to €{$newLimit}.",
            ]);
        } elseif ($diff < 0) {
            $this->transactionService->recordTransaction([
                'customer_credit_account_id' => $account->id,
                'type' => 'limit_decrease',
                'amount' => abs($diff),
                'description' => $description ?? "Credit limit decreased from €{$oldLimit} to €{$newLimit}.",
            ]);
        }

        return $account->fresh();
    }
}
