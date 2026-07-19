<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuoteExtraCharge extends Model
{
    protected $fillable = [
        'quote_id',
        'type',
        'custom_name',
        'amount',
    ];

    public function quote()
    {
        return $this->belongsTo(Quote::class);
    }
}
