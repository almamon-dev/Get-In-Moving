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
        $now = now();
        $sixMonthsAgo = now()->subMonths(5)->startOfMonth();

        // 1. Escrow Stats
        $heldAmount = SupplierTransaction::where('status', 'pending')->where('type', 'earning')->sum('amount');
        $pendingPayoutsCount = SupplierTransaction::where('status', 'pending')->where('type', 'earning')->count();

        // 2. Dispute/Issue Stats
        $disputedOrdersCount = Order::where('pod_status', 'rejected')->count();
        $recentDisputes = Order::where('pod_status', 'rejected')
            ->with(['customer', 'supplier'])
            ->latest()
            ->limit(5)
            ->get();

        // 3. Chart Data: Monthly Revenue (Earning Transactions)
        $monthlyRevenue = SupplierTransaction::where('type', 'earning')
            ->where('status', 'completed')
            ->where('created_at', '>=', $sixMonthsAgo)
            ->selectRaw('MONTHNAME(created_at) as month, SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('created_at')
            ->get()
            ->map(function($item) {
                return [
                    'month' => $item->month,
                    'total' => (float) $item->total
                ];
            });

        // 4. Chart Data: User Distribution
        $userDistribution = [
            ['name' => 'Customers', 'value' => User::where('user_type', 'customer')->count()],
            ['name' => 'Suppliers', 'value' => User::where('user_type', 'supplier')->count()],
        ];

        // 5. Recent Transactions
        $recentTransactions = SupplierTransaction::with(['supplier', 'order'])
            ->latest()
            ->limit(10)
            ->get();

        // 6. Overall Stats
        $stats = [
            'total_customers' => User::where('user_type', 'customer')->count(),
            'total_suppliers' => User::where('user_type', 'supplier')->count(),
            'total_orders' => Order::count(),
            'held_amount' => (float) $heldAmount,
            'pending_payouts_count' => $pendingPayoutsCount,
            'disputed_orders_count' => $disputedOrdersCount,
            'total_revenue' => (float) SupplierTransaction::where('type', 'earning')->where('status', 'completed')->sum('amount'),
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recent_disputes' => $recentDisputes,
            'revenue_data' => $monthlyRevenue,
            'user_distribution' => $userDistribution,
            'recent_transactions' => $recentTransactions,
        ]);
    }
}
