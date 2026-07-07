<?php

namespace App\Notifications;

use App\Models\QuoteRequest;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewQuoteRequestAvailableNotification extends Notification
{
    protected $quoteRequest;

    /**
     * Create a new notification instance.
     */
    public function __construct(QuoteRequest $quoteRequest)
    {
        $this->quoteRequest = $quoteRequest;
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
            ->subject('New Job Opportunity Available!')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('A new job (quote request) has just been posted that matches your criteria.')
            ->line('Pickup: ' . $this->quoteRequest->pickup_address)
            ->line('Delivery: ' . $this->quoteRequest->delivery_address)
            ->action('View Job Details', url('/supplier-dashboard/requests/' . $this->quoteRequest->id))
            ->line('Log in now to submit your quote and secure this job!');
    }

    /**
     * Get the array representation of the notification for database.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'quote_request_id' => $this->quoteRequest->id,
            'pickup_address' => $this->quoteRequest->pickup_address,
            'delivery_address' => $this->quoteRequest->delivery_address,
            'message' => 'New Quote Request from ' . $this->quoteRequest->user->name,
        ];
    }
}
