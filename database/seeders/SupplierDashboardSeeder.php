<?php

namespace Database\Seeders;

use App\Models\Invoice;
use App\Models\Message;
use App\Models\Order;
use App\Models\Quote;
use App\Models\QuoteRequest;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class SupplierDashboardSeeder extends Seeder
{
    public function run(): void
    {
        $supplier = User::where('email', 'sarah@supplier.com')->first();
        $customer = User::where('user_type', 'customer')->first();

        if (! $supplier || ! $customer) {
            $this->command->error('Supplier or Customer not found. Please run UserSeeder first.');

            return;
        }

        $supplierId = $supplier->id;
        $customerId = $customer->id;

        // Clear existing data for this supplier to have a clean slate
        Order::where('supplier_id', $supplierId)->delete();
        Quote::where('user_id', $supplierId)->delete();

        // 1. Create Data spread over the last 12 months
        for ($i = 0; $i < 12; $i++) {
            $date = Carbon::now()->subMonths($i);

            // Create 2-4 orders per month
            $count = rand(2, 4);
            for ($j = 0; $j < $count; $j++) {
                $status = ($i === 0 && $j === 0) ? 'in_progress' : 'delivered';

                $request = QuoteRequest::create([
                    'user_id' => $customerId,
                    'service_type' => 'Full House Move',
                    'pickup_address' => 'London, UK',
                    'delivery_address' => 'Manchester, UK',
                    'pickup_date' => $date->toDateString(),
                    'pickup_time_from' => '09:00:00',
                    'pickup_time_till' => '17:00:00',
                    'status' => 'completed',
                ]);

                $quote = Quote::create([
                    'quote_request_id' => $request->id,
                    'user_id' => $supplierId,
                    'amount' => rand(500, 2000),
                    'status' => 'accepted',
                    'created_at' => $date,
                    'updated_at' => $date,
                ]);

                $order = Order::create([
                    'order_number' => 'ORD-'.strtoupper(bin2hex(random_bytes(4))),
                    'quote_id' => $quote->id,
                    'customer_id' => $customerId,
                    'supplier_id' => $supplierId,
                    'total_amount' => $quote->amount,
                    'service_type' => $request->service_type,
                    'pickup_address' => $request->pickup_address,
                    'delivery_address' => $request->delivery_address,
                    'pickup_date' => $request->pickup_date,
                    'status' => $status,
                    'created_at' => $date,
                    'updated_at' => $date,
                ]);

                // Create Invoice
                $isPaid = rand(0, 10) > 2; // 80% chance of being paid
                Invoice::create([
                    'order_id' => $order->id,
                    'invoice_number' => 'INV-'.strtoupper(bin2hex(random_bytes(4))),
                    'supplier_amount' => $order->total_amount * 0.9,
                    'platform_fee' => $order->total_amount * 0.1,
                    'total_amount' => $order->total_amount,
                    'status' => $isPaid ? 'paid' : 'due',
                    'due_date' => $date->copy()->addDays(7),
                    'paid_at' => $isPaid ? $date->copy()->addDays(2) : null,
                    'created_at' => $date,
                    'updated_at' => $date,
                ]);
            }
        }

        // 2. Create some negotiations (Pending Quotes)
        for ($k = 0; $k < 3; $k++) {
            $request = QuoteRequest::create([
                'user_id' => $customerId,
                'service_type' => 'Office Relocation',
                'pickup_address' => 'London, UK',
                'delivery_address' => 'Birmingham, UK',
                'pickup_date' => now()->addDays(10)->toDateString(),
                'pickup_time_from' => '10:00:00',
                'pickup_time_till' => '16:00:00',
                'status' => 'active',
            ]);

            Quote::create([
                'quote_request_id' => $request->id,
                'user_id' => $supplierId,
                'amount' => rand(1000, 3000),
                'status' => 'pending',
            ]);
        }

        // 3. Create some Recent activity (Messages)
        $lastQuote = Quote::where('user_id', $supplierId)->latest()->first();
        for ($m = 0; $m < 5; $m++) {
            Message::create([
                'sender_id' => $customerId,
                'receiver_id' => $supplierId,
                'quote_id' => $lastQuote->id ?? 1,
                'message' => 'Hello, I have a question about the '.($m % 2 == 0 ? 'move' : 'quote').' price.',
                'created_at' => now()->subHours($m * 2),
            ]);
        }
    }
}
