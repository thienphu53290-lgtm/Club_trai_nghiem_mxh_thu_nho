<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cuoc_tro_chuyen', function (Blueprint $table) {
            if (!Schema::hasColumn('cuoc_tro_chuyen', 'nguoi_mot_chan')) {
                $table->tinyInteger('nguoi_mot_chan')->default(0)->after('tin_nhan_cuoi_id');
            }
            if (!Schema::hasColumn('cuoc_tro_chuyen', 'nguoi_hai_chan')) {
                $table->tinyInteger('nguoi_hai_chan')->default(0)->after('nguoi_mot_chan');
            }
            if (!Schema::hasColumn('cuoc_tro_chuyen', 'mot_chan_at')) {
                $table->timestamp('mot_chan_at')->nullable()->after('nguoi_hai_chan');
            }
            if (!Schema::hasColumn('cuoc_tro_chuyen', 'hai_chan_at')) {
                $table->timestamp('hai_chan_at')->nullable()->after('mot_chan_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('cuoc_tro_chuyen', function (Blueprint $table) {
            $table->dropColumn(['nguoi_mot_chan', 'nguoi_hai_chan', 'mot_chan_at', 'hai_chan_at']);
        });
    }
};
