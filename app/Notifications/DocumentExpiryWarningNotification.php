<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DocumentExpiryWarningNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $days;

    /**
     * Create a new notification instance.
     */
    public function __construct($days)
    {
        $this->days = $days;
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
            ->subject('Action Required: Document Expiry Warning')
            ->line('Your required compliance documents (Policy or License) are set to expire in ' . $this->days . ' days.')
            ->line('Please upload updated documents as soon as possible to avoid account restriction.')
            ->action('Update Documents', url('/supplier/settings'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'document_expiry_warning',
            'message' => 'Your required compliance documents are set to expire in ' . $this->days . ' days. Please upload updated documents.',
            'days' => $this->days
        ];
    }
}
