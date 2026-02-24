<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Illuminate\Database\Schema\Blueprint $table) {
            $table->string('stripe_account_id')->nullable()->after('deletion_requested_at');
            $table->boolean('is_stripe_connected')->default(false)->after('stripe_account_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Illuminate\Database\Schema\Blueprint $table) {
            $table->dropColumn(['stripe_account_id', 'is_stripe_connected']);
        });
    }
};
