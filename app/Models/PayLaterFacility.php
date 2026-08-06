<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PayLaterFacility extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'credit_limit',
        'daily_limit',
        'weekly_limit',
        'status',
        'requested_at',
        'approved_at',
        'rejection_reason',
        'payment_method_id',
        'card_last_four',
        'card_type',
    ];

    protected $casts = [
        'credit_limit' => 'float',
        'daily_limit' => 'float',
        'weekly_limit' => 'float',
        'requested_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    /**
     * Get the user that owns the Pay Later facility.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the transactions for the Pay Later facility.
     */
    public function transactions()
    {
        return $this->hasMany(PayLaterTransaction::class);
    }

    /**
     * Get reserved credit (sum of unpaid orders using Pay Later facility).
     */
    public function getReservedCreditAttribute(): float
    {
        return (float) Order::where('customer_id', $this->user_id)
            ->where('payment_method', 'pay_later')
            ->where('payment_status', 'unpaid')
            ->where('status', '!=', 'cancelled')
            ->sum('reserved_credit_amount');
    }

    /**
     * Get used credit (sum of unpaid due/overdue invoices).
     */
    public function getUsedCreditAttribute(): float
    {
        return (float) Invoice::whereHas('order', function ($q) {
            $q->where('customer_id', $this->user_id);
        })
        ->whereIn('status', ['due', 'overdue'])
        ->sum('total_amount');
    }

    /**
     * Get available credit.
     */
    public function getAvailableCreditAttribute(): float
    {
        return (float) max(0, $this->credit_limit - ($this->used_credit + $this->reserved_credit));
    }
}
