<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'invoice_id',
        'user_id',
        'subscription_id',
        'transaction_id',
        'session_id',
        'amount',
        'currency',
        'status',
        'payment_method',
        'metadata',
        'available_at',
        'is_released',
        'payment_type',
    ];

    protected $casts = [
        'metadata' => 'array',
        'available_at' => 'datetime',
        'is_released' => 'boolean',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subscription()
    {
        return $this->belongsTo(UserSubscription::class, 'subscription_id');
    }
}
