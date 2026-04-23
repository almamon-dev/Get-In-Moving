<?php

namespace App\Notifications;

use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AccountVerifiedNotification extends Notification
{
    public $userType;

    /**
     * Create a new notification instance.
     */
    public function __construct($userType = 'customer')
    {
        $this->userType = $userType;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        \Log::info('AccountVerifiedNotification sending to: ' . $notifiable->email);
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Account Verified - '.config('app.name'))
            ->view('emails.account_verified', [
                'greeting' => 'Account Verified',
                'notifiable' => $notifiable,
                'userType' => $this->userType
            ]);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => 'Account Verified',
            'message' => 'Your account has been verified successfully. You now have full access to all features.',
            'type' => 'success',
            'user_type' => $this->userType,
        ];
    }
}
