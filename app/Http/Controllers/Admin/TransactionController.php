<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupplierTransaction;
use App\Models\WithdrawRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    /**
     * Display a listing of supplier transactions and overall statistics.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $type = $request->input('type', 'all');

        $query = SupplierTransaction::with(['supplier', 'order'])
            ->latest();

        if ($type !== 'all') {
            $query->where('type', $type);
        }

        if ($search) {
            $query->whereHas('supplier', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('company_name', 'like', "%{$search}%");
            })->orWhereHas('order', function($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%");
            });
        }

        $transactions = $query->paginate(15)->withQueryString();

        // Calculate Statistics
        $totalEarnings = SupplierTransaction::where('type', 'earning')->sum('amount');
        $totalWithdrawn = SupplierTransaction::where('type', 'withdrawal')->sum('amount');
        
        $pendingWithdrawals = WithdrawRequest::where('status', 'pending')->count();
        $pendingWithdrawalAmount = WithdrawRequest::where('status', 'pending')->sum('amount');

        return Inertia::render('Admin/Finance/Transactions/Index', [
            'transactions' => $transactions,
            'stats' => [
                'total_earnings' => $totalEarnings,
                'total_withdrawn' => $totalWithdrawn,
                'pending_requests_count' => $pendingWithdrawals,
                'pending_withdrawal_amount' => $pendingWithdrawalAmount,
            ],
            'filters' => [
                'type' => $type,
                'search' => $search,
            ]
        ]);
    }
}
