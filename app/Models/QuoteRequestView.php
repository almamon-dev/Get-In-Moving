<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuoteRequestView extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'quote_request_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function quoteRequest()
    {
        return $this->belongsTo(QuoteRequest::class);
    }
}
