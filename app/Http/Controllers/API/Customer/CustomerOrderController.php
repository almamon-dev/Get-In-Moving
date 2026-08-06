<?php

namespace App\Http\Controllers\API\Customer;

use App\Http\Controllers\Controller;
use App\Http\Resources\API\Supplier\OrderResource;
use App\Models\Order;
use App\Models\Review;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CustomerOrderController extends Controller
{
    use ApiResponse;

    /**
     * Get list of orders for the customer.
     */
    public function getMyOrders(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $paymentMethodFilter = $request->input('payment_method');

        $query = Order::with(['items', 'supplier', 'review', 'updates', 'invoice', 'invoice.payments'])
            ->where('customer_id', $request->user()->id);

        if ($paymentMethodFilter === 'pay_later') {
            $query->whereHas('invoice', function ($q) {
                $q->whereNotNull('due_date');
            });
        }

        $orders = ($perPage === 'all' || $perPage == 0)
            ? $query->latest()->get()
            : $query->latest()->paginate((int)$perPage);

        if ($orders instanceof \Illuminate\Pagination\LengthAwarePaginator) {
            $orders->setCollection(OrderResource::collection($orders->getCollection())->collection);
        } else {
            $orders = OrderResource::collection($orders);
        }

        return $this->sendResponse($orders, 'Your orders retrieved.');
    }

    /**
     * Get details of a specific order.
     */
    public function getOrderDetails($id)
    {
        $order = Order::with(['items', 'supplier', 'quote.quoteRequest', 'review', 'updates'])
            ->where(function ($q) use ($id) {
                $q->where('id', $id)->orWhere('order_number', $id);
            })
            ->first();

        if (! $order || $order->customer_id !== auth()->id()) {
            return $this->sendError('Order not found.', [], 404);
        }

        return $this->sendResponse(new OrderResource($order), 'Order details retrieved.');
    }

    /**
     * Download Proof of Delivery for an order.
     */
    public function downloadPod($id)
    {
        $order = Order::find($id);

        if (! $order || $order->customer_id !== auth()->id()) {
            return $this->sendError('Order not found.', [], 404);
        }

        if (! $order->proof_of_delivery) {
            return $this->sendError('Proof of Delivery not found.', [], 404);
        }

        $path = public_path($order->proof_of_delivery);

        if (! file_exists($path)) {
            return $this->sendError('File not found on server.', [], 404);
        }

        return response()->download($path);
    }

    /**
     * Approve Proof of Delivery.
     */
    public function approvePod($id)
    {
        $order = Order::find($id);

        if (! $order || $order->customer_id !== auth()->id()) {
            return $this->sendError('Order not found.', [], 404);
        }

        DB::transaction(function () use ($order) {
            $order->update([
                'status' => 'completed',
                'pod_status' => 'confirmed',
            ]);

            $order->updates()->create([
                'status' => 'completed',
                'title' => 'Order Completed',
                'description' => 'The customer has approved the Proof of Delivery and the order is marked as completed.',
            ]);

            $hasPendingTransaction = \App\Models\SupplierTransaction::where('order_id', $order->id)
                ->where('type', 'earning')
                ->where('status', 'pending')
                ->exists();

            if (! $hasPendingTransaction) {
                Log::info("POD approved for Order #{$order->order_number} but no pending transaction found.");
            }
        });

        return $this->sendResponse(new OrderResource($order), 'Proof of Delivery approved.');
    }

    /**
     * Raise an issue/Reject Proof of Delivery.
     */
    public function rejectPod(Request $request, $id)
    {
        $request->validate([
            'note' => 'nullable|string|max:1000',
        ]);

        $order = Order::find($id);

        if (! $order || $order->customer_id !== auth()->id()) {
            return $this->sendError('Order not found.', [], 404);
        }

        $order->update([
            'pod_status' => 'rejected',
            'status_note' => $request->note,
        ]);

        $order->updates()->create([
            'status' => 'rejected',
            'title' => 'POD Rejected',
            'description' => $request->note ?? 'The customer has rejected the Proof of Delivery and requested a re-upload.',
        ]);

        return $this->sendResponse(new OrderResource($order), 'Issue raised and Proof of Delivery rejected.');
    }

    /**
     * Submit a review for a completed order.
     */
    public function submitReview(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $order = Order::with('review')->find($id);

        if (! $order || $order->customer_id !== auth()->id()) {
            return $this->sendError('Order not found.', [], 404);
        }

        if ($order->status !== 'completed' && $order->status !== 'delivered') {
            return $this->sendError('You can only review a delivered or completed order.', [], 422);
        }

        if ($order->review) {
            return $this->sendError('You have already reviewed this order.', [], 422);
        }

        $review = Review::create([
            'order_id' => $order->id,
            'customer_id' => auth()->id(),
            'supplier_id' => $order->supplier_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return $this->sendResponse($review, 'Thank you for your feedback! Your rating has been submitted.');
    }
}
