<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Events\RealtimeNotificationEvent;

class ChatTypingController extends Controller
{
    public function typing(Request $request)
    {
        $user = $request->user('sanctum');
        $receiverId = $request->input('receiver_id');

        if (!$user || !$receiverId) {
            return response()->json(['status' => false], 400);
        }

        RealtimeNotificationEvent::dispatch(
            'chat_typing',
            'Đang soạn tin nhắn...',
            '',
            [
                'sender_id' => $user->id,
                'receiver_id' => $receiverId
            ]
        );

        return response()->json(['status' => true]);
    }
}
