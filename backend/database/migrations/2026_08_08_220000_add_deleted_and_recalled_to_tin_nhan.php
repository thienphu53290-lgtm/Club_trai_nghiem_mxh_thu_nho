<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tin_nhan', function (Blueprint $table) {
            if (!Schema::hasColumn('tin_nhan', 'deleted_by_users')) {
                $table->string('deleted_by_users', 1000)->nullable()->after('da_doc');
            }
            if (!Schema::hasColumn('tin_nhan', 'is_recalled')) {
                $table->tinyInteger('is_recalled')->default(0)->after('deleted_by_users');
            }
        });
    }

    public function down(): void
    {
        Schema::table('tin_nhan', function (Blueprint $table) {
            $table->dropColumn(['deleted_by_users', 'is_recalled']);
        });
    }
};
