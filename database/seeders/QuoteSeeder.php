<?php

namespace Database\Seeders;

use App\Models\Quote;
use App\Models\QuoteRequest;
use App\Models\User;
use Illuminate\Database\Seeder;

class QuoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = User::where('user_type', 'customer')->get();
        if ($customers->isEmpty()) {
            $customers = User::all();
        }

        $supplier = User::where('user_type', 'supplier')->first() ?? User::first();

        if ($customers->isEmpty() || ! $supplier) {
            $this->command->error('Please ensure UserSeeder has run to create customers and suppliers!');

            return;
        }

        foreach ($customers as $customer) {
            $quotesData = [
                // Request 1: Active with Supplier Quote & Extra Charges
                [
                    'request' => [
                        'user_id' => $customer->id,
                        'pickup_address' => 'Amsterdam, North Holland, 1015 CJ, Netherlands',
                        'pickup_city' => 'Amsterdam',
                        'pickup_state' => 'North Holland',
                        'pickup_zip' => '1015 CJ',
                        'pickup_country' => 'Netherlands',

                        'delivery_address' => 'Rotterdam, South Holland, 3011 AD, Netherlands',
                        'delivery_city' => 'Rotterdam',
                        'delivery_state' => 'South Holland',
                        'delivery_zip' => '3011 AD',
                        'delivery_country' => 'Netherlands',

                        'pickup_date' => now()->addDays(2)->format('Y-m-d'),
                        'pickup_time_from' => '09:00:00',
                        'pickup_time_till' => '12:00:00',
                        'delivery_date' => now()->addDays(3)->format('Y-m-d'),
                        'delivery_time_from' => '14:00:00',
                        'delivery_time_till' => '18:00:00',
                        'additional_notes' => 'Please handle with care. Fragile electronic equipment onboard.',
                        'requested_date' => now()->format('Y-m-d'),
                        'status' => 'active',
                    ],
                    'items' => [
                        ['item_type' => 'Euro pallets', 'quantity' => 5, 'length' => 120, 'width' => 80, 'height' => 100, 'weight' => 500],
                    ],
                    'quote' => [
                        'user_id' => $supplier->id,
                        'base_amount' => 291.00,
                        'amount' => 320.00,
                        'estimated_time' => '1 Day',
                        'notes' => 'Express freight transport between Amsterdam and Rotterdam. Includes GPS tracking.',
                        'valid_until' => now()->addDays(7),
                        'status' => 'pending',
                    ],
                    'extra_charges' => [
                        ['type' => 'Packaging', 'custom_name' => 'Packaging', 'amount' => 23.00],
                        ['type' => 'Handling', 'custom_name' => 'Handling', 'amount' => 6.00],
                    ],
                ],

                // Request 2: Active with Supplier Quote (Cross-border)
                [
                    'request' => [
                        'user_id' => $customer->id,
                        'pickup_address' => 'Brussels, Brussels-Capital, 1000, Belgium',
                        'pickup_city' => 'Brussels',
                        'pickup_state' => 'Brussels-Capital',
                        'pickup_zip' => '1000',
                        'pickup_country' => 'Belgium',

                        'delivery_address' => 'Paris, Île-de-France, 75001, France',
                        'delivery_city' => 'Paris',
                        'delivery_state' => 'Île-de-France',
                        'delivery_zip' => '75001',
                        'delivery_country' => 'France',

                        'pickup_date' => now()->addDays(4)->format('Y-m-d'),
                        'pickup_time_from' => '08:00:00',
                        'pickup_time_till' => '11:00:00',
                        'delivery_date' => now()->addDays(6)->format('Y-m-d'),
                        'delivery_time_from' => '10:00:00',
                        'delivery_time_till' => '16:00:00',
                        'additional_notes' => 'Cross-border logistics consignment. 10-ton covered truck required.',
                        'requested_date' => now()->subDays(1)->format('Y-m-d'),
                        'status' => 'active',
                    ],
                    'items' => [
                        ['item_type' => 'Industrial pallets', 'quantity' => 12, 'length' => 120, 'width' => 100, 'height' => 160, 'weight' => 1200],
                    ],
                    'quote' => [
                        'user_id' => $supplier->id,
                        'base_amount' => 450.00,
                        'amount' => 500.00,
                        'estimated_time' => '2 Days',
                        'notes' => 'Inter-country Freight via E19/A2. Heavy cargo insurance included.',
                        'valid_until' => now()->addDays(10),
                        'status' => 'pending',
                    ],
                    'extra_charges' => [
                        ['type' => 'Fuel Surcharge', 'custom_name' => 'Fuel Surcharge', 'amount' => 50.00],
                    ],
                ],

                // Request 3: Pending Quote Request (Open for new supplier quotes)
                [
                    'request' => [
                        'user_id' => $customer->id,
                        'pickup_address' => 'Berlin, Brandenburg, 10115, Germany',
                        'pickup_city' => 'Berlin',
                        'pickup_state' => 'Brandenburg',
                        'pickup_zip' => '10115',
                        'pickup_country' => 'Germany',

                        'delivery_address' => 'Amsterdam, North Holland, 1016 GD, Netherlands',
                        'delivery_city' => 'Amsterdam',
                        'delivery_state' => 'North Holland',
                        'delivery_zip' => '1016 GD',
                        'delivery_country' => 'Netherlands',

                        'pickup_date' => now()->addDays(5)->format('Y-m-d'),
                        'pickup_time_from' => '10:00:00',
                        'pickup_time_till' => '13:00:00',
                        'delivery_date' => now()->addDays(7)->format('Y-m-d'),
                        'delivery_time_from' => '16:00:00',
                        'delivery_time_till' => '20:00:00',
                        'additional_notes' => 'Bulk corrugated packaging boxes. Liftgate required at pickup.',
                        'requested_date' => now()->subDays(2)->format('Y-m-d'),
                        'status' => 'active',
                    ],
                    'items' => [
                        ['item_type' => 'Box Container', 'quantity' => 8, 'length' => 60, 'width' => 40, 'height' => 50, 'weight' => 320],
                    ],
                ],

                // Request 4: Local Netherlands Express
                [
                    'request' => [
                        'user_id' => $customer->id,
                        'pickup_address' => 'IJmuiden, North Holland, 1976 SM, Netherlands',
                        'pickup_city' => 'IJmuiden',
                        'pickup_state' => 'North Holland',
                        'pickup_zip' => '1976 SM',
                        'pickup_country' => 'Netherlands',

                        'delivery_address' => 'Rotterdam, South Holland, 3044 AT, Netherlands',
                        'delivery_city' => 'Rotterdam',
                        'delivery_state' => 'South Holland',
                        'delivery_zip' => '3044 AT',
                        'delivery_country' => 'Netherlands',

                        'pickup_date' => now()->addDays(1)->format('Y-m-d'),
                        'pickup_time_from' => '09:30:00',
                        'pickup_time_till' => '12:30:00',
                        'delivery_date' => now()->addDays(2)->format('Y-m-d'),
                        'delivery_time_from' => '13:00:00',
                        'delivery_time_till' => '17:00:00',
                        'additional_notes' => 'Standard palletized freight.',
                        'requested_date' => now()->format('Y-m-d'),
                        'status' => 'active',
                    ],
                    'items' => [
                        ['item_type' => 'Standard pallets', 'quantity' => 2, 'length' => 120, 'width' => 80, 'height' => 120, 'weight' => 180],
                    ],
                    'quote' => [
                        'user_id' => $supplier->id,
                        'base_amount' => 180.00,
                        'amount' => 200.00,
                        'estimated_time' => '1 Day',
                        'notes' => 'Local port transport via A4 highway.',
                        'valid_until' => now()->addDays(5),
                        'status' => 'pending',
                    ],
                    'extra_charges' => [
                        ['type' => 'Liftgate', 'custom_name' => 'Liftgate Service', 'amount' => 20.00],
                    ],
                ],
            ];

            foreach ($quotesData as $data) {
                $quoteRequest = QuoteRequest::create($data['request']);

                foreach ($data['items'] as $item) {
                    $quoteRequest->items()->create($item);
                }

                if (isset($data['quote'])) {
                    $quoteData = array_merge($data['quote'], [
                        'quote_request_id' => $quoteRequest->id,
                    ]);
                    $quote = Quote::create($quoteData);

                    if (isset($data['extra_charges']) && is_array($data['extra_charges'])) {
                        foreach ($data['extra_charges'] as $extra) {
                            $quote->extraCharges()->create($extra);
                        }
                    }
                }
            }
        }

        $this->command->info('Successfully seeded quote requests and supplier quotes!');
    }
}
