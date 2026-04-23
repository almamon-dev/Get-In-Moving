<?php

namespace App\Notifications;

use App\Models\Invoice;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentReceivedNotification extends Notification
{
    protected $invoice;

    /**
     * Create a new notification instance.
     */
    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        \Log::info('PaymentReceivedNotification sending to: ' . $notifiable->email);
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $orderNumber = $this->invoice->order->order_number;
        $amount = number_format($this->invoice->supplier_amount, 2);

        return (new MailMessage)
            ->subject('Payment Received')
            ->view('emails.payment_received', [
                'greeting' => 'Payment Received - #'.$orderNumber,
                'notifiable' => $notifiable,
                'orderId' => $this->invoice->order_id,
                'orderNumber' => $orderNumber,
                'amount' => $amount
            ]);
    }

    /**
     * Get the array representation of the notification for database.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'invoice_id' => $this->invoice->id,
            'order_id' => $this->invoice->order_id,
            'amount' => $this->invoice->supplier_amount,
            'order_number' => $this->invoice->order->order_number,
            'message' => 'Payment of €'.number_format($this->invoice->supplier_amount, 2).' received for Order #'.$this->invoice->order->order_number.'. The order is now in progress.',
        ];
    }
}
