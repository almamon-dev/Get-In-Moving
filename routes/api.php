<?php

use App\Http\Controllers\API\Auth\AuthApiController;
use App\Http\Controllers\API\Customer\CustomerApiController;
use App\Http\Controllers\API\Customer\CustomerQuoteController;
use App\Http\Controllers\API\Customer\CustomerOrderController;
use App\Http\Controllers\API\Customer\CustomerInvoiceController;
use App\Http\Controllers\API\Customer\CustomerPayLaterController;
use App\Http\Controllers\API\Customer\CustomerNotificationController;
use App\Http\Controllers\API\Customer\CustomerDashboardController;
use App\Http\Controllers\API\Supplier\AvailabilityApiController;
use App\Http\Controllers\API\Supplier\EmployeeApiController;
use App\Http\Controllers\API\Supplier\SupplierApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Page;
use App\Http\Controllers\API\PublicApiController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/pages/{slug}', function ($slug) {
    $page = Page::where('slug', $slug)->where('is_published', true)->firstOrFail();
    return response()->json([
        'success' => true,
        'data' => $page
    ]);
});

Route::get('/settings', function () {
    return response()->json([
        'success' => true,
        'data' => \App\Models\Setting::pluck('value', 'key')->toArray()
    ]);
});

Route::get('/customer/quote-requests/template/download', [CustomerApiController::class, 'downloadTemplate'])
    ->name('api.customer.template.download')
    ->middleware('signed');

Route::get('/customer/quote-requests/pdf/sample/generate', [CustomerApiController::class, 'generateSamplePdf'])
    ->name('api.customer.sample-pdf.generate')
    ->middleware('signed');

// Public Data
Route::get('/public/supplier-availabilities', [PublicApiController::class, 'getSupplierAvailabilities']);
Route::post('/public/contact-us', [PublicApiController::class, 'submitContact']);

// Pricing Plans
Route::get('/pricing-plans', [\App\Http\Controllers\API\PricingPlanApiController::class, 'index']);

// Public Auth Routes
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthApiController::class, 'registerApi']);
    Route::post('/login', [AuthApiController::class, 'loginApi']);
    Route::post('/verify-email', [AuthApiController::class, 'verifyEmailApi']);
    Route::post('/resend-otp', [AuthApiController::class, 'resendOtpApi']);
    Route::post('/forgot-password', [AuthApiController::class, 'forgotPasswordApi']);
    Route::post('/verify-otp', [AuthApiController::class, 'verifyOtpApi']);
    Route::post('/reset-password', [AuthApiController::class, 'resetPasswordApi']);
});

// Stripe Webhook
Route::post('/webhooks/stripe', [\App\Http\Controllers\API\StripeWebhookController::class, 'handle']);

// Stripe Public Config
Route::get('/stripe/public-key', function () {
    return response()->json([
        'success' => true,
        'key' => env('STRIPE_KEY')
    ]);
});

