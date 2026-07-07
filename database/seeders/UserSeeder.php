<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // Create Admin User
        User::firstOrCreate(
            ['email' => 'admin@getitmoving.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('admin123'),
                'user_type' => 'admin',
                'phone_number' => '01700000000',
                'company_name' => 'Get It Moving',
                'is_verified' => true,
                'email_verified_at' => now(),
                'verified_at' => now(),
                'terms_accepted_at' => now(),
            ]
        );

        // Create 3 Suppliers with Stripe Connected
        for ($i = 1; $i <= 3; $i++) {
            $user = User::updateOrCreate(
                ['email' => 'supplier' . $i . '@gmail.com'],
                [
                    'name' => 'Supplier ' . $i,
                    'password' => Hash::make('password'),
                    'user_type' => 'supplier',
                    'company_name' => 'Supplier Co ' . $i,
                    'phone_number' => '017000' . rand(10000, 99999),
                    'status' => 'active',
                    'is_verified' => true,
                    'email_verified_at' => now(),
                    'verified_at' => now(),
                    'terms_accepted_at' => now(),
                    'is_stripe_connected' => true,
                    'stripe_account_id' => 'acct_1' . uniqid(),
                ]
            );

            // Create active subscription for the supplier
            \App\Models\UserSubscription::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'pricing_plan_id' => \App\Models\PricingPlan::first()->id ?? 1,
                    'started_at' => now(),
                    'expires_at' => now()->addYear(),
                    'status' => 'active',
                    'is_trial' => false,
                    'auto_renew' => true,
                ]
            );
        }

        // Create 2 Customers
        for ($i = 1; $i <= 2; $i++) {
            $user = User::updateOrCreate(
                ['email' => 'customer' . $i . '@gmail.com'],
                [
                    'name' => 'Customer ' . $i,
                    'password' => Hash::make('password'),
                    'user_type' => 'customer',
                    'company_name' => 'Customer Co ' . $i,
                    'phone_number' => '018000' . rand(10000, 99999),
                    'status' => 'active',
                    'is_verified' => true,
                    'email_verified_at' => now(),
                    'verified_at' => now(),
                    'terms_accepted_at' => now(),
                ]
            );

            $customerPlan = \App\Models\PricingPlan::where('user_type', 'customer')->first();
            if ($customerPlan) {
                \App\Models\UserSubscription::firstOrCreate(
                    ['user_id' => $user->id],
                    [
                        'pricing_plan_id' => $customerPlan->id,
                        'started_at' => now(),
                        'expires_at' => now()->addYear(),
                        'status' => 'active',
                        'is_trial' => false,
                        'auto_renew' => true,
                    ]
                );
            }
        }
    }
}
