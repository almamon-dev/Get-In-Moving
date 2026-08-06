<?php

namespace App\Http\Resources\API\Customer;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $statusTimeline = [
            'pending' => 0,
            'confirmed' => 1,
            'in_progress' => 2,
            'picked_up' => 3,
            'delivered' => 4,
            'completed' => 5,
        ];

        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'total_amount' => (float) $this->total_amount,
            'total_amount_formatted' => '€'.number_format($this->total_amount, 2),
            'status' => $this->status,
            'status_note' => $this->status_note,
            'pickup_address' => $this->pickup_address,
            'delivery_address' => $this->delivery_address,
            'pickup_date' => $this->pickup_date,
            'estimated_time' => $this->estimated_time,
            'pallet_type' => $this->getPalletType(),
            'items_count' => $this->items ? $this->items->sum('quantity') : 0,
            'proof_of_delivery' => \App\Helpers\Helper::generateURL($this->proof_of_delivery),
            'pod_status' => $this->pod_status,
            'tracking' => [
                'current_step' => $statusTimeline[$this->status] ?? 0,
                'steps' => ['Pending', 'Confirmed', 'In Progress', 'Picked Up', 'Delivered', 'Completed'],
            ],
            'items' => $this->whenLoaded('items', function () {
                return $this->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'item_type' => $item->item_type,
                        'quantity' => $item->quantity,
                        'length' => $item->length,
                        'width' => $item->width,
                        'height' => $item->height,
                        'weight' => $item->weight,
                    ];
                });
            }),
            'review' => $this->review ? [
                'rating' => $this->review->rating,
                'comment' => $this->review->comment,
                'date' => $this->review->created_at->format('d M Y'),
            ] : [],
            'supplier' => [
                'id' => $this->supplier?->id,
                'name' => $this->supplier?->name,
                'company_name' => $this->supplier?->company_name,
                'profile_picture' => \App\Helpers\Helper::generateURL($this->supplier?->profile_picture) ?? null,
            ],
            'live_updates' => $this->updates->map(function ($update) {
                return [
                    'title' => $update->title,
                    'description' => $update->description,
                    'status' => $update->status,
                    'time_ago' => $update->created_at->diffForHumans(),
                    'created_at' => $update->created_at->format('d M Y, h:i A'),
                ];
            }),
            'invoice' => $this->invoice ? [
                'id' => $this->invoice->id,
                'invoice_number' => $this->invoice->invoice_number,
                'status' => $this->invoice->status,
                'due_date' => $this->invoice->due_date ? \Carbon\Carbon::parse($this->invoice->due_date)->format('Y-m-d') : null,
                'due_date_formatted' => $this->invoice->due_date ? \Carbon\Carbon::parse($this->invoice->due_date)->format('d M Y') : null,
                'auto_charge_date' => $this->invoice->due_date ? \Carbon\Carbon::parse($this->invoice->due_date)->format('d M Y') : null,
                'days_remaining' => $this->invoice->due_date ? (int) max(0, (int) \Carbon\Carbon::now()->diffInDays(\Carbon\Carbon::parse($this->invoice->due_date), false)) : 0,
                'is_overdue' => $this->invoice->due_date ? \Carbon\Carbon::now()->isAfter(\Carbon\Carbon::parse($this->invoice->due_date)) && $this->invoice->status !== 'paid' : false,
            ] : null,
            'payment_status' => $this->invoice ? $this->invoice->status : 'paid',
            'payment_method' => ($this->invoice && $this->invoice->payments()->latest()->first()?->payment_method === 'pay_later')
                ? 'pay_later' 
                : ($this->invoice && $this->invoice->due_date ? 'pay_later' : 'upfront'),
            'created_at' => $this->created_at?->toDateTimeString(),
        ];
    }
}
