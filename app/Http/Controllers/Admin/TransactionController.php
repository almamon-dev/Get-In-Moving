<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionController extends Controller
{
    /**
     * Display a listing of supplier transactions and overall statistics.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $status = $request->input('status', 'all');

        $query = \App\Models\Payment::with(['user', 'subscription.pricingPlan', 'invoice.order.customer', 'invoice.order.supplier'])
            ->latest();

        if ($status !== 'all') {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('transaction_id', 'like', "%{$search}%")
                    ->orWhereHas('invoice.order', function ($sq) use ($search) {
                        $sq->where('order_number', 'like', "%{$search}%");
                    })
                    ->orWhereHas('invoice.order.supplier', function ($sq) use ($search) {
                        $sq->where('name', 'like', "%{$search}%")
                            ->orWhere('company_name', 'like', "%{$search}%");
                    });
            });
        }

        $payments = $query->paginate(15)->withQueryString();

        // Calculate Statistics
        $totalVolume = (float) \App\Models\Payment::where('status', 'succeeded')->sum('amount');
        $releasedAmount = (float) \App\Models\Payment::where('status', 'succeeded')->where('is_released', true)->sum('amount');
        $escrowAmount = (float) \App\Models\Payment::where('status', 'succeeded')->where('is_released', false)->sum('amount');
        $totalWithdrawn = (float) \App\Models\WithdrawRequest::where('status', 'completed')->sum('amount');

        $pendingClearanceCount = \App\Models\Payment::where('status', 'succeeded')->where('is_released', false)->count();

        return Inertia::render('Admin/Finance/Transactions/Index', [
            'payments' => $payments,
            'stats' => [
                'total_volume' => $totalVolume,
                'released_amount' => $releasedAmount,
                'escrow_amount' => $escrowAmount,
                'total_withdrawn' => $totalWithdrawn,
                'pending_clearance_count' => $pendingClearanceCount,
            ],
            'filters' => [
                'status' => $status,
                'search' => $search,
            ],
        ]);
    }
}
