<?php

namespace Database\Seeders;

use App\Models\PricingPlan;
use Illuminate\Database\Seeder;

class PricingPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Supplier Plans (with Free Trial)
        $supplierPlans = [
            [
                'name' => 'Free Trial',
                'user_type' => 'supplier',
                'price' => 1.00,
                'billing_period' => 'trial',
                'trial_days' => 7,
                'is_active' => true,
                'is_popular' => false,
                'order' => 1,
                'features' => [
                    'Accept and manage transport jobs',
                    'Update job status and delivery progress',
                    'Upload proof of delivery (POD) documents',
                    'Communicate with clients through the platform',
                    'Access job history, earnings, and payments',
                ],
            ],
            [
                'name' => 'Monthly',
                'user_type' => 'supplier',
                'price' => 1.00,
                'billing_period' => 'monthly',
                'trial_days' => 0,
                'is_active' => true,
                'is_popular' => true,
                'order' => 2,
                'features' => [
                    'Accept and manage transport jobs',
                    'Update job status and delivery progress',
                    'Upload proof of delivery (POD) documents',
                    'Communicate with clients through the platform',
                    'Access job history, earnings, and payments',
                    'Priority support',
                ],
            ],
            [
                'name' => 'Annual',
                'user_type' => 'supplier',
                'price' => 1.00,
                'billing_period' => 'annual',
                'trial_days' => 0,
                'is_active' => true,
                'is_popular' => false,
                'order' => 3,
                'features' => [
                    'Accept and manage transport jobs',
                    'Update job status and delivery progress',
                    'Upload proof of delivery (POD) documents',
                    'Communicate with clients through the platform',
                    'Access job history, earnings, and payments',
                    'Priority support',
                    '2 months free (save €318)',
                ],
            ],
        ];

        // Customer Plans (NO Free Trial - Must Buy)
        $customerPlans = [
            [
                'name' => 'Monthly',
                'user_type' => 'customer',
                'price' => 1.00,
                'billing_period' => 'monthly',
                'trial_days' => 0,
                'is_active' => true,
                'is_popular' => true,
                'order' => 1,
                'features' => [
                    'Create and manage unlimited transport orders',
                    'Receive and compare supplier quotes',
                    'Track live order progress and delivery status',
                    'Access invoices, billing history, and proof of delivery (POD)',
                    'Email notifications for order updates',
                ],
            ],
            [
                'name' => 'Quarterly',
                'user_type' => 'customer',
                'price' => 1.00,
                'billing_period' => 'quarterly',
                'trial_days' => 0,
                'is_active' => true,
                'is_popular' => false,
                'order' => 2,
                'features' => [
                    'Create and manage unlimited transport orders',
                    'Receive and compare supplier quotes',
                    'Track live order progress and delivery status',
                    'Access invoices, billing history, and proof of delivery (POD)',
                    'Email notifications for order updates',
                    'Priority support',
                ],
            ],
            [
                'name' => 'Annual',
                'user_type' => 'customer',
                'price' => 1.00,
                'billing_period' => 'annual',
                'trial_days' => 0,
                'is_active' => true,
                'is_popular' => false,
                'order' => 3,
                'features' => [
                    'Create and manage unlimited transport orders',
                    'Receive and compare supplier quotes',
                    'Track live order progress and delivery status',
                    'Access invoices, billing history, and proof of delivery (POD)',
                    'Email notifications for order updates',
                    'Priority support',
                    '6 months free (save €414)',
                ],
            ],
        ];

        $allPlans = array_merge($supplierPlans, $customerPlans);

        foreach ($allPlans as $plan) {
            // Push to Stripe if configured
            if (env('STRIPE_SECRET') && $plan['price'] > 0) {
                try {
                    $stripe = \Laravel\Cashier\Cashier::stripe();
                    
                    $interval = match ($plan['billing_period']) {
                        'annual' => 'year',
                        default => 'month',
                    };
                    $intervalCount = ($plan['billing_period'] === 'quarterly') ? 3 : 1;
                    $productName = $plan['name'] . ' (' . ucfirst($plan['user_type']) . ')';

                    // 1. Search if product already exists in Stripe
                    $existingProducts = $stripe->products->search([
                        'query' => "name:'" . $productName . "' AND active:'true'",
                        'limit' => 1,
                    ]);

                    if (count($existingProducts->data) > 0) {
                        $product = $existingProducts->data[0];
                        $this->command->info("Found existing Stripe Product: {$productName}");

                        // Find existing price for this product
                        $existingPrices = $stripe->prices->search([
                            'query' => "product:'" . $product->id . "' AND active:'true'",
                            'limit' => 1,
                        ]);

                        if (count($existingPrices->data) > 0) {
                            $price = $existingPrices->data[0];
                        } else {
                            // Create price if missing
                            $price = $stripe->prices->create([
                                'product' => $product->id,
                                'unit_amount' => $plan['price'] * 100,
                                'currency' => config('cashier.currency', 'eur'), // using eur as per previous logic
                                'recurring' => ['interval' => $interval, 'interval_count' => $intervalCount],
                            ]);
                        }
                    } else {
                        // 2. Create new Product and Price if not found
                        $product = $stripe->products->create([
                            'name' => $productName,
                            'description' => ucfirst($plan['user_type']) . ' Plan',
                        ]);

                        $price = $stripe->prices->create([
                            'product' => $product->id,
                            'unit_amount' => $plan['price'] * 100, // Stripe uses cents
                            'currency' => config('cashier.currency', 'eur'),
                            'recurring' => ['interval' => $interval, 'interval_count' => $intervalCount],
                        ]);
                        $this->command->info("Created new Stripe Product: {$productName}");
                    }

                    $plan['stripe_product_id'] = $product->id;
                    $plan['stripe_price_id'] = $price->id;
                    
                } catch (\Exception $e) {
                    $this->command->error("Stripe Error for {$plan['name']}: " . $e->getMessage());
                }
            }

            PricingPlan::create($plan);
        }
    }
}
