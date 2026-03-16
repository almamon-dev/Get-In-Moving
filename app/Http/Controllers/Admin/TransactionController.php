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
        $status = $request->input('status', 'all');

        $query = \App\Models\Payment::with(['invoice.order.customer', 'invoice.order.supplier'])
            ->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('transaction_id', 'like', "%{$search}%")
                  ->orWhereHas('invoice.order', function($sq) use ($search) {
                      $sq->where('order_number', 'like', "%{$search}%");
                  })
                  ->orWhereHas('invoice.order.supplier', function($sq) use ($search) {
                      $sq->where('name', 'like', "%{$search}%")
                        ->orWhere('company_name', 'like', "%{$search}%");
                  });
            });
        }

        $payments = $query->paginate(15)->withQueryString();

        // Calculate Statistics
        $totalVolume = \App\Models\Payment::where('status', 'succeeded')->sum('amount');
        $releasedAmount = \App\Models\Payment::where('status', 'succeeded')->where('is_released', true)->sum('amount');
        $escrowAmount = \App\Models\Payment::where('status', 'succeeded')->where('is_released', false)->sum('amount');
        
        $pendingClearanceCount = \App\Models\Payment::where('status', 'succeeded')->where('is_released', false)->count();

        // Transform payments to include remaining days
        $payments->getCollection()->transform(function($payment) {
            $payment->remaining_days = null;
            if ($payment->available_at && !$payment->is_released) {
                $days = now()->diffInDays($payment->available_at, false);
                $payment->remaining_days = max(0, (int) $days);
            }
            return $payment;
        });

        return Inertia::render('Admin/Finance/Transactions/Index', [
            'payments' => $payments,
            'stats' => [
                'total_volume' => $totalVolume,
                'released_amount' => $releasedAmount,
                'escrow_amount' => $escrowAmount,
                'pending_clearance_count' => $pendingClearanceCount,
            ],
            'filters' => [
                'status' => $status,
                'search' => $search,
            ]
        ]);
    }
}
