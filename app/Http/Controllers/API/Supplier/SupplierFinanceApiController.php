<?php

namespace App\Http\Controllers\API\Supplier;

use App\Http\Controllers\Controller;
use App\Models\SupplierTransaction;
use App\Models\WithdrawRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SupplierFinanceApiController extends Controller
{
    use ApiResponse;

    /**
     * Get supplier financial dashboard data
     */
    public function getDashboard(Request $request)
    {
        $user = $request->user();

        $recentTransactions = SupplierTransaction::where('supplier_id', $user->id)
            ->with('order')
            ->latest()
            ->limit(10)
            ->get();

        $withdrawRequests = WithdrawRequest::where('supplier_id', $user->id)
            ->latest()
            ->limit(5)
            ->get();

        return $this->sendResponse([
            'current_balance' => (float) $user->balance,
            'recent_transactions' => $recentTransactions,
            'withdraw_requests' => $withdrawRequests,
        ], 'Financial dashboard data retrieved successfully.');
    }

    /**
     * Request a withdrawal
     */
    public function requestWithdraw(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'account_name' => 'required|string',
            'payment_method' => 'nullable|string',
            'payment_details' => 'required|string',
        ]);

        $user = $request->user();
        $withdrawAmount = $request->amount ?? $user->balance;

        if ($withdrawAmount <= 0) {
            return $this->sendError('You have no balance to withdraw.');
        }

        if ($user->balance < $withdrawAmount) {
            return $this->sendError('Insufficient balance for this withdrawal request.');
        }
        try {
            DB::beginTransaction();

            $withdrawRequest = WithdrawRequest::create([
                'supplier_id' => $user->id,
                'account_name' => $request->account_name,
                'amount' => $withdrawAmount,
                'payment_method' => $request->payment_method ?? 'Manual',
                'payment_details' => $request->payment_details,
                'status' => 'pending',
            ]);

            // Deduction from balance
            $user->decrement('balance', $withdrawAmount);

            SupplierTransaction::create([
                'supplier_id' => $user->id,
                'amount' => -$withdrawAmount,
                'type' => 'withdrawal',
                'description' => 'Withdrawal request (#'.$withdrawRequest->id.') for '.$request->account_name,
            ]);

            DB::commit();

            return $this->sendResponse($withdrawRequest, 'Withdrawal request submitted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->sendError('Failed to process withdrawal request. '.$e->getMessage());
        }
    }
}
