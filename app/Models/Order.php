<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'quote_id',
        'customer_id',
        'supplier_id',
        'total_amount',
        'service_type',
        'pickup_address',
        'delivery_address',
        'pickup_date',
        'estimated_time',
        'status',
        'status_note',
        'proof_of_delivery',
        'pod_status',
    ];

    public function quote()
    {
        return $this->belongsTo(Quote::class);
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }
}
