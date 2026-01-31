<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ComplianceApprovedNotification extends Notification
{
    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
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
            ->subject('Compliance Approved - '.config('app.name'))
            ->greeting('Hello '.$notifiable->name.'!')
            ->line('Great news! Your compliance documents have been reviewed and approved.')
            ->line('Your insurance and licensing information has been verified by our team.')
            ->line('You can now access all supplier features and start providing services.')
            ->action('Visit Dashboard', url('/dashboard'))
            ->line('Thank you for completing the compliance process!')
            ->salutation('Best regards, '.config('app.name').' Team');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Compliance Approved',
            'message' => 'Your compliance documents have been reviewed and approved. You can now access all supplier features.',
            'type' => 'success',
        ];
    }
}
