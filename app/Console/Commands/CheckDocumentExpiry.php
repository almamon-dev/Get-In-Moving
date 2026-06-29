<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Carbon\Carbon;
use App\Notifications\DocumentExpiryWarningNotification;
use App\Notifications\DocumentExpiredNotification;

class CheckDocumentExpiry extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-document-expiry';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check supplier document expiry and send warnings or restrict accounts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today();
        
        $warningDays = [30, 14, 7];

        $suppliers = User::where('user_type', 'supplier')->get();

        foreach ($suppliers as $supplier) {
            $policyExpiry = Carbon::parse($supplier->policy_expiry_date);
            $licenseExpiry = Carbon::parse($supplier->license_expiry_date);

            // Check if expired (with 7 days grace period)
            $policyExpired = $supplier->policy_expiry_date && $policyExpiry->copy()->addDays(7)->isPast();
            $licenseExpired = $supplier->license_expiry_date && $licenseExpiry->copy()->addDays(7)->isPast();

            if ($policyExpired || $licenseExpired) {
                if ($supplier->status !== 'restricted') {
                    $supplier->status = 'restricted';
                    $supplier->is_compliance_verified = false;
                    $supplier->save();
                    $supplier->notify(new DocumentExpiredNotification());
                }
                continue;
            }

            // Check warnings
            foreach ($warningDays as $days) {
                if (($supplier->policy_expiry_date && $policyExpiry->diffInDays($today) == $days && $today->lessThan($policyExpiry)) || 
                    ($supplier->license_expiry_date && $licenseExpiry->diffInDays($today) == $days && $today->lessThan($licenseExpiry))) {
                    $supplier->notify(new DocumentExpiryWarningNotification($days));
                    break;
                }
            }
        }
    }
}
