<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QuoteRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'service_type',
        'pickup_address',
        'delivery_address',
        'pickup_date',
        'pickup_time_from',
        'pickup_time_till',
        'additional_notes',
        'attachment_path',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(QuoteRequestItem::class);
    }

    public function quotes()
    {
        return $this->hasMany(Quote::class);
    }

    public function views()
    {
        return $this->hasMany(QuoteRequestView::class);
    }

    public function getSupplierStatus($userId)
    {
        if (!$userId) return 'new';

        if ($this->quotes()->where('user_id', $userId)->exists()) {
            return 'quoted';
        }
        if ($this->views()->where('user_id', $userId)->exists()) {
            return 'viewed';
        }
        return 'new';
    }
}
