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
        Schema::create('pay_later_facilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->decimal('credit_limit', 12, 2)->default(5000.00);
            $table->decimal('daily_limit', 12, 2)->default(0.00);
            $table->decimal('weekly_limit', 12, 2)->default(0.00);
            $table->decimal('reserved_credit', 12, 2)->default(0.00);
            $table->enum('status', ['inactive', 'pending', 'approved', 'rejected', 'suspended'])->default('inactive');
            $table->timestamp('requested_at')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->string('payment_method_id')->nullable();
            $table->string('card_last_four', 10)->nullable();
            $table->string('card_type', 50)->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pay_later_facilities');
    }
};
