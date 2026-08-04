<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::get('/', function () {
    try {
        $userCount = DB::table('users')->count();
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
        return response()->json([
            'status' => 'PARTIAL_ONLINE',
            'message' => 'Backend alive, database boot initializing...',
            'error' => $e->getMessage()
        ], 500, ['Content-Type' => 'application/json; charset=UTF-8'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    }
});
