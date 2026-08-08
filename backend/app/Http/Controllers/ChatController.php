<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Events\RealtimeNotificationEvent;
use App\Services\CloudinaryService;
use Carbon\Carbon;

class ChatController extends Controller
{
    public function getConversations(Request $request)
    {
        $currentUser = $request->user('sanctum');
        if (!$currentUser) {
            return response()->json(['message' => 'Vui lòng đăng nhập để xem tin nhắn.'], 401);
        }

        $conversations = DB::table('cuoc_tro_chuyen')
            ->where('nguoi_mot_id', $currentUser->id)
            ->orWhere('nguoi_hai_id', $currentUser->id)
            ->orderBy('updated_at', 'desc')
            ->get();

        $result = [];
        foreach ($conversations as $conv) {
            $partnerId = ((int)$conv->nguoi_mot_id === (int)$currentUser->id) ? $conv->nguoi_hai_id : $conv->nguoi_mot_id;
            $partner = User::with('vaiTro', 'capBacInfo')->find($partnerId);
            if (!$partner) continue;

            $cacheKey = "user_online_" . $partner->id;
            $isCacheOnline = Cache::has($cacheKey);
            $isDbOnline = $partner->lan_cuoi_hoat_dong && Carbon::parse($partner->lan_cuoi_hoat_dong)->gte(now()->subMinutes(5));
            $isOnline = $isCacheOnline || $isDbOnline;

            $lastSeenPill = 'Vừa rời đi';
            if (!$isOnline && $partner->lan_cuoi_hoat_dong) {
                $diff = (int) Carbon::parse($partner->lan_cuoi_hoat_dong)->diffInMinutes(now());
                if ($diff < 60) {
                    $lastSeenPill = max(1, $diff) . ' phút';
                } elseif ($diff < 1440) {
                    $lastSeenPill = max(1, (int) Carbon::parse($partner->lan_cuoi_hoat_dong)->diffInHours(now())) . ' giờ';
                } else {
                    $lastSeenPill = 'Offline';
                }
            }

            $isFollowing = DB::table('theo_doi')
                ->where('nguoi_theo_doi_id', $currentUser->id)
                ->where('nguoi_duoc_theo_doi_id', $partner->id)
                ->where('trang_thai', 1)
                ->exists();

            $lastMsg = DB::table('tin_nhan')
                ->where('cuoc_tro_chuyen_id', $conv->id)
                ->where(function ($query) use ($currentUser) {
                    $query->whereNull('deleted_by_users')
                          ->orWhere('deleted_by_users', 'not like', '%,'.$currentUser->id.',%');
                })
                ->orderBy('created_at', 'desc')
                ->first();

            $unread = DB::table('tin_nhan')
                ->where('cuoc_tro_chuyen_id', $conv->id)
                ->where('nguoi_nhan_id', $currentUser->id)
                ->where('da_doc', 0)
                ->where(function ($query) use ($currentUser) {
                    $query->whereNull('deleted_by_users')
                          ->orWhere('deleted_by_users', 'not like', '%,'.$currentUser->id.',%');
                })
                ->count();

            $lastMessageText = 'Bắt đầu cuộc trò chuyện mới';
            if ($lastMsg) {
                if ($lastMsg->is_recalled) {
                    $lastMessageText = 'Tin nhắn đã thu hồi';
                } else {
                    $lastMessageText = $lastMsg->noi_dung ?: ($lastMsg->hinh_anh_url ? '[Hình ảnh]' : 'Tin nhắn mới');
                }
            }
            $timeText = $lastMsg ? Carbon::parse($lastMsg->created_at)->format('H:i') : 'Mới';
            $isMeOne = ((int)$conv->nguoi_mot_id === (int)$currentUser->id);
            $isBlockedByMe = $isMeOne ? ((int)$conv->nguoi_mot_chan === 1) : ((int)$conv->nguoi_hai_chan === 1);
            $isBlockedByPartner = $isMeOne ? ((int)$conv->nguoi_hai_chan === 1) : ((int)$conv->nguoi_mot_chan === 1);

            $result[] = [
                'id' => $partner->id,
                'name' => $partner->ten_hien_thi ?: $partner->ho_ten,
                'avatar' => $partner->anh_dai_dien ?: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
                'time' => $timeText,
                'lastMessage' => $lastMessageText,
                'unread' => $unread,
                'product' => $conv->san_pham_quan_tam ?: 'Trao đổi trải nghiệm',
                'productPrice' => $conv->gia_san_pham ?: 'Thảo luận riêng',
                'online' => $isOnline,
                'lastSeenPill' => $lastSeenPill,
                'isVerified' => (int)$partner->vai_tro_id >= 2 || $partner->diem_trai_nghiem >= 100,
                'isFollowing' => $isFollowing,
                'isBlockedByMe' => $isBlockedByMe,
                'isBlockedByPartner' => $isBlockedByPartner,
                'roleTitle' => $partner->cap_bac ?: '👑 Thành Viên Club',
                'conversation_id' => $conv->id
            ];
        }

        $existingIds = array_column($result, 'id');
        $existingIds[] = (int) $currentUser->id;

        $followIds = DB::table('theo_doi')
            ->where('trang_thai', 1)
            ->where(function($q) use ($currentUser) {
                $q->where('nguoi_theo_doi_id', $currentUser->id)
                  ->orWhere('nguoi_duoc_theo_doi_id', $currentUser->id);
            })
            ->get()
            ->map(function($item) use ($currentUser) {
                return ((int)$item->nguoi_theo_doi_id === (int)$currentUser->id) 
                    ? (int)$item->nguoi_duoc_theo_doi_id 
                    : (int)$item->nguoi_theo_doi_id;
            })
            ->unique()
            ->values()
            ->all();

        foreach ($followIds as $fId) {
            if (in_array((int)$fId, $existingIds, true)) continue;

            $partner = User::with('vaiTro', 'capBacInfo')->find($fId);
            if (!$partner) continue;

            $cacheKey = "user_online_" . $partner->id;
            $isCacheOnline = Cache::has($cacheKey);
            $isDbOnline = $partner->lan_cuoi_hoat_dong && Carbon::parse($partner->lan_cuoi_hoat_dong)->gte(now()->subMinutes(5));
            $isOnline = $isCacheOnline || $isDbOnline;

            $lastSeenPill = 'Vừa rời đi';
            if (!$isOnline && $partner->lan_cuoi_hoat_dong) {
                $diff = (int) Carbon::parse($partner->lan_cuoi_hoat_dong)->diffInMinutes(now());
                if ($diff < 60) {
                    $lastSeenPill = max(1, $diff) . ' phút';
                } elseif ($diff < 1440) {
                    $lastSeenPill = max(1, (int) Carbon::parse($partner->lan_cuoi_hoat_dong)->diffInHours(now())) . ' giờ';
                } else {
                    $lastSeenPill = 'Offline';
                }
            }

            $isFollowing = DB::table('theo_doi')
                ->where('nguoi_theo_doi_id', $currentUser->id)
                ->where('nguoi_duoc_theo_doi_id', $partner->id)
                ->where('trang_thai', 1)
                ->exists();

            $result[] = [
                'id' => $partner->id,
                'name' => $partner->ten_hien_thi ?: $partner->ho_ten,
                'avatar' => $partner->anh_dai_dien ?: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
                'time' => 'Mới',
                'lastMessage' => 'Bắt đầu cuộc trò chuyện mới',
                'unread' => 0,
                'product' => 'Kết nối từ cộng đồng Club',
                'productPrice' => 'Thảo luận trực tiếp',
                'online' => $isOnline,
                'lastSeenPill' => $lastSeenPill,
                'isVerified' => (int)$partner->vai_tro_id >= 2 || $partner->diem_trai_nghiem >= 100,
                'isFollowing' => $isFollowing,
                'isBlockedByMe' => false,
                'isBlockedByPartner' => false,
                'roleTitle' => $partner->cap_bac ?: '👑 Thành Viên Club',
                'conversation_id' => null
            ];
            $existingIds[] = (int)$fId;
        }

        return response()->json([
            'status' => 'success',
            'contacts' => $result
        ]);
    }

