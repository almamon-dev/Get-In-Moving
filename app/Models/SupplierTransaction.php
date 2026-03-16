<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SupplierTransaction extends Model
{
    use HasFactory;

    const STATUS_PENDING = 'pending';
    const STATUS_COMPLETED = 'completed';

    protected $fillable = [
        'supplier_id',
        'order_id',
        'amount',
        'type',
        'status',
        'available_at',
        'description',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'available_at' => 'datetime',
    ];

    public function supplier()
    {
        return $this->belongsTo(User::class, 'supplier_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
