<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\SupplierTransaction;
use App\Models\WithdrawRequest;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $period = $request->input('period', date('n') <= 6 ? 'H1' : 'H2'); // Default based on current month
        $year = $request->input('year', date('Y'));

        if ($period === 'H1') {
            $startDate = Carbon::create($year, 1, 1)->startOfMonth();
            $endDate = Carbon::create($year, 6, 1)->endOfMonth();
        } else {
            $startDate = Carbon::create($year, 7, 1)->startOfMonth();
            $endDate = Carbon::create($year, 12, 1)->endOfMonth();
        }

        // 1. Escrow Stats (Overall)
        $heldAmount = SupplierTransaction::where('status', 'pending')->where('type', 'earning')->sum('amount');
        $pendingPayoutsCount = SupplierTransaction::where('status', 'pending')->where('type', 'earning')->count();

        // 2. Dispute/Issue Stats
        $disputedOrdersCount = Order::where('pod_status', 'rejected')->count();
        $recentDisputes = Order::where('pod_status', 'rejected')
            ->with(['customer', 'supplier'])
            ->latest()
            ->limit(5)
            ->get();

        // 3. Chart Data: Monthly Platform Revenue (Fees) for selected period
        $months = [];
        $tempDate = clone $startDate;
        for ($i = 0; $i < 6; $i++) {
            $monthName = $tempDate->format('F');
            $months[$monthName] = [
                'month' => $monthName,
                'total' => 0,
                'sort_key' => $tempDate->format('Y-m')
            ];
            $tempDate->addMonth();
        }

        $monthlyFees = \App\Models\Invoice::where('status', 'paid')
            ->whereBetween('paid_at', [$startDate, $endDate])
            ->selectRaw('MONTHNAME(paid_at) as month, SUM(platform_fee) as total')
            ->groupBy('month')
            ->get();

        foreach ($monthlyFees as $fee) {
            if (isset($months[$fee->month])) {
                $months[$fee->month]['total'] = (float) $fee->total;
            }
        }

        $revenueData = array_values($months);

        // 4. Chart Data: User Distribution
        $userDistribution = [
            ['name' => 'Customers', 'value' => User::where('user_type', 'customer')->count()],
            ['name' => 'Suppliers', 'value' => User::where('user_type', 'supplier')->count()],
        ];

        // 5. Recent Transactions (All payments received)
        $recentTransactions = \App\Models\Payment::with(['user', 'subscription.pricingPlan', 'invoice.order'])
            ->latest()
            ->limit(10)
            ->get();

        // 6. Overall Stats
        $platformFees = \App\Models\Invoice::where('status', 'paid')->sum('platform_fee');

        $stats = [
            'total_customers' => User::where('user_type', 'customer')->count(),
            'total_suppliers' => User::where('user_type', 'supplier')->count(),
            'total_orders' => Order::count(),
            'held_amount' => (float) \App\Models\Payment::where('status', 'succeeded')->where('is_released', false)->sum('amount'),
            'pending_payouts_count' => \App\Models\Payment::where('status', 'succeeded')->where('is_released', false)->count(),
            'disputed_orders_count' => $disputedOrdersCount,
            'total_revenue' => (float) $platformFees,
            'gross_volume' => (float) \App\Models\Payment::where('status', 'succeeded')->sum('amount'),
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recent_disputes' => $recentDisputes,
            'revenue_data' => $revenueData,
            'user_distribution' => $userDistribution,
            'recent_transactions' => $recentTransactions,
            'filters' => [
                'period' => $period,
                'year' => (int) $year
            ]
        ]);
    }
}
