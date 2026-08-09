<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EventPackageController extends Controller
{
    public function index()
    {
        $packages = DB::table('goi_dich_vu')->where('trang_thai', 1)->get();
        return response()->json($packages);
    }
}
