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
                'price' => 0.00,
                'billing_period' => 'trial',
                'trial_days' => 30,
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
                'price' => 159.00,
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
                'price' => 499.00,
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
                    '2 months free (save $318)',
                ],
            ],
        ];

        // Customer Plans (NO Free Trial - Must Buy)
        $customerPlans = [
            [
                'name' => 'Monthly',
                'user_type' => 'customer',
                'price' => 69.00,
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
                'price' => 159.00,
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
                'price' => 499.00,
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
                    '6 months free (save $414)',
                ],
            ],
        ];

        foreach ($supplierPlans as $plan) {
            PricingPlan::create($plan);
        }

        foreach ($customerPlans as $plan) {
            PricingPlan::create($plan);
        }
    }
}
