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
        Schema::table('quotes', function (Blueprint $table) {
            $table->decimal('revised_amount', 12, 2)->nullable();
            $table->string('revised_estimated_time')->nullable();
            $table->enum('revision_status', ['none', 'pending', 'accepted', 'rejected'])->default('none');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('quotes', function (Blueprint $table) {
            $table->dropColumn(['revised_amount', 'revised_estimated_time', 'revision_status']);
        });
    }
};
