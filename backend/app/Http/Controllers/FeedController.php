<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\User;
use App\Events\RealtimeNotificationEvent;
use App\Services\CloudinaryService;

class FeedController extends Controller
{
    public function getSuggestions(Request $request)
    {
        $suggestions = DB::table('nguoi_dung')
            ->leftJoin('cap_bac', 'nguoi_dung.cap_bac_id', '=', 'cap_bac.id')
            ->select(
                'nguoi_dung.id',
                'nguoi_dung.ho_ten',
                'nguoi_dung.ten_hien_thi',
                'nguoi_dung.anh_dai_dien',
                'nguoi_dung.cap_bac as ten_cap_bac',
                'cap_bac.anh_cap_bac'
            )
            ->where('nguoi_dung.trang_thai', 1)
            ->inRandomOrder()
            ->limit(5)
            ->get();
            
        return response()->json([
            'status' => 'success',
            'suggestions' => $suggestions
        ]);
    }

    public function index(Request $request)
    {
        $currentUser = $request->user('sanctum');

        $posts = DB::table('bai_viet')
            ->join('nguoi_dung', 'bai_viet.nguoi_dung_id', '=', 'nguoi_dung.id')
            ->leftJoin('danh_muc', 'bai_viet.danh_muc_id', '=', 'danh_muc.id')
            ->leftJoin('cap_bac', 'nguoi_dung.cap_bac_id', '=', 'cap_bac.id')
            ->select(
                'bai_viet.*',
                'danh_muc.ten as ten_danh_muc',
                'nguoi_dung.ho_ten',
                'nguoi_dung.ten_hien_thi',
                'nguoi_dung.anh_dai_dien',
                'nguoi_dung.cap_bac as ten_cap_bac',
                'cap_bac.anh_cap_bac',
                'cap_bac.icon as icon_cap_bac',
                'cap_bac.mau_sac as mau_sac_cap_bac'
            )
            ->where('bai_viet.trang_thai', 1)
            ->orderBy('bai_viet.ghim', 'desc')
            ->orderBy('bai_viet.created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($post) use ($currentUser) {
                $post->hashtags = json_decode($post->hashtags ?? '[]', true);

                $attachments = DB::table('tep_bai_viet')
                    ->where('bai_viet_id', $post->id)
                    ->orderBy('thu_tu')
                    ->pluck('duong_dan')
                    ->toArray();

                if (empty($attachments) && !empty($post->anh_bia)) {
                    $attachments = [$post->anh_bia];
                } elseif (!empty($post->anh_bia) && !in_array($post->anh_bia, $attachments)) {
                    array_unshift($attachments, $post->anh_bia);
                }
                $post->danh_sach_anh = array_values(array_unique($attachments));

                $post->likes_count = DB::table('cam_xuc')
                    ->where('bai_viet_id', $post->id)
                    ->count();

                $post->comments_count = DB::table('binh_luan')
                    ->where('bai_viet_id', $post->id)
                    ->where('trang_thai', 1)
                    ->count();

                $post->is_liked = false;
                $post->is_owner = false;
                if ($currentUser) {
                    $post->is_liked = DB::table('cam_xuc')
                        ->where('bai_viet_id', $post->id)
                        ->where('nguoi_dung_id', $currentUser->id)
                        ->exists();
                    $post->is_owner = ((int) $post->nguoi_dung_id === (int) $currentUser->id) || ((int) $currentUser->vai_tro_id >= 2) || ($currentUser->email === 'superadmin@pivo.com');
                }

                $post->recent_comments = DB::table('binh_luan')
                    ->join('nguoi_dung', 'binh_luan.nguoi_dung_id', '=', 'nguoi_dung.id')
                    ->leftJoin('cap_bac', 'nguoi_dung.cap_bac_id', '=', 'cap_bac.id')
                    ->select(
                        'binh_luan.*',
                        'nguoi_dung.ho_ten',
                        'nguoi_dung.ten_hien_thi',
                        'nguoi_dung.anh_dai_dien',
                        'nguoi_dung.cap_bac as ten_cap_bac',
                        'cap_bac.anh_cap_bac'
                    )
                    ->where('binh_luan.bai_viet_id', $post->id)
                    ->where('binh_luan.trang_thai', 1)
                    ->orderBy('binh_luan.created_at', 'desc')
                    ->limit(50)
                    ->get();

                foreach ($post->recent_comments as $commentItem) {
                    $commentItem->likes_count = DB::table('cam_xuc')->where('binh_luan_id', $commentItem->id)->count();
                    $commentItem->is_liked = false;
                    if ($currentUser) {
                        $commentItem->is_liked = DB::table('cam_xuc')
                            ->where('binh_luan_id', $commentItem->id)
                            ->where('nguoi_dung_id', $currentUser->id)
                            ->exists();
                    }
                }

                $post->san_pham_list = DB::table('bai_viet_san_pham')
                    ->join('san_pham', 'bai_viet_san_pham.san_pham_id', '=', 'san_pham.id')
                    ->select('san_pham.*')
                    ->where('bai_viet_san_pham.bai_viet_id', $post->id)
                    ->get()
                    ->map(function ($sp) {
                        $sp->lien_ket_mua = DB::table('lien_ket_mua')
                            ->where('san_pham_id', $sp->id)
                            ->get();
                        return $sp;
                    });

                return $post;
            });

