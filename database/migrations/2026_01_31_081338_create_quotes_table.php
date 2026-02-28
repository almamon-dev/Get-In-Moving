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
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_request_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Supplier
            $table->decimal('amount', 12, 2);
            $table->string('estimated_time')->nullable();
            $table->text('notes')->nullable();
            $table->timestamp('valid_until')->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected', 'withdrawn'])->default('pending');
            $table->decimal('revised_amount', 12, 2)->nullable();
            $table->string('revised_estimated_time')->nullable();
            $table->enum('revision_status', ['none', 'pending', 'accepted', 'rejected'])->default('none');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
