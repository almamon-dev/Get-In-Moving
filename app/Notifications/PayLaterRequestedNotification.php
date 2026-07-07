<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PayLaterRequestedNotification extends Notification
{
    use Queueable;

    public $user;

    /**
     * Create a new notification instance.
     */
    public function __construct($user)
    {
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('New Pay Later Request')
            ->line('Customer ' . $this->user->name . ' (' . $this->user->email . ') has requested Pay Later access.')
            ->action('View Approvals', url('/admin/pay-later-approvals'))
            ->line('Please review their request in the admin panel.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'New Pay Later Request',
            'message' => 'Customer ' . $this->user->name . ' has requested Pay Later access.',
            'url' => '/admin/pay-later-approvals',
            'type' => 'pay_later_request'
        ];
    }
}
