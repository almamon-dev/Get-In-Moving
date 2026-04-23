<?php

namespace App\Notifications;

use App\Models\Quote;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewQuoteSubmittedNotification extends Notification
{
    protected $quote;

    /**
     * Create a new notification instance.
     */
    public function __construct(Quote $quote)
    {
        $this->quote = $quote;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        \Log::info('NewQuoteSubmittedNotification sending to: ' . $notifiable->email);
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Quote Received')
            ->view('emails.new_quote', [
                'greeting' => 'New Quote Received',
                'notifiable' => $notifiable,
                'palletType' => $this->quote->quoteRequest->pallet_type,
                'amount' => number_format($this->quote->amount, 2),
                'estimatedTime' => $this->quote->estimated_time,
                'quoteRequestId' => $this->quote->quote_request_id
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
            'quote_id' => $this->quote->id,
            'quote_request_id' => $this->quote->quote_request_id,
            'supplier_id' => $this->quote->user_id,
            'supplier_name' => $this->quote->user->name,
            'amount' => $this->quote->amount,
            'pallet_type' => $this->quote->quoteRequest->pallet_type,
            'message' => 'New quote received from '.$this->quote->user->name,
        ];
    }
}
