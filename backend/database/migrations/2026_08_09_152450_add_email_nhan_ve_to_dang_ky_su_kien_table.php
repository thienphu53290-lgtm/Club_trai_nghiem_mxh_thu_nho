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
            $table->string('email_nhan_ve')->nullable()->after('ho_ten');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('dang_ky_su_kien', function (Blueprint $table) {
            $table->dropColumn('email_nhan_ve');
        });
    }
};
