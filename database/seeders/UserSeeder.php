<?php

namespace Database\Seeders;

use App\Models\PricingPlan;
use App\Models\User;
use App\Models\UserSubscription;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get some plans
        $customerPlan = PricingPlan::where('user_type', 'customer')->first();
        $supplierPlan = PricingPlan::where('user_type', 'supplier')->first();

        // Create Admin User
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@getitmoving.com',
            'password' => Hash::make('admin123'),
            'user_type' => 'admin',
            'phone_number' => '01700000000',
            'company_name' => 'Get It Moving',
            'is_verified' => true,
            'email_verified_at' => now(),
            'verified_at' => now(),
            'terms_accepted_at' => now(),
        ]);

        // Create 3 Customers
        $customers = [
            [
                'name' => 'John Doe',
                'email' => 'john@customer.com',
                'password' => Hash::make('password123'),
                'user_type' => 'customer',
                'phone_number' => '01712345671',
                'company_name' => 'ABC Company',
                'is_verified' => true,
                'email_verified_at' => now(),
                'verified_at' => now(),
                'terms_accepted_at' => now(),
            ],
            [
                'name' => 'Jane Smith',
                'email' => 'jane@customer.com',
                'password' => Hash::make('password123'),
                'user_type' => 'customer',
                'phone_number' => '01712345672',
                'company_name' => null,
                'is_verified' => true,
                'email_verified_at' => now(),
                'verified_at' => now(),
                'terms_accepted_at' => now(),
            ],
            [
                'name' => 'Mike Johnson',
                'email' => 'mike@customer.com',
                'password' => Hash::make('password123'),
                'user_type' => 'customer',
                'phone_number' => '01712345673',
                'company_name' => 'XYZ Corp',
                'is_verified' => true,
                'email_verified_at' => now(),
                'verified_at' => now(),
                'terms_accepted_at' => now(),
            ],
            [
                'name' => 'AL Mamon',
                'email' => 'mamon193p@gmail.com',
                'password' => Hash::make('password123'),
                'user_type' => 'customer',
                'phone_number' => '01712345673',
                'company_name' => 'XYZ Corp',
                'is_verified' => false,
                'email_verified_at' => now(),
                'verified_at' => now(),
                'terms_accepted_at' => now(),
            ],
        ];

        foreach ($customers as $customerData) {
            $user = User::create($customerData);

            // Create Subscription for customer
            if ($customerPlan) {
                UserSubscription::create([
                    'user_id' => $user->id,
                    'pricing_plan_id' => $customerPlan->id,
                    'started_at' => now(),
                    'expires_at' => now()->addMonth(),
                    'status' => 'active',
                    'is_trial' => false,
                ]);
            }
        }

        // Create 3 Suppliers
        $suppliers = [
            [
                'name' => 'Sarah Williams',
                'email' => 'sarah@supplier.com',
                'password' => Hash::make('password123'),
                'user_type' => 'supplier',
                'company_name' => 'Swift Logistics Ltd',
                'phone_number' => '01812345671',
                'insurance_type' => 'Commercial Auto Insurance',
                'insurance_provider_name' => 'Allianz Insurance',
                'policy_number' => 'POL-2024-001',
                'policy_expiry_date' => '2025-12-31',
                'insurance_document' => null,
                'license_document' => null,
                'is_verified' => true,
                'email_verified_at' => now(),
                'verified_at' => now(),
                'is_compliance_verified' => true,
                'compliance_verified_at' => now(),
                'terms_accepted_at' => now(),
            ],
            [
                'name' => 'David Brown',
                'email' => 'david@supplier.com',
                'password' => Hash::make('password123'),
                'user_type' => 'supplier',
                'company_name' => 'Express Movers Inc',
                'phone_number' => '01812345672',
                'insurance_type' => 'Liability Insurance',
                'insurance_provider_name' => 'AXA Insurance',
                'policy_number' => 'POL-2024-002',
                'policy_expiry_date' => '2026-06-30',
                'insurance_document' => null,
                'license_document' => null,
                'is_verified' => true,
                'email_verified_at' => now(),
                'verified_at' => now(),
                'is_compliance_verified' => true,
                'compliance_verified_at' => now(),
                'terms_accepted_at' => now(),
            ],
            [
                'name' => 'David Brown',
                'email' => 'mamonsoftvence@gmail.com',
                'password' => Hash::make('password123'),
                'user_type' => 'supplier',
                'company_name' => 'Express Movers Inc',
                'phone_number' => '01812345672',
                'insurance_type' => 'Liability Insurance',
                'insurance_provider_name' => 'AXA Insurance',
                'policy_number' => 'POL-2024-002',
                'policy_expiry_date' => '2026-06-30',
                'insurance_document' => null,
                'license_document' => null,
                'is_verified' => false,
                'email_verified_at' => now(),
                'verified_at' => now(),
                'is_compliance_verified' => false,
                'compliance_verified_at' => null,
                'terms_accepted_at' => now(),
            ],
            [
                'name' => 'Emily Davis',
                'email' => 'emily@supplier.com',
                'password' => Hash::make('password123'),
                'user_type' => 'supplier',
                'company_name' => 'Prime Transport Services',
                'phone_number' => '01812345673',
                'insurance_type' => 'Comprehensive Insurance',
                'insurance_provider_name' => 'MetLife Insurance',
                'policy_number' => 'POL-2024-003',
                'policy_expiry_date' => '2025-09-15',
                'insurance_document' => null,
                'license_document' => null,
                'is_verified' => true,
                'email_verified_at' => now(),
                'verified_at' => now(),
                'is_compliance_verified' => false, // This one is pending compliance
                'compliance_verified_at' => null,
                'terms_accepted_at' => now(),
            ],
        ];

        foreach ($suppliers as $supplierData) {
            $user = User::create($supplierData);

            // Create Subscription for supplier
            if ($supplierPlan) {
                UserSubscription::create([
                    'user_id' => $user->id,
                    'pricing_plan_id' => $supplierPlan->id,
                    'started_at' => now(),
                    'expires_at' => now()->addMonth(),
                    'status' => 'active',
                    'is_trial' => $supplierPlan->billing_period === 'trial',
                ]);
            }
        }
    }
    // comand all credential
    // admin: admin@admin.com / password123
    // customer: customer@customer.com / password123
    // supplier: supplier@supplier.com / password123
    // customer: mamon193p@gmail.com / password123
    // supplier: mamonsoftvence@gmail.com / password123

}
