<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Events\RealtimeNotificationEvent;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\FeedController;
use App\Http\Controllers\ChatController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/profile/{id?}', [ProfileController::class, 'show']);
Route::get('/feed/posts', [FeedController::class, 'index']);

Route::post('/chat/heartbeat', [ChatController::class, 'heartbeat']);
Route::get('/chat/presence-status', [ChatController::class, 'getPresenceStatus']);
Route::post('/chat/broadcast-status', [ChatController::class, 'broadcastStatus']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/profile/update', [ProfileController::class, 'update']);
    Route::post('/users/{id}/follow', [ProfileController::class, 'toggleFollow']);
    Route::post('/posts/{id}/like', [ProfileController::class, 'toggleLikePost']);
    Route::post('/posts/{id}/comment', [ProfileController::class, 'addComment']);
    Route::post('/comments/{id}/like', [ProfileController::class, 'toggleLikeComment']);
    Route::post('/feed/posts', [FeedController::class, 'store']);
    Route::put('/feed/posts/{id}', [FeedController::class, 'update']);
    Route::delete('/feed/posts/{id}', [FeedController::class, 'destroy']);
    Route::get('/chat/conversations', [ChatController::class, 'getConversations']);
    Route::get('/chat/messages/{partnerId}', [ChatController::class, 'getMessages']);
    Route::post('/chat/messages', [ChatController::class, 'sendMessage']);
    Route::delete('/chat/messages/{id}', [ChatController::class, 'deleteMessage']);
    Route::delete('/chat/conversations/{partnerId}', [ChatController::class, 'deleteConversation']);
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
