<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BannerController extends Controller
{
    public function getHeroBanners()
    {
        $banners = DB::table('banner')
            ->join('vi_tri_banner', 'banner.vi_tri_banner_id', '=', 'vi_tri_banner.id')
            ->where('vi_tri_banner.ma', 'hero')
            ->where('banner.trang_thai', 1)
            ->where('vi_tri_banner.trang_thai', 1)
            ->select('banner.*')
            ->orderBy('banner.thu_tu', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $banners
        ], 200);
    }
}
