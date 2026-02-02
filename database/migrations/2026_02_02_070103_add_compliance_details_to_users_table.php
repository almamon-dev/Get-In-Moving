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
            $table->date('license_expiry_date')->nullable()->after('policy_expiry_date');
            $table->enum('insurance_status', ['pending', 'verified', 'rejected'])->default('pending')->after('insurance_document');
            $table->enum('license_status', ['pending', 'verified', 'rejected'])->default('pending')->after('license_document');
            $table->timestamp('insurance_uploaded_at')->nullable()->after('insurance_status');
            $table->timestamp('license_uploaded_at')->nullable()->after('license_status');
            $table->timestamp('deletion_requested_at')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'license_expiry_date',
                'insurance_status',
                'license_status',
                'insurance_uploaded_at',
                'license_uploaded_at',
                'deletion_requested_at',
            ]);
        });
    }
};
