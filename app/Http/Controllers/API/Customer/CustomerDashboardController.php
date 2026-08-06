<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Customer\NotificationResource;
use App\Http\Resources\API\Customer\QuoteRequestResource;
use App\Http\Resources\API\Supplier\OrderResource;
use App\Models\Order;
use App\Models\Quote;
use App\Models\QuoteRequest;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CustomerDashboardController extends Controller
{
    use ApiResponse;

    /**
     * Get dashboard overview for the customer.
     */
    public function getDashboardOverview()
    {
        $user = auth()->user();

        $totalQuotes = Quote::whereHas('quoteRequest', function ($q) use ($user) {
            $q->where('user_id', $user->id);
        })->count();

        $activeQuotesCount = QuoteRequest::where('user_id', $user->id)
            ->where('status', 'active')
            ->whereHas('quotes')
            ->count();

        $activeOrdersCount = Order::where('customer_id', $user->id)
            ->whereIn('status', ['confirmed', 'in_progress', 'picked_up', 'delivered'])
            ->count();

        $completedOrdersCount = Order::where('customer_id', $user->id)
            ->where('status', 'completed')
            ->count();

        $pendingActions = $user->unreadNotifications()->count();

        $activeOrders = Order::with(['supplier', 'updates'])
            ->where('customer_id', $user->id)
            ->whereIn('status', ['confirmed', 'in_progress', 'picked_up', 'delivered'])
            ->latest()
            ->limit(3)
            ->get();

        $activeQuoteRequests = QuoteRequest::with(['quotes.supplier'])
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->whereHas('quotes')
            ->latest()
            ->limit(3)
            ->get();

        $recentActivity = $user->notifications()->latest()->limit(5)->get();

        return $this->sendResponse([
            'stats' => [
                'total_quotes' => $totalQuotes,
                'active_quotes' => $activeQuotesCount,
                'active_orders' => $activeOrdersCount,
                'completed_orders' => $completedOrdersCount,
                'pending_actions' => $pendingActions,
            ],
            'active_orders' => OrderResource::collection($activeOrders),
            'active_quotes' => QuoteRequestResource::collection($activeQuoteRequests),
            'recent_activity' => NotificationResource::collection($recentActivity),
        ], 'Dashboard overview retrieved successfully.');
    }

    /**
     * Toggle auto-renewal for the customer's subscription.
     */
    public function toggleAutoRenewal(Request $request)
    {
        $user = $request->user();
        
        $subscription = $user->subscription('default');
        
        if (!$subscription) {
            return $this->sendError('No active subscription found to manage.', [], 404);
        }

        try {
            $isCanceling = $request->input('cancel_auto_renewal', false);
            
            if ($isCanceling) {
                if (!$subscription->canceled()) {
                    $subscription->cancel();
                }
            } else {
                if ($subscription->canceled()) {
                    $subscription->resume();
                }
            }
            
            return $this->sendResponse([
                'has_active_subscription' => !$isCanceling,
            ], $isCanceling ? 'Auto-renewal has been disabled.' : 'Auto-renewal has been enabled.');
        } catch (\Exception $e) {
            Log::error('Error toggling auto-renewal: ' . $e->getMessage());
            return $this->sendError('Failed to update auto-renewal preferences: ' . $e->getMessage(), [], 500);
        }
    }
}