// Stripe Connect Public Redirects
Route::get('/stripe/connect/return', [\App\Http\Controllers\API\Supplier\StripeConnectController::class, 'returnUrl']);
Route::get('/stripe/connect/refresh', [\App\Http\Controllers\API\Supplier\StripeConnectController::class, 'refreshUrl']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthApiController::class, 'logoutApi']);

    // Subscriptions
    Route::prefix('subscription')->group(function () {
        Route::get('/status', [\App\Http\Controllers\API\Subscription\SubscriptionApiController::class, 'checkStatus']);
        Route::post('/checkout-link', [\App\Http\Controllers\API\Subscription\SubscriptionApiController::class, 'getCheckoutLink']);
    });

    // Negotiations & Chat
    Route::get('/negotiations', [\App\Http\Controllers\API\NegotiationApiController::class, 'index']);
    Route::post('/negotiations/{id}/read', [\App\Http\Controllers\API\NegotiationApiController::class, 'markAsRead']);
    Route::post('/negotiations/read-all', [\App\Http\Controllers\API\NegotiationApiController::class, 'markAllAsRead']);

    // Chat/Messaging
    Route::get('/chat/{id}', [\App\Http\Controllers\API\ChatApiController::class, 'getMessages']);
    Route::post('/chat/send', [\App\Http\Controllers\API\ChatApiController::class, 'sendMessage']);

    // Customer Endpoints
    Route::middleware('customer')->prefix('customer')->group(function () {
        Route::post('/subscription/toggle-auto-renewal', [CustomerDashboardController::class, 'toggleAutoRenewal']);
        Route::get('/dashboard-overview', [CustomerDashboardController::class, 'getDashboardOverview']);
        Route::post('/quote-requests', [CustomerQuoteController::class, 'createQuoteRequest']);
        Route::post('/quote-requests/import', [CustomerQuoteController::class, 'importQuoteRequest']);
        Route::post('/quote-requests/upload-pdf', [CustomerQuoteController::class, 'uploadPdf']);
        Route::get('/quote-requests/template-link', [CustomerQuoteController::class, 'getTemplateLink']);
        Route::get('/quote-requests/pdf-template-link', [CustomerQuoteController::class, 'getPdfTemplateLink']);
        Route::get('/quote-requests/sample-pdf-link', [CustomerQuoteController::class, 'getSamplePdfLink']);
        Route::get('/quote-requests/template', [CustomerQuoteController::class, 'downloadTemplate']);
        Route::get('/quote-requests', [CustomerQuoteController::class, 'getMyQuoteRequests']);
        Route::delete('/quote-requests/{id}', [CustomerQuoteController::class, 'deleteQuoteRequest']);
        Route::get('/quote-requests/{id}/edit', [CustomerQuoteController::class, 'editQuoteRequest']);
        Route::put('/quote-requests/{id}', [CustomerQuoteController::class, 'updateQuoteRequest']);
        Route::get('/quote-requests/{id}/quotes', [CustomerQuoteController::class, 'getRequestQuotes']);
        Route::post('/quotes/{id}/accept', [CustomerQuoteController::class, 'acceptQuote']);
        Route::post('/quotes/{id}/accept-revision', [CustomerQuoteController::class, 'acceptRevision']);
        Route::post('/quotes/{id}/reject-revision', [CustomerQuoteController::class, 'rejectRevision']);

        // Orders
        Route::get('/orders', [CustomerOrderController::class, 'getMyOrders']);
        Route::get('/orders/{id}', [CustomerOrderController::class, 'getOrderDetails']);

        // Billing
        Route::get('/invoices', [CustomerInvoiceController::class, 'getMyInvoices']);
        Route::get('/invoices/{id}', [CustomerInvoiceController::class, 'getInvoiceDetails']);
        Route::get('/invoices/{id}/download', [CustomerInvoiceController::class, 'downloadInvoice']);
        Route::post('/invoices/{id}/pay', [CustomerInvoiceController::class, 'payInvoice']);
        Route::post('/invoices/{id}/pay-later', [CustomerInvoiceController::class, 'payInvoiceWithPayLater']);

        // Profile & Settings Management
        Route::get('/profile', [\App\Http\Controllers\API\Customer\SettingsController::class, 'getProfile']);
        Route::post('/profile', [\App\Http\Controllers\API\Customer\SettingsController::class, 'updateProfile']);
        Route::post('/change-password', [\App\Http\Controllers\API\Customer\SettingsController::class, 'changePassword']);
        Route::delete('/account', [\App\Http\Controllers\API\Customer\SettingsController::class, 'deleteAccount']);
        Route::post('/pay-later/request', [CustomerPayLaterController::class, 'requestPayLater']);
        Route::get('/pay-later/requests', [CustomerPayLaterController::class, 'getPayLaterRequests']);
        Route::delete('/pay-later/request/{id}', [CustomerPayLaterController::class, 'deletePayLaterRequest']);
        Route::get('/pay-later/summary', [CustomerPayLaterController::class, 'getPayLaterSummary']);
        Route::get('/pay-later/saved-cards', [CustomerPayLaterController::class, 'getPayLaterSavedCards']);
        Route::get('/pay-later/setup-intent', [CustomerPayLaterController::class, 'setupPayLaterCard']);
        Route::post('/pay-later/save-card', [CustomerPayLaterController::class, 'savePayLaterCard']);
        Route::delete('/pay-later/remove-card', [CustomerPayLaterController::class, 'removePayLaterCard']);
        Route::get('/pay-later/transactions', [CustomerPayLaterController::class, 'getPayLaterTransactions']);

        // Notifications
        Route::get('/notifications', [CustomerNotificationController::class, 'getNotifications']);
        Route::post('/notifications/{id}/read', [CustomerNotificationController::class, 'markNotificationRead']);
        Route::post('/notifications/read-all', [CustomerNotificationController::class, 'markAllNotificationsRead']);

        // Proof of Delivery Management
        Route::get('/orders/{id}/pod-download', [CustomerOrderController::class, 'downloadPod']);
        Route::post('/orders/{id}/pod-approve', [CustomerOrderController::class, 'approvePod']);
        Route::post('/orders/{id}/pod-reject', [CustomerOrderController::class, 'rejectPod']);
        Route::post('/orders/{id}/rate', [CustomerOrderController::class, 'submitReview']);
    });

    // Supplier Endpoints (Public for authenticated suppliers, even if unverified)
    Route::prefix('supplier')->group(function () {
        Route::post('/stripe/connect', [\App\Http\Controllers\API\Supplier\StripeConnectController::class, 'onboard']);

        // Profile & Settings
        Route::get('/profile', [SupplierApiController::class, 'getProfile']);
        Route::post('/profile', [SupplierApiController::class, 'updateProfile']);
        Route::post('/profile/logo', [SupplierApiController::class, 'updateLogo']);
        Route::post('/profile/logo-remove', [SupplierApiController::class, 'removeLogo']);
        Route::post('/profile/compliance/insurance', [SupplierApiController::class, 'updateInsurance']);
        Route::post('/profile/compliance/license', [SupplierApiController::class, 'updateLicense']);
        Route::post('/profile/change-password', [SupplierApiController::class, 'changePassword']);
        Route::post('/profile/delete-account', [SupplierApiController::class, 'deleteAccount']);

        // Notifications
        Route::get('/notifications', [SupplierApiController::class, 'getNotifications']);
        Route::post('/notifications/{id}/read', [SupplierApiController::class, 'markNotificationRead']);
        Route::post('/notifications/read-all', [SupplierApiController::class, 'markAllNotificationsRead']);
    });

    // Strict Supplier Endpoints
    Route::middleware('supplier')->prefix('supplier')->group(function () {
        Route::get('/dashboard', [SupplierApiController::class, 'getDashboardData']);
        Route::get('/available-requests', [SupplierApiController::class, 'getAvailableRequests']);
        Route::get('/requests/{id}', [SupplierApiController::class, 'getRequestDetails']);
        Route::post('/requests/{id}/quote', [SupplierApiController::class, 'submitQuote']);
        Route::post('/quotes/{id}/revise', [SupplierApiController::class, 'submitRevision']);
        Route::get('/quotes', [SupplierApiController::class, 'getMyQuotes']);

        // Orders
        Route::get('/orders', [SupplierApiController::class, 'getMyOrders']);
        Route::get('/orders/{id}', [SupplierApiController::class, 'getOrderDetails']);
        Route::post('/orders/{id}/status', [SupplierApiController::class, 'updateOrderStatus']);

        // Invoices
        Route::get('/invoices', [SupplierApiController::class, 'getMyInvoices']);
        Route::get('/invoices/{id}', [SupplierApiController::class, 'getInvoiceDetails']);

        // POD (Proof of Delivery)
        Route::get('/pods', [SupplierApiController::class, 'getPodOrders']);
        Route::post('/orders/{id}/pod-reupload', [SupplierApiController::class, 'reuploadPod']);

        // Availability & Capacity
        Route::get('/availabilities', [AvailabilityApiController::class, 'index']);
        Route::post('/availabilities', [AvailabilityApiController::class, 'store']);
        Route::post('/availabilities/{id}', [AvailabilityApiController::class, 'update']);
        Route::post('/availabilities/{id}/toggle', [AvailabilityApiController::class, 'toggleStatus']);
        Route::delete('/availabilities/{id}', [AvailabilityApiController::class, 'destroy']);

        // Employee Management
        Route::get('/employees', [EmployeeApiController::class, 'index']);
        Route::post('/employees', [EmployeeApiController::class, 'store']);
        Route::post('/employees/{id}/status', [EmployeeApiController::class, 'updateStatus']);
        Route::delete('/employees/{id}', [EmployeeApiController::class, 'destroy']);

        // Payments
        Route::get('/payments', [SupplierApiController::class, 'getPayments']);

        // Finance & Withdrawals
        Route::prefix('finance')->group(function () {
            Route::get('/dashboard', [\App\Http\Controllers\API\Supplier\SupplierFinanceApiController::class, 'getDashboard']);
            Route::post('/withdraw', [\App\Http\Controllers\API\Supplier\SupplierFinanceApiController::class, 'requestWithdraw']);
        });
    });
});

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/supplier/billing-portal', function (\Illuminate\Http\Request $request) {
        $returnUrl = $request->input('return_url', config('app.frontend_url') . '/supplier-dashboard/settings');
        $user = $request->user();
        if (!$user->hasStripeId()) {
            $user->createAsStripeCustomer();
        }
        return response()->json([
            'success' => true,
            'url' => $user->billingPortalUrl($returnUrl)
        ]);
    });

    Route::post('/client/billing-portal', function (\Illuminate\Http\Request $request) {
        $returnUrl = $request->input('return_url', config('app.frontend_url') . '/client-dashboard/settings');
        $user = $request->user();
        if (!$user->hasStripeId()) {
            $user->createAsStripeCustomer();
        }
        return response()->json([
            'success' => true,
            'url' => $user->billingPortalUrl($returnUrl)
        ]);
    });
});
