<?php

namespace App\Notifications;

use App\Models\Quote;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RevisedQuoteNotification extends Notification
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
            ->subject('Revised Offer Received for Your Request')
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('The supplier '.$this->quote->user->name.' has submitted a revised offer for your request: '.$this->quote->quoteRequest->service_type)
            ->line('New Proposed Amount: $'.number_format($this->quote->revised_amount, 0))
            ->line('New Estimated Delivery: '.$this->quote->revised_estimated_time)
            ->action('View and Respond to Offer', url('/customer/negotiations'))
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
            'amount' => $this->quote->revised_amount,
            'service_type' => $this->quote->quoteRequest->service_type,
            'message' => 'Supplier '.$this->quote->user->name.' offered a new price: $'.number_format($this->quote->revised_amount, 0),
            'type' => 'revision',
        ];
    }
}
