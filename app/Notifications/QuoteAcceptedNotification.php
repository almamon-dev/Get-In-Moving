<?php

namespace App\Notifications;

use App\Models\Quote;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class QuoteAcceptedNotification extends Notification
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
        \Log::info('QuoteAcceptedNotification sending to: ' . $notifiable->email);
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Quote Accepted!')
            ->view('emails.quote_accepted', [
                'greeting' => 'Quote Accepted!',
                'notifiable' => $notifiable,
                'palletType' => $this->quote->quoteRequest->pallet_type,
                'amount' => number_format($this->quote->amount, 2)
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
            'amount' => $this->quote->amount,
            'pallet_type' => $this->quote->quoteRequest->pallet_type,
            'message' => 'Your quote of €'.number_format($this->quote->amount, 2).' was accepted! A new order was created.',
        ];
    }
}
