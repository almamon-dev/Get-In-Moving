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
        \Log::info('FundsReleasedNotification sending to: ' . $notifiable->email);
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $invoice = $this->payment->invoice;
        $order = $invoice->order;
        $amount = number_format($invoice->supplier_amount, 2);

        return (new MailMessage)
            ->subject('Escrow Funds Released')
            ->view('emails.funds_released', [
                'greeting' => 'Escrow Funds Released',
                'notifiable' => $notifiable,
                'orderNumber' => $order->order_number,
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
        $invoice = $this->payment->invoice;
        $order = $invoice->order;
        $amount = $invoice->supplier_amount;

        return [
            'payment_id' => $this->payment->id,
            'order_id' => $order->id,
            'order_number' => $order->order_number,
            'amount' => $amount,
            'message' => 'Funds of €' . number_format($amount, 2) . ' for Order #' . $order->order_number . ' have been released to your balance.',
            'type' => 'fund_release'
        ];
    }
}
