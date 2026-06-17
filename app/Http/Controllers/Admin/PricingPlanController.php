<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricingPlan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PricingPlanController extends Controller
{
    /**
     * Display a listing of pricing plans.
     */
    public function index()
    {
        $supplierPlans = PricingPlan::where('user_type', 'supplier')
            ->orderBy('order')
            ->get();

        $customerPlans = PricingPlan::where('user_type', 'customer')
            ->orderBy('order')
            ->get();

        return Inertia::render('Admin/PricingPlans/Index', [
            'supplierPlans' => $supplierPlans,
            'customerPlans' => $customerPlans,
        ]);
    }

    /**
     * Show the form for creating a new pricing plan.
     */
    public function create()
    {
        return Inertia::render('Admin/PricingPlans/Create');
    }

    /**
     * Store a newly created pricing plan.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'user_type' => 'required|in:customer,supplier',
            'price' => 'required|numeric|min:0',
            'billing_period' => 'required|in:trial,monthly,quarterly,annual',
            'trial_days' => 'nullable|integer|min:0',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
            'is_popular' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        if (env('STRIPE_SECRET') && $validated['price'] > 0) {
            $stripe = \Laravel\Cashier\Cashier::stripe();
            
            $interval = match ($validated['billing_period']) {
                'annual' => 'year',
                default => 'month',
            };
            $intervalCount = ($validated['billing_period'] === 'quarterly') ? 3 : 1;

            try {
                $product = $stripe->products->create([
                    'name' => $validated['name'],
                    'description' => ucfirst($validated['user_type']) . ' Plan',
                ]);

                $price = $stripe->prices->create([
                    'product' => $product->id,
                    'unit_amount' => $validated['price'] * 100, // Stripe uses cents
                    'currency' => config('cashier.currency', 'usd'),
                    'recurring' => ['interval' => $interval, 'interval_count' => $intervalCount],
                ]);

                $validated['stripe_product_id'] = $product->id;
                $validated['stripe_price_id'] = $price->id;
            } catch (\Exception $e) {
                // Log or handle Stripe error
                \Log::error('Stripe Pricing Plan Creation Error: ' . $e->getMessage());
            }
        }

        PricingPlan::create($validated);

        return redirect()->route('admin.pricing-plans.index')
            ->with('success', 'Pricing plan created successfully.');
    }

    /**
     * Display the specified pricing plan.
     */
    public function show(PricingPlan $pricingPlan)
    {
        return Inertia::render('Admin/PricingPlans/Show', [
            'pricingPlan' => $pricingPlan,
        ]);
    }

    /**
     * Show the form for editing the specified pricing plan.
     */
    public function edit(PricingPlan $pricingPlan)
    {
        return Inertia::render('Admin/PricingPlans/Edit', [
            'pricingPlan' => $pricingPlan,
        ]);
    }

    /**
     * Update the specified pricing plan.
     */
    public function update(Request $request, PricingPlan $pricingPlan)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'user_type' => 'required|in:customer,supplier',
            'price' => 'required|numeric|min:0',
            'billing_period' => 'required|in:trial,monthly,quarterly,annual',
            'trial_days' => 'nullable|integer|min:0',
            'features' => 'nullable|array',
            'is_active' => 'boolean',
            'is_popular' => 'boolean',
            'order' => 'nullable|integer',
        ]);

        if (env('STRIPE_SECRET')) {
            $stripe = \Laravel\Cashier\Cashier::stripe();
            try {
                // If the product exists and name changed, update the product name
                if ($pricingPlan->stripe_product_id && $pricingPlan->name !== $validated['name']) {
                    $stripe->products->update($pricingPlan->stripe_product_id, [
                        'name' => $validated['name'],
                    ]);
                }

                // If price or billing period changed, we must create a new Price in Stripe
                if (
                    $validated['price'] > 0 && 
                    ($pricingPlan->price != $validated['price'] || $pricingPlan->billing_period !== $validated['billing_period'])
                ) {
                    $interval = match ($validated['billing_period']) {
                        'annual' => 'year',
                        default => 'month',
                    };
                    $intervalCount = ($validated['billing_period'] === 'quarterly') ? 3 : 1;

                    // Reuse existing product if possible, else create one
                    $productId = $pricingPlan->stripe_product_id;
                    if (!$productId) {
                        $product = $stripe->products->create([
                            'name' => $validated['name'],
                            'description' => ucfirst($validated['user_type']) . ' Plan',
                        ]);
                        $productId = $product->id;
                        $validated['stripe_product_id'] = $productId;
                    }

                    $newPrice = $stripe->prices->create([
                        'product' => $productId,
                        'unit_amount' => $validated['price'] * 100,
                        'currency' => config('cashier.currency', 'usd'),
                        'recurring' => ['interval' => $interval, 'interval_count' => $intervalCount],
                    ]);

                    $validated['stripe_price_id'] = $newPrice->id;
                }
            } catch (\Exception $e) {
                \Log::error('Stripe Pricing Plan Update Error: ' . $e->getMessage());
            }
        }

        $pricingPlan->update($validated);

        return redirect()->route('admin.pricing-plans.index')
            ->with('success', 'Pricing plan updated successfully.');
    }

    /**
     * Remove the specified pricing plan.
     */
    public function destroy(PricingPlan $pricingPlan)
    {
        $pricingPlan->delete();

        return redirect()->route('admin.pricing-plans.index')
            ->with('success', 'Pricing plan deleted successfully.');
    }

    /**
     * Toggle active status.
     */
    public function toggleActive(PricingPlan $pricingPlan)
    {
        $pricingPlan->update([
            'is_active' => ! $pricingPlan->is_active,
        ]);

        return redirect()->back()
            ->with('success', 'Plan status updated successfully.');
    }

    /**
     * Bulk delete pricing plans.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:pricing_plans,id',
        ]);

        PricingPlan::whereIn('id', $request->ids)->delete();

        return redirect()->back()
            ->with('success', 'Selected plans deleted successfully.');
    }
}
