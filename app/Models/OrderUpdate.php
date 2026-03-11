<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderUpdate extends Model
{
    protected $fillable = [
        'order_id',
        'title',
        'description',
        'status',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
