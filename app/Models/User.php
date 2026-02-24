<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory,Notifiable;

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
        ];
    }

    /**
     * Get the OTPs for the user.
     */
    public function otps()
    {
        return $this->hasMany(Otp::class);
    }

    /**
     * Get the user's active subscription.
     */
    public function subscription()
    {
        return $this->hasOne(UserSubscription::class)->latestOfMany();
    }
}
