<?php

namespace App\Notifications;

use App\Models\WithdrawRequest;
use Illuminate\Notifications\Notification;

class NewWithdrawRequestNotification extends Notification
{
    protected $withdrawRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct(WithdrawRequest $withdrawRequest)
    {
        $this->withdrawRequest = $withdrawRequest;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        \Log::info('NewWithdrawRequestNotification sending to: ' . $notifiable->email);
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'withdraw_request_id' => $this->withdrawRequest->id,
            'supplier_id' => $this->withdrawRequest->supplier_id,
            'supplier_name' => $this->withdrawRequest->supplier->name,
            'amount' => $this->withdrawRequest->amount,
            'account_name' => $this->withdrawRequest->account_name,
            'message' => 'New withdrawal request of $' . number_format($this->withdrawRequest->amount, 2) . ' from ' . $this->withdrawRequest->supplier->name,
            'type' => 'withdrawal_request',
            'action_url' => '/admin/finance/withdraw-requests'
        ];
    }
}
