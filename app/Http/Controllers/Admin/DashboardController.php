<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\SupplierTransaction;
use App\Models\WithdrawRequest;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Escrow Stats
        $heldAmount = SupplierTransaction::where('status', 'pending')->where('type', 'earning')->sum('amount');
        $pendingPayoutsCount = SupplierTransaction::where('status', 'pending')->where('type', 'earning')->count();

        // 2. Dispute/Issue Stats
        $disputedOrdersCount = Order::where('pod_status', 'rejected')->count();
        $disputedOrders = Order::where('pod_status', 'rejected')
            ->with(['customer', 'supplier'])
            ->latest()
            ->limit(5)
            ->get();

        // 3. Overall Stats
        $stats = [
            'total_customers' => User::where('user_type', 'customer')->count(),
            'total_suppliers' => User::where('user_type', 'supplier')->count(),
            'total_orders' => Order::count(),
            'held_amount' => (float) $heldAmount,
            'pending_payouts_count' => $pendingPayoutsCount,
            'disputed_orders_count' => $disputedOrdersCount,
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recent_disputes' => $disputedOrders,
        ]);
    }
}
