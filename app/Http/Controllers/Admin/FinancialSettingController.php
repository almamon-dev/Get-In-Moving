<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinancialSettingController extends Controller
{
    protected function getEnv($key, $default = null)
    {
        $path = base_path('.env');
        if (file_exists($path)) {
            $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                $parts = explode('=', $line, 2);
                if (count($parts) === 2 && trim($parts[0]) === $key) {
                    return trim(trim($parts[1]), '"\'');
                }
            }
        }
        return $default;
    }

    public function index()
    {
        $settings = [
            'stripe_key' => $this->getEnv('STRIPE_KEY', config('services.stripe.key')),
            'stripe_secret' => $this->getEnv('STRIPE_SECRET', config('services.stripe.secret')),
            'stripe_webhook_secret' => $this->getEnv('STRIPE_WEBHOOK_SECRET', config('services.stripe.webhook_secret')),
            'fund_hold_minutes' => $this->getEnv('FUND_HOLD_MINUTES', 5),
        ];

        return Inertia::render('Admin/Settings/Financial/Gateway', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'stripe_key' => 'nullable|string',
            'stripe_secret' => 'nullable|string',
            'stripe_webhook_secret' => 'nullable|string',
            'fund_hold_minutes' => 'nullable|integer|min:0',
        ]);

        $envMapping = [
            'stripe_key' => 'STRIPE_KEY',
            'stripe_secret' => 'STRIPE_SECRET',
            'stripe_webhook_secret' => 'STRIPE_WEBHOOK_SECRET',
            'fund_hold_minutes' => 'FUND_HOLD_MINUTES',
        ];

        foreach ($validated as $key => $value) {
            if (isset($envMapping[$key])) {
                $this->setEnv($envMapping[$key], $value);
            }
        }
        // Clear config cache so changes take effect immediately
        \Illuminate\Support\Facades\Artisan::call('config:clear');

        return back()->with('success', 'Financial settings updated successfully.');
    }

    protected function setEnv($key, $value)
    {
        $path = base_path('.env');

        if (file_exists($path)) {
            $content = file_get_contents($path);

            // If the key exists, replace it, otherwise append it
            if (strpos($content, "{$key}=") !== false) {
                // Handle values with spaces or special characters by quoting them
                $escapedValue = '"'.addslashes($value).'"';
                $content = preg_replace("/^{$key}=.*/m", "{$key}={$escapedValue}", $content);
            } else {
                $content .= "\n{$key}=\"".addslashes($value)."\"\n";
            }

            file_put_contents($path, $content);
        }
    }
}
