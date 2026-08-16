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
        Schema::table('dang_ky_su_kien', function (Blueprint $table) {
            $table->timestamp('thoi_gian_checkin')->nullable()->after('trang_thai');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dang_ky_su_kien', function (Blueprint $table) {
            $table->dropColumn('thoi_gian_checkin');
        });
    }
};
