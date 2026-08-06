<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Customer Credit Accounts
        Schema::create('customer_credit_accounts', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->decimal('credit_limit', 12, 2)->default(5000.00);
            $table->decimal('used_credit', 12, 2)->default(0.00);
            $table->decimal('available_credit', 12, 2)->default(5000.00);
            $table->enum('status', ['active', 'suspended', 'revoked', 'under_review'])->default('active');
            $table->integer('payment_terms_days')->default(14);
            $table->date('credit_expiry_date')->nullable();
            $table->enum('risk_level', ['low', 'medium', 'high'])->default('low');
            $table->timestamps();
            $table->softDeletes();
        });

        // 2. Pay Later Requests
        Schema::create('pay_later_requests', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('requested_limit', 12, 2)->default(5000.00);
            $table->decimal('approved_limit', 12, 2)->nullable();
            $table->enum('status', ['pending', 'under_review', 'approved', 'rejected', 'need_documents'])->default('pending');
            $table->json('company_info')->nullable();
            $table->json('business_documents')->nullable();
            $table->text('notes')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // 3. Credit Transactions (Ledger)
        Schema::create('credit_transactions', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('customer_credit_account_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('invoice_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('order_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('type', [
                'credit_approved',
                'limit_increase',
                'limit_decrease',
                'order_purchase',
                'payment_received',
                'refund',
                'manual_adjustment'
            ]);
            $table->decimal('amount', 12, 2);
            $table->decimal('balance_after', 12, 2);
            $table->decimal('available_credit_after', 12, 2);
            $table->string('reference_number')->nullable();
            $table->string('description')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // 4. Credit Payments
        Schema::create('credit_payments', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('customer_credit_account_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('invoice_id')->nullable()->constrained()->onDelete('set null');
            $table->decimal('amount', 12, 2);
            $table->string('payment_method')->default('stripe');
            $table->string('reference_number')->nullable();
            $table->string('received_by')->nullable();
            $table->enum('status', ['succeeded', 'pending', 'failed'])->default('succeeded');
            $table->text('notes')->nullable();
            $table->timestamps();
        });

        // 5. Credit Audit Logs
        Schema::create('credit_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('customer_credit_account_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
            $table->string('action');
            $table->foreignId('performed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address')->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('credit_audit_logs');
        Schema::dropIfExists('credit_payments');
        Schema::dropIfExists('credit_transactions');
        Schema::dropIfExists('pay_later_requests');
        Schema::dropIfExists('customer_credit_accounts');
    }
};
