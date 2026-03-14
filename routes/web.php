<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Routes
    Route::prefix('admin')->name('admin.')->group(function () {
        // Customer Management
        Route::resource('customers', \App\Http\Controllers\Admin\CustomerController::class)->only(['index', 'show', 'destroy']);
        Route::patch('customers/{customer}/verification', [\App\Http\Controllers\Admin\CustomerController::class, 'updateVerification'])->name('customers.verification');

        Route::resource('suppliers', \App\Http\Controllers\Admin\SupplierController::class)->only(['index', 'show', 'destroy']);
        Route::patch('suppliers/{supplier}/compliance', [\App\Http\Controllers\Admin\SupplierController::class, 'updateCompliance'])->name('suppliers.compliance');
        Route::patch('suppliers/{supplier}/verification', [\App\Http\Controllers\Admin\SupplierController::class, 'updateVerification'])->name('suppliers.verification');

        // Finance Management
        Route::get('transactions', [\App\Http\Controllers\Admin\TransactionController::class, 'index'])->name('transactions.index');
        Route::resource('withdrawals', \App\Http\Controllers\Admin\WithdrawRequestController::class)->only(['index', 'destroy']);
        Route::patch('withdrawals/{withdraw_request}/status', [\App\Http\Controllers\Admin\WithdrawRequestController::class, 'updateStatus'])->name('withdrawals.status');

        // Pricing Plans Management
        Route::resource('pricing-plans', \App\Http\Controllers\Admin\PricingPlanController::class);
        Route::patch('pricing-plans/{pricingPlan}/toggle-active', [\App\Http\Controllers\Admin\PricingPlanController::class, 'toggleActive'])->name('pricing-plans.toggle-active');

        // Settings Routes
        Route::prefix('settings')->name('settings.')->group(function () {
            // General Settings
            Route::prefix('general')->name('general.')->group(function () {
                Route::get('profile', [\App\Http\Controllers\Admin\ProfileController::class, 'index'])->name('profile');
                Route::post('profile/update', [\App\Http\Controllers\Admin\ProfileController::class, 'update'])->name('profile.update');
                Route::post('profile/remove-picture', [\App\Http\Controllers\Admin\ProfileController::class, 'removePicture'])->name('profile.remove-picture');
                Route::get('security', function () {
                    return Inertia::render('Admin/Settings/General/Security');
                })->name('security');
                Route::get('notifications', function () {
                    return Inertia::render('Admin/Settings/General/Notifications');
                })->name('notifications');
            });

            // Website Settings
            Route::prefix('website')->name('website.')->group(function () {
                Route::get('system', [\App\Http\Controllers\Admin\SettingController::class, 'websiteSystem'])->name('system');
                Route::get('company', [\App\Http\Controllers\Admin\SettingController::class, 'companySettings'])->name('company');
                Route::get('localization', function () {
                    return Inertia::render('Admin/Settings/Website/Localization');
                })->name('localization');
                Route::get('prefixes', function () {
                    return Inertia::render('Admin/Settings/Website/Prefixes');
                })->name('prefixes');
                Route::get('preference', function () {
                    return Inertia::render('Admin/Settings/Website/Preference');
                })->name('preference');
                Route::get('appearance', function () {
                    return Inertia::render('Admin/Settings/Website/Appearance');
                })->name('appearance');
                Route::get('social-auth', function () {
                    return Inertia::render('Admin/Settings/Website/SocialAuthentication');
                })->name('social-auth');
            });

            // System Settings
            Route::prefix('system')->name('system.')->group(function () {
                Route::get('email', [\App\Http\Controllers\Admin\SettingController::class, 'emailSettings'])->name('email');
                Route::post('email/update', [\App\Http\Controllers\Admin\SettingController::class, 'updateEmail'])->name('email.update');
                Route::get('sms', function () {
                    return Inertia::render('Admin/Settings/Placeholder', ['title' => 'SMS Settings']);
                })->name('sms');
                Route::get('otp', function () {
                    return Inertia::render('Admin/Settings/Placeholder', ['title' => 'OTP Settings']);
                })->name('otp');
                Route::get('gdpr', function () {
                    return Inertia::render('Admin/Settings/Placeholder', ['title' => 'GDPR Settings']);
                })->name('gdpr');
            });

            // Financial Settings
            Route::prefix('financial')->name('financial.')->group(function () {
                Route::get('gateway', [\App\Http\Controllers\Admin\SettingController::class, 'financialGateway'])->name('gateway');
                Route::get('bank-accounts', function () {
                    return Inertia::render('Admin/Settings/Placeholder', ['title' => 'Bank Accounts']);
                })->name('bank-accounts');
                Route::get('tax-rates', function () {
                    return Inertia::render('Admin/Settings/Placeholder', ['title' => 'Tax Rates']);
                })->name('tax-rates');
                Route::get('currencies', function () {
                    return Inertia::render('Admin/Settings/Placeholder', ['title' => 'Currencies']);
                })->name('currencies');
            });

            // Generic Update Route
            Route::post('update', [\App\Http\Controllers\Admin\SettingController::class, 'update'])->name('update');

            // Other Settings
            Route::prefix('other')->name('other.')->group(function () {
                Route::get('storage', function () {
                    return Inertia::render('Admin/Settings/Placeholder', ['title' => 'Storage Settings']);
                })->name('storage');
                Route::get('ban-ip', function () {
                    return Inertia::render('Admin/Settings/Placeholder', ['title' => 'Ban IP Address']);
                })->name('ban-ip');
            });
        });
    });
});

require __DIR__.'/auth.php';
