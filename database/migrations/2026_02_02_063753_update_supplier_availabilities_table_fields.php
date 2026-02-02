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
        Schema::table('supplier_availabilities', function (Blueprint $table) {
            $table->string('route_name')->nullable()->after('type');
            $table->integer('capacity_limit')->nullable()->change();
            $table->string('trailer_type')->nullable()->after('service_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('supplier_availabilities', function (Blueprint $table) {
            $table->dropColumn(['route_name', 'trailer_type']);
            $table->integer('capacity_limit')->nullable(false)->change();
        });
    }
};
