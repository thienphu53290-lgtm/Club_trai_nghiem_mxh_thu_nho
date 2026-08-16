<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BaoCao;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'loai' => 'required|string|in:post,comment,user,product',
            'doi_tuong_id' => 'required|integer',
            'ly_do' => 'required|string|max:255'
        ]);

        $userId = auth()->id();

        // Check if user already reported this item
        $existing = BaoCao::where('nguoi_gui_id', $userId)
            ->where('loai', $request->loai)
            ->where('doi_tuong_id', $request->doi_tuong_id)
            ->where('trang_thai', 0) // still pending
            ->first();

        if ($existing) {
            return response()->json(['status' => 'error', 'message' => 'Bạn đã báo cáo nội dung này trước đó rồi!'], 400);
        }

        BaoCao::create([
            'nguoi_gui_id' => $userId,
            'loai' => $request->loai,
            'doi_tuong_id' => $request->doi_tuong_id,
            'ly_do' => $request->ly_do,
            'trang_thai' => 0
        ]);

        return response()->json(['status' => 'success', 'message' => 'Đã gửi báo cáo vi phạm đến quản trị viên Club.']);
    }
}
