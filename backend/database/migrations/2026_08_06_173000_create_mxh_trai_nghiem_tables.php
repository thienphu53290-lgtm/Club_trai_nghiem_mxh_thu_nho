<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('danh_muc', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->string('loai_danh_muc', 50)->default('bai_viet')->comment('bai_viet, san_pham, su_kien');
            $table->string('ten', 100);
            $table->string('slug', 100)->unique();
            $table->text('mo_ta')->nullable();
            $table->string('hinh_anh', 255)->nullable();
            $table->integer('danh_muc_cha_id')->nullable();
            $table->integer('thu_tu')->default(0);
            $table->tinyInteger('trang_thai')->default(1)->comment('1: Hiện, 0: Ẩn');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('danh_muc_cha_id')->references('id')->on('danh_muc')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::create('vi_tri_banner', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->string('ten', 100);
            $table->string('ma', 50)->unique()->comment('hero, sidebar_left, popup...');
            $table->string('mo_ta', 255)->nullable();
            $table->tinyInteger('trang_thai')->default(1)->comment('1: Hiện, 0: Ẩn');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });

        Schema::create('banner', function (Blueprint $table) {
            $table->integer('id')->autoIncrement();
            $table->integer('vi_tri_banner_id');
            $table->string('tieu_de', 255)->nullable();
            $table->text('mo_ta')->nullable();
            $table->string('hinh_anh', 255);
            $table->string('duong_dan', 255)->nullable();
            $table->integer('thu_tu')->default(0);
            $table->tinyInteger('trang_thai')->default(1)->comment('1: Hiện, 0: Ẩn');
            $table->dateTime('ngay_bat_dau')->nullable();
            $table->dateTime('ngay_ket_thuc')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('vi_tri_banner_id')->references('id')->on('vi_tri_banner')->onDelete('cascade')->onUpdate('cascade');
        });

        Schema::create('san_pham', function (Blueprint $table) {
            $table->id();
            $table->integer('danh_muc_id');
            $table->string('ten', 255);
            $table->string('slug', 255)->unique();
            $table->text('mo_ta')->nullable();
            $table->string('anh_dai_dien', 255)->nullable();
            $table->decimal('gia_tham_khao', 12, 2)->nullable();
            $table->integer('luot_xem')->default(0);
            $table->tinyInteger('trang_thai')->default(1)->comment('1: Hiển thị, 0: Ẩn');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('danh_muc_id')->references('id')->on('danh_muc')->onUpdate('cascade');
        });

        Schema::create('su_kien', function (Blueprint $table) {
            $table->id();
            $table->string('tieu_de', 255);
            $table->string('slug', 255)->unique();
            $table->string('anh_bia', 255)->nullable();
            $table->longText('mo_ta')->nullable();
            $table->string('dia_diem', 255)->nullable();
            $table->dateTime('thoi_gian_bat_dau');
            $table->dateTime('thoi_gian_ket_thuc');
            $table->integer('so_luong_toi_da')->nullable();
            $table->tinyInteger('trang_thai')->default(1)->comment('0: Hủy, 1: Sắp diễn ra, 2: Đang diễn ra, 3: Đã kết thúc');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });

        Schema::create('bai_viet', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('nguoi_dung_id');
            $table->integer('danh_muc_id');
            $table->string('loai_bai_viet', 50)->default('review')->comment('review, check_in, video_short');
            $table->string('tieu_de', 255);
            $table->string('slug', 255)->unique();
            $table->longText('noi_dung');
            $table->string('anh_bia', 255)->nullable();
            $table->json('hashtags')->nullable()->comment('Mảng JSON hoặc danh sách chuỗi thẻ tag như #cafe, #tech');
            $table->integer('luot_xem')->default(0);
            $table->tinyInteger('trang_thai')->default(1)->comment('0: Nháp, 1: Xuất bản, 2: Khóa');
            $table->tinyInteger('ghim')->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('nguoi_dung_id')->references('id')->on('nguoi_dung')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('danh_muc_id')->references('id')->on('danh_muc')->onUpdate('cascade');
        });

        Schema::create('tep_bai_viet', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bai_viet_id');
            $table->string('loai', 20)->comment('image, video, document');
            $table->string('duong_dan', 255);
            $table->integer('thu_tu')->default(0);
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('bai_viet_id')->references('id')->on('bai_viet')->onDelete('cascade')->onUpdate('cascade');
        });

        Schema::create('bai_viet_san_pham', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bai_viet_id');
            $table->unsignedBigInteger('san_pham_id');

            $table->foreign('bai_viet_id')->references('id')->on('bai_viet')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('san_pham_id')->references('id')->on('san_pham')->onDelete('cascade')->onUpdate('cascade');
        });

        Schema::create('binh_luan', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bai_viet_id');
            $table->unsignedBigInteger('nguoi_dung_id');
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->text('noi_dung');
            $table->tinyInteger('trang_thai')->default(1)->comment('1: Hiện, 0: Ẩn');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('bai_viet_id')->references('id')->on('bai_viet')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('nguoi_dung_id')->references('id')->on('nguoi_dung')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('parent_id')->references('id')->on('binh_luan')->onDelete('cascade')->onUpdate('cascade');
        });

        Schema::create('cam_xuc', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bai_viet_id')->nullable();
            $table->unsignedBigInteger('binh_luan_id')->nullable();
            $table->unsignedBigInteger('nguoi_dung_id');
            $table->string('loai', 20)->comment('like, love, haha, wow, sad, angry');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('bai_viet_id')->references('id')->on('bai_viet')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('binh_luan_id')->references('id')->on('binh_luan')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('nguoi_dung_id')->references('id')->on('nguoi_dung')->onDelete('cascade')->onUpdate('cascade');
        });

        Schema::create('danh_gia', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('san_pham_id');
            $table->unsignedBigInteger('nguoi_dung_id');
            $table->tinyInteger('so_sao')->comment('Từ 1 đến 5');
            $table->text('noi_dung')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('san_pham_id')->references('id')->on('san_pham')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('nguoi_dung_id')->references('id')->on('nguoi_dung')->onDelete('cascade')->onUpdate('cascade');
        });

        Schema::create('lien_ket_mua', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('san_pham_id');
            $table->string('ten_san', 100)->comment('Shopee, TikTok Shop, Lazada, Web chính');
            $table->text('url');
            $table->text('url_affiliate')->nullable();
            $table->decimal('gia', 12, 2)->nullable();
            $table->tinyInteger('mac_dinh')->default(0);
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('san_pham_id')->references('id')->on('san_pham')->onDelete('cascade')->onUpdate('cascade');
        });

        Schema::create('click_affiliate', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('nguoi_dung_id')->nullable();
            $table->unsignedBigInteger('lien_ket_id');
            $table->unsignedBigInteger('bai_viet_id')->nullable();
            $table->string('dia_chi_ip', 45)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('nguoi_dung_id')->references('id')->on('nguoi_dung')->onDelete('set null')->onUpdate('cascade');
            $table->foreign('lien_ket_id')->references('id')->on('lien_ket_mua')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('bai_viet_id')->references('id')->on('bai_viet')->onDelete('set null')->onUpdate('cascade');
        });

        Schema::create('dang_ky_su_kien', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('su_kien_id');
            $table->unsignedBigInteger('nguoi_dung_id');
            $table->string('ho_ten', 100);
            $table->string('so_dien_thoai', 20);
            $table->tinyInteger('trang_thai')->default(0)->comment('0: Chờ duyệt, 1: Đã duyệt, 2: Đã tham gia');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('su_kien_id')->references('id')->on('su_kien')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('nguoi_dung_id')->references('id')->on('nguoi_dung')->onDelete('cascade')->onUpdate('cascade');
        });

        Schema::create('theo_doi', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('nguoi_theo_doi_id');
            $table->unsignedBigInteger('nguoi_duoc_theo_doi_id');
            $table->tinyInteger('trang_thai')->default(1)->comment('1: Đã theo dõi');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('nguoi_theo_doi_id')->references('id')->on('nguoi_dung')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('nguoi_duoc_theo_doi_id')->references('id')->on('nguoi_dung')->onDelete('cascade')->onUpdate('cascade');
        });

        Schema::create('thong_bao', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('nguoi_dung_id');
            $table->string('tieu_de', 255);
            $table->text('noi_dung');
            $table->string('loai', 50)->default('system')->comment('system, post, comment, event...');
            $table->string('duong_dan', 255)->nullable();
            $table->tinyInteger('da_doc')->default(0);
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('nguoi_dung_id')->references('id')->on('nguoi_dung')->onDelete('cascade')->onUpdate('cascade');
        });

        Schema::create('tin_nhan', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('nguoi_gui_id');
            $table->unsignedBigInteger('nguoi_nhan_id');
            $table->text('noi_dung');
            $table->tinyInteger('da_doc')->default(0);
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('nguoi_gui_id')->references('id')->on('nguoi_dung')->onDelete('cascade')->onUpdate('cascade');
            $table->foreign('nguoi_nhan_id')->references('id')->on('nguoi_dung')->onDelete('cascade')->onUpdate('cascade');
        });

        Schema::create('da_luu', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('nguoi_dung_id');
            $table->string('ten_bo_suu_tap', 255)->default('Lưu tự do')->comment('Phân loại vào bộ sưu tập trải nghiệm');
            $table->string('loai', 50)->comment('post, product, video');
            $table->unsignedBigInteger('doi_tuong_id');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('nguoi_dung_id')->references('id')->on('nguoi_dung')->onDelete('cascade')->onUpdate('cascade');
        });

        Schema::create('ho_tro', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('nguoi_dung_id');
            $table->string('tieu_de', 255);
            $table->text('noi_dung');
            $table->tinyInteger('trang_thai')->default(0)->comment('0: Mới, 1: Đang xử lý, 2: Đã xong');
            $table->timestamp('created_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();

            $table->foreign('nguoi_dung_id')->references('id')->on('nguoi_dung')->onDelete('cascade')->onUpdate('cascade');
        });

        Schema::create('bao_cao', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('nguoi_gui_id');
            $table->string('loai', 50)->comment('post, comment, user, product');
            $table->unsignedBigInteger('doi_tuong_id');
            $table->string('ly_do', 255);
            $table->tinyInteger('trang_thai')->default(0)->comment('0: Chờ xử lý, 1: Đã xử lý, 2: Bỏ qua');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('nguoi_gui_id')->references('id')->on('nguoi_dung')->onDelete('cascade')->onUpdate('cascade');
        });

        Schema::create('nhat_ky', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('nguoi_dung_id')->nullable();
            $table->string('hanh_dong', 100);
            $table->string('bang_du_lieu', 100)->nullable();
            $table->json('du_lieu')->nullable();
            $table->string('dia_chi_ip', 45)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('nguoi_dung_id')->references('id')->on('nguoi_dung')->onDelete('set null')->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nhat_ky');
        Schema::dropIfExists('bao_cao');
        Schema::dropIfExists('ho_tro');
        Schema::dropIfExists('da_luu');
        Schema::dropIfExists('tin_nhan');
        Schema::dropIfExists('thong_bao');
        Schema::dropIfExists('theo_doi');
        Schema::dropIfExists('dang_ky_su_kien');
        Schema::dropIfExists('click_affiliate');
        Schema::dropIfExists('lien_ket_mua');
        Schema::dropIfExists('danh_gia');
        Schema::dropIfExists('cam_xuc');
        Schema::dropIfExists('binh_luan');
        Schema::dropIfExists('bai_viet_san_pham');
        Schema::dropIfExists('tep_bai_viet');
        Schema::dropIfExists('bai_viet');
        Schema::dropIfExists('su_kien');
        Schema::dropIfExists('san_pham');
        Schema::dropIfExists('banner');
        Schema::dropIfExists('vi_tri_banner');
        Schema::dropIfExists('danh_muc');
    }
};
