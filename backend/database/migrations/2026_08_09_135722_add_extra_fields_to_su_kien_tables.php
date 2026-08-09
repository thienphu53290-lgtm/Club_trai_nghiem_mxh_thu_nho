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
        Schema::table('su_kien', function (Blueprint $table) {
            $table->integer('so_ve_mien_phi')->default(0)->after('gia_ve')->comment('Số lượng vé miễn phí đầu tiên (Early Bird)');
            $table->tinyInteger('hinh_thuc')->default(0)->after('dia_diem')->comment('0: Offline, 1: Online');
            $table->longText('giai_thuong')->nullable()->after('trang_thai')->comment('Mô tả giải thưởng nếu có giveaway');
        });

        Schema::table('dang_ky_su_kien', function (Blueprint $table) {
            $table->string('giai_thuong_nhan_duoc', 255)->nullable()->after('giao_dich_id')->comment('Giải thưởng nhận được khi quay số');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('su_kien', function (Blueprint $table) {
            $table->dropColumn(['so_ve_mien_phi', 'hinh_thuc', 'giai_thuong']);
        });

        Schema::table('dang_ky_su_kien', function (Blueprint $table) {
            $table->dropColumn('giai_thuong_nhan_duoc');
        });
    }
};
