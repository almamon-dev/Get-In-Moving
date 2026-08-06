<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CreditPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'customer_credit_account_id',
        'user_id',
        'invoice_id',
        'amount',
        'payment_method',
        'reference_number',
        'received_by',
        'status',
        'notes',
    ];

    protected $casts = [
        'amount' => 'float',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($model) {
            if (empty($model->uuid)) {
                $model->uuid = (string) Str::uuid();
            }
        });
    }

    public function creditAccount()
    {
        return $this->belongsTo(CustomerCreditAccount::class, 'customer_credit_account_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
