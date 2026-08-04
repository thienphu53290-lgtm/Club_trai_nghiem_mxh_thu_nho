<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vai_tro', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->string('ten', 50)->unique();
            $table->string('mo_ta', 255)->nullable();
            $table->tinyInteger('trang_thai')->default(1)->comment('1: Hoạt động, 0: Khóa');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });

        Schema::create('cap_bac', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->string('ten_cap_bac', 100)->unique();
            $table->integer('diem_toi_thieu')->default(0);
            $table->integer('diem_toi_da')->nullable();
            $table->string('anh_cap_bac', 255)->nullable();
            $table->string('icon', 50)->nullable();
            $table->string('mau_sac', 255)->nullable();
            $table->string('mo_ta', 255)->nullable();
            $table->tinyInteger('trang_thai')->default(1);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });

        Schema::create('nguoi_dung', function (Blueprint $table) {
            $table->id();
            $table->integer('vai_tro_id')->default(1);
            $table->integer('cap_bac_id')->default(1);
            $table->string('email', 100)->unique();
            $table->string('mat_khau', 255);
            $table->string('ho_ten', 100)->nullable();
            $table->string('ten_hien_thi', 100)->nullable();
            $table->string('anh_dai_dien', 255)->nullable();
            $table->string('anh_bia', 255)->nullable();
            $table->text('tieu_su')->nullable();
            $table->string('so_dien_thoai', 20)->nullable();
            $table->date('ngay_sinh')->nullable();
            $table->tinyInteger('gioi_tinh')->nullable()->comment('1: Nam, 2: Nữ, 3: Khác');
            $table->string('dia_chi', 255)->nullable();
            $table->string('facebook', 255)->nullable();
            $table->string('instagram', 255)->nullable();
            $table->string('tiktok', 255)->nullable();
            $table->string('website', 255)->nullable();
            $table->json('huy_chuong_danh_hieu')->nullable()->comment('Mảng JSON chứa các danh hiệu và huy chương đạt được');
            $table->integer('diem_trai_nghiem')->default(100)->comment('Điểm hoạt động trải nghiệm tích lũy');
            $table->string('cap_bac', 100)->default('Đồng Tiên Phong')->comment('Danh hiệu cấp bậc thành viên');
            $table->tinyInteger('trang_thai')->default(1)->comment('1: Hoạt động, 0: Khóa');
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('lan_cuoi_dang_nhap')->nullable();
            $table->rememberToken();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('vai_tro_id')->references('id')->on('vai_tro')->onUpdate('cascade');
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('nguoi_dung');
        Schema::dropIfExists('cap_bac');
        Schema::dropIfExists('vai_tro');
    }
};
