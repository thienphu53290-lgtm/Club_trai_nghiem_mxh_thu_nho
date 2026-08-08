<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Services\LogtailService;

class CrudLoggerMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Tiếp tục xử lý request bình thường
        $response = $next($request);

        // Chỉ ghi log nếu HTTP Status thành công (200-299)
        if ($response->isSuccessful()) {
            $this->logCrudAction($request);
        }

        return $response;
    }

    private function logCrudAction(Request $request)
    {
        $method = $request->method();
        $path = $request->path(); // e.g. "api/feed/posts"
        $user = $request->user('sanctum');

        // Chỉ quan tâm các method thay đổi dữ liệu
        if (!in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'])) {
            return;
        }

        // Bỏ qua các route không cần log
        if (str_starts_with($path, 'api/chat/heartbeat') || str_starts_with($path, 'api/test-logtail') || str_starts_with($path, 'api/logout')) {
            return;
        }

        $actionString = '';
        $dataType = 'SYSTEM';

        // Map method sang tiếng Việt
        $methodLabel = 'cập nhật';
        if ($method === 'POST') $methodLabel = 'thêm mới/thực hiện';
        if ($method === 'DELETE') $methodLabel = 'xóa';

        // Map URI sang tiếng Việt
        if (str_contains($path, 'posts')) {
            $dataType = 'CREATE_ITEM';
            $actionString = "{$methodLabel} bài viết";
            if (str_contains($path, 'like')) $actionString = "tương tác (thích) bài viết";
            if (str_contains($path, 'comment')) $actionString = "bình luận vào bài viết";
        } elseif (str_contains($path, 'profile')) {
            $dataType = 'UPDATE_USER';
            $actionString = "{$methodLabel} hồ sơ cá nhân";
        } elseif (str_contains($path, 'chat')) {
            $dataType = 'MESSAGE';
            $actionString = "{$methodLabel} tin nhắn / hội thoại";
        } elseif (str_contains($path, 'follow')) {
            $dataType = 'UPDATE_USER';
            $actionString = "theo dõi/bỏ theo dõi người dùng";
        } else {
            // Fallback chung
            $dataType = 'CRUD Dữ liệu';
            $actionString = "{$methodLabel} dữ liệu tại {$path}";
        }

        $userId = $user ? $user->id : null;

        // Lưu vào bảng nhat_ky nội bộ
        try {
            DB::table('nhat_ky')->insert([
                'nguoi_dung_id' => $userId,
                'hanh_dong' => strtolower($actionString),
                'bang_du_lieu' => $dataType,
                'du_lieu' => json_encode($request->except(['password', 'password_confirmation', 'anh_dai_dien', 'anh_bia', 'danh_sach_anh'])),
                'dia_chi_ip' => $request->ip(),
                'created_at' => now(),
            ]);
        } catch (\Throwable $e) {
            // Bỏ qua lỗi insert log để không ảnh hưởng luồng chính
        }

        // Bắn log sang Better Stack
        if ($user) {
            LogtailService::crud(
                $path,
                $method,
                $user->id,
                ['action_desc' => $actionString]
            );
        }
    }
}
