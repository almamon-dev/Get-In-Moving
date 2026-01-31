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
        Schema::create('messages', function (Blueprint $description) {
            $description->id();
            $description->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $description->foreignId('receiver_id')->constrained('users')->onDelete('cascade');
            $description->foreignId('quote_id')->constrained('quotes')->onDelete('cascade');
            $description->text('message');
            $description->boolean('is_read')->default(false);
            $description->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
