<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class CreditTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'customer_credit_account_id',
        'user_id',
        'invoice_id',
        'order_id',
        'type',
        'amount',
        'balance_after',
        'available_credit_after',
        'reference_number',
        'description',
        'created_by',
    ];

    protected $casts = [
        'amount' => 'float',
        'balance_after' => 'float',
        'available_credit_after' => 'float',
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

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
