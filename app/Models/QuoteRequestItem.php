<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuoteRequestItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'quote_request_id',
        'item_type',
        'quantity',
        'length',
        'width',
        'height',
        'weight',
    ];

    public function quoteRequest()
    {
        return $this->belongsTo(QuoteRequest::class);
    }
}
