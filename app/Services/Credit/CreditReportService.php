<?php

namespace App\Services\Credit;

use App\Models\CustomerCreditAccount;
use App\Models\Invoice;
use App\Models\CreditTransaction;
use App\Models\PayLaterRequest;
use Illuminate\Support\Facades\DB;

class CreditReportService
{
    /**
     * Get Executive Overview Dashboard Metrics.
     */
    public function getDashboardMetrics(): array
    {
        $totalIssued = CustomerCreditAccount::where('status', 'active')->sum('credit_limit');
        $usedCredit = CustomerCreditAccount::where('status', 'active')->sum('used_credit');
        $availableCredit = CustomerCreditAccount::where('status', 'active')->sum('available_credit');

        $overdueAmount = Invoice::where('status', 'overdue')
            ->whereHas('order', function ($q) {
                $q->whereHas('customer', function ($cq) {
                    $cq->where('user_type', 'customer');
                });
            })->sum('total_amount');

        $pendingRequests = PayLaterRequest::where('status', 'pending')->count();
        $highRiskCount = CustomerCreditAccount::where('risk_level', 'high')->count();

        $utilizationPercentage = $totalIssued > 0 ? round(($usedCredit / $totalIssued) * 100, 2) : 0;

        return [
            'total_credit_issued' => (float) $totalIssued,
            'used_credit' => (float) $usedCredit,
            'available_credit' => (float) $availableCredit,
            'outstanding_balance' => (float) $usedCredit,
            'overdue_amount' => (float) $overdueAmount,
            'pending_requests' => $pendingRequests,
            'high_risk_customers' => $highRiskCount,
            'credit_utilization_percentage' => $utilizationPercentage,
        ];
    }

    /**
     * Get Aging Report (0-30, 31-60, 61-90, 90+ Days).
     */
    public function getAgingReport(): array
    {
        $now = now();

        $invoices = Invoice::whereIn('status', ['due', 'overdue'])
            ->with(['order.customer'])
            ->get();

        $current = 0; // 0-30
        $thirtyToSixty = 0; // 31-60
        $sixtyToNinety = 0; // 61-90
        $ninetyPlus = 0; // 90+

        foreach ($invoices as $inv) {
            $daysOverdue = $inv->due_date ? max(0, (int) $inv->due_date->diffInDays($now, false)) : 0;
            $amt = (float) $inv->total_amount;

            if ($daysOverdue <= 30) {
                $current += $amt;
            } elseif ($daysOverdue <= 60) {
                $thirtyToSixty += $amt;
            } elseif ($daysOverdue <= 90) {
                $sixtyToNinety += $amt;
            } else {
                $ninetyPlus += $amt;
            }
        }

        return [
            'current_30_days' => $current,
            'thirty_to_sixty_days' => $thirtyToSixty,
            'sixty_to_ninety_days' => $sixtyToNinety,
            'ninety_plus_days' => $ninetyPlus,
            'total_aging_amount' => $current + $thirtyToSixty + $sixtyToNinety + $ninetyPlus,
        ];
    }
}
