<?php

namespace App\Http\Controllers\API\Supplier;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Stripe\StripeClient;
use Illuminate\Support\Facades\Auth;

class StripeConnectController extends Controller
{
    protected $stripe;

    public function __construct()
    {
        // Add your Stripe Secret key to .env as STRIPE_SECRET
        $this->stripe = new StripeClient(config('services.stripe.secret') ?? env('STRIPE_SECRET'));
    }

    /**
     * Generate an Onboarding Link for the Supplier
     */
    public function onboard(Request $request)
    {
        try {
            $user = Auth::user();

            if (!$user->userSubscription || $user->userSubscription->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'You must purchase a subscription before connecting your Stripe account.'
                ]);
            }

            // Check if user already has a Stripe account ID
            if (!$user->stripe_account_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Stripe account is not generated yet. Please contact support if you have an active subscription.'
                ]);
            }

            // Create Account Link for onboarding
            $accountLink = $this->stripe->accountLinks->create([
                'account' => $user->stripe_account_id,
                'refresh_url' => url('/api/stripe/connect/refresh?user_id=' . $user->id),
                'return_url' => url('/api/stripe/connect/return?user_id=' . $user->id),
                'type' => 'account_onboarding',
            ]);

            return response()->json([
                'success' => true,
                'url' => $accountLink->url
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to connect Stripe: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Handle return from Stripe Onboarding
     */
    public function returnUrl(Request $request)
    {
        try {
            $user = \App\Models\User::find($request->user_id);
            
            if (!$user || !$user->stripe_account_id) {
                return redirect(config('app.frontend_url') . '/supplier/settings?stripe_status=error');
            }

            // Verify account status
            $account = $this->stripe->accounts->retrieve($user->stripe_account_id);
            
            if ($account->details_submitted && $account->charges_enabled) {
                $user->update(['is_stripe_connected' => true]);
                return redirect(config('app.frontend_url') . '/supplier/settings?stripe_status=success');
            }

            return redirect(config('app.frontend_url') . '/supplier/settings?stripe_status=pending');
        } catch (\Exception $e) {
            return redirect(config('app.frontend_url') . '/supplier/settings?stripe_status=error');
        }
    }

    /**
     * Handle refresh URL (if onboarding link expires)
     */
    public function refreshUrl(Request $request)
    {
        // Redirect back to frontend settings page to restart the process
        return redirect(config('app.frontend_url') . '/supplier/settings?stripe_status=expired');
    }
}
