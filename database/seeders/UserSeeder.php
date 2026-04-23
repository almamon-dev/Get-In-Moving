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
    }
}
