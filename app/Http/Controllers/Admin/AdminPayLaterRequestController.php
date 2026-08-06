<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PayLaterRequest;
use App\Models\User;
use App\Services\Credit\CreditAccountService;
use App\Services\Credit\CreditTransactionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminPayLaterRequestController extends Controller
{
    protected CreditAccountService $accountService;
    protected CreditTransactionService $transactionService;

    public function __construct(CreditAccountService $accountService, CreditTransactionService $transactionService)
    {
        $this->accountService = $accountService;
        $this->transactionService = $transactionService;
    }

    /**
     * List Pay Later requests.
     */
    public function index(Request $request)
    {
        $query = PayLaterRequest::with('user');

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $requests = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('Admin/CreditManagement/Requests', [
            'requests' => $requests,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    /**
     * Approve Pay Later request.
     */
    public function approve(Request $request, PayLaterRequest $payLaterRequest)
    {
        $request->validate([
            'approved_limit' => 'required|numeric|min:0',
            'payment_terms_days' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:1000',
        ]);

        $approvedLimit = (float) $request->approved_limit;

        $payLaterRequest->update([
            'status' => 'approved',
            'approved_limit' => $approvedLimit,
            'admin_notes' => $request->notes,
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        // Initialize or update customer credit account
        $user = $payLaterRequest->user;
        $user->update([
            'pay_later_status' => 'approved',
            'pay_later_credit_limit' => $approvedLimit,
        ]);

        $account = $this->accountService->getOrCreateAccount($user, $approvedLimit);
        $account->update([
            'status' => 'active',
            'credit_limit' => $approvedLimit,
            'available_credit' => max(0, $approvedLimit - $account->used_credit),
            'payment_terms_days' => (int) $request->payment_terms_days,
        ]);

        // Record transaction
        $this->transactionService->recordTransaction([
            'customer_credit_account_id' => $account->id,
            'type' => 'credit_approved',
            'amount' => $approvedLimit,
            'description' => "Pay Later request approved with limit €{$approvedLimit}.",
        ]);

        return redirect()->back()->with('success', 'Pay Later request approved successfully.');
    }

    /**
     * Reject Pay Later request.
     */
    public function reject(Request $request, PayLaterRequest $payLaterRequest)
    {
        $request->validate([
            'rejection_reason' => 'required|string|max:1000',
        ]);

        $payLaterRequest->update([
            'status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        $payLaterRequest->user->update([
            'pay_later_status' => 'rejected',
            'pay_later_rejection_reason' => $request->rejection_reason,
        ]);

        return redirect()->back()->with('success', 'Pay Later request rejected.');
    }

    /**
     * Request additional documents.
     */
    public function requestDocuments(Request $request, PayLaterRequest $payLaterRequest)
    {
        $request->validate([
            'admin_notes' => 'required|string|max:1000',
        ]);

        $payLaterRequest->update([
            'status' => 'need_documents',
            'admin_notes' => $request->admin_notes,
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id(),
        ]);

        return redirect()->back()->with('success', 'Additional documents requested from customer.');
    }
}
