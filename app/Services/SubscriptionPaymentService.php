<?php

namespace App\Services;

use App\Models\UserSubscription;
use App\Models\PricingPlan;
use Stripe\Checkout\Session;
use Stripe\Stripe;

class SubscriptionPaymentService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    /**
     * Create a Stripe Checkout session for a subscription.
     */
    public function createCheckoutSession(UserSubscription $subscription)
    {
        $plan = $subscription->pricingPlan;
        $user = $subscription->user;
        
        // Ensure user is a Stripe customer
        if (!$user->hasStripeId()) {
            $user->createAsStripeCustomer();
        }

        // Create a Cashier subscription checkout session
        return $user->newSubscription('default', $plan->stripe_price_id)
            ->checkout([
                'success_url' => config('services.stripe.success_url') . '?type=subscription',
                'cancel_url' => config('services.stripe.cancel_url') . '?type=subscription',
                'metadata' => [
                    'subscription_id' => $subscription->id,
                    'type' => 'subscription_payment'
                ],
            ]);
    }
}
