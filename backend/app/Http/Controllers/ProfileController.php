<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    public function show(Request $request, $id = null)
    {
        $currentUser = $request->user('sanctum');

        if (!$id || $id === 'me' || $id === 'my-profile') {
            if (!$currentUser) {
                return response()->json(['message' => 'Bạn chưa đăng nhập.'], 401);
            }
            $targetUser = $currentUser->load('vaiTro');
        } else {
            $targetUser = User::with('vaiTro')->find($id);
            if (!$targetUser) {
                return response()->json(['message' => 'Không tìm thấy thông tin tài khoản này.'], 404);
            }
        }

        $followersCount = DB::table('theo_doi')
            ->where('nguoi_duoc_theo_doi_id', $targetUser->id)
            ->where('trang_thai', 1)
            ->count();

        $followingCount = DB::table('theo_doi')
            ->where('nguoi_theo_doi_id', $targetUser->id)
            ->where('trang_thai', 1)
            ->count();

        $isFollowing = false;
        if ($currentUser && $currentUser->id !== $targetUser->id) {
            $isFollowing = DB::table('theo_doi')
                ->where('nguoi_theo_doi_id', $currentUser->id)
                ->where('nguoi_duoc_theo_doi_id', $targetUser->id)
                ->where('trang_thai', 1)
                ->exists();
        }

        $posts = DB::table('bai_viet')
            ->leftJoin('danh_muc', 'bai_viet.danh_muc_id', '=', 'danh_muc.id')
            ->select('bai_viet.*', 'danh_muc.ten as ten_danh_muc')
            ->where('bai_viet.nguoi_dung_id', $targetUser->id)
            ->where('bai_viet.trang_thai', 1)
            ->orderBy('bai_viet.ghim', 'desc')
            ->orderBy('bai_viet.created_at', 'desc')
            ->get()
            ->map(function ($post) use ($currentUser) {
                $post->hashtags = json_decode($post->hashtags ?? '[]', true);
                
                $post->likes_count = DB::table('cam_xuc')
                    ->where('bai_viet_id', $post->id)
                    ->count();
                
                $post->comments_count = DB::table('binh_luan')
                    ->where('bai_viet_id', $post->id)
                    ->where('trang_thai', 1)
                    ->count();

                $post->is_liked = false;
                if ($currentUser) {
                    $post->is_liked = DB::table('cam_xuc')
                        ->where('bai_viet_id', $post->id)
                        ->where('nguoi_dung_id', $currentUser->id)
                        ->exists();
                }

                return $post;
            });

        $followersList = DB::table('theo_doi')
            ->join('nguoi_dung', 'theo_doi.nguoi_theo_doi_id', '=', 'nguoi_dung.id')
            ->leftJoin('vai_tro', 'nguoi_dung.vai_tro_id', '=', 'vai_tro.id')
            ->select('nguoi_dung.id', 'nguoi_dung.ho_ten', 'nguoi_dung.ten_hien_thi', 'nguoi_dung.anh_dai_dien', 'vai_tro.ten as ten_vai_tro')
            ->where('theo_doi.nguoi_duoc_theo_doi_id', $targetUser->id)
            ->where('theo_doi.trang_thai', 1)
            ->limit(10)
            ->get();

        $savedItems = DB::table('da_luu')
            ->where('nguoi_dung_id', $targetUser->id)
            ->get()
            ->map(function ($item) {
                if ($item->loai === 'post') {
                    $post = DB::table('bai_viet')->where('id', $item->doi_tuong_id)->first();
                    $item->tieu_de = $post->tieu_de ?? 'Bài review trải nghiệm';
                    $item->anh_minh_hoa = $post->anh_bia ?? 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80';
                } elseif ($item->loai === 'product') {
                    $prod = DB::table('san_pham')->where('id', $item->doi_tuong_id)->first();
                    $item->tieu_de = $prod->ten ?? 'Sản phẩm trải nghiệm';
                    $item->anh_minh_hoa = $prod->anh_dai_dien ?? 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80';
                }
                return $item;
            });

        $collections = [];
        foreach ($savedItems as $item) {
            $colName = $item->ten_bo_suu_tap;
            if (!isset($collections[$colName])) {
                $collections[$colName] = [
                    'ten_bo_suu_tap' => $colName,
                    'anh_bia' => $item->anh_minh_hoa ?? 'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=600&auto=format&fit=crop&q=80',
                    'so_luong' => 0,
                    'items' => []
                ];
            }
            $collections[$colName]['so_luong']++;
            $collections[$colName]['items'][] = $item;
        }

        $events = DB::table('dang_ky_su_kien')
            ->join('su_kien', 'dang_ky_su_kien.su_kien_id', '=', 'su_kien.id')
            ->select('su_kien.*', 'dang_ky_su_kien.trang_thai as trang_thai_dang_ky', 'dang_ky_su_kien.created_at as ngay_dang_ky')
            ->where('dang_ky_su_kien.nguoi_dung_id', $targetUser->id)
            ->orderBy('su_kien.thoi_gian_bat_dau', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => [
                'profile' => $targetUser,
                'stats' => [
                    'followers_count' => $followersCount,
                    'following_count' => $followingCount,
                    'posts_count' => $posts->count(),
                ],
                'is_following' => $isFollowing,
                'is_owner' => $currentUser && ($currentUser->id === $targetUser->id),
                'posts' => $posts,
                'followers_list' => $followersList,
                'collections' => array_values($collections),
                'events' => $events
            ]
        ], 200);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Vui lòng đăng nhập để thực hiện.'], 401);
        }

        $validator = Validator::make($request->all(), [
            'ho_ten' => 'nullable|string|max:100',
            'ten_hien_thi' => 'nullable|string|max:100',
            'tieu_su' => 'nullable|string|max:1000',
            'so_dien_thoai' => 'nullable|string|max:20',
            'ngay_sinh' => 'nullable|date',
            'gioi_tinh' => 'nullable|integer|in:1,2,3',
            'dia_chi' => 'nullable|string|max:255',
            'facebook' => 'nullable|string|max:255',
            'instagram' => 'nullable|string|max:255',
            'tiktok' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'anh_dai_dien' => 'nullable|string|max:1000',
            'anh_bia' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $fields = [
            'ho_ten', 'ten_hien_thi', 'tieu_su', 'so_dien_thoai',
            'ngay_sinh', 'gioi_tinh', 'dia_chi', 'facebook',
            'instagram', 'tiktok', 'website', 'anh_dai_dien', 'anh_bia'
        ];

        foreach ($fields as $field) {
            if ($request->has($field)) {
                $user->$field = $request->input($field);
            }
        }

        if ($request->hasFile('anh_dai_dien_file')) {
            $file = $request->file('anh_dai_dien_file');
            $filename = 'avatar_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/avatars'), $filename);
            $user->anh_dai_dien = url('/uploads/avatars/' . $filename);
        }

        if ($request->hasFile('anh_bia_file')) {
            $file = $request->file('anh_bia_file');
            $filename = 'cover_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/covers'), $filename);
            $user->anh_bia = url('/uploads/covers/' . $filename);
        }

        $user->save();
        $user->load('vaiTro');

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật trang cá nhân thành công! ✨',
            'user' => $user
        ], 200);
    }

    public function toggleFollow(Request $request, $targetId)
    {
        $currentUser = $request->user();
        if (!$currentUser || $currentUser->id == $targetId) {
            return response()->json(['message' => 'Thao tác không hợp lệ.'], 400);
        }

        $existing = DB::table('theo_doi')
            ->where('nguoi_theo_doi_id', $currentUser->id)
            ->where('nguoi_duoc_theo_doi_id', $targetId)
            ->first();

        if ($existing && $existing->trang_thai == 1) {
            DB::table('theo_doi')->where('id', $existing->id)->update(['trang_thai' => 0]);
            $isFollowing = false;
        } elseif ($existing && $existing->trang_thai == 0) {
            DB::table('theo_doi')->where('id', $existing->id)->update(['trang_thai' => 1]);
            $isFollowing = true;
        } else {
            DB::table('theo_doi')->insert([
                'nguoi_theo_doi_id' => $currentUser->id,
                'nguoi_duoc_theo_doi_id' => $targetId,
                'trang_thai' => 1,
                'created_at' => now()
            ]);
            $isFollowing = true;
        }

        return response()->json([
            'status' => 'success',
            'is_following' => $isFollowing,
            'message' => $isFollowing ? 'Đã theo dõi thành công!' : 'Đã hủy theo dõi.'
        ], 200);
    }

    public function toggleLikePost(Request $request, $postId)
    {
        $currentUser = $request->user();
        if (!$currentUser) {
            return response()->json(['message' => 'Vui lòng đăng nhập để thao tác.'], 401);
        }

        $existing = DB::table('cam_xuc')
            ->where('bai_viet_id', $postId)
            ->where('nguoi_dung_id', $currentUser->id)
            ->first();

        if ($existing) {
            DB::table('cam_xuc')->where('id', $existing->id)->delete();
            $isLiked = false;
        } else {
            DB::table('cam_xuc')->insert([
                'bai_viet_id' => $postId,
                'nguoi_dung_id' => $currentUser->id,
                'loai' => 'like',
                'created_at' => now()
            ]);
            $isLiked = true;

            User::where('id', $currentUser->id)->increment('diem_trai_nghiem', 5);
        }

        $likesCount = DB::table('cam_xuc')->where('bai_viet_id', $postId)->count();

        return response()->json([
            'status' => 'success',
            'is_liked' => $isLiked,
            'likes_count' => $likesCount,
            'message' => $isLiked ? 'Đã thích bài viết! (+5 Điểm trải nghiệm ✨)' : 'Đã bỏ thích.'
        ], 200);
    }

    public function addComment(Request $request, $postId)
    {
        $currentUser = $request->user();
        if (!$currentUser) {
            return response()->json(['message' => 'Vui lòng đăng nhập để bình luận.'], 401);
        }

        $validator = Validator::make($request->all(), [
            'noi_dung' => 'required|string|max:500'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Nội dung bình luận không hợp lệ.'], 422);
        }

        DB::table('binh_luan')->insertGetId([
            'bai_viet_id' => $postId,
            'nguoi_dung_id' => $currentUser->id,
            'parent_id' => null,
            'noi_dung' => $request->input('noi_dung'),
            'trang_thai' => 1,
            'created_at' => now()
        ]);

        User::where('id', $currentUser->id)->increment('diem_trai_nghiem', 10);
        $commentsCount = DB::table('binh_luan')->where('bai_viet_id', $postId)->where('trang_thai', 1)->count();

        return response()->json([
            'status' => 'success',
            'comments_count' => $commentsCount,
            'message' => 'Gửi thảo luận thành công! (+10 Điểm trải nghiệm ✨)'
        ], 200);
    }
}
