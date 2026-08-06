<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Events\RealtimeNotificationEvent;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/profile/{id?}', [ProfileController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/profile/update', [ProfileController::class, 'update']);
    Route::post('/users/{id}/follow', [ProfileController::class, 'toggleFollow']);
    Route::post('/posts/{id}/like', [ProfileController::class, 'toggleLikePost']);
    Route::post('/posts/{id}/comment', [ProfileController::class, 'addComment']);
});

Route::get('/test-connection', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Backend đã kết nối thành công với Frontend!'
    ]);
});

Route::post('/send-live-notification', function (Request $request) {
    $type = $request->input('type', 'like');
    $title = $request->input('title', 'Thông báo mới');
    $message = $request->input('message', 'Có hoạt động mới trên hội club!');
    $data = $request->input('data', []);

    RealtimeNotificationEvent::dispatch($type, $title, $message, $data);

    return response()->json([
        'status' => 'success',
        'message' => 'Đã phát tín hiệu Realtime qua Laravel Reverb!',
    ]);
});
