<?php

namespace Database\Seeders;

use App\Models\Quote;
use App\Models\QuoteRequest;
use App\Models\QuoteRequestItem;
use App\Models\User;
use Illuminate\Database\Seeder;

class QuoteRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = User::where('user_type', 'customer')->get();

        if ($customers->isEmpty()) {
            $this->command->info('No customers found. Creating some...');
            User::factory()->count(3)->create(['user_type' => 'customer']);
            $customers = User::where('user_type', 'customer')->get();
        }

        foreach ($customers as $customer) {
            // Create 3 quote requests for each customer to test variety
            for ($i = 1; $i <= 3; $i++) {
                $request = QuoteRequest::create([
                    'user_id' => $customer->id,
                    'service_type' => ['Full Truckload', 'Less Than Truckload', 'Road Freight', 'Pallet Transport'][rand(0, 3)],
                    'pickup_address' => 'Pickup Address '.$i.', City '.$customer->id,
                    'delivery_address' => 'Delivery Address '.$i.', City '.($customer->id + 1),
                    'pickup_date' => now()->addDays(rand(5, 20)),
                    'pickup_time_from' => '09:00:00',
                    'pickup_time_till' => '17:00:00',
                    'additional_notes' => 'Handle with care. This is a clean seed request without any quotes.',
                    'status' => 'active',
                ]);

                // Create random items for each request
                $itemCount = rand(1, 4);
                for ($j = 1; $j <= $itemCount; $j++) {
                    QuoteRequestItem::create([
                        'quote_request_id' => $request->id,
                        'item_type' => ['Euro pallets', 'Boxes', 'Furniture', 'Electronics'][rand(0, 3)],
                        'quantity' => rand(1, 20),
                        'length' => rand(50, 200),
                        'width' => rand(50, 150),
                        'height' => rand(50, 200),
                        'weight' => rand(10, 1000),
                    ]);
                }
            }
        }

        $this->command->info('Quote requests seeded successfully without supplier quotes.');
    }
}
