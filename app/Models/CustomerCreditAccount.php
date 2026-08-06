<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class CustomerCreditAccount extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'uuid',
        'user_id',
        'credit_limit',
        'used_credit',
        'available_credit',
        'status',
        'payment_terms_days',
        'credit_expiry_date',
        'risk_level',
    ];

    protected $casts = [
        'credit_limit' => 'float',
        'used_credit' => 'float',
        'available_credit' => 'float',
        'credit_expiry_date' => 'date',
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

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(CreditTransaction::class);
    }

    public function payments()
    {
        return $this->hasMany(CreditPayment::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(CreditAuditLog::class);
    }
}
