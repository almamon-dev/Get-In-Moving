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
        $query = User::with(['userSubscription.pricingPlan'])
            ->where('user_type', 'customer')
            ->whereIn('pay_later_status', ['pending', 'approved', 'rejected']);

        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('company_name', 'like', "%{$search}%");
            });
        }

        if ($request->has('status') && $request->status !== null) {
            $query->where('pay_later_status', $request->status);
        }

        $requests = $query->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Customers/PayLaterApprovals', [
            'requests' => $requests,
            'filters' => $request->only(['search', 'status']),
            'stats' => [
                'total' => User::where('user_type', 'customer')->whereIn('pay_later_status', ['pending', 'approved', 'rejected'])->count(),
                'pending' => User::where('user_type', 'customer')->where('pay_later_status', 'pending')->count(),
                'approved' => User::where('user_type', 'customer')->where('pay_later_status', 'approved')->count(),
                'rejected' => User::where('user_type', 'customer')->where('pay_later_status', 'rejected')->count(),
            ],
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
        ]);

        $customer->update([
            'pay_later_status' => $request->pay_later_status,
        ]);

        // Send notification if approved or rejected (optional, based on requirement)
        if ($request->pay_later_status === 'approved') {
            $customer->notify(new \App\Notifications\PayLaterApprovedNotification());
        }

        return redirect()->back()
            ->with('success', 'Pay Later status updated successfully.');
    }
}
