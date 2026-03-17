<?php

namespace App\Notifications;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class FundsReleasedNotification extends Notification
{
    use Queueable;

    protected $payment;

    /**
     * Create a new notification instance.
     */
    public function __construct(Payment $payment)
    {
        $this->payment = $payment;
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
        $invoice = $this->payment->invoice;
        $order = $invoice->order;
        $amount = $invoice->supplier_amount;

        return (new MailMessage)
            ->subject('Escrow Funds Released')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Good news! The escrowed funds for Order #' . $order->order_number . ' have been released to your available balance.')
            ->line('Amount Released: $' . number_format($amount, 2))
            ->action('View Finance', url('/supplier/finance/dashboard'))
            ->line('The funds are now available for withdrawal.');
    }

    /**
     * Get the array representation of the notification for database.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $invoice = $this->payment->invoice;
        $order = $invoice->order;
        $amount = $invoice->supplier_amount;

        return [
            'payment_id' => $this->payment->id,
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'amount' => $amount,
            'message' => 'Funds of $' . number_format($amount, 2) . ' for Order #' . $order->order_number . ' have been released to your balance.',
            'type' => 'fund_release'
        ];
    }
}
