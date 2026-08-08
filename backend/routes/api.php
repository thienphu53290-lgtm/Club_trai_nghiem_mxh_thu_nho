<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Events\RealtimeNotificationEvent;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\AdminController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/profile/{id?}', [ProfileController::class, 'show']);
Route::get('/feed/posts', [FeedController::class, 'index']);
Route::get('/banners/hero', [BannerController::class, 'getHeroBanners']);

Route::post('/chat/heartbeat', [ChatController::class, 'heartbeat']);
Route::get('/chat/presence-status', [ChatController::class, 'getPresenceStatus']);
Route::post('/chat/broadcast-status', [ChatController::class, 'broadcastStatus']);

Route::middleware(['auth:sanctum', 'check_status', 'crud_logger'])->group(function () {
    Route::get('/admin/dashboard-stats', [AdminController::class, 'dashboard']);
    Route::get('/admin/logs', [AdminController::class, 'getLogs']);
    Route::get('/admin/users', [AdminController::class, 'getUsers']);
    Route::post('/admin/users', [AdminController::class, 'createUser']);
    Route::put('/admin/users/{id}/status', [AdminController::class, 'toggleUserStatus']);
    Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
    Route::get('/admin/roles', [AdminController::class, 'getRoles']);
    Route::post('/admin/roles', [AdminController::class, 'addRole']);
    Route::put('/admin/roles/{id}', [AdminController::class, 'updateRole']);
    Route::delete('/admin/roles/{id}', [AdminController::class, 'deleteRole']);
    Route::get('/admin/admins', [AdminController::class, 'getAdmins']);
    Route::post('/admin/admins', [AdminController::class, 'addAdmin']);
    Route::put('/admin/admins/{id}', [AdminController::class, 'updateAdmin']);
    Route::delete('/admin/admins/{id}/revoke', [AdminController::class, 'revokeAdmin']);
    Route::post('/onboarding', [AuthController::class, 'saveOnboarding']);
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/profile/update', [ProfileController::class, 'update']);
    Route::post('/users/{id}/follow', [ProfileController::class, 'toggleFollow']);
    Route::get('/users/connections', [ProfileController::class, 'getConnections']);
    Route::post('/posts/{id}/like', [ProfileController::class, 'toggleLikePost']);
    Route::post('/posts/{id}/comment', [ProfileController::class, 'addComment']);
    Route::post('/comments/{id}/like', [ProfileController::class, 'toggleLikeComment']);
    Route::post('/feed/posts', [FeedController::class, 'store']);
    Route::put('/feed/posts/{id}', [FeedController::class, 'update']);
    Route::delete('/feed/posts/{id}', [FeedController::class, 'destroy']);
    Route::get('/chat/conversations', [ChatController::class, 'getConversations']);
    Route::put('/chat/read', [App\Http\Controllers\ChatController::class, 'markAsRead']);
    Route::post('/chat/typing', [App\Http\Controllers\ChatTypingController::class, 'typing']);
    Route::get('/chat/messages/{partnerId}', [ChatController::class, 'getMessages']);
    Route::post('/chat/messages', [ChatController::class, 'sendMessage']);
    Route::delete('/chat/messages/{id}', [ChatController::class, 'deleteMessage']);
    Route::delete('/chat/conversations/{partnerId}', [ChatController::class, 'deleteConversation']);
    Route::post('/chat/block/{partnerId}', [ChatController::class, 'blockUser']);
    Route::post('/chat/unblock/{partnerId}', [ChatController::class, 'unblockUser']);
});

Route::post('/affiliate-click', [FeedController::class, 'recordAffiliateClick']);

Route::get('/test-connection', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Backend đã kết nối thành công với Frontend!'
    ]);
});

Route::post('/test-logtail', function (Request $request) {
    \App\Services\LogtailService::audit('TEST_LOGTAIL_FROM_BACKEND', $request->all());
    return response()->json([
        'status' => 'success',
        'message' => 'Logtail test event dispatched from Laravel backend'
    ]);
});
Route::get('/debug-broadcast', function () {
    return response()->json([
        'default' => config('broadcasting.default'),
        'pusher_cluster' => config('broadcasting.connections.pusher.options.cluster'),
        'pusher_key' => config('broadcasting.connections.pusher.key'),
    ]);
});
Route::get('/debug-env', function () {
    return response()->json([
        'env_helper' => env('BROADCAST_CONNECTION'),
        'getenv' => getenv('BROADCAST_CONNECTION'),
        'server' => $_SERVER['BROADCAST_CONNECTION'] ?? null,
    ]);
});
