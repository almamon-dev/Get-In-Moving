<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'item_type',
        'quantity',
        'length',
        'width',
        'height',
        'weight',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
