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
        Schema::create('quote_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Customer
            $table->string('service_type')->nullable(); // e.g. Full Truckload
            $table->string('pickup_address')->nullable();
            $table->string('delivery_address')->nullable();
            $table->date('pickup_date')->nullable();
            $table->time('pickup_time_from')->nullable();
            $table->time('pickup_time_till')->nullable();
            $table->text('additional_notes')->nullable();
            $table->string('attachment_path')->nullable();
            $table->enum('status', ['pending', 'active', 'completed', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quote_requests');
    }
};
