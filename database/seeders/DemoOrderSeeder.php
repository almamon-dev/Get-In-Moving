<?php

namespace Database\Seeders;

use App\Models\Invoice;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderUpdate;
use App\Models\Quote;
use App\Models\QuoteRequest;
use App\Models\QuoteRequestItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DemoOrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customer = User::where('email', 'john@customer.com')->first() ?? User::where('user_type', 'customer')->first();
        $supplier = User::where('email', 'sarah@supplier.com')->first() ?? User::where('user_type', 'supplier')->first();

        if (!$customer || !$supplier) {
            $this->command->error('Customer or Supplier not found.');
            return;
        }

        $mamon = User::where('email', 'mamon193p@gmail.com')->first();
        if ($mamon) {
            $this->createDemoOrder($mamon, $supplier, 'confirmed', null, 'awaiting');
            $this->createDemoOrder($mamon, $supplier, 'delivered', 'uploads/orders/proofs/demo_pod.jpg', 'confirmed');
            $this->createNotifications($mamon);
        }

        $jane = User::where('email', 'jane@customer.com')->first();
        if ($jane) {
            $this->createDemoOrder($jane, $supplier, 'confirmed', null, 'awaiting');
            $this->createDemoOrder($jane, $supplier, 'in_progress', null, 'awaiting');
            $this->createDemoOrder($jane, $supplier, 'delivered', 'uploads/orders/proofs/demo_pod.jpg', 'pending');
            $this->createNotifications($jane);
        }

        $this->createDemoOrder($customer, $supplier, 'confirmed', null, 'awaiting');
        $this->createDemoOrder($customer, $supplier, 'in_progress', null, 'awaiting');
        $this->createDemoOrder($customer, $supplier, 'picked_up', null, 'awaiting');
        $this->createDemoOrder($customer, $supplier, 'delivered', 'uploads/orders/proofs/demo_pod.jpg', 'pending');
        $this->createDemoOrder($customer, $supplier, 'delivered', 'uploads/orders/proofs/demo_pod.jpg', 'confirmed');

        $this->command->info('Demo orders created successfully.');
    }

    private function createDemoOrder($customer, $supplier, $status, $podPath, $podStatus)
    {
        // 1. Create Quote Request
        $quoteRequest = QuoteRequest::create([
            'user_id' => $customer->id,
            'service_type' => 'Full House Move',
            'pickup_address' => '123 Pickup St, London, UK',
            'delivery_address' => '456 Delivery Ave, Manchester, UK',
            'pickup_date' => now()->addDays(rand(1, 10))->toDateString(),
            'pickup_time_from' => '09:00:00',
            'pickup_time_till' => '17:00:00',
            'additional_notes' => 'Handle with care. Large furniture included.',
            'status' => 'completed',
        ]);

        // 2. Add items to Quote Request
        QuoteRequestItem::create([
            'quote_request_id' => $quoteRequest->id,
            'item_type' => 'Furniture',
            'quantity' => 5,
            'weight' => 200,
            'length' => 120,
            'width' => 80,
            'height' => 100,
        ]);

        // 3. Create Quote
        $quote = Quote::create([
            'quote_request_id' => $quoteRequest->id,
            'user_id' => $supplier->id,
            'amount' => rand(500, 1500),
            'estimated_time' => '2 days',
            'status' => 'accepted',
        ]);

        // 4. Create Order
        $order = Order::create([
            'order_number' => 'ORD-' . strtoupper(Str::random(6)),
            'quote_id' => $quote->id,
            'customer_id' => $customer->id,
            'supplier_id' => $supplier->id,
            'total_amount' => $quote->amount,
            'service_type' => $quoteRequest->service_type,
            'pickup_address' => $quoteRequest->pickup_address,
            'delivery_address' => $quoteRequest->delivery_address,
            'pickup_date' => $quoteRequest->pickup_date,
            'estimated_time' => $quote->estimated_time,
            'status' => $status,
            'status_note' => 'Order processed through automated seeder.',
            'proof_of_delivery' => $podPath,
            'pod_status' => $podStatus,
        ]);

        // 5. Create Order Items
        OrderItem::create([
            'order_id' => $order->id,
            'item_type' => 'Furniture',
            'quantity' => 5,
            'weight' => 200,
            'length' => 120,
            'width' => 80,
            'height' => 100,
        ]);

        // 6. Create Invoice
        Invoice::create([
            'order_id' => $order->id,
            'invoice_number' => 'INV-' . (Invoice::count() + 300000),
            'supplier_amount' => $order->total_amount * 0.95,
            'platform_fee' => $order->total_amount * 0.05,
            'total_amount' => $order->total_amount,
            'status' => ($status === 'delivered') ? 'paid' : 'due',
            'due_date' => now()->addDays(14),
        ]);

        // Create Order Updates (Live Updates)
        $updates = [
            ['title' => 'Order Confirmed', 'description' => 'Your order has been confirmed by ' . $supplier->company_name . '.', 'status' => 'confirmed', 'created_at' => now()->subDays(1)],
        ];

        if (in_array($status, ['in_progress', 'picked_up', 'delivered'])) {
            $updates[] = ['title' => 'In Progress', 'description' => 'Supplier is preparing your order for pickup.', 'status' => 'in_progress', 'created_at' => now()->subHours(2)];
        }

        if (in_array($status, ['picked_up', 'delivered'])) {
            $updates[] = ['title' => 'Order Picked Up', 'description' => 'Order has been picked up from the origin location.', 'status' => 'picked_up', 'created_at' => now()->subHours(1)];
        }

        if ($status === 'delivered') {
            $updates[] = ['title' => 'Order Delivered', 'description' => 'Order has been delivered to the destination.', 'status' => 'delivered', 'created_at' => now()->subMinutes(15)];
        }

        foreach ($updates as $update) {
            $order->updates()->create($update);
        }

        return $order;
    }

    private function createNotifications($user)
    {
        $notifications = [
            [
                'id' => Str::uuid(),
                'type' => 'App\\Notifications\\NewQuoteSubmittedNotification',
                'notifiable_type' => 'App\\Models\\User',
                'notifiable_id' => $user->id,
                'data' => json_encode([
                    'message' => 'A new quote has been submitted for your request.',
                    'quote_id' => 1,
                    'amount' => 1200,
                ]),
                'created_at' => now()->subMinutes(30),
            ],
            [
                'id' => Str::uuid(),
                'type' => 'App\\Notifications\\OrderStatusUpdatedNotification',
                'notifiable_type' => 'App\\Models\\User',
                'notifiable_id' => $user->id,
                'data' => json_encode([
                    'message' => 'Your order ORD-ABC123 is now in progress.',
                    'order_id' => 1,
                    'status' => 'in_progress',
                ]),
                'created_at' => now()->subHours(2),
            ],
            [
                'id' => Str::uuid(),
                'type' => 'App\\Notifications\\RevisedQuoteNotification',
                'notifiable_type' => 'App\\Models\\User',
                'notifiable_id' => $user->id,
                'data' => json_encode([
                    'message' => 'A supplier has revised their quote for your request.',
                    'quote_id' => 2,
                    'new_amount' => 1100,
                ]),
                'created_at' => now()->subDays(1),
            ],
        ];

        foreach ($notifications as $notification) {
            DB::table('notifications')->insert($notification);
        }
    }
}