    public function getMessages(Request $request, $partnerId)
    {
        $currentUser = $request->user('sanctum');
        if (!$currentUser) {
            return response()->json(['message' => 'Vui lòng đăng nhập.'], 401);
        }

        $partner = User::with('vaiTro', 'capBacInfo')->find($partnerId);
        if (!$partner) {
            return response()->json(['message' => 'Không tìm thấy thành viên này.'], 404);
        }

        $conv = DB::table('cuoc_tro_chuyen')
            ->where(function ($q) use ($currentUser, $partnerId) {
                $q->where('nguoi_mot_id', $currentUser->id)->where('nguoi_hai_id', $partnerId);
            })
            ->orWhere(function ($q) use ($currentUser, $partnerId) {
                $q->where('nguoi_mot_id', $partnerId)->where('nguoi_hai_id', $currentUser->id);
            })
            ->first();

        $messages = [];
        $sharedMedia = [];
        $conversationId = null;
        $sanPhamQuanTam = $request->query('product', 'Trao đổi trải nghiệm');
        $giaSanPham = $request->query('price', 'Thảo luận riêng');

        if ($conv) {
            $conversationId = $conv->id;
            $sanPhamQuanTam = $conv->san_pham_quan_tam ?: $sanPhamQuanTam;
            $giaSanPham = $conv->gia_san_pham ?: $giaSanPham;

            DB::table('tin_nhan')
                ->where('cuoc_tro_chuyen_id', $conv->id)
                ->where('nguoi_nhan_id', $currentUser->id)
                ->where('da_doc', 0)
                ->update(['da_doc' => 1]);

            $rawMsgs = DB::table('tin_nhan')
                ->where('cuoc_tro_chuyen_id', $conv->id)
                ->where(function ($query) use ($currentUser) {
                    $query->whereNull('deleted_by_users')
                          ->orWhere('deleted_by_users', 'not like', '%,'.$currentUser->id.',%');
                })
                ->orderBy('created_at', 'asc')
                ->get();

            foreach ($rawMsgs as $m) {
                $isMe = ((int)$m->nguoi_gui_id === (int)$currentUser->id);
                $isRecalled = (bool)$m->is_recalled;
                $messages[] = [
                    'id' => $m->id,
                    'senderId' => $isMe ? 'me' : $m->nguoi_gui_id,
                    'text' => $isRecalled ? 'Tin nhắn đã thu hồi' : $m->noi_dung,
                    'imageUrl' => $isRecalled ? null : $m->hinh_anh_url,
                    'time' => Carbon::parse($m->created_at)->format('H:i, d/m'),
                    'isMe' => $isMe,
                    'daDoc' => (bool)$m->da_doc,
                    'isRecalled' => $isRecalled
                ];
                if ($m->hinh_anh_url && !$isRecalled) {
                    $sharedMedia[] = $m->hinh_anh_url;
                }
            }
        }

        $cacheKey = "user_online_" . $partner->id;
        $isOnline = Cache::has($cacheKey) || ($partner->lan_cuoi_hoat_dong && Carbon::parse($partner->lan_cuoi_hoat_dong)->gte(now()->subMinutes(5)));

        $lastSeenPill = 'Vừa rời đi';
        if (!$isOnline && $partner->lan_cuoi_hoat_dong) {
            $diff = (int) Carbon::parse($partner->lan_cuoi_hoat_dong)->diffInMinutes(now());
            if ($diff < 60) {
                $lastSeenPill = max(1, $diff) . ' phút';
            } elseif ($diff < 1440) {
                $lastSeenPill = max(1, (int) Carbon::parse($partner->lan_cuoi_hoat_dong)->diffInHours(now())) . ' giờ';
            } else {
                $lastSeenPill = 'Offline';
            }
        }

        $isFollowing = DB::table('theo_doi')
            ->where('nguoi_theo_doi_id', $currentUser->id)
            ->where('nguoi_duoc_theo_doi_id', $partner->id)
            ->where('trang_thai', 1)
            ->exists();

        $isBlockedByMe = false;
        $isBlockedByPartner = false;
        if ($conv) {
            $isMeOne = ((int)$conv->nguoi_mot_id === (int)$currentUser->id);
            $isBlockedByMe = $isMeOne ? ((int)$conv->nguoi_mot_chan === 1) : ((int)$conv->nguoi_hai_chan === 1);
            $isBlockedByPartner = $isMeOne ? ((int)$conv->nguoi_hai_chan === 1) : ((int)$conv->nguoi_mot_chan === 1);
        }

        return response()->json([
            'status' => 'success',
            'partner' => [
                'id' => $partner->id,
                'name' => $partner->ten_hien_thi ?: $partner->ho_ten,
                'avatar' => $partner->anh_dai_dien ?: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
                'online' => $isOnline,
                'lastSeenPill' => $lastSeenPill,
                'isVerified' => (int)$partner->vai_tro_id >= 2 || $partner->diem_trai_nghiem >= 100,
                'isFollowing' => $isFollowing,
                'isBlockedByMe' => $isBlockedByMe,
                'isBlockedByPartner' => $isBlockedByPartner,
                'roleTitle' => $partner->cap_bac ?: '👑 Thành Viên Club',
                'product' => $sanPhamQuanTam,
                'productPrice' => $giaSanPham,
                'messages' => $messages,
                'sharedMedia' => array_values(array_unique($sharedMedia)),
                'quickReplies' => ['Chào bạn nhen 🤝', 'Cho mình xin thêm thông tin trải nghiệm nhé', 'Quán này ở đoạn nào thế bạn ❤️']
            ]
        ]);
    }

