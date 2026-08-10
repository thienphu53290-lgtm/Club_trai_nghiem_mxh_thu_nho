<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SuKien;
use App\Models\DangKySuKien;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Mail\EventTicketMail;
use App\Services\CloudinaryService;
use Carbon\Carbon;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $query = SuKien::query()->whereIn('trang_thai', [1, 2]); // 1: Sắp diễn ra/Mở bán, 2: Đang diễn ra, 3: Đã kết thúc (bỏ qua)

        if ($request->has('hinh_thuc') && $request->hinh_thuc !== 'all') {
            $query->where('hinh_thuc', $request->hinh_thuc);
        }

        if ($request->has('dang_mo_dang_ky') && $request->dang_mo_dang_ky == 'true') {
            $query->where('thoi_gian_bat_dau', '>', Carbon::now());
        }

        $events = $query->orderBy('thoi_gian_bat_dau', 'asc')->get();

        // Calculate attendees and remaining free tickets
        foreach ($events as $event) {
            $dangKyCount = DangKySuKien::where('su_kien_id', $event->id)->count();
            $event->attendees = $dangKyCount;
            
            $veMienPhiConLai = max(0, $event->so_ve_mien_phi - $dangKyCount);
            $event->ve_mien_phi_con_lai = $veMienPhiConLai;
            
            // For frontend compatibility: match DB status instead of time comparison
            if ($event->trang_thai == 2) {
                $event->status = 'Đang diễn ra';
            } else {
                $event->status = 'Mở bán vé';
            }
        }

        return response()->json([
            'status' => 'success',
            'events' => $events
        ]);
    }

    public function getAds()
    {
        // Get all active events that have purchased ads
        $adEvents = SuKien::whereIn('trang_thai', [1, 2])
            ->where('goi_quang_cao', '>', 0)
            ->orderBy('created_at', 'desc')
            ->get();

        // Calculate basic info for all events
        foreach ($adEvents as $event) {
            $dangKyCount = DangKySuKien::where('su_kien_id', $event->id)->count();
            $event->attendees = $dangKyCount;
            
            $veMienPhiConLai = max(0, $event->so_ve_mien_phi - $dangKyCount);
            $event->ve_mien_phi_con_lai = $veMienPhiConLai;
            
            if ($event->trang_thai == 2) {
                $event->status = 'Đang diễn ra';
            } else {
                $event->status = 'Mở bán vé';
            }
        }

        // Super ads: Events with goi_quang_cao = 499000
        $superAds = $adEvents->where('goi_quang_cao', 499000)->values();

        // Feed ads: All ad events, but 499k has 2x weight (we just duplicate them in the array)
        $feedAds = collect();
        foreach ($adEvents as $event) {
            $feedAds->push($event);
            if ($event->goi_quang_cao == 499000) {
                // Add one more time to increase frequency
                $feedAds->push($event);
            }
        }
        
        // Shuffle the feed ads
        $feedAds = $feedAds->shuffle()->values();

        return response()->json([
            'status' => 'success',
            'super_ads' => $superAds,
            'feed_ads' => $feedAds
        ]);
    }

    public function show($slug)
    {
        $event = SuKien::where('slug', $slug)->first();
        
        if (!$event) {
            return response()->json(['message' => 'Sự kiện không tồn tại.'], 404);
        }

        $dangKyCount = DangKySuKien::where('su_kien_id', $event->id)->count();
        $event->attendees = $dangKyCount;
        
        $veMienPhiConLai = max(0, $event->so_ve_mien_phi - $dangKyCount);
        $event->ve_mien_phi_con_lai = $veMienPhiConLai;
        
        $event->status = $event->thoi_gian_bat_dau > Carbon::now() ? 'Sắp diễn ra' : 'Đã diễn ra';

        // Check user registration status if logged in
        $isRegistered = false;
        $user = request()->user('sanctum');
        if ($user) {
            $isRegistered = DangKySuKien::where('su_kien_id', $event->id)
                ->where('nguoi_dung_id', $user->id)
                ->exists();
        }
        $event->is_registered = $isRegistered;

        return response()->json([
            'status' => 'success',
            'event' => $event
        ]);
    }

    public function register(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Vui lòng đăng nhập để đăng ký sự kiện.'], 401);
        }

        $suKien = SuKien::find($id);
        if (!$suKien) {
            return response()->json(['message' => 'Sự kiện không tồn tại.'], 404);
        }

        // Check if already registered
        $existing = DangKySuKien::where('su_kien_id', $id)
            ->where('nguoi_dung_id', $user->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Bạn đã đăng ký tham gia sự kiện này rồi.'], 400);
        }

        $dangKyCount = DangKySuKien::where('su_kien_id', $id)->count();

        if ($suKien->so_luong_toi_da && $dangKyCount >= $suKien->so_luong_toi_da) {
            return response()->json(['message' => 'Sự kiện đã đủ số lượng người tham gia.'], 400);
        }

        $isFree = false;
        if ($suKien->gia_ve == 0 || $dangKyCount < $suKien->so_ve_mien_phi) {
            $isFree = true;
        }

        $emailNhanVe = $request->input('email_nhan_ve', $user->email);

        if ($isFree) {
            // Register directly
            $dangKy = DangKySuKien::create([
                'su_kien_id' => $id,
                'nguoi_dung_id' => $user->id,
                'ho_ten' => $user->ho_ten,
                'email_nhan_ve' => $emailNhanVe,
                'so_dien_thoai' => $user->so_dien_thoai ?? '',
                'trang_thai' => 1, // Đã duyệt
            ]);

            // Send Email (We can dispatch this to a queue in a real app)
            try {
                Mail::to($emailNhanVe)->send(new EventTicketMail($suKien, $user, $dangKy));
            } catch (\Exception $e) {
                // Log the error but don't fail the registration
                \Log::error('Failed to send event ticket email: ' . $e->getMessage());
            }

            return response()->json([
                'status' => 'success',
                'is_free' => true,
                'message' => 'Đăng ký sự kiện thành công! Bạn đã nhận được vé miễn phí. Vui lòng kiểm tra email của bạn.'
            ]);
        } else {
            // For paid tickets (simulate creating a transaction)
            // In a real app, we would insert into giao_dich and return a payment URL.
            // For MVP, we'll create the dang_ky_su_kien with trang_thai = 0 (Chờ duyệt)
            $maGiaoDich = 'VE-' . time() . '-' . $user->id;
            
            $giaoDichId = DB::table('giao_dich')->insertGetId([
                'nguoi_dung_id' => $user->id,
                'loai_nguon_thu' => 've_su_kien',
                'doi_tuong_id' => $id,
                'so_tien' => $suKien->gia_ve,
                'phuong_thuc_thanh_toan' => 'Chuyển khoản',
                'trang_thai' => 0, // Chờ thanh toán
                'ma_giao_dich' => $maGiaoDich,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]);

            DangKySuKien::create([
                'su_kien_id' => $id,
                'nguoi_dung_id' => $user->id,
                'ho_ten' => $user->ho_ten,
                'email_nhan_ve' => $emailNhanVe,
                'so_dien_thoai' => $user->so_dien_thoai ?? '',
                'trang_thai' => 0, // Chờ duyệt/thanh toán
                'giao_dich_id' => $giaoDichId
            ]);

            return response()->json([
                'status' => 'success',
                'is_free' => false,
                'message' => 'Vui lòng thanh toán để hoàn tất đăng ký.',
                'gia_ve' => $suKien->gia_ve,
                'ma_giao_dich' => $maGiaoDich
            ]);
        }
    }

    public function confirmPayment(Request $request, $ma_giao_dich)
    {
        $giaoDich = DB::table('giao_dich')->where('ma_giao_dich', $ma_giao_dich)->first();
        if (!$giaoDich) {
            return response()->json(['message' => 'Không tìm thấy giao dịch.'], 404);
        }

        if ($giaoDich->trang_thai == 1) {
            return response()->json(['message' => 'Giao dịch này đã được thanh toán trước đó.'], 400);
        }

        // Cập nhật giao dịch -> thành công
        DB::table('giao_dich')->where('id', $giaoDich->id)->update([
            'trang_thai' => 1,
            'updated_at' => Carbon::now()
        ]);

        // Kiểm tra loại nguồn thu
        if ($giaoDich->loai_nguon_thu == 'mua_goi_su_kien') {
            // Thanh toán gói tạo sự kiện -> Kích hoạt sự kiện
            $suKien = SuKien::find($giaoDich->doi_tuong_id);
            if ($suKien) {
                $suKien->update(['trang_thai' => 1]); // Active
            }
            return response()->json([
                'status' => 'success',
                'message' => 'Thanh toán thành công! Sự kiện của bạn đã được duyệt và hiển thị trên hệ thống.'
            ]);
        }

        // Cập nhật trạng thái đăng ký sự kiện
        $dangKy = DangKySuKien::where('giao_dich_id', $giaoDich->id)->first();
        if ($dangKy) {
            $dangKy->update(['trang_thai' => 1]); // Đã duyệt

            // Gửi email vé điện tử
            $suKien = SuKien::find($dangKy->su_kien_id);
            $user = DB::table('nguoi_dung')->where('id', $dangKy->nguoi_dung_id)->first();
            
            if ($suKien && $user && $dangKy->email_nhan_ve) {
                try {
                    Mail::to($dangKy->email_nhan_ve)->send(new EventTicketMail($suKien, $user, $dangKy));
                } catch (\Exception $e) {
                    \Log::error('Failed to send event ticket email: ' . $e->getMessage());
                }
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Thanh toán thành công! Vé điện tử đã được gửi vào email của bạn.'
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['message' => 'Bạn cần đăng nhập để tạo sự kiện.'], 401);
        }

        $request->validate([
            'tieu_de' => 'required|string|max:255',
            'dia_diem' => 'required|string|max:255',
            'thoi_gian_bat_dau' => 'required|date',
            'thoi_gian_ket_thuc' => 'required|date|after:thoi_gian_bat_dau',
            'gia_ve' => 'required|numeric',
            'goi_dich_vu_id' => 'required|exists:goi_dich_vu,id'
        ]);

        $goi = DB::table('goi_dich_vu')->where('id', $request->goi_dich_vu_id)->first();
        if (!$goi) return response()->json(['message' => 'Gói dịch vụ không hợp lệ'], 400);

        $anhBiaUrl = null;
        if ($request->hasFile('anh_bia_file')) {
            $anhBiaUrl = CloudinaryService::upload($request->file('anh_bia_file'), 'events');
        } else {
            $anhBiaUrl = $request->anh_bia; // Fallback to URL if provided
        }

        $thuVienAnhUrls = [];
        if ($request->hasFile('thu_vien_anh_files')) {
            foreach ($request->file('thu_vien_anh_files') as $file) {
                if ($file) {
                    $thuVienAnhUrls[] = CloudinaryService::upload($file, 'events');
                }
            }
        } elseif ($request->thu_vien_anh) {
            // Handle array of URLs if sent
            $urls = is_string($request->thu_vien_anh) ? json_decode($request->thu_vien_anh, true) : $request->thu_vien_anh;
            if (is_array($urls)) {
                $thuVienAnhUrls = array_filter($urls, fn($u) => !empty(trim($u)));
            }
        }

        $suKien = SuKien::create([
            'nguoi_tao_id' => $user->id,
            'goi_dich_vu_id' => $goi->id,
            'tieu_de' => $request->tieu_de,
            'slug' => \Illuminate\Support\Str::slug($request->tieu_de) . '-' . time(),
            'mo_ta' => $request->mo_ta ?? '',
            'dia_diem' => $request->dia_diem,
            'hinh_thuc' => $request->hinh_thuc ?? 0,
            'thoi_gian_bat_dau' => $request->thoi_gian_bat_dau,
            'thoi_gian_ket_thuc' => $request->thoi_gian_ket_thuc,
            'gia_ve' => $request->gia_ve,
            'so_ve_mien_phi' => $request->so_ve_mien_phi ?? 0,
            'so_luong_toi_da' => $goi->so_luong_toi_da,
            'anh_bia' => $anhBiaUrl,
            'thu_vien_anh' => json_encode($thuVienAnhUrls),
            'goi_quang_cao' => $request->goi_quang_cao ?? 0,
            'trang_thai' => 0, // Mặc định 0, xử lý bên dưới
        ]);

        $adPrice = $request->goi_quang_cao ?? 0;
        if (str_contains(strtolower($goi->ten_goi), 'pro')) {
            $adPrice = $adPrice * 0.6; // Giảm 40%
        }
        if ($goi->loai_phi == 'percent') {
            $adPrice = 0; // Miễn phí cho Enterprise
        }

        $eventPrice = $goi->loai_phi == 'flat' ? $goi->gia_tri : 0;
        $totalPrice = $eventPrice + $adPrice;

        if ($goi->loai_phi == 'percent') {
            // Gói Enterprise: Không thu tiền ngay, để Chờ Duyệt (trạng thái 0)
            return response()->json([
                'status' => 'enterprise_pending',
                'message' => 'Yêu cầu tạo sự kiện Enterprise đã được ghi nhận. Vui lòng liên hệ Admin.',
                'su_kien_id' => $suKien->id
            ]);
        } elseif ($totalPrice > 0) {
            // Tạo giao dịch thanh toán tiền mua gói (gồm cả phí sự kiện + quảng cáo)
            $maGiaoDich = 'PK-' . time() . '-' . $user->id;
            
            DB::table('giao_dich')->insert([
                'nguoi_dung_id' => $user->id,
                'loai_nguon_thu' => 'mua_goi_su_kien',
                'doi_tuong_id' => $suKien->id,
                'so_tien' => $totalPrice,
                'ma_giao_dich' => $maGiaoDich,
                'trang_thai' => 0, // chờ thanh toán
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            return response()->json([
                'status' => 'payment_required',
                'ma_giao_dich' => $maGiaoDich,
                'so_tien' => $totalPrice,
                'message' => 'Vui lòng thanh toán phí khởi tạo.'
            ]);
        } else {
            // Miễn phí 100% (Ví dụ: Gói Starter + Không quảng cáo)
            $suKien->trang_thai = 1; // Kích hoạt ngay
            $suKien->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Tạo sự kiện thành công và đã được kích hoạt!',
                'su_kien' => $suKien
            ]);
        }
    }
}
