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
        Schema::table('nguoi_dung', function (Blueprint $table) {
            $table->string('provider', 50)->nullable()->after('email');
            $table->string('provider_id', 255)->nullable()->after('provider');
            $table->string('mat_khau', 255)->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nguoi_dung', function (Blueprint $table) {
            $table->dropColumn(['provider', 'provider_id']);
            $table->string('mat_khau', 255)->nullable(false)->change();
        });
    }
};