    public function sendMessage(Request $request)
    {
        $currentUser = $request->user('sanctum');
        if (!$currentUser) {
            return response()->json(['message' => 'Vui lòng đăng nhập để gửi tin nhắn.'], 401);
        }

        $validator = Validator::make($request->all(), [
            'receiver_id' => 'required|integer|exists:nguoi_dung,id',
            'noi_dung' => 'nullable|string|max:2000',
            'hinh_anh_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'hinh_anh_url' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails() || (empty($request->noi_dung) && !$request->hasFile('hinh_anh_file') && empty($request->hinh_anh_url))) {
            return response()->json(['message' => 'Vui lòng nhập nội dung hoặc hình ảnh gửi đi.'], 422);
        }

        $receiverId = (int)$request->receiver_id;
        $receiver = User::find($receiverId);
        if (!$receiver) {
            return response()->json(['message' => 'Người nhận không tồn tại.'], 404);
        }

        $checkConv = DB::table('cuoc_tro_chuyen')
            ->where(function ($q) use ($currentUser, $receiverId) {
                $q->where('nguoi_mot_id', $currentUser->id)->where('nguoi_hai_id', $receiverId);
            })
            ->orWhere(function ($q) use ($currentUser, $receiverId) {
                $q->where('nguoi_mot_id', $receiverId)->where('nguoi_hai_id', $currentUser->id);
            })
            ->first();

        if ($checkConv) {
            $isMeOne = ((int)$checkConv->nguoi_mot_id === (int)$currentUser->id);
            $blockedByMe = $isMeOne ? ((int)$checkConv->nguoi_mot_chan === 1) : ((int)$checkConv->nguoi_hai_chan === 1);
            $blockedByPartner = $isMeOne ? ((int)$checkConv->nguoi_hai_chan === 1) : ((int)$checkConv->nguoi_mot_chan === 1);
            if ($blockedByMe) {
                return response()->json(['message' => 'Bạn đã chặn thành viên này, không thể gửi tin nhắn.'], 403);
            }
            if ($blockedByPartner) {
                return response()->json(['message' => 'Bạn không thể gửi tin nhắn cho thành viên này do cài đặt quyền riêng tư.'], 403);
            }
        }

        $imageUrl = $request->input('hinh_anh_url');
        if ($request->hasFile('hinh_anh_file')) {
            $file = $request->file('hinh_anh_file');
            if ($file && $file->isValid()) {
                $imageUrl = CloudinaryService::upload($file, 'chat');
            }
        }

        $conv = DB::table('cuoc_tro_chuyen')
            ->where(function ($q) use ($currentUser, $receiverId) {
                $q->where('nguoi_mot_id', $currentUser->id)->where('nguoi_hai_id', $receiverId);
            })
            ->orWhere(function ($q) use ($currentUser, $receiverId) {
                $q->where('nguoi_mot_id', $receiverId)->where('nguoi_hai_id', $currentUser->id);
            })
            ->first();

        $product = $request->input('san_pham', 'Trao đổi từ Trang cá nhân / Club');
        $price = $request->input('gia_san_pham', 'Thảo luận riêng');

        if (!$conv) {
            $convId = DB::table('cuoc_tro_chuyen')->insertGetId([
                'nguoi_mot_id' => $currentUser->id,
                'nguoi_hai_id' => $receiverId,
                'san_pham_quan_tam' => $product,
                'gia_san_pham' => $price,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        } else {
            $convId = $conv->id;
            DB::table('cuoc_tro_chuyen')->where('id', $convId)->update([
                'san_pham_quan_tam' => $product ?: $conv->san_pham_quan_tam,
                'gia_san_pham' => $price ?: $conv->gia_san_pham,
                'updated_at' => now()
            ]);
        }

        $noiDung = (string) ($request->input('noi_dung') ?? '');
        $msgId = DB::table('tin_nhan')->insertGetId([
            'cuoc_tro_chuyen_id' => $convId,
            'nguoi_gui_id' => $currentUser->id,
            'nguoi_nhan_id' => $receiverId,
            'noi_dung' => $noiDung,
            'hinh_anh_url' => $imageUrl,
            'da_doc' => 0,
            'created_at' => now(),
            'updated_at' => now()
        ]);

        DB::table('cuoc_tro_chuyen')->where('id', $convId)->update([
            'tin_nhan_cuoi_id' => $msgId,
            'updated_at' => now()
        ]);

        $newMsgPayload = [
            'id' => $msgId,
            'conversation_id' => $convId,
            'senderId' => $currentUser->id,
            'receiverId' => $receiverId,
            'senderName' => $currentUser->ten_hien_thi ?: $currentUser->ho_ten,
            'senderAvatar' => $currentUser->anh_dai_dien ?: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
            'text' => $noiDung,
            'imageUrl' => $imageUrl,
            'time' => Carbon::now()->format('H:i'),
            'daDoc' => false,
            'product' => $product,
            'productPrice' => $price
        ];

        try {
            RealtimeNotificationEvent::dispatch(
                'new_chat_message',
                'Tin nhắn từ ' . ($currentUser->ten_hien_thi ?: $currentUser->ho_ten),
                $noiDung ?: '[Hình ảnh mới]',
                $newMsgPayload
            );
        } catch (\Throwable $e) {
            \Log::error('Broadcast error: ' . $e->getMessage());
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Đã gửi tin nhắn thành công!',
            'data' => [
                'id' => $msgId,
                'senderId' => 'me',
                'text' => $noiDung,
                'imageUrl' => $imageUrl,
                'time' => Carbon::now()->format('H:i'),
                'isMe' => true
            ]
        ], 201);
    }

    public function deleteConversation(Request $request, $partnerId)
    {
        $currentUser = $request->user('sanctum');
        if (!$currentUser) {
            return response()->json(['message' => 'Vui lòng đăng nhập.'], 401);
        }

        $conv = DB::table('cuoc_tro_chuyen')
            ->where(function ($q) use ($currentUser, $partnerId) {
                $q->where('nguoi_mot_id', $currentUser->id)->where('nguoi_hai_id', $partnerId);
            })
            ->orWhere(function ($q) use ($currentUser, $partnerId) {
                $q->where('nguoi_mot_id', $partnerId)->where('nguoi_hai_id', $currentUser->id);
            })
            ->first();

        if ($conv) {
            $msgs = DB::table('tin_nhan')->where('cuoc_tro_chuyen_id', $conv->id)->get();
            foreach ($msgs as $m) {
                $del = $m->deleted_by_users ?: '';
                if (!str_contains($del, ',' . $currentUser->id . ',')) {
                    $del .= ',' . $currentUser->id . ',';
                    DB::table('tin_nhan')->where('id', $m->id)->update(['deleted_by_users' => $del]);
                }
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Đã xóa trọn bộ lịch sử hội thoại thành công.'
        ]);
    }

    public function deleteMessage(Request $request, $id)
    {
        $currentUser = $request->user('sanctum');
        if (!$currentUser) {
            return response()->json(['message' => 'Vui lòng đăng nhập.'], 401);
        }

        $msg = DB::table('tin_nhan')->where('id', $id)->first();
        if (!$msg) {
            return response()->json(['message' => 'Tin nhắn không tồn tại.'], 404);
        }

        $type = $request->input('type', 'me');

        if ($type === 'everyone') {
            if ((int)$msg->nguoi_gui_id !== (int)$currentUser->id) {
                return response()->json(['message' => 'Bạn chỉ được thu hồi tin nhắn do chính bạn gửi.'], 403);
            }

            DB::table('tin_nhan')->where('id', $id)->update([
                'is_recalled' => 1,
                'updated_at' => now()
            ]);

            try {
                RealtimeNotificationEvent::dispatch(
                    'message_recalled',
                    'Thu hồi tin nhắn',
                    'Tin nhắn đã bị thu hồi',
                    [
                        'id' => $msg->id,
                        'conversation_id' => $msg->cuoc_tro_chuyen_id,
                        'senderId' => $msg->nguoi_gui_id,
                        'receiverId' => $msg->nguoi_nhan_id
                    ]
                );
            } catch (\Throwable $e) {
                \Log::error('Broadcast error: ' . $e->getMessage());
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Đã thu hồi tin nhắn đối với mọi người.',
                'action' => 'recalled',
                'id' => (int)$id
            ]);
        }

        $del = $msg->deleted_by_users ?: '';
        if (!str_contains($del, ',' . $currentUser->id . ',')) {
            $del .= ',' . $currentUser->id . ',';
            DB::table('tin_nhan')->where('id', $id)->update(['deleted_by_users' => $del]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Đã xóa tin nhắn ở phía bạn.',
            'action' => 'deleted_me',
            'id' => (int)$id
        ]);
    }

    public function heartbeat(Request $request)
    {
        $userId = $request->input('user_id', 1);
        $user = User::find($userId);
        
        if ($user) {
            $cacheKey = "user_online_" . $user->id;
            $wasOffline = !Cache::has($cacheKey);
            
            Cache::put($cacheKey, true, now()->addMinutes(5));
            $user->lan_cuoi_hoat_dong = now();
            $user->saveQuietly();

            if ($wasOffline) {
                try {
                    RealtimeNotificationEvent::dispatch(
                        'user_status_change',
                        'Thành viên Online',
                        "{$user->ho_ten} vừa trực tuyến trên Club",
                        ['user_id' => $user->id, 'online' => true, 'status' => 'Đang hoạt động']
                    );
                } catch (\Throwable $e) {
                    \Log::error('Broadcast error: ' . $e->getMessage());
                }
            }

            return response()->json([
                'status' => 'success',
                'online' => true,
                'last_active_at' => $user->lan_cuoi_hoat_dong->toDateTimeString(),
                'method_used' => 'Heartbeat DB + Redis/Cache'
            ]);
        }

        return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
    }

    public function getPresenceStatus(Request $request)
    {
        $users = User::all(['id', 'ho_ten', 'ten_hien_thi', 'lan_cuoi_hoat_dong', 'trang_thai', 'anh_dai_dien', 'cap_bac', 'vai_tro_id']);
        $result = [];

        foreach ($users as $user) {
            $cacheKey = "user_online_" . $user->id;
            $isCacheOnline = Cache::has($cacheKey);
            $isDbOnline = $user->lan_cuoi_hoat_dong && Carbon::parse($user->lan_cuoi_hoat_dong)->gte(now()->subMinutes(5));
            $isOnline = $isCacheOnline || $isDbOnline;

            $statusText = 'Đang hoạt động';
            if (!$isOnline) {
                if ($user->lan_cuoi_hoat_dong) {
                    $diffMinutes = (int) Carbon::parse($user->lan_cuoi_hoat_dong)->diffInMinutes(now());
                    if ($diffMinutes < 60) {
                        $statusText = "Hoạt động " . max(1, $diffMinutes) . " phút trước";
                    } elseif ($diffMinutes < 1440) {
                        $diffHours = (int) Carbon::parse($user->lan_cuoi_hoat_dong)->diffInHours(now());
                        $statusText = "Hoạt động " . max(1, $diffHours) . " giờ trước";
                    } else {
                        $statusText = "Offline";
                    }
                } else {
                    $statusText = "Offline";
                }
            }

            $result[$user->id] = [
                'user_id' => $user->id,
                'name' => $user->ten_hien_thi ?: $user->ho_ten,
                'avatar' => $user->anh_dai_dien ?: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
                'online' => $isOnline,
                'status_text' => $statusText,
                'last_seen' => $user->lan_cuoi_hoat_dong ? $user->lan_cuoi_hoat_dong->toDateTimeString() : null
            ];
        }

        return response()->json([
            'status' => 'success',
            'data' => $result,
            'methods_active' => ['heartbeat_cache', 'database_timestamp', 'websocket_presence']
        ]);
    }

    public function broadcastStatus(Request $request)
    {
        $userId = $request->input('user_id');
        $isOnline = $request->input('online', true);
        $user = User::find($userId);

        if ($user) {
            $cacheKey = "user_online_" . $user->id;
            if ($isOnline) {
                Cache::put($cacheKey, true, now()->addMinutes(5));
                $user->lan_cuoi_hoat_dong = now();
                $statusText = 'Đang hoạt động';
            } else {
                Cache::forget($cacheKey);
                $user->lan_cuoi_hoat_dong = now()->subMinutes(6);
                $statusText = 'Vừa rời đi';
            }
            $user->saveQuietly();

            try {
                RealtimeNotificationEvent::dispatch(
                    'user_status_change',
                    'Cập nhật trạng thái Realtime',
                    $isOnline ? "{$user->ho_ten} đang hoạt động trên hội thoại" : "{$user->ho_ten} đã ngoại tuyến",
                    ['user_id' => $user->id, 'online' => $isOnline, 'status' => $statusText]
                );
            } catch (\Throwable $e) {
                \Log::error('Broadcast error: ' . $e->getMessage());
            }

            return response()->json([
                'status' => 'success',
                'user_id' => $user->id,
                'online' => $isOnline,
                'message' => 'Đã phát tín hiệu trạng thái Realtime qua WebSocket Reverb!'
            ]);
        }

        return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
    }

    public function blockUser(Request $request, $partnerId)
    {
        $currentUser = $request->user('sanctum');
        if (!$currentUser) {
            return response()->json(['status' => 'error', 'message' => 'Vui lòng đăng nhập.'], 401);
        }
        if ((int)$currentUser->id === (int)$partnerId) {
            return response()->json(['status' => 'error', 'message' => 'Không thể chặn chính mình.'], 400);
        }

        $conv = DB::table('cuoc_tro_chuyen')
            ->where(function ($q) use ($currentUser, $partnerId) {
                $q->where('nguoi_mot_id', $currentUser->id)->where('nguoi_hai_id', $partnerId);
            })
            ->orWhere(function ($q) use ($currentUser, $partnerId) {
                $q->where('nguoi_mot_id', $partnerId)->where('nguoi_hai_id', $currentUser->id);
            })
            ->first();

        if (!$conv) {
            DB::table('cuoc_tro_chuyen')->insertGetId([
                'nguoi_mot_id' => $currentUser->id,
                'nguoi_hai_id' => $partnerId,
                'san_pham_quan_tam' => 'Trao đổi trải nghiệm',
                'gia_san_pham' => 'Thảo luận riêng',
                'nguoi_mot_chan' => 1,
                'nguoi_hai_chan' => 0,
                'mot_chan_at' => now(),
                'hai_chan_at' => null,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            return response()->json(['status' => 'success', 'message' => 'Đã chặn tin nhắn từ thành viên này.', 'isBlockedByMe' => true]);
        }

        $isMeOne = ((int)$conv->nguoi_mot_id === (int)$currentUser->id);
        $currentBlocked = $isMeOne ? (int)$conv->nguoi_mot_chan : (int)$conv->nguoi_hai_chan;
        $lastBlockedAt = $isMeOne ? $conv->mot_chan_at : $conv->hai_chan_at;

        if ($currentBlocked === 0 && $lastBlockedAt) {
            $targetTime = Carbon::parse($lastBlockedAt)->addHours(8);
            if ($targetTime->isAfter(now())) {
                $diffInSeconds = now()->diffInSeconds($targetTime);
                $hours = (int) floor($diffInSeconds / 3600);
                $minutes = (int) floor(($diffInSeconds % 3600) / 60);
                return response()->json([
                    'status' => 'error', 
                    'message' => "Bạn chỉ có thể chặn lại thành viên này sau {$hours} giờ {$minutes} phút nữa (mỗi lần chặn lại cùng một người phải cách nhau ít nhất 8 tiếng)."
                ], 422);
            }
        }

        $updateData = $isMeOne 
            ? ['nguoi_mot_chan' => 1, 'mot_chan_at' => now(), 'updated_at' => now()] 
            : ['nguoi_hai_chan' => 1, 'hai_chan_at' => now(), 'updated_at' => now()];

        DB::table('cuoc_tro_chuyen')->where('id', $conv->id)->update($updateData);

        return response()->json(['status' => 'success', 'message' => 'Đã chặn tin nhắn từ thành viên này.', 'isBlockedByMe' => true]);
    }

    public function unblockUser(Request $request, $partnerId)
    {
        $currentUser = $request->user('sanctum');
        if (!$currentUser) {
            return response()->json(['status' => 'error', 'message' => 'Vui lòng đăng nhập.'], 401);
        }

        $conv = DB::table('cuoc_tro_chuyen')
            ->where(function ($q) use ($currentUser, $partnerId) {
                $q->where('nguoi_mot_id', $currentUser->id)->where('nguoi_hai_id', $partnerId);
            })
            ->orWhere(function ($q) use ($currentUser, $partnerId) {
                $q->where('nguoi_mot_id', $partnerId)->where('nguoi_hai_id', $currentUser->id);
            })
            ->first();

        if ($conv) {
            $isMeOne = ((int)$conv->nguoi_mot_id === (int)$currentUser->id);
            $updateData = $isMeOne 
                ? ['nguoi_mot_chan' => 0, 'updated_at' => now()] 
                : ['nguoi_hai_chan' => 0, 'updated_at' => now()];

            DB::table('cuoc_tro_chuyen')->where('id', $conv->id)->update($updateData);
        }

        return response()->json(['status' => 'success', 'message' => 'Đã mở chặn cho thành viên này.', 'isBlockedByMe' => false]);
    }
}
