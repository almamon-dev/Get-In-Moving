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
        Schema::table('quote_requests', function (Blueprint $table) {
            $table->string('pickup_address')->nullable()->change();
            $table->string('delivery_address')->nullable()->change();
            $table->date('pickup_date')->nullable()->change();
            $table->time('pickup_time_from')->nullable()->change();
            $table->time('pickup_time_till')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quote_requests', function (Blueprint $table) {
            $table->string('pickup_address')->nullable(false)->change();
            $table->string('delivery_address')->nullable(false)->change();
            $table->date('pickup_date')->nullable(false)->change();
            $table->time('pickup_time_from')->nullable(false)->change();
            $table->time('pickup_time_till')->nullable(false)->change();
        });
    }
};
