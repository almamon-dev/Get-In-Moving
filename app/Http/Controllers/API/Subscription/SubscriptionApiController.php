<?php

namespace App\Http\Controllers\API\Subscription;

use App\Http\Controllers\Controller;
use App\Models\UserSubscription;
use App\Services\SubscriptionPaymentService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Exception;

class SubscriptionApiController extends Controller
{
    use ApiResponse;

    protected $paymentService;

    public function __construct(SubscriptionPaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Get a checkout link for the user's pending subscription.
     */
    public function getCheckoutLink(Request $request)
    {
        try {
            $user = $request->user();
            $subscription = $user->subscription;

            if (!$subscription) {
                return $this->sendError('No subscription found for this user.', [], 404);
            }

            if ($subscription->status === 'active') {
                return $this->sendError('Subscription is already active.', [], 422);
            }

            if ($subscription->is_trial) {
                return $this->sendError('Trial subscriptions do not require payment.', [], 422);
            }

            $session = $this->paymentService->createCheckoutSession($subscription);

            return $this->sendResponse([
                'checkout_url' => $session->url,
                'status' => $subscription->status
            ], 'Checkout link generated successfully.');

        } catch (Exception $e) {
            return $this->sendError('Failed to generate checkout link.', ['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Check the current subscription status.
     */
    public function checkStatus(Request $request)
    {
        $subscription = $request->user()->subscription;
        
        if (!$subscription) {
            return $this->sendResponse(['has_subscription' => false], 'No subscription found.');
        }

        return $this->sendResponse([
            'has_subscription' => true,
            'status' => $subscription->status,
            'is_active' => $subscription->isActive(),
            'expires_at' => $subscription->expires_at ? $subscription->expires_at->toDateTimeString() : null,
            'plan_name' => $subscription->pricingPlan->name ?? 'Unknown',
        ], 'Subscription status retrieved.');
    }
}
