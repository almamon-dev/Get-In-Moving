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

                    $product = $stripe->products->create([
                        'name' => $plan['name'] . ' (' . ucfirst($plan['user_type']) . ')',
                        'description' => ucfirst($plan['user_type']) . ' Plan',
                    ]);

                    $price = $stripe->prices->create([
                        'product' => $product->id,
                        'unit_amount' => $plan['price'] * 100, // Stripe uses cents
                        'currency' => config('cashier.currency', 'usd'),
                        'recurring' => ['interval' => $interval, 'interval_count' => $intervalCount],
                    ]);

                    $plan['stripe_product_id'] = $product->id;
                    $plan['stripe_price_id'] = $price->id;
                    
                    $this->command->info("Created Stripe Product: {$plan['name']} ({$plan['user_type']})");
                } catch (\Exception $e) {
                    $this->command->error("Stripe Error for {$plan['name']}: " . $e->getMessage());
                }
            }

            PricingPlan::create($plan);
        }
    }
}
