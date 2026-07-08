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
        Schema::table('users', function (Blueprint $table) {
            $table->string('pay_later_pm_id')->nullable();
            $table->string('pay_later_pm_last_four', 4)->nullable();
            $table->string('pay_later_pm_type')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'pay_later_pm_id',
                'pay_later_pm_last_four',
                'pay_later_pm_type',
            ]);
        });
    }
};
