<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PayLaterApprovedNotification extends Notification
{
    use Queueable;

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
            ->subject('Pay Later Request Approved!')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Great news! Your request for the Pay Later facility has been approved.')
            ->line('You can now use this facility to manage your payments flexibly.')
            ->action('Go to Dashboard', url(config('app.frontend_url') . '/client-dashboard'))
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
            'type' => 'pay_later_approved',
            'title' => 'Pay Later Request Approved',
            'message' => 'Your request for the Pay Later facility has been approved by the admin.',
            'url' => '/client-dashboard',
        ];
    }
}
