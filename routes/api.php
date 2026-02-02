<?php

use App\Http\Controllers\API\Auth\AuthApiController;
use App\Http\Controllers\API\Customer\CustomerApiController;
use App\Http\Controllers\API\Supplier\AvailabilityApiController;
use App\Http\Controllers\API\Supplier\EmployeeApiController;
use App\Http\Controllers\API\Supplier\SupplierApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

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

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthApiController::class, 'logoutApi']);

    // Negotiations & Chat
    Route::get('/negotiations', [\App\Http\Controllers\API\NegotiationApiController::class, 'index']);
    Route::post('/negotiations/{id}/read', [\App\Http\Controllers\API\NegotiationApiController::class, 'markAsRead']);
    Route::post('/negotiations/read-all', [\App\Http\Controllers\API\NegotiationApiController::class, 'markAllAsRead']);

    // Chat/Messaging
    Route::get('/chat/{quoteId}', [\App\Http\Controllers\API\ChatApiController::class, 'getMessages']);
    Route::post('/chat/send', [\App\Http\Controllers\API\ChatApiController::class, 'sendMessage']);

    // Customer Endpoints
    Route::middleware('customer')->prefix('customer')->group(function () {
        Route::post('/quote-requests', [CustomerApiController::class, 'createQuoteRequest']);
        Route::get('/quote-requests', [CustomerApiController::class, 'getMyQuoteRequests']);
        Route::get('/quote-requests/{id}/quotes', [CustomerApiController::class, 'getRequestQuotes']);
        Route::post('/quotes/{id}/accept', [CustomerApiController::class, 'acceptQuote']);
        Route::post('/quotes/{id}/accept-revision', [CustomerApiController::class, 'acceptRevision']);
        Route::post('/quotes/{id}/reject-revision', [CustomerApiController::class, 'rejectRevision']);

        // Orders
        Route::get('/orders', [CustomerApiController::class, 'getMyOrders']);
        Route::get('/orders/{id}', [CustomerApiController::class, 'getOrderDetails']);

        // Billing
        Route::get('/invoices', [CustomerApiController::class, 'getMyInvoices']);
        Route::get('/invoices/{id}', [CustomerApiController::class, 'getInvoiceDetails']);
        Route::get('/invoices/{id}/download', [CustomerApiController::class, 'downloadInvoice']);
        Route::post('/invoices/{id}/pay', [CustomerApiController::class, 'payInvoice']);

        // Profile & Settings Management
        Route::get('/profile', [\App\Http\Controllers\API\Customer\SettingsController::class, 'getProfile']);
        Route::post('/profile', [\App\Http\Controllers\API\Customer\SettingsController::class, 'updateProfile']);
        Route::post('/change-password', [\App\Http\Controllers\API\Customer\SettingsController::class, 'changePassword']);
        Route::delete('/account', [\App\Http\Controllers\API\Customer\SettingsController::class, 'deleteAccount']);
    });

    // Supplier Endpoints
    Route::middleware('supplier')->prefix('supplier')->group(function () {
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

        // Profile & Settings
        Route::get('/profile', [SupplierApiController::class, 'getProfile']);
        Route::post('/profile', [SupplierApiController::class, 'updateProfile']);
        Route::post('/profile/logo', [SupplierApiController::class, 'updateLogo']);
        Route::post('/profile/logo-remove', [SupplierApiController::class, 'removeLogo']);
        Route::post('/profile/compliance/insurance', [SupplierApiController::class, 'updateInsurance']);
        Route::post('/profile/compliance/license', [SupplierApiController::class, 'updateLicense']);
        Route::post('/profile/change-password', [SupplierApiController::class, 'changePassword']);
        Route::post('/profile/request-deletion', [SupplierApiController::class, 'requestDeletion']);
    });
});
