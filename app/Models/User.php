<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;

use Laravel\Cashier\Billable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, Billable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'email_verified_at',
        'password',
        'user_type',
        'company_name',
        'phone_number',
        'business_address',
        'city',
        'state',
        'zip_code',
        'country',
        'profile_picture',
        'designation',
        'bio',
        'insurance_type',
        'insurance_provider_name',
        'policy_number',
        'policy_expiry_date',
        'license_expiry_date',
        'insurance_document',
        'license_document',
        'insurance_status',
        'license_status',
        'insurance_uploaded_at',
        'license_uploaded_at',
        'is_verified',
        'verified_at',
        'is_compliance_verified',
        'compliance_verified_at',
        'reset_password_token',
        'reset_password_token_expire_at',
        'terms_accepted_at',
        'parent_id',
        'last_login_at',
        'status',
        'deletion_requested_at',
        'stripe_account_id',
        'is_stripe_connected',
        'balance',
        'pay_later_status',
        'pay_later_requested_at',
        'pay_later_rejection_reason',
        'pay_later_pm_id',
        'pay_later_pm_last_four',
        'pay_later_pm_type',
        'pay_later_credit_limit',
        'pay_later_daily_limit',
        'pay_later_weekly_limit',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'reset_password_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_verified' => 'boolean',
            'verified_at' => 'datetime',
            'is_compliance_verified' => 'boolean',
            'compliance_verified_at' => 'datetime',
            'policy_expiry_date' => 'date',
            'license_expiry_date' => 'date',
            'insurance_uploaded_at' => 'datetime',
            'license_uploaded_at' => 'datetime',
            'reset_password_token_expire_at' => 'datetime',
            'terms_accepted_at' => 'datetime',
            'last_login_at' => 'datetime',
            'deletion_requested_at' => 'datetime',
            'is_stripe_connected' => 'boolean',
            'pay_later_credit_limit' => 'float',
        ];
    }

    /**
     * Get or create Pay Later Facility for the user.
     */
    public function payLaterFacility()
    {
        return $this->hasOne(PayLaterFacility::class);
    }

    /**
     * Get Pay Later Transactions for the user.
     */
    public function payLaterTransactions()
    {
        return $this->hasMany(PayLaterTransaction::class);
    }

    /**
     * Get total reserved Pay Later credit (unpaid active orders using Pay Later).
     */
    public function getPayLaterReservedCreditAttribute(): float
    {
        if ($this->relationLoaded('payLaterFacility') && $this->payLaterFacility) {
            return $this->payLaterFacility->reserved_credit;
        }

        return (float) \App\Models\Order::where('customer_id', $this->id)
            ->where('payment_method', 'pay_later')
            ->where('payment_status', 'unpaid')
            ->where('status', '!=', 'cancelled')
            ->sum('reserved_credit_amount');
    }

    /**
     * Get total used Pay Later credit (unpaid due/overdue invoices).
     */
    public function getPayLaterUsedCreditAttribute(): float
    {
        if ($this->relationLoaded('payLaterFacility') && $this->payLaterFacility) {
            return $this->payLaterFacility->used_credit;
        }

        return (float) \App\Models\Invoice::whereHas('order', function ($q) {
            $q->where('customer_id', $this->id);
        })
        ->whereIn('status', ['due', 'overdue'])
        ->sum('total_amount');
    }

    /**
     * Get available Pay Later credit.
     */
    public function getPayLaterAvailableCreditAttribute(): float
    {
        $limit = (float) ($this->payLaterFacility->credit_limit ?? $this->pay_later_credit_limit ?? 5000.00);
        return (float) max(0, $limit - ($this->pay_later_used_credit + $this->pay_later_reserved_credit));
    }

    /**
     * Get the OTPs for the user.
     */
    public function otps()
    {
        return $this->hasMany(Otp::class);
    }

    /**
     * Get the subscription for the user.
     */
    public function userSubscription()
    {
        return $this->hasOne(UserSubscription::class)->latestOfMany('created_at');
    }
}
