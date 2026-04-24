<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quote extends Model
{
    use HasFactory;

    protected $fillable = [
        'quote_request_id',
        'user_id',
        'amount',
        'estimated_time',
        'notes',
        'valid_until',
        'status',
        'revised_amount',
        'revised_estimated_time',
        'revision_status',
    ];

    public function quoteRequest()
    {
        return $this->belongsTo(QuoteRequest::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function supplier()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function order()
    {
        return $this->hasOne(Order::class);
    }
}
