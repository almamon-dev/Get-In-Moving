<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomerCreditAccount;
use App\Models\User;
use App\Models\Order;
use App\Models\Invoice;
use App\Models\CreditTransaction;
use App\Models\CreditPayment;
use App\Models\CreditAuditLog;
use App\Services\Credit\CreditAccountService;
use App\Services\Credit\CreditReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminCreditManagementController extends Controller
{
    protected CreditAccountService $accountService;
    protected CreditReportService $reportService;

    public function __construct(CreditAccountService $accountService, CreditReportService $reportService)
    {
        $this->accountService = $accountService;
        $this->reportService = $reportService;
    }

    /**
     * Executive Dashboard overview.
     */
    public function dashboard(Request $request)
    {
        $metrics = $this->reportService->getDashboardMetrics();
        $aging = $this->reportService->getAgingReport();

        $accounts = CustomerCreditAccount::with(['user'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/CreditManagement/Dashboard', [
            'metrics' => $metrics,
            'aging' => $aging,
            'accounts' => $accounts,
        ]);
    }

    /**
     * Comprehensive Customer Credit Profile with 7 Enterprise Tabs.
     */
    public function showProfile(Request $request, User $customer)
    {
        $account = $this->accountService->getOrCreateAccount($customer);
        $tab = $request->get('tab', 'summary');

        $orders = Order::where('customer_id', $customer->id)->latest()->take(20)->get();
        $invoices = Invoice::whereHas('order', function ($q) use ($customer) {
            $q->where('customer_id', $customer->id);
        })->latest()->take(20)->get();

        $ledger = CreditTransaction::where('customer_credit_account_id', $account->id)->latest()->take(50)->get();
        $payments = CreditPayment::where('customer_credit_account_id', $account->id)->latest()->take(50)->get();
        $auditLogs = CreditAuditLog::where('customer_credit_account_id', $account->id)->latest()->take(50)->get();

        return Inertia::render('Admin/CreditManagement/CustomerCreditProfile', [
            'customer' => $customer,
            'account' => $account,
            'activeTab' => $tab,
            'orders' => $orders,
            'invoices' => $invoices,
            'ledger' => $ledger,
            'payments' => $payments,
            'auditLogs' => $auditLogs,
        ]);
    }

    /**
     * Adjust credit limit (Increase/Decrease).
     */
    public function adjustLimit(Request $request, CustomerCreditAccount $account)
    {
        $request->validate([
            'credit_limit' => 'required|numeric|min:0',
            'reason' => 'nullable|string|max:500',
        ]);

        $this->accountService->adjustLimit($account, (float) $request->credit_limit, $request->reason);

        return redirect()->back()->with('success', 'Credit limit adjusted successfully.');
    }

    /**
     * Change account status (Suspend, Resume, Revoke).
     */
    public function updateStatus(Request $request, CustomerCreditAccount $account)
    {
        $request->validate([
            'status' => 'required|in:active,suspended,revoked,under_review',
            'reason' => 'nullable|string|max:500',
        ]);

        $this->accountService->updateStatus($account, $request->status, $request->reason);

        return redirect()->back()->with('success', 'Customer credit account status updated successfully.');
    }
}
