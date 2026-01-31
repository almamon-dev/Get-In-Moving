<?php

namespace App\Notifications;

use App\Models\Message;
use Illuminate\Notifications\Notification;

class NewMessageNotification extends Notification
{
    protected $message;

    /**
     * Create a new notification instance.
     */
    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database']; // Only database, no email for chat messages
    }

    /**
     * Get the array representation of the notification for database.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message_id' => $this->message->id,
            'quote_id' => $this->message->quote_id,
            'sender_id' => $this->message->sender_id,
            'sender_name' => $this->message->sender->name,
            'message' => strlen($this->message->message) > 50
                ? substr($this->message->message, 0, 50).'...'
                : $this->message->message,
            'type' => 'new_message',
        ];
    }
}
