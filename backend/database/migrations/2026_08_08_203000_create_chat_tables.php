<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('cuoc_tro_chuyen')) {
            Schema::create('cuoc_tro_chuyen', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('nguoi_mot_id');
                $table->unsignedBigInteger('nguoi_hai_id');
                $table->string('san_pham_quan_tam', 255)->nullable();
                $table->string('gia_san_pham', 100)->nullable();
                $table->unsignedBigInteger('tin_nhan_cuoi_id')->nullable();
                $table->timestamps();

                $table->foreign('nguoi_mot_id')->references('id')->on('nguoi_dung')->onDelete('cascade');
                $table->foreign('nguoi_hai_id')->references('id')->on('nguoi_dung')->onDelete('cascade');
            });
        }

        if (!Schema::hasTable('tin_nhan')) {
            Schema::create('tin_nhan', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('cuoc_tro_chuyen_id')->nullable();
                $table->unsignedBigInteger('nguoi_gui_id');
                $table->unsignedBigInteger('nguoi_nhan_id');
                $table->text('noi_dung')->nullable();
                $table->string('hinh_anh_url', 1000)->nullable();
                $table->tinyInteger('da_doc')->default(0);
                $table->timestamps();

                $table->foreign('cuoc_tro_chuyen_id')->references('id')->on('cuoc_tro_chuyen')->onDelete('cascade');
                $table->foreign('nguoi_gui_id')->references('id')->on('nguoi_dung')->onDelete('cascade');
                $table->foreign('nguoi_nhan_id')->references('id')->on('nguoi_dung')->onDelete('cascade');
            });
        } else {
            Schema::table('tin_nhan', function (Blueprint $table) {
                if (!Schema::hasColumn('tin_nhan', 'cuoc_tro_chuyen_id')) {
                    $table->unsignedBigInteger('cuoc_tro_chuyen_id')->nullable()->after('id');
                }
                if (!Schema::hasColumn('tin_nhan', 'hinh_anh_url')) {
                    $table->string('hinh_anh_url', 1000)->nullable()->after('noi_dung');
                }
                if (!Schema::hasColumn('tin_nhan', 'updated_at')) {
                    $table->timestamp('updated_at')->nullable()->after('created_at');
                }
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('cuoc_tro_chuyen');
    }
};
