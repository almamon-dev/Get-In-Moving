<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminDocumentVerificationRequiredNotification extends Notification
{
    use Queueable;

    protected $supplier;
    protected $docType;

    /**
     * Create a new notification instance.
     */
    public function __construct($supplier, $docType)
    {
        $this->supplier = $supplier;
        $this->docType = $docType;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'document_verification_required',
            'sender_name' => $this->supplier->name,
            'message' => 'Supplier ' . $this->supplier->name . ' has uploaded a new ' . $this->docType . ' document. Please review it for verification.',
            'supplier_id' => $this->supplier->id,
        ];
    }
}
