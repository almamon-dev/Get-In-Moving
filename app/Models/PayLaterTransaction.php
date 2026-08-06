<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayLaterTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'pay_later_facility_id',
        'invoice_id',
        'order_id',
        'type',
        'amount',
        'available_credit_after',
        'description',
    ];

    protected $casts = [
        'amount' => 'float',
        'available_credit_after' => 'float',
    ];

    /**
     * Get the user.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the facility.
     */
    public function facility()
    {
        return $this->belongsTo(PayLaterFacility::class, 'pay_later_facility_id');
    }

    /**
     * Get the related invoice.
     */
    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    /**
     * Get the related order.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
