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
        Schema::create('quote_request_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_request_id')->constrained()->onDelete('cascade');
            $table->string('item_type'); // e.g. Euro pallets
            $table->integer('quantity');
            $table->decimal('length', 10, 2)->nullable(); // cm
            $table->decimal('width', 10, 2)->nullable(); // cm
            $table->decimal('height', 10, 2)->nullable(); // cm
            $table->decimal('weight', 10, 2)->nullable(); // kg
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quote_request_items');
    }
};
