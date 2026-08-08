<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Tạo bảng giao_dich
        Schema::create('giao_dich', function (Blueprint $table) {
            $table->id();
            $table->string('ma_giao_dich')->unique()->comment('Mã tra cứu (VD: PAY-20260807-XYZ)');
            $table->unsignedBigInteger('nguoi_dung_id');
            $table->string('loai_nguon_thu')->comment('ve_su_kien, goi_vip, affiliate, donate, vv...');
            $table->unsignedBigInteger('doi_tuong_id')->nullable()->comment('ID của sự kiện, gói VIP...');
            $table->decimal('so_tien', 15, 2);
            $table->string('phuong_thuc_thanh_toan')->nullable()->comment('VNPay, MoMo, ChuyenKhoan...');
            $table->tinyInteger('trang_thai')->default(0)->comment('0: Chờ thanh toán, 1: Thành công, 2: Thất bại, 3: Hoàn tiền');
            $table->timestamp('ngay_thanh_toan')->nullable();
            $table->timestamps();

            $table->foreign('nguoi_dung_id')->references('id')->on('nguoi_dung')->onDelete('cascade')->onUpdate('cascade');
        });

        // 2. Tạo bảng goi_vip (Danh mục các gói dịch vụ)
        Schema::create('goi_vip', function (Blueprint $table) {
            $table->id();
            $table->string('ten_goi')->comment('Gói Trải Nghiệm Pro, Gói Kim Cương...');
            $table->text('mo_ta')->nullable();
            $table->decimal('gia_tien', 15, 2);
            $table->integer('thoi_han_ngay')->comment('Thời gian gói (Ví dụ: 30, 365)');
            $table->tinyInteger('trang_thai')->default(1)->comment('1: Đang bán, 0: Ngừng bán');
            $table->timestamps();
        });

        // 3. Tạo bảng lich_su_goi_vip (Lưu người dùng đang dùng gói nào)
        Schema::create('lich_su_goi_vip', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('nguoi_dung_id');
            $table->unsignedBigInteger('goi_vip_id');
            $table->unsignedBigInteger('giao_dich_id')->nullable();
            $table->dateTime('ngay_kich_hoat');
            $table->dateTime('ngay_het_han');
            $table->tinyInteger('trang_thai')->default(1)->comment('1: Đang dùng, 0: Đã hết hạn');
            $table->timestamps();

            $table->foreign('nguoi_dung_id')->references('id')->on('nguoi_dung')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('goi_vip_id')->references('id')->on('goi_vip')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('giao_dich_id')->references('id')->on('giao_dich')->onDelete('set null')->onUpdate('cascade');
        });

        // 4. Bổ sung giá vé vào bảng su_kien
        Schema::table('su_kien', function (Blueprint $table) {
            $table->decimal('gia_ve', 15, 2)->default(0)->after('trang_thai')->comment('Giá vé sự kiện, 0 = miễn phí');
        });

        // 5. Liên kết bảng dang_ky_su_kien với giao_dich
        Schema::table('dang_ky_su_kien', function (Blueprint $table) {
            $table->unsignedBigInteger('giao_dich_id')->nullable()->after('trang_thai');
            
            $table->foreign('giao_dich_id')->references('id')->on('giao_dich')->onDelete('set null')->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('dang_ky_su_kien', function (Blueprint $table) {
            $table->dropForeign(['giao_dich_id']);
            $table->dropColumn('giao_dich_id');
        });

        Schema::table('su_kien', function (Blueprint $table) {
            $table->dropColumn('gia_ve');
        });

        Schema::dropIfExists('lich_su_goi_vip');
        Schema::dropIfExists('goi_vip');
        Schema::dropIfExists('giao_dich');
    }
};
