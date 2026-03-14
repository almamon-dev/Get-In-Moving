<?php

namespace App\Notifications;

use App\Models\Quote;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class QuoteRejectedNotification extends Notification
{
    protected $quote;
    protected $isRevision;

    /**
     * Create a new notification instance.
     */
    public function __construct(Quote $quote, bool $isRevision = false)
    {
        $this->quote = $quote;
        $this->isRevision = $isRevision;
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
        $type = $this->isRevision ? 'revised quote' : 'quote';
        return (new MailMessage)
            ->subject('Update on your ' . $type)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Your ' . $type . ' for ' . $this->quote->quoteRequest->service_type . ' has been rejected by the client.')
            ->action('View Quote Details', url('/supplier/quotes'))
            ->line('Thank you for using our platform!');
    }

    /**
     * Get the array representation of the notification for database.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $type = $this->isRevision ? 'revised quote' : 'quote';
        return [
            'quote_id' => $this->quote->id,
            'quote_request_id' => $this->quote->quote_request_id,
            'message' => 'Your ' . $type . ' for ' . $this->quote->quoteRequest->service_type . ' was rejected.',
        ];
    }
}
