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
        Schema::create('supplier_availabilities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supplier_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['standard', 'recurring'])->default('standard');
            $table->string('service_type');

            // Route/Location
            $table->string('pickup_region')->nullable();
            $table->string('delivery_region')->nullable();

            // Timing
            $table->date('start_date');
            $table->date('end_date')->nullable(); // For recurring
            $table->json('days_of_week')->nullable(); // ['monday', 'tuesday', ...]
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();

            // Pricing & Capacity
            $table->decimal('price', 15, 2)->default(0);
            $table->integer('capacity_limit')->default(0);
            $table->integer('capacity_used')->default(0);

            // Constraints
            $table->decimal('min_weight', 10, 2)->nullable();
            $table->decimal('max_weight', 10, 2)->nullable();

            $table->text('notes')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supplier_availabilities');
    }
};
