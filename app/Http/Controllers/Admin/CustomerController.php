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
        $query = User::with(['subscription.pricingPlan'])
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
        return Inertia::render('Admin/Customers/Show', [
            'customer' => $customer,
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
}
