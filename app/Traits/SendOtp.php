<?php

namespace App\Traits;

use App\Models\Otp;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

trait SendOtp
{
    public function sendOtp(User $user, string $purpose = 'Verification'): int
    {
        $otpLength = (int) config('auth.otp_length', 4);
        $otpExpiryMinutes = (int) config('auth.otp_expiry', 60);

        DB::beginTransaction();
        try {
            $existingOtp = $user->otps()
                ->where('purpose', $purpose)
                ->where('is_verified', false)
                ->where('expires_at', '>', now())
                ->latest()
                ->first();

            if ($existingOtp) {
                $otp = $existingOtp->otp;
                $existingOtp->update(['expires_at' => now()->addMinutes($otpExpiryMinutes)]);
                Log::info("OTP reused for {$user->email} [$purpose]: $otp");
            } else {
                $otp = random_int(
                    (int) str_pad('1', $otpLength, '0'),
                    (int) str_pad('9', $otpLength, '9')
                );

                // Send OTP first
                try {
                    Mail::to($user->email)->send(new \App\Mail\OtpMail($otp, $user, $purpose));
                } catch (Exception $e) {
                    Log::error("Failed to send OTP to {$user->email}: {$e->getMessage()}");
                    DB::rollBack();
                    throw new Exception('SMTP Error: OTP email not sent.');
                }

                // Email sent → insert OTP in DB
                $user->otps()->create([
                    'otp' => $otp,
                    'purpose' => $purpose,
                    'expires_at' => now()->addMinutes($otpExpiryMinutes),
                    'is_verified' => false,
                ]);
                Log::info("New OTP generated for {$user->email} [$purpose]: $otp");
            }

            DB::commit();

            return (int) $otp;

        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
