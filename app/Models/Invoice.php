<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'user_id',
        'subscription_id',
        'invoice_number',
        'supplier_amount',
        'platform_fee',
        'total_amount',
        'status',
        'due_date',
        'paid_at',
        'invoice_type',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'due_date' => 'date',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function subscription()
    {
        return $this->belongsTo(UserSubscription::class, 'subscription_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}
