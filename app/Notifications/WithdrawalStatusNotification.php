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

        $message = (new MailMessage)
            ->subject($subject)
            ->greeting('Hello '.$notifiable->name.'!');

        if ($status === 'completed' || $status === 'approved') {
            $message->line("Your withdrawal request for €{$amount} has been approved and processed.")
                ->line("The funds should appear in your selected account: {$this->withdrawRequest->payment_method}.");
        } else {
            $message->line("Your withdrawal request for €{$amount} has been rejected.")
                ->line('Reason/Note: '.($this->withdrawRequest->admin_note ?? 'No specific reason provided.'))
                ->line('The amount has been refunded to your account balance.');
        }

        return $message->action('View Finance Dashboard', url('/supplier/finance/dashboard'))
            ->line('Thank you for using our platform!');
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