        $activeMembers = DB::table('nguoi_dung')
            ->leftJoin('cap_bac', 'nguoi_dung.cap_bac_id', '=', 'cap_bac.id')
            ->select(
                'nguoi_dung.id',
                'nguoi_dung.ho_ten',
                'nguoi_dung.ten_hien_thi',
                'nguoi_dung.anh_dai_dien',
                'nguoi_dung.diem_trai_nghiem',
                'nguoi_dung.lan_cuoi_dang_nhap',
                'nguoi_dung.cap_bac as ten_cap_bac',
                'cap_bac.anh_cap_bac'
            )
            ->where('nguoi_dung.trang_thai', 1)
            ->orderBy('nguoi_dung.diem_trai_nghiem', 'desc')
            ->limit(8)
            ->get()
            ->map(function ($member) {
                $member->online = (bool)($member->lan_cuoi_dang_nhap && strtotime($member->lan_cuoi_dang_nhap) > strtotime('-2 hours'));
                return $member;
            });

        $suggestions = DB::table('nguoi_dung')
            ->leftJoin('cap_bac', 'nguoi_dung.cap_bac_id', '=', 'cap_bac.id')
            ->select(
                'nguoi_dung.id',
                'nguoi_dung.ho_ten',
                'nguoi_dung.ten_hien_thi',
                'nguoi_dung.anh_dai_dien',
                'nguoi_dung.cap_bac as ten_cap_bac',
                'cap_bac.anh_cap_bac'
            )
            ->where('nguoi_dung.trang_thai', 1)
            ->inRandomOrder()
            ->limit(5)
            ->get();

        $topics = [
            ['tag' => '#coffeemorning', 'count' => '38 khoảnh khắc'],
            ['tag' => '#dalatslowlife', 'count' => '25 trải nghiệm'],
            ['tag' => '#techsetup2026', 'count' => '42 đánh giá'],
            ['tag' => '#realtimeclub', 'count' => '60 thảo luận'],
            ['tag' => '#minimalism', 'count' => '19 chia sẻ'],
        ];

