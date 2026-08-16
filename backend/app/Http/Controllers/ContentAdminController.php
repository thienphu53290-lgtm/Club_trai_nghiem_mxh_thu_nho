<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BaoCao;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ContentAdminController extends Controller
{
    /**
     * Lấy danh sách báo cáo
     */
    public function getReports(Request $request)
    {
        $status = $request->query('status', 0); // 0: Chờ xử lý, 1: Đã xử lý, 2: Bỏ qua
        $type = $request->query('type', 'all');

        $query = BaoCao::with('nguoiGui:id,ho_ten,email,anh_dai_dien')->where('trang_thai', $status);
        
        if ($type !== 'all') {
            $query->where('loai', $type);
        }

        $reports = $query->orderBy('created_at', 'desc')->paginate(20);

        // Load chi tiết đối tượng bị báo cáo
        $reports->getCollection()->transform(function ($report) {
            $target = null;
            if ($report->loai === 'post') {
                $post = DB::table('bai_viet')->where('id', $report->doi_tuong_id)->first();
                if ($post) {
                    $user = DB::table('nguoi_dung')->where('id', $post->nguoi_dung_id)->first();
                    $target = (object) [
                        'id' => $post->id,
                        'tieu_de' => $post->tieu_de,
                        'noi_dung' => $post->noi_dung,
                        'anh_bia' => $post->anh_bia,
                        'nguoi_dung' => $user ? [
                            'id' => $user->id,
                            'ho_ten' => $user->ho_ten,
                            'anh_dai_dien' => $user->anh_dai_dien
                        ] : null
                    ];
                }
            } elseif ($report->loai === 'comment') {
                $comment = DB::table('binh_luan')->where('id', $report->doi_tuong_id)->first();
                if ($comment) {
                    $user = DB::table('nguoi_dung')->where('id', $comment->nguoi_dung_id)->first();
                    $target = (object) [
                        'id' => $comment->id,
                        'noi_dung' => $comment->noi_dung,
                        'nguoi_dung' => $user ? [
                            'id' => $user->id,
                            'ho_ten' => $user->ho_ten,
                            'anh_dai_dien' => $user->anh_dai_dien
                        ] : null
                    ];
                }
            } elseif ($report->loai === 'user') {
                $target = User::find($report->doi_tuong_id);
            }
            $report->target_detail = $target;
            return $report;
        });

        return response()->json(['status' => 'success', 'data' => $reports]);
    }

    /**
     * Xử lý báo cáo (Bỏ qua hoặc Xóa)
     */
    public function handleReport($id, Request $request)
    {
        $request->validate([
            'action' => 'required|in:ignore,delete',
            'reason' => 'nullable|string'
        ]);

        $report = BaoCao::findOrFail($id);
        $admin = auth()->user();

        if ($request->action === 'ignore') {
            $report->trang_thai = 2; // Bỏ qua
            $report->save();
            
            $this->logAction($admin->id, 'Bỏ qua báo cáo', 'bao_cao', ['report_id' => $report->id, 'action' => 'ignore']);
            return response()->json(['status' => 'success', 'message' => 'Đã đánh dấu bỏ qua báo cáo.']);
        }

        if ($request->action === 'delete') {
            $report->trang_thai = 1; // Đã xử lý (Xóa)
            $report->save();

            // Thực hiện xóa
            if ($report->loai === 'post') {
                DB::table('bai_viet')->where('id', $report->doi_tuong_id)->delete();
            } elseif ($report->loai === 'comment') {
                DB::table('binh_luan')->where('id', $report->doi_tuong_id)->delete();
            }

            // Đồng bộ cập nhật các báo cáo khác cùng đối tượng này
            BaoCao::where('loai', $report->loai)
                  ->where('doi_tuong_id', $report->doi_tuong_id)
                  ->where('trang_thai', 0)
                  ->update(['trang_thai' => 1]);

            $this->logAction($admin->id, 'Xóa nội dung vi phạm', 'DELETE_ITEM', [
                'report_id' => $report->id, 
                'type' => $report->loai, 
                'target_id' => $report->doi_tuong_id,
                'reason' => $request->reason
            ]);

            return response()->json(['status' => 'success', 'message' => 'Đã xóa nội dung vi phạm.']);
        }
    }

    /**
     * Danh sách User Spam (bị báo cáo nhiều nhất)
     */
    public function getSpamUsers(Request $request)
    {
        // Thống kê những user bị báo cáo dưới dạng 'user', hoặc tổng hợp các bài viết/comment của họ bị báo cáo
        // Cách đơn giản nhất: Đếm số lượng báo cáo (trạng thái chờ xử lý hoặc đã xử lý) theo user bị báo cáo
        
        $spamUsers = BaoCao::where('loai', 'user')
            ->select('doi_tuong_id', DB::raw('count(*) as report_count'))
            ->groupBy('doi_tuong_id')
            ->orderByDesc('report_count')
            ->get();
            
        // Gắn thông tin User
        $userIds = $spamUsers->pluck('doi_tuong_id');
        $users = User::whereIn('id', $userIds)->get()->keyBy('id');
        
        $result = $spamUsers->map(function($item) use ($users) {
            $user = $users->get($item->doi_tuong_id);
            if ($user) {
                return [
                    'id' => $user->id,
                    'ho_ten' => $user->ho_ten,
                    'email' => $user->email,
                    'anh_dai_dien' => $user->anh_dai_dien,
                    'trang_thai' => $user->trang_thai,
                    'report_count' => $item->report_count
                ];
            }
            return null;
        })->filter()->values();

        return response()->json(['status' => 'success', 'data' => $result]);
    }

    /**
     * Khóa/Mở khóa User Spam
     */
    public function punishUser($id, Request $request)
    {
        $user = User::findOrFail($id);
        
        if ($user->vai_tro_id == 3) {
            return response()->json(['status' => 'error', 'message' => 'Không thể khóa Super Admin!'], 400);
        }

        $user->trang_thai = $user->trang_thai == 1 ? 0 : 1;
        $user->save();

        $admin = auth()->user();
        $action = $user->trang_thai == 1 ? 'Mở khóa tài khoản' : 'Khóa tài khoản (Spam/Vi phạm)';
        
        $this->logAction($admin->id, $action, 'UPDATE_USER', ['target_user_id' => $user->id]);

        $msg = $user->trang_thai == 1 ? 'Đã mở khóa tài khoản.' : 'Đã khóa tài khoản vi phạm.';
        return response()->json(['status' => 'success', 'message' => $msg]);
    }

    /**
     * Lấy danh sách toàn bộ bài viết
     */
    public function getAllPosts(Request $request)
    {
        $posts = DB::table('bai_viet')
            ->leftJoin('nguoi_dung', 'bai_viet.nguoi_dung_id', '=', 'nguoi_dung.id')
            ->select(
                'bai_viet.id',
                'bai_viet.tieu_de',
                'bai_viet.noi_dung',
                'bai_viet.anh_bia',
                'bai_viet.trang_thai',
                'bai_viet.created_at',
                'nguoi_dung.id as nguoi_dung_id',
                'nguoi_dung.ho_ten',
                'nguoi_dung.anh_dai_dien'
            )
            ->orderByDesc('bai_viet.created_at')
            ->paginate(20);

        return response()->json([
            'status' => 'success',
            'data' => $posts
        ]);
    }

    /**
     * Khóa/Mở khóa bài viết
     */
    public function togglePostStatus($id, Request $request)
    {
        $post = DB::table('bai_viet')->where('id', $id)->first();
        if (!$post) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy bài viết'], 404);
        }

        $newStatus = $post->trang_thai == 1 ? 0 : 1;
        
        DB::table('bai_viet')->where('id', $id)->update(['trang_thai' => $newStatus]);

        $admin = auth()->user();
        if ($admin) {
            $action = $newStatus == 1 ? 'Khôi phục bài viết' : 'Ẩn bài viết vi phạm';
            $this->logAction($admin->id, $action, 'UPDATE_POST', ['post_id' => $id]);
        }

        return response()->json([
            'status' => 'success',
            'message' => $newStatus == 1 ? 'Đã khôi phục bài viết thành công.' : 'Đã ẩn bài viết vi phạm.',
            'new_status' => $newStatus
        ]);
    }

    /**
     * Lấy danh sách toàn bộ bình luận
     */
    public function getAllComments(Request $request)
    {
        $comments = DB::table('binh_luan')
            ->leftJoin('nguoi_dung', 'binh_luan.nguoi_dung_id', '=', 'nguoi_dung.id')
            ->leftJoin('bai_viet', 'binh_luan.bai_viet_id', '=', 'bai_viet.id')
            ->select(
                'binh_luan.id',
                'binh_luan.noi_dung',
                'binh_luan.trang_thai',
                'binh_luan.created_at',
                'nguoi_dung.id as nguoi_dung_id',
                'nguoi_dung.ho_ten',
                'nguoi_dung.anh_dai_dien',
                'bai_viet.id as bai_viet_id',
                'bai_viet.tieu_de as bai_viet_tieu_de'
            )
            ->orderBy('binh_luan.created_at', 'desc')
            ->paginate(30);

        return response()->json([
            'status' => 'success',
            'data' => $comments
        ]);
    }

    /**
     * Khóa/Mở khóa bình luận
     */
    public function toggleCommentStatus($id, Request $request)
    {
        $comment = DB::table('binh_luan')->where('id', $id)->first();
        if (!$comment) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy bình luận'], 404);
        }

        $newStatus = $comment->trang_thai == 1 ? 0 : 1;
        DB::table('binh_luan')->where('id', $id)->update(['trang_thai' => $newStatus]);

        $admin = auth()->user();
        if ($admin) {
            $action = $newStatus == 1 ? 'Khôi phục bình luận' : 'Ẩn bình luận vi phạm';
            $this->logAction($admin->id, $action, 'UPDATE_COMMENT', ['comment_id' => $id]);
        }

        return response()->json([
            'status' => 'success',
            'message' => $newStatus == 1 ? 'Đã khôi phục bình luận.' : 'Đã ẩn bình luận vi phạm.',
            'new_status' => $newStatus
        ]);
    }

    /**
     * Lấy danh sách chủ đề (Danh mục)
     */
    public function getAllTopics(Request $request)
    {
        $topics = DB::table('danh_muc')
            ->orderBy('thu_tu', 'asc')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json([
            'status' => 'success',
            'data' => $topics
        ]);
    }

    /**
     * Tạo chủ đề mới
     */
    public function createTopic(Request $request)
    {
        $request->validate([
            'ten' => 'required|string|max:255',
            'loai_danh_muc' => 'nullable|string|max:50'
        ]);

        $slug = \Illuminate\Support\Str::slug($request->ten);

        $id = DB::table('danh_muc')->insertGetId([
            'ten' => $request->ten,
            'slug' => $slug,
            'mo_ta' => $request->mo_ta ?? null,
            'loai_danh_muc' => $request->loai_danh_muc ?? 'chu_de',
            'trang_thai' => 1,
            'created_at' => Carbon::now()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Tạo chủ đề thành công.',
            'data' => DB::table('danh_muc')->where('id', $id)->first()
        ]);
    }

    /**
     * Cập nhật chủ đề
     */
    public function updateTopic($id, Request $request)
    {
        $request->validate([
            'ten' => 'required|string|max:255'
        ]);

        $topic = DB::table('danh_muc')->where('id', $id)->first();
        if (!$topic) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy chủ đề'], 404);
        }

        $slug = \Illuminate\Support\Str::slug($request->ten);

        DB::table('danh_muc')->where('id', $id)->update([
            'ten' => $request->ten,
            'slug' => $slug,
            'mo_ta' => $request->mo_ta ?? $topic->mo_ta,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Cập nhật chủ đề thành công.'
        ]);
    }

    /**
     * Ẩn/Hiện chủ đề
     */
    public function toggleTopicStatus($id, Request $request)
    {
        $topic = DB::table('danh_muc')->where('id', $id)->first();
        if (!$topic) {
            return response()->json(['status' => 'error', 'message' => 'Không tìm thấy chủ đề'], 404);
        }

        $newStatus = $topic->trang_thai == 1 ? 0 : 1;
        DB::table('danh_muc')->where('id', $id)->update(['trang_thai' => $newStatus]);

        return response()->json([
            'status' => 'success',
            'message' => $newStatus == 1 ? 'Đã hiện chủ đề.' : 'Đã ẩn chủ đề.',
            'new_status' => $newStatus
        ]);
    }

    /**
     * Hàm tiện ích Ghi Log
     */
    private function logAction($userId, $action, $type, $data)
    {
        DB::table('nhat_ky')->insert([
            'nguoi_dung_id' => $userId,
            'hanh_dong' => $action,
            'bang_du_lieu' => $type,
            'du_lieu' => json_encode($data),
            'dia_chi_ip' => request()->ip(),
            'created_at' => Carbon::now()
        ]);
    }
}
