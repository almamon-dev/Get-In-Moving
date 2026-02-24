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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained()->onDelete('cascade');
            $table->string('transaction_id')->unique()->nullable(); // Stripe Payment Intent ID or similar
            $table->string('session_id')->nullable(); // Stripe Session ID
            $table->decimal('amount', 12, 2);
            $table->string('currency', 10)->default('usd');
            $table->string('status'); // e.g., succeeded, pending, failed
            $table->string('payment_method')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