        return response()->json([
            'status' => 'success',
            'posts' => $posts,
            'active_members' => $activeMembers,
            'suggestions' => $suggestions,
            'topics' => $topics,
        ], 200);
    }

    public function store(Request $request)
    {
        $user = $request->user('sanctum');
        if (!$user) {
            return response()->json(['message' => 'Vui lòng đăng nhập để chia sẻ khoảnh khắc.'], 401);
        }

        $validator = Validator::make($request->all(), [
            'noi_dung' => 'required|string|max:5000',
            'tieu_de' => 'nullable|string|max:255',
            'anh_bia_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'danh_sach_file.*' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'Dữ liệu không hợp lệ.', 'errors' => $validator->errors()], 422);
        }

        $tieuDe = $request->input('tieu_de');
        $noiDung = $request->input('noi_dung');

        // (AI Content Moderation is now handled asynchronously after post creation)
        if (empty($tieuDe)) {
            $tieuDe = mb_substr(strip_tags($request->input('noi_dung')), 0, 60) . '...';
        }

        $slug = Str::slug($tieuDe) . '-' . uniqid();
        $uploadedUrls = [];

        if ($request->hasFile('danh_sach_file')) {
            $files = $request->file('danh_sach_file');
            if (!is_array($files)) {
                $files = [$files];
            }
            foreach ($files as $file) {
                if ($file && $file->isValid()) {
                    $uploadedUrls[] = CloudinaryService::upload($file, 'posts');
                }
            }
        }

        if ($request->hasFile('anh_bia_file') && empty($uploadedUrls)) {
            $file = $request->file('anh_bia_file');
            if ($file && $file->isValid()) {
                $uploadedUrls[] = CloudinaryService::upload($file, 'posts');
            }
        }

        if ($request->has('danh_sach_url')) {
            $urls = $request->input('danh_sach_url');
            if (is_array($urls)) {
                foreach ($urls as $u) {
                    if (!empty($u) && filter_var($u, FILTER_VALIDATE_URL)) {
                        $uploadedUrls[] = $u;
                    }
                }
            } elseif (!empty($urls)) {
                if (filter_var($urls, FILTER_VALIDATE_URL)) {
                    $uploadedUrls[] = $urls;
                }
            }
        }

        if ($request->filled('anh_bia')) {
            $ab = $request->input('anh_bia');
            if (!in_array($ab, $uploadedUrls) && filter_var($ab, FILTER_VALIDATE_URL)) {
                array_unshift($uploadedUrls, $ab);
            }
        }

        $uploadedUrls = array_values(array_unique($uploadedUrls));
        $anhBiaUrl = !empty($uploadedUrls) ? $uploadedUrls[0] : null;

        $postId = DB::table('bai_viet')->insertGetId([
            'nguoi_dung_id' => $user->id,
            'danh_muc_id' => 1,
            'loai_bai_viet' => 'check_in',
            'tieu_de' => $tieuDe,
            'slug' => $slug,
            'noi_dung' => $request->input('noi_dung'),
            'anh_bia' => $anhBiaUrl,
            'hashtags' => json_encode(['#pivo', '#khoanhkhac'], JSON_UNESCAPED_UNICODE),
            'luot_xem' => 1,
            'trang_thai' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        foreach ($uploadedUrls as $idx => $imgUrl) {
            DB::table('tep_bai_viet')->insert([
                'bai_viet_id' => $postId,
                'loai' => 'image',
                'duong_dan' => $imgUrl,
                'thu_tu' => $idx,
                'created_at' => now(),
            ]);
        }

        $sanPhamTen = $request->input('san_pham_ten');
        $sanPhamUrl = $request->input('san_pham_url');
        if (!empty($sanPhamTen) && !empty($sanPhamUrl)) {
            $giaThamKhao = (float) $request->input('san_pham_gia', 0);
            $tenSan = $request->input('san_pham_san', 'Shopee');
            
            $sanPhamId = DB::table('san_pham')->insertGetId([
                'danh_muc_id' => 1,
                'ten' => $sanPhamTen,
                'slug' => Str::slug($sanPhamTen) . '-' . uniqid(),
                'mo_ta' => $request->input('san_pham_mota', ''),
                'anh_dai_dien' => $anhBiaUrl,
                'gia_tham_khao' => $giaThamKhao,
                'luot_xem' => 1,
                'trang_thai' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::table('lien_ket_mua')->insert([
                'san_pham_id' => $sanPhamId,
                'ten_san' => $tenSan,
                'url' => $sanPhamUrl,
                'url_affiliate' => $sanPhamUrl,
                'gia' => $giaThamKhao,
                'mac_dinh' => 1,
                'created_at' => now(),
            ]);

            DB::table('bai_viet_san_pham')->insert([
                'bai_viet_id' => $postId,
                'san_pham_id' => $sanPhamId,
            ]);
        }

        $u = User::find($user->id);
        if ($u) {
            $u->increment('diem_trai_nghiem', 20);
            $u->refresh();
            $u->updateCapBac();
        }

        try {
            RealtimeNotificationEvent::dispatch(
                'new_post',
                '🌟 Khoảnh khắc mới từ ' . ($user->ten_hien_thi ?: $user->ho_ten),
                mb_substr(strip_tags($request->input('noi_dung')), 0, 100),
                ['post_id' => $postId, 'user_id' => $user->id]
            );
        } catch (\Throwable $e) {
            \Log::error('Broadcast error: ' . $e->getMessage());
        }

        // --- AI Content Moderation (Asynchronous) ---
        dispatch(new \App\Jobs\CheckToxicityJob('post', $postId, $tieuDe . ' ' . $request->input('noi_dung'), $user->id));
        // --------------------------------------------

        return response()->json([
            'status' => 'success',
            'message' => 'Đăng khoảnh khắc thành công! (+20 XP ✨)',
            'post_id' => $postId
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user('sanctum');
        if (!$user) {
            return response()->json(['message' => 'Bạn chưa đăng nhập.'], 401);
        }

        $post = DB::table('bai_viet')->where('id', $id)->first();
        if (!$post) {
            return response()->json(['message' => 'Bài viết không tồn tại.'], 404);
        }

        if ((int) $post->nguoi_dung_id !== (int) $user->id && (int) $user->vai_tro_id < 2 && $user->email !== 'superadmin@pivo.com') {
            return response()->json(['message' => 'Bạn không có quyền chỉnh sửa bài viết này.'], 403);
        }

        $request->validate([
            'tieu_de' => 'required|string|max:255',
            'noi_dung' => 'required|string',
        ]);

        // --- AI Content Moderation (Asynchronous) ---
        dispatch(new \App\Jobs\CheckToxicityJob('post', $id, $request->input('tieu_de') . ' ' . $request->input('noi_dung'), $user->id));
        // --------------------------------------------

        $hashtags = json_decode($post->hashtags ?? '[]', true);
        if ($request->has('hashtags')) {
            $inputHashtags = $request->input('hashtags');
            if (is_string($inputHashtags)) {
                $tags = array_map('trim', explode(',', $inputHashtags));
                $hashtags = array_map(function($tag) {
                    return str_starts_with($tag, '#') ? $tag : '#' . $tag;
                }, array_filter($tags));
            } elseif (is_array($inputHashtags)) {
                $hashtags = $inputHashtags;
            }
        }

        DB::table('bai_viet')->where('id', $id)->update([
            'tieu_de' => $request->input('tieu_de'),
            'noi_dung' => $request->input('noi_dung'),
            'hashtags' => json_encode(array_values(array_unique($hashtags)), JSON_UNESCAPED_UNICODE),
            'updated_at' => now(),
        ]);

        $existingLink = DB::table('bai_viet_san_pham')->where('bai_viet_id', $id)->first();
        $sanPhamTen = $request->input('san_pham_ten');
        $sanPhamUrl = $request->input('san_pham_url');
        $giaThamKhao = (float) $request->input('san_pham_gia', 0);
        $tenSan = $request->input('san_pham_san', 'Shopee');

        if (!empty($sanPhamTen) && !empty($sanPhamUrl)) {
            if ($existingLink) {
                DB::table('san_pham')->where('id', $existingLink->san_pham_id)->update([
                    'ten' => $sanPhamTen,
                    'gia_tham_khao' => $giaThamKhao,
                    'updated_at' => now(),
                ]);
                DB::table('lien_ket_mua')->where('san_pham_id', $existingLink->san_pham_id)->delete();
                DB::table('lien_ket_mua')->insert([
                    'san_pham_id' => $existingLink->san_pham_id,
                    'ten_san' => $tenSan,
                    'url' => $sanPhamUrl,
                    'url_affiliate' => $sanPhamUrl,
                    'gia' => $giaThamKhao,
                    'mac_dinh' => 1,
                    'created_at' => now(),
                ]);
            } else {
                $sanPhamId = DB::table('san_pham')->insertGetId([
                    'danh_muc_id' => 1,
                    'ten' => $sanPhamTen,
                    'slug' => Str::slug($sanPhamTen) . '-' . uniqid(),
                    'mo_ta' => '',
                    'anh_dai_dien' => $post->anh_bia,
                    'gia_tham_khao' => $giaThamKhao,
                    'luot_xem' => 1,
                    'trang_thai' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                DB::table('lien_ket_mua')->insert([
                    'san_pham_id' => $sanPhamId,
                    'ten_san' => $tenSan,
                    'url' => $sanPhamUrl,
                    'url_affiliate' => $sanPhamUrl,
                    'gia' => $giaThamKhao,
                    'mac_dinh' => 1,
                    'created_at' => now(),
                ]);
                DB::table('bai_viet_san_pham')->insert([
                    'bai_viet_id' => $id,
                    'san_pham_id' => $sanPhamId,
                ]);
            }
        } elseif ($request->has('san_pham_ten') && empty($sanPhamTen) && $existingLink) {
            DB::table('bai_viet_san_pham')->where('bai_viet_id', $id)->delete();
            DB::table('lien_ket_mua')->where('san_pham_id', $existingLink->san_pham_id)->delete();
            DB::table('san_pham')->where('id', $existingLink->san_pham_id)->delete();
        }

        $sanPhamList = DB::table('bai_viet_san_pham')
            ->join('san_pham', 'bai_viet_san_pham.san_pham_id', '=', 'san_pham.id')
            ->select('san_pham.*')
            ->where('bai_viet_san_pham.bai_viet_id', $id)
            ->get()
            ->map(function ($sp) {
                $sp->lien_ket_mua = DB::table('lien_ket_mua')
                    ->where('san_pham_id', $sp->id)
                    ->orderBy('mac_dinh', 'desc')
                    ->get();
                return $sp;
            });

        try {
            RealtimeNotificationEvent::dispatch(
                'update_post',
                '📝 Cập nhật khoảnh khắc',
                'Một bài viết vừa được chỉnh sửa nội dung.',
                ['post_id' => $id, 'user_id' => $user->id]
            );
        } catch (\Throwable $e) {
            \Log::error('Broadcast error: ' . $e->getMessage());
        }

        // --- AI Content Moderation (Asynchronous) ---
        dispatch(new \App\Jobs\CheckToxicityJob('post', $id, $request->input('tieu_de') . ' ' . $request->input('noi_dung'), $user->id));
        // --------------------------------------------

        return response()->json([
            'status' => 'success',
            'message' => 'Chỉnh sửa khoảnh khắc thành công!',
            'post' => [
                'id' => $id,
                'tieu_de' => $request->input('tieu_de'),
                'noi_dung' => $request->input('noi_dung'),
                'hashtags' => array_values(array_unique($hashtags)),
                'san_pham_list' => $sanPhamList
            ]
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user('sanctum');
        if (!$user) {
            return response()->json(['message' => 'Bạn chưa đăng nhập.'], 401);
        }

        $post = DB::table('bai_viet')->where('id', $id)->first();
        if (!$post) {
            return response()->json(['message' => 'Bài viết không tồn tại.'], 404);
        }

        if ((int) $post->nguoi_dung_id !== (int) $user->id && (int) $user->vai_tro_id < 2 && $user->email !== 'superadmin@pivo.com') {
            return response()->json(['message' => 'Bạn không có quyền xóa bài viết này.'], 403);
        }

        if (!empty($post->anh_bia)) {
            CloudinaryService::deleteByUrl($post->anh_bia);
        }

        $attachments = DB::table('tep_bai_viet')->where('bai_viet_id', $id)->get();
        foreach ($attachments as $att) {
            if (!empty($att->duong_dan) && $att->loai === 'image') {
                CloudinaryService::deleteByUrl($att->duong_dan);
            }
        }

        DB::table('bai_viet_san_pham')->where('bai_viet_id', $id)->delete();
        DB::table('tep_bai_viet')->where('bai_viet_id', $id)->delete();
        DB::table('bai_viet')->where('id', $id)->delete();

        try {
            RealtimeNotificationEvent::dispatch(
                'delete_post',
                '🗑️ Xóa khoảnh khắc',
                'Một bài viết đã được xóa khỏi bảng tin.',
                ['post_id' => $id, 'user_id' => $user->id]
            );
        } catch (\Throwable $e) {
            \Log::error('Broadcast error: ' . $e->getMessage());
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Đã xóa bài viết khỏi bảng tin thành công.'
        ], 200);
    }

    public function savePost(Request $request, $id)
    {
        $user = $request->user('sanctum');
        if (!$user) {
            return response()->json(['message' => 'Bạn chưa đăng nhập.'], 401);
        }

        $post = DB::table('bai_viet')->where('id', $id)->first();
        if (!$post) {
            return response()->json(['message' => 'Bài viết không tồn tại.'], 404);
        }

        $collectionName = $request->input('collection_name', 'Lưu tự do');

        $existing = DB::table('da_luu')
            ->where('nguoi_dung_id', $user->id)
            ->where('loai', 'post')
            ->where('doi_tuong_id', $id)
            ->first();

        if ($existing) {
            DB::table('da_luu')->where('id', $existing->id)->delete();
            return response()->json([
                'status' => 'success',
                'action' => 'unsaved',
                'message' => 'Đã bỏ lưu bài viết.'
            ], 200);
        } else {
            DB::table('da_luu')->insert([
                'nguoi_dung_id' => $user->id,
                'ten_bo_suu_tap' => $collectionName,
                'loai' => 'post',
                'doi_tuong_id' => $id,
                'created_at' => now(),
            ]);
            return response()->json([
                'status' => 'success',
                'action' => 'saved',
                'message' => 'Đã lưu bài viết vào bộ sưu tập.'
            ], 200);
        }
    }

    public function recordAffiliateClick(Request $request)
    {
        $user = $request->user('sanctum');
        DB::table('click_affiliate')->insert([
            'nguoi_dung_id' => $user ? $user->id : null,
            'lien_ket_id' => $request->input('lien_ket_id', 0),
            'bai_viet_id' => $request->input('bai_viet_id', 0),
            'dia_chi_ip' => $request->ip(),
            'created_at' => now(),
        ]);
        return response()->json(['status' => 'success']);
    }

    public function myCollections(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        $collections = DB::table('da_luu')
            ->where('nguoi_dung_id', $user->id)
            ->select('ten_bo_suu_tap')
            ->distinct()
            ->pluck('ten_bo_suu_tap');

        return response()->json([
            'status' => 'success',
            'collections' => $collections
        ], 200);
    }
}
