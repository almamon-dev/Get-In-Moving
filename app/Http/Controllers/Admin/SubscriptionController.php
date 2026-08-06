<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\UserSubscription;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $query = UserSubscription::with(['user', 'pricingPlan']);
        
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }
        
        if ($request->has('status') && $request->status != 'All') {
            $query->where('status', strtolower($request->status));
        }

        $perPage = $request->per_page ?? 10;
        $subscriptions = $query->latest()->paginate($perPage)->withQueryString();

        return Inertia::render('Admin/Subscriptions/Index', [
            'subscriptions' => $subscriptions,
            'filters' => $request->only(['search', 'status', 'per_page'])
        ]);
    }

    public function destroy(UserSubscription $subscription)
    {
        $subscription->delete();
        return back()->with('success', 'Subscription deleted.');
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:user_subscriptions,id'
        ]);

        UserSubscription::whereIn('id', $request->ids)->delete();

        return back()->with('success', 'Selected subscriptions deleted.');
    }

    public function toggleAutoRenewal(Request $request, UserSubscription $subscription)
    {
        $user = $subscription->user;
        
        $cashierSubscription = collect($user->subscriptions)->first(function ($sub) use ($subscription) {
            // Find by pricing plan or default name
            return $sub->name === 'default';
        });

        if (!$cashierSubscription) {
            return back()->with('error', 'No active Stripe subscription found for this user.');
        }

        try {
            if ($cashierSubscription->canceled()) {
                $cashierSubscription->resume();
                $subscription->update(['auto_renew' => true]);
                return back()->with('success', 'Auto-renewal has been enabled.');
            } else {
                $cashierSubscription->cancel();
                $subscription->update(['auto_renew' => false]);
                return back()->with('success', 'Auto-renewal has been disabled.');
            }
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to update auto-renewal: ' . $e->getMessage());
        }
    }
}
