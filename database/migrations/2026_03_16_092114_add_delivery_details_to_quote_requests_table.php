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
            $table->date('delivery_date')->nullable()->after('pickup_date');
            $table->time('delivery_time_from')->nullable()->after('pickup_time_till');
            $table->time('delivery_time_till')->nullable()->after('delivery_time_from');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quote_requests', function (Blueprint $table) {
            $table->dropColumn(['delivery_date', 'delivery_time_from', 'delivery_time_till']);
        });
    }
};
