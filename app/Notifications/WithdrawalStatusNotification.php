<?php

namespace App\Notifications;

use App\Models\WithdrawRequest;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WithdrawalStatusNotification extends Notification
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
        \Log::info('WithdrawalStatusNotification sending to: ' . $notifiable->email);
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $status = $this->withdrawRequest->status;
        $amount = number_format($this->withdrawRequest->amount, 2);
        $subject = 'Withdrawal Request '.ucfirst($status);

        return (new MailMessage)
            ->subject($subject)
            ->view('emails.withdrawal_status', [
                'greeting' => $subject,
                'notifiable' => $notifiable,
                'status' => $status,
                'amount' => $amount,
                'paymentMethod' => $this->withdrawRequest->payment_method,
                'adminNote' => $this->withdrawRequest->admin_note ?? 'No specific reason provided.'
            ]);
    }

    /**
     * Get the array representation of the notification for database.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'withdraw_request_id' => $this->withdrawRequest->id,
            'amount' => $this->withdrawRequest->amount,
            'status' => $this->withdrawRequest->status,
            'message' => "Your withdrawal request for €{$this->withdrawRequest->amount} was ".$this->withdrawRequest->status.'.',
            'type' => 'withdrawal_status_update',
        ];
    }
}
