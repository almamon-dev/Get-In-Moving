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
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Quote Received for Your Shiping Request')
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('A supplier has submitted a new quote for your request: '.$this->quote->quoteRequest->service_type)
            ->line('Amount: $'.number_format($this->quote->amount, 2))
            ->line('Estimated Time: '.$this->quote->estimated_time)
            ->action('View Quote Details', url('/customer/quote-requests/'.$this->quote->quote_request_id))
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
            'quote_id' => $this->quote->id,
            'quote_request_id' => $this->quote->quote_request_id,
            'supplier_id' => $this->quote->user_id,
            'supplier_name' => $this->quote->user->name,
            'amount' => $this->quote->amount,
            'service_type' => $this->quote->quoteRequest->service_type,
            'message' => 'New quote received from '.$this->quote->user->name,
        ];
    }
}
