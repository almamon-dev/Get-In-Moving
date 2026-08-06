<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Models\PayLaterFacility;
use App\Models\PayLaterRequest;
use App\Models\PayLaterTransaction;
use App\Models\Setting;
use App\Models\User;
use App\Notifications\PayLaterRequestedNotification;
use App\Notifications\PayLaterRequestSubmittedNotification;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CustomerPayLaterController extends Controller
{
    use ApiResponse;

    /**
     * Request Pay Later facility or limit increase.
     */
    public function requestPayLater(Request $request)
    {
        $user = $request->user();

        if (in_array($user->pay_later_status, ['pending', 'Under Review'])) {
            return $this->sendError('You already have a Pay Later application currently under review.', [], 422);
        }

        $defaultLimit = Setting::where('key', 'pay_later_default_limit')->value('value');
        $defaultLimit = $defaultLimit ? (float) $defaultLimit : 5000;
        
        $defaultDaily = Setting::where('key', 'pay_later_default_daily_limit')->value('value');
        $defaultDaily = $defaultDaily ? (float) $defaultDaily : 1000;

        $defaultWeekly = Setting::where('key', 'pay_later_default_weekly_limit')->value('value');
        $defaultWeekly = $defaultWeekly ? (float) $defaultWeekly : 2500;
        
        $requestedLimit = $request->requested_limit ?? $defaultLimit;

        $facility = PayLaterFacility::withTrashed()->where('user_id', $user->id)->first();
        $isFirstRequest = !$facility || $facility->status !== 'approved';

        if ($isFirstRequest) {
            $user->update([
                'pay_later_status' => 'pending',
                'pay_later_credit_limit' => $requestedLimit,
                'pay_later_daily_limit' => $defaultDaily,
                'pay_later_weekly_limit' => $defaultWeekly,
                'pay_later_requested_at' => now(),
                'pay_later_rejection_reason' => null
            ]);

            if ($facility) {
                if ($facility->trashed()) {
                    $facility->restore();
                }
                $facility->update([
                    'status' => 'pending',
                    'credit_limit' => $requestedLimit,
                    'daily_limit' => $defaultDaily,
                    'weekly_limit' => $defaultWeekly,
                    'rejection_reason' => null,
                ]);
            } else {
                PayLaterFacility::create([
                    'user_id' => $user->id,
                    'status' => 'pending',
                    'credit_limit' => $requestedLimit,
                    'daily_limit' => $defaultDaily,
                    'weekly_limit' => $defaultWeekly,
                    'rejection_reason' => null,
                ]);
            }

            PayLaterRequest::create([
                'uuid' => (string) Str::uuid(),
                'user_id' => $user->id,
                'requested_limit' => $requestedLimit,
                'status' => 'pending',
                'notes' => 'Initial Pay Later facility request',
            ]);

            User::where('user_type', 'admin')->each(function($admin) use ($user) {
                $admin->notify(new PayLaterRequestedNotification($user));
            });

            $user->notify(new PayLaterRequestSubmittedNotification());

            return $this->sendResponse([], 'Pay Later request submitted successfully and is pending approval.');
        } else {
            PayLaterRequest::create([
                'uuid' => (string) Str::uuid(),
                'user_id' => $user->id,
                'requested_limit' => $requestedLimit,
                'status' => 'pending',
                'notes' => 'Requested credit limit increase',
            ]);

            User::where('user_type', 'admin')->each(function($admin) use ($user) {
                $admin->notify(new PayLaterRequestedNotification($user));
            });

            $user->notify(new PayLaterRequestSubmittedNotification());

            return $this->sendResponse(['status' => 'pending'], 'Limit increase request submitted successfully. Awaiting admin approval.');
        }
    }

    /**
     * Get customer Pay Later applications / credit limit requests history.
     */
    public function getPayLaterRequests(Request $request)
    {
        $user = $request->user();
        
        $requests = PayLaterRequest::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($req) {
                $status = strtolower($req->status);
                $approvedAmt = $req->approved_limit ?: $req->requested_limit;

                return [
                    'id' => 'PLR-' . date('Y', strtotime($req->created_at)) . '-' . str_pad($req->id, 4, '0', STR_PAD_LEFT),
                    'rawId' => $req->id,
                    'requestedLimit' => (float) $req->requested_limit,
                    'status' => ucfirst($status),
                    'date' => $req->created_at->format('d M Y'),
                    'remarks' => $req->rejection_reason ?? ($status === 'approved' ? 'Approved limit: €' . number_format($approvedAmt, 2) : 'Under admin review'),
                ];
            });

        return $this->sendResponse($requests, 'Pay Later requests retrieved successfully.');
    }

    /**
     * Delete a Pay Later request.
     */
    public function deletePayLaterRequest(Request $request, $id)
    {
        $user = $request->user();
        
        $payLaterRequest = PayLaterRequest::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$payLaterRequest) {
            return $this->sendError('Request not found.', [], 404);
        }

        if (!in_array(strtolower($payLaterRequest->status), ['pending', 'under_review'])) {
            return $this->sendError('You cannot delete a request that has already been processed.', [], 400);
        }

        if ($payLaterRequest->notes === 'Initial Pay Later facility request') {
            $facility = PayLaterFacility::where('user_id', $user->id)
                ->where('status', 'pending')
                ->first();
            
            if ($facility) {
                $facility->delete();
            }
        }

        $payLaterRequest->delete();

        return $this->sendResponse([], 'Pay Later request deleted successfully.');
    }

    /**
     * Create a SetupIntent for Pay Later card
     */
    public function setupPayLaterCard(Request $request)
    {
        $user = $request->user();
        if (!$user->hasStripeId()) {
            $user->createAsStripeCustomer();
        }
        $intent = $user->createSetupIntent();
        return $this->sendResponse([
            'client_secret' => $intent->client_secret
        ], 'SetupIntent created.');
    }

    /**
     * Save the Pay Later card after SetupIntent succeeds
     */
    public function savePayLaterCard(Request $request)
    {
        $request->validate([
            'payment_method_id' => 'required|string',
        ]);

        $user = $request->user();
        try {
            $paymentMethod = $user->addPaymentMethod($request->payment_method_id);
            $stripePaymentMethod = $paymentMethod->asStripePaymentMethod();

            if (isset($stripePaymentMethod->card)) {
                $funding = strtolower($stripePaymentMethod->card->funding ?? '');
                if ($funding !== 'credit') {
                    try {
                        $user->deletePaymentMethod($stripePaymentMethod->id);
                    } catch (\Exception $detachEx) {
                        Log::warning('Failed to detach non-credit card: ' . $detachEx->getMessage());
                    }

                    return $this->sendError('Card Validation Failed: Only Credit Cards (Visa/Mastercard/Amex Credit) are accepted for the Pay Later facility. Debit cards and prepaid cards are not allowed.', [], 422);
                }

                try {
                    $user->updateDefaultPaymentMethod($stripePaymentMethod->id);
                } catch (\Exception $exDefault) {
                    Log::info('Default PM update info: ' . $exDefault->getMessage());
                }

                $user->update([
                    'pay_later_pm_id' => $stripePaymentMethod->id,
                    'pay_later_pm_last_four' => $stripePaymentMethod->card->last4,
                    'pay_later_pm_type' => $stripePaymentMethod->card->brand,
                    'pm_last_four' => $stripePaymentMethod->card->last4,
                    'pm_type' => $stripePaymentMethod->card->brand,
                ]);

                PayLaterFacility::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'payment_method_id' => $stripePaymentMethod->id,
                        'card_last_four' => $stripePaymentMethod->card->last4,
                        'card_type' => $stripePaymentMethod->card->brand,
                    ]
                );

                return $this->sendResponse([
                    'last_four' => $stripePaymentMethod->card->last4,
                    'type' => $stripePaymentMethod->card->brand,
                ], 'Pay Later card saved successfully.');
            }
            
            return $this->sendError('Invalid card details provided.', [], 422);
            
        } catch (\Exception $e) {
            return $this->sendError('Failed to save card: ' . $e->getMessage(), [], 500);
        }
    }

    /**
     * Remove saved Pay Later card.
     */
    public function removePayLaterCard(Request $request)
    {
        $user = $request->user();

        if (!$user->pay_later_pm_id && !$user->pay_later_pm_last_four && !$user->credit_card_last_four && !$user->payLaterFacility?->payment_method_id) {
            return $this->sendError('No saved Pay Later card found to remove.', [], 400);
        }

        try {
            $pmId = $user->pay_later_pm_id ?? $user->payLaterFacility?->payment_method_id;
            if ($pmId) {
                try {
                    $user->deletePaymentMethod($pmId);
                } catch (\Exception $ex) {
                    Log::warning('Failed to detach payment method from Stripe: ' . $ex->getMessage());
                }
            }

            $user->update([
                'pay_later_pm_id' => null,
                'pay_later_pm_last_four' => null,
                'pay_later_pm_type' => null,
                'credit_card_last_four' => null,
                'credit_card_type' => null,
                'pay_later_status' => $user->pay_later_status === 'approved' ? 'approved' : 'inactive',
            ]);

            PayLaterFacility::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'payment_method_id' => null,
                    'card_last_four' => null,
                    'card_type' => null,
                    'status' => $user->pay_later_status === 'approved' ? 'approved' : 'inactive',
                ]
            );

            return $this->sendResponse([], 'Pay Later card removed successfully.');
        } catch (\Exception $e) {
            return $this->sendError('Failed to remove card: ' . $e->getMessage(), [], 500);
        }
    }

    /**
     * Get customer Pay Later credit summary including Total, Daily, and Weekly limits.
     */
    public function getPayLaterSummary(Request $request)
    {
        $user = $request->user();

        $defaultDaily = Setting::where('key', 'pay_later_default_daily_limit')->value('value');
        $defaultDaily = $defaultDaily ? (float) $defaultDaily : 1000;

        $defaultWeekly = Setting::where('key', 'pay_later_default_weekly_limit')->value('value');
        $defaultWeekly = $defaultWeekly ? (float) $defaultWeekly : 2500;

        $totalLimit = (float) ($user->pay_later_credit_limit ?: ($user->payLaterFacility?->credit_limit ?: 5000));
        $dailyLimit = (float) ($user->pay_later_daily_limit ?: ($user->payLaterFacility?->daily_limit ?: $defaultDaily));
        $weeklyLimit = (float) ($user->pay_later_weekly_limit ?: ($user->payLaterFacility?->weekly_limit ?: $defaultWeekly));

        $usedCredit = (float) \App\Models\Invoice::whereHas('order', function ($q) use ($user) {
            $q->where('customer_id', $user->id);
        })
        ->whereIn('status', ['due', 'overdue'])
        ->sum('total_amount');

        $reservedCredit = (float) \App\Models\Order::where('customer_id', $user->id)
            ->where('payment_method', 'pay_later')
            ->where('payment_status', 'unpaid')
            ->where('status', '!=', 'cancelled')
            ->sum('reserved_credit_amount');

        $availableCredit = (float) max(0, $totalLimit - ($usedCredit + $reservedCredit));

        $dailyUsed = (float) \App\Models\Invoice::whereHas('order', function ($q) use ($user) {
            $q->where('customer_id', $user->id);
        })
        ->whereDate('created_at', now()->today())
        ->whereIn('status', ['due', 'overdue'])
        ->sum('total_amount');

        $dailyAvailable = $dailyLimit > 0 ? (float) max(0, $dailyLimit - $dailyUsed) : $availableCredit;

        $weeklyUsed = (float) \App\Models\Invoice::whereHas('order', function ($q) use ($user) {
            $q->where('customer_id', $user->id);
        })
        ->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])
        ->whereIn('status', ['due', 'overdue'])
        ->sum('total_amount');

        $weeklyAvailable = $weeklyLimit > 0 ? (float) max(0, $weeklyLimit - $weeklyUsed) : $availableCredit;

        $chartData = [];
        $currentYear = now()->year;
        for ($m = 1; $m <= 12; $m++) {
            $monthDate = \Carbon\Carbon::create($currentYear, $m, 1);
            $monthSpent = (float) \App\Models\Invoice::whereHas('order', function ($q) use ($user) {
                $q->where('customer_id', $user->id);
            })
            ->whereYear('created_at', $currentYear)
            ->whereMonth('created_at', $m)
            ->sum('total_amount');

            $chartData[] = [
                'month' => $monthDate->format('M Y'),
                'label' => $monthDate->format('M'),
                'spent' => $monthSpent,
            ];
        }

        $defaultSettingLimit = Setting::where('key', 'pay_later_default_limit')->value('value');
        $defaultSettingLimit = $defaultSettingLimit ? (float) $defaultSettingLimit : 5000;

        return $this->sendResponse([
            'status' => $user->pay_later_status ?? 'inactive',
            'credit_limit' => $totalLimit,
            'daily_limit' => $dailyLimit,
            'weekly_limit' => $weeklyLimit,
            'used_credit' => $usedCredit,
            'reserved_credit' => $reservedCredit,
            'available_credit' => $availableCredit,
            'daily_used_credit' => $dailyUsed,
            'daily_available_credit' => $dailyAvailable,
            'weekly_used_credit' => $weeklyUsed,
            'weekly_available_credit' => $weeklyAvailable,
            'rejection_reason' => $user->pay_later_rejection_reason,
            'has_card' => (bool) ($user->pay_later_pm_last_four || $user->pm_last_four),
            'card_last_four' => $user->pay_later_pm_last_four ?? $user->pm_last_four,
            'card_type' => $user->pay_later_pm_type ?? $user->pm_type ?? 'Credit',
            'chart_data' => $chartData,
            'default_limit' => $defaultSettingLimit,
        ], 'Pay Later summary retrieved successfully.');
    }

    /**
     * Get customer Pay Later credit transactions & audit ledger.
     */
    public function getPayLaterTransactions(Request $request)
    {
        $user = $request->user();
        
        $transactions = PayLaterTransaction::where('user_id', $user->id)
            ->with(['invoice', 'order'])
            ->latest()
            ->paginate(15);

        if ($transactions->isEmpty()) {
            $transactions = \App\Models\CreditTransaction::where('user_id', $user->id)
                ->with(['invoice', 'order'])
                ->latest()
                ->paginate(15);
        }

        return $this->sendResponse($transactions, 'Pay Later credit transactions retrieved successfully.');
    }

    /**
     * Get saved Pay Later credit cards for customer.
     */
    public function getPayLaterSavedCards(Request $request)
    {
        $user = $request->user();
        
        $cards = [];
        $lastFour = $user->pay_later_pm_last_four ?? $user->pm_last_four;
        $type = $user->pay_later_pm_type ?? $user->pm_type ?? 'Visa';
        $pmId = $user->pay_later_pm_id ?? $user->stripe_id;

        if ($lastFour) {
            $cards[] = [
                'id' => $pmId ?: 'pm_saved_default',
                'brand' => ucfirst($type),
                'last4' => $lastFour,
                'expMonth' => 12,
                'expYear' => 2028,
                'isDefault' => true,
                'funding' => 'credit',
            ];
        }

        return $this->sendResponse([
            'cards' => $cards,
            'has_card' => count($cards) > 0,
        ], 'Saved cards retrieved successfully.');
    }
}
