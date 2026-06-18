<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\InvoicePaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    protected $paymentService;

    public function __construct(InvoicePaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $endpointSecret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                $endpointSecret
            );
        } catch (\UnexpectedValueException $e) {
            return response()->json(['message' => 'Invalid payload'], 400);
        } catch (SignatureVerificationException $e) {
            return response()->json(['message' => 'Invalid signature'], 400);
        }

        // Handle the event
        switch ($event->type) {
            case 'checkout.session.completed':
                $session = $event->data->object;
                $this->paymentService->handleCheckoutSessionCompleted($session);
                break;
            case 'account.updated':
                $account = $event->data->object;
                $user = \App\Models\User::where('stripe_account_id', $account->id)->first();
                if ($user) {
                    $isCompleted = $account->details_submitted && $account->charges_enabled;
                    $user->update(['is_stripe_connected' => $isCompleted]);
                    Log::info("Stripe Webhook: Account updated for user {$user->id}. Connected: " . ($isCompleted ? 'Yes' : 'No'));
                }
                break;
            case 'invoice.payment_succeeded':
                $invoice = $event->data->object;
                $this->paymentService->handleInvoicePaymentSucceeded($invoice);
                break;
            case 'customer.subscription.deleted':
                $subscription = $event->data->object;
                $this->paymentService->handleCustomerSubscriptionDeleted($subscription);
                break;
            default:
                Log::info('Unhandled Stripe event type: ' . $event->type);
        }
        $cashierController = new \Laravel\Cashier\Http\Controllers\WebhookController;
        return $cashierController->handleWebhook($request);
    }
}
