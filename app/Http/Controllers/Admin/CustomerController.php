<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\AccountVerifiedNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers.
     */
    public function index(Request $request)
    {
        $query = User::with(['userSubscription.pricingPlan'])
            ->where('user_type', 'customer');

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%");
            });
        }

        // Filter by verification status
        if ($request->has('verified') && $request->verified !== null) {
            $query->where('is_verified', $request->verified);
        }

        $customers = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'verified']),
            'stats' => [
                'total' => User::where('user_type', 'customer')->count(),
                'verified' => User::where('user_type', 'customer')->where('is_verified', true)->count(),
                'unverified' => User::where('user_type', 'customer')->where('is_verified', false)->count(),
            ],
        ]);
    }

    /**
     * Display the specified customer.
     */
    public function show(User $customer)
    {
        $customer->load('userSubscription.pricingPlan');
        
        return Inertia::render('Admin/Customers/Show', [
            'customer' => $customer,
        ]);
    }

    /**
     * Display a listing of Pay Later requests.
     */
    public function payLaterApprovals(Request $request)
    {
        $type = $request->query('type', 'activation'); // activation, increase, history

        $query = \App\Models\PayLaterRequest::with(['user', 'user.payLaterFacility']);

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%");
            });
        }

        if ($type === 'activation') {
            $query->whereIn('status', ['pending', 'under_review'])->where('notes', 'Initial Pay Later facility request');
        } elseif ($type === 'increase') {
            $query->whereIn('status', ['pending', 'under_review'])->where('notes', 'Requested credit limit increase');
        } elseif ($type === 'history') {
            $query->whereNotIn('status', ['pending', 'under_review']);
            if ($request->has('status') && $request->status !== null && $request->status !== 'all') {
                $query->where('status', $request->status);
            }
        }

        $requests = $query->latest()->paginate(10)->through(function ($req) {
            $req->user->used_credit = $req->user->pay_later_used_credit ?? 0;
            $req->user->available_credit = $req->user->pay_later_available_credit ?? 0;
            return $req;
        })->withQueryString();

        $stats = [
            'total' => \App\Models\PayLaterRequest::count(),
            'activation' => \App\Models\PayLaterRequest::whereIn('status', ['pending', 'under_review'])->where('notes', 'Initial Pay Later facility request')->count(),
            'increase' => \App\Models\PayLaterRequest::whereIn('status', ['pending', 'under_review'])->where('notes', 'Requested credit limit increase')->count(),
            'history' => \App\Models\PayLaterRequest::whereNotIn('status', ['pending', 'under_review'])->count(),
        ];

        return Inertia::render('Admin/Customers/PayLaterApprovals', [
            'requests' => $requests,
            'filters' => $request->only(['search', 'status', 'type']),
            'stats' => $stats,
        ]);
    }

    /**
     * Update verification status.
     */
    public function updateVerification(Request $request, User $customer)
    {
        $request->validate([
            'is_verified' => 'required|boolean',
        ]);

        $customer->update([
            'is_verified' => $request->is_verified,
            'verified_at' => $request->is_verified ? now() : null,
            'email_verified_at' => $request->is_verified ? now() : null,
        ]);

        // Send notification if verified
        if ($request->is_verified) {
            $customer->notify(new AccountVerifiedNotification('customer'));
        }

        return redirect()->back()
            ->with('success', 'Verification status updated successfully.');
    }

    /**
     * Remove the specified customer.
     */
    public function destroy(User $customer)
    {
        $customer->delete();

        return redirect()->route('admin.customers.index')
            ->with('success', 'Customer deleted successfully.');
    }

    /**
     * Update pay later status.
     */
    public function updatePayLaterStatus(Request $request, User $customer)
    {
        $request->validate([
            'pay_later_status' => 'required|in:inactive,pending,approved,rejected',
            'rejection_reason' => 'nullable|string|max:1000',
            'pay_later_credit_limit' => 'nullable|numeric|min:0',
            'pay_later_daily_limit' => 'nullable|numeric|min:0',
            'pay_later_weekly_limit' => 'nullable|numeric|min:0',
        ]);

        $updateData = [
            'pay_later_status' => $request->pay_later_status,
        ];

        if ($request->has('pay_later_credit_limit') && $request->pay_later_credit_limit !== null) {
            $updateData['pay_later_credit_limit'] = (float) $request->pay_later_credit_limit;
        }
        if ($request->has('pay_later_daily_limit') && $request->pay_later_daily_limit !== null) {
            $updateData['pay_later_daily_limit'] = (float) $request->pay_later_daily_limit;
        }
        if ($request->has('pay_later_weekly_limit') && $request->pay_later_weekly_limit !== null) {
            $updateData['pay_later_weekly_limit'] = (float) $request->pay_later_weekly_limit;
        }

        $rejectionReason = $request->rejection_reason ?? $request->pay_later_rejection_reason;
        if ($request->pay_later_status === 'rejected') {
            $updateData['pay_later_rejection_reason'] = $rejectionReason;
        } elseif ($request->pay_later_status === 'approved' || $request->pay_later_status === 'inactive') {
            $updateData['pay_later_rejection_reason'] = null; // Clear reason if state changes
        }

        $customer->update($updateData);

        // Sync with dedicated pay_later_facilities table
        $facilityData = [
            'status' => $request->pay_later_status,
            'rejection_reason' => $request->pay_later_status === 'rejected' ? $rejectionReason : null,
        ];

        if ($request->has('pay_later_credit_limit') && $request->pay_later_credit_limit !== null) {
            $facilityData['credit_limit'] = (float) $request->pay_later_credit_limit;
        }
        if ($request->has('pay_later_daily_limit') && $request->pay_later_daily_limit !== null) {
            $facilityData['daily_limit'] = (float) $request->pay_later_daily_limit;
        }
        if ($request->has('pay_later_weekly_limit') && $request->pay_later_weekly_limit !== null) {
            $facilityData['weekly_limit'] = (float) $request->pay_later_weekly_limit;
        }

        if ($request->pay_later_status === 'approved') {
            $facilityData['approved_at'] = now();
        }

        $facility = \App\Models\PayLaterFacility::updateOrCreate(
            ['user_id' => $customer->id],
            $facilityData
        );

        // Also update any pending PayLaterRequest entries for this customer to reflect admin status
        \App\Models\PayLaterRequest::where('user_id', $customer->id)
            ->whereIn('status', ['pending', 'under_review'])
            ->update([
                'status' => $request->pay_later_status,
                'approved_limit' => $request->pay_later_status === 'approved' ? ($request->pay_later_credit_limit ?? $customer->pay_later_credit_limit) : null,
                'rejection_reason' => $request->pay_later_status === 'rejected' ? $rejectionReason : null,
                'reviewed_at' => now(),
                'reviewed_by' => auth()->id(),
            ]);

        // Log limit adjustment transaction if credit limit was changed
        if ($request->has('pay_later_credit_limit') && $request->pay_later_credit_limit !== null) {
            \App\Models\PayLaterTransaction::create([
                'user_id' => $customer->id,
                'pay_later_facility_id' => $facility->id,
                'type' => 'limit_adjustment',
                'amount' => (float) $request->pay_later_credit_limit,
                'available_credit_after' => $customer->pay_later_available_credit,
                'description' => "Credit limit updated to €" . number_format((float) $request->pay_later_credit_limit, 2) . " by Admin.",
            ]);
        }

        // Send notification if approved
        if ($request->pay_later_status === 'approved') {
            $customer->notify(new \App\Notifications\PayLaterApprovedNotification());
        }

        return redirect()->back()
            ->with('success', 'Pay Later facility & credit limit updated successfully.');
    }
}
