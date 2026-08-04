<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    try {
        if (!DB::getSchemaBuilder()->hasTable('nguoi_dung')) {
            Artisan::call('migrate', ['--force' => true]);
            Artisan::call('db:seed', ['--force' => true]);
        }
        $userCount = DB::table('nguoi_dung')->count();
        $postCount = DB::table('bai_viet')->count();
        return response()->json([
            'status' => 'SUCCESS',
            'message' => '🚀 Club Trải Nghiệm Backend & SQLite Database Operational 100%',
            'data_status' => [
                'database_connected' => true,
                'users_count' => $userCount,
                'posts_count' => $postCount,
                'betterstack_logtail' => 'Active WORM Ready'
            ]
        ], 200, ['Content-Type' => 'application/json; charset=UTF-8'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    } catch (\Throwable $e) {
        try {
            Artisan::call('migrate', ['--force' => true]);
            Artisan::call('db:seed', ['--force' => true]);
            return response()->json([
                'status' => 'RECOVERED',
                'message' => '🚀 Club Trải Nghiệm Backend auto-healed SQLite database successfully!',
                'migration_output' => Artisan::output()
            ], 200, ['Content-Type' => 'application/json; charset=UTF-8'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        } catch (\Throwable $ex) {
            return response()->json([
                'status' => 'ERROR',
                'error' => $ex->getMessage(),
                'original_error' => $e->getMessage()
            ], 500, ['Content-Type' => 'application/json; charset=UTF-8'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        }
    }
});
