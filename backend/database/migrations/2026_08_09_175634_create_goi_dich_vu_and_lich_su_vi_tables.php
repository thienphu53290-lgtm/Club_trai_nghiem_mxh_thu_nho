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
        // 1. Tạo bảng goi_dich_vu
        Schema::create('goi_dich_vu', function (Blueprint $table) {
            $table->id();
            $table->string('ten_goi')->comment('Tên gói (VD: Starter, Basic)');
            $table->text('mo_ta')->nullable();
            $table->integer('so_luong_toi_da')->nullable()->comment('Giới hạn người tham gia');
            $table->string('loai_phi')->comment('free, flat, percent');
            $table->decimal('gia_tri', 15, 2)->default(0)->comment('0đ, 799k, 3%...');
            $table->tinyInteger('trang_thai')->default(1);
            $table->timestamps();
        });

        // 2. Tạo bảng lich_su_vi
        Schema::create('lich_su_vi', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('nguoi_dung_id');
            $table->decimal('so_tien', 15, 2);
            $table->string('loai_giao_dich')->comment('ban_ve, rut_tien, nap_tien, mua_quang_cao');
            $table->string('mo_ta')->nullable();
            $table->unsignedBigInteger('tham_chieu_id')->nullable()->comment('ID vé hoặc sự kiện liên quan');
            $table->timestamps();

            $table->foreign('nguoi_dung_id')->references('id')->on('nguoi_dung')->onDelete('cascade');
        });

        Schema::table('nguoi_dung', function (Blueprint $table) {
            $table->decimal('so_du', 15, 2)->default(0);
        });

        // 4. Thêm cột vào su_kien
        Schema::table('su_kien', function (Blueprint $table) {
            $table->unsignedBigInteger('nguoi_tao_id')->nullable()->after('id');
            $table->unsignedBigInteger('goi_dich_vu_id')->nullable()->after('nguoi_tao_id');
            $table->boolean('is_featured')->default(false)->after('trang_thai');

            $table->foreign('nguoi_tao_id')->references('id')->on('nguoi_dung')->onDelete('set null');
            $table->foreign('goi_dich_vu_id')->references('id')->on('goi_dich_vu')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('su_kien', function (Blueprint $table) {
            $table->dropForeign(['nguoi_tao_id']);
            $table->dropForeign(['goi_dich_vu_id']);
            $table->dropColumn(['nguoi_tao_id', 'goi_dich_vu_id', 'is_featured']);
        });

        Schema::table('nguoi_dung', function (Blueprint $table) {
            $table->dropColumn('so_du');
        });

        Schema::dropIfExists('lich_su_vi');
        Schema::dropIfExists('goi_dich_vu');
    }
};
