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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('quote_id')->constrained()->onDelete('cascade');
            $table->foreignId('customer_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('supplier_id')->constrained('users')->onDelete('cascade');
            $table->decimal('total_amount', 12, 2);
            $table->string('service_type');
            $table->text('pickup_address');
            $table->text('delivery_address');
            $table->date('pickup_date');
            $table->string('estimated_time')->nullable();
            $table->enum('status', ['confirmed', 'in_progress', 'picked_up', 'delivered', 'cancelled'])->default('confirmed');
            $table->text('status_note')->nullable();
            $table->string('proof_of_delivery')->nullable();
            $table->enum('pod_status', ['awaiting', 'pending', 'confirmed', 'rejected'])->default('awaiting');
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('item_type');
            $table->integer('quantity');
            $table->decimal('length', 10, 2)->nullable();
            $table->decimal('width', 10, 2)->nullable();
            $table->decimal('height', 10, 2)->nullable();
            $table->decimal('weight', 10, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};
