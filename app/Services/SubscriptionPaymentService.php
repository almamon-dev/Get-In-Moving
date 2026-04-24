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
        
        return Session::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'eur',
                    'product_data' => [
                        'name' => "Subscription: {$plan->name}",
                        'description' => "Billing Period: {$plan->billing_period}",
                    ],
                    'unit_amount' => (int) ($plan->price * 100),
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => config('services.stripe.success_url') . '?type=subscription',
            'cancel_url' => config('services.stripe.cancel_url') . '?type=subscription',
            'metadata' => [
                'subscription_id' => $subscription->id,
                'type' => 'subscription_payment'
            ],
        ]);
    }
}
