<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Setting;
use Inertia\Inertia;

class FinancialSettingController extends Controller
{
    public function index()
    {
        $settings = Setting::whereIn('key', [
            'stripe_key',
            'stripe_secret',
            'stripe_webhook_secret'
        ])->pluck('value', 'key');

        return Inertia::render('Admin/Settings/Financial/Gateway', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'stripe_key' => 'nullable|string',
            'stripe_secret' => 'nullable|string',
            'stripe_webhook_secret' => 'nullable|string',
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return back()->with('success', 'Financial settings updated successfully.');
    }
}
