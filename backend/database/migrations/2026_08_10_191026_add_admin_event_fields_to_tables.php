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
            $table->timestamp('check_in_at')->nullable()->after('trang_thai')->comment('Thời gian quét mã QR vào cổng');
            $table->json('thong_tin_bo_sung')->nullable()->after('giao_dich_id')->comment('Form đăng ký: size áo, ăn chay/mặn...');
        });

        Schema::table('su_kien', function (Blueprint $table) {
            $table->json('tai_lieu_dinh_kem')->nullable()->after('thu_vien_anh')->comment('File PDF, slide gửi cho khách mời');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tables', function (Blueprint $table) {
            //
        });
    }
};
