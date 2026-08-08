<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PaymentAndVipSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tạo các gói VIP
        $goiVip = [
            ['id' => 1, 'ten_goi' => 'Gói Trải Nghiệm Pro', 'gia_tien' => 99000, 'thoi_han_ngay' => 30],
            ['id' => 2, 'ten_goi' => 'Gói Vàng Tiên Phong', 'gia_tien' => 250000, 'thoi_han_ngay' => 90],
            ['id' => 3, 'ten_goi' => 'Gói Kim Cương VIP', 'gia_tien' => 850000, 'thoi_han_ngay' => 365],
        ];

        foreach ($goiVip as $goi) {
            DB::table('goi_vip')->insertOrIgnore([
                'id' => $goi['id'],
                'ten_goi' => $goi['ten_goi'],
                'mo_ta' => 'Mock VIP Package',
                'gia_tien' => $goi['gia_tien'],
                'thoi_han_ngay' => $goi['thoi_han_ngay'],
                'trang_thai' => 1,
                'created_at' => now(),
            ]);
        }

        // Get some users
        $userIds = DB::table('nguoi_dung')->pluck('id')->toArray();
        if (empty($userIds)) return;

        // 2. Tạo giao dịch (Mock Transactions cho 12 tháng)
        $now = Carbon::now();
        $transactions = [];
        $vipHistories = [];

        $loaiNguonThu = ['ve_su_kien', 'goi_vip', 'affiliate'];
        $phuongThuc = ['VNPay', 'MoMo', 'ChuyenKhoan'];

        // Chúng ta cần giả lập khoảng 1.5 Tỷ doanh thu trong năm nay (theo UI là 1.450M cho 2026)
        // và khoảng 128M affiliate doanh thu tổng.
        
        // Tạo khoảng 100 giao dịch rải rác trong 12 tháng qua
        for ($i = 0; $i < 150; $i++) {
            $loai = $loaiNguonThu[array_rand($loaiNguonThu)];
            
            // Random ngày trong vòng 12 tháng (từ tháng 1 tới tháng hiện tại của năm nay)
            // Hoặc rải rác 365 ngày qua
            $randomDays = rand(0, 365);
            $ngayThanhToan = Carbon::now()->subDays($randomDays);

            $soTien = 0;
            $doiTuongId = null;

            if ($loai == 'goi_vip') {
                $goi = $goiVip[array_rand($goiVip)];
                $soTien = $goi['gia_tien'];
                $doiTuongId = $goi['id'];
            } elseif ($loai == 've_su_kien') {
                $soTien = rand(1, 5) * 100000; // 100k -> 500k
                $doiTuongId = rand(1, 2);
            } elseif ($loai == 'affiliate') {
                $soTien = rand(5, 50) * 100000; // 500k -> 5M
                $doiTuongId = rand(1, 10);
            }

            $userId = $userIds[array_rand($userIds)];
            
            $maGiaoDich = 'PAY-' . $ngayThanhToan->format('Ymd') . '-' . strtoupper(uniqid());

            $transactions[] = [
                'ma_giao_dich' => $maGiaoDich,
                'nguoi_dung_id' => $userId,
                'loai_nguon_thu' => $loai,
                'doi_tuong_id' => $doiTuongId,
                'so_tien' => $soTien,
                'phuong_thuc_thanh_toan' => $phuongThuc[array_rand($phuongThuc)],
                'trang_thai' => 1, // Success
                'ngay_thanh_toan' => $ngayThanhToan,
                'created_at' => $ngayThanhToan,
                'updated_at' => $ngayThanhToan,
            ];
        }

        // Đảm bảo có dữ liệu đột biến cho tháng hiện tại (T8) theo đúng UI
        for ($i = 0; $i < 20; $i++) {
            $loai = $loaiNguonThu[array_rand($loaiNguonThu)];
            $ngayThanhToan = Carbon::now()->subDays(rand(0, 15)); // Trong vòng 15 ngày qua
            $userId = $userIds[array_rand($userIds)];
            
            $soTien = 0;
            if ($loai == 'goi_vip') {
                $soTien = 850000;
            } elseif ($loai == 'affiliate') {
                $soTien = rand(10, 80) * 100000; // Affiliate lớn
            } else {
                $soTien = 500000;
            }

            $transactions[] = [
                'ma_giao_dich' => 'PAY-' . $ngayThanhToan->format('Ymd') . '-' . strtoupper(uniqid()),
                'nguoi_dung_id' => $userId,
                'loai_nguon_thu' => $loai,
                'doi_tuong_id' => 1,
                'so_tien' => $soTien,
                'phuong_thuc_thanh_toan' => 'VNPay',
                'trang_thai' => 1,
                'ngay_thanh_toan' => $ngayThanhToan,
                'created_at' => $ngayThanhToan,
                'updated_at' => $ngayThanhToan,
            ];
        }

        // Chunk insert để tránh lỗi
        $chunks = array_chunk($transactions, 50);
        foreach ($chunks as $chunk) {
            DB::table('giao_dich')->insert($chunk);
        }

        // Seed 1 vài dữ liệu gói VIP
        $recentTransactions = DB::table('giao_dich')->where('loai_nguon_thu', 'goi_vip')->get();
        foreach ($recentTransactions as $trx) {
            $thoiHan = 30;
            if ($trx->so_tien == 250000) $thoiHan = 90;
            if ($trx->so_tien == 850000) $thoiHan = 365;

            $ngayKichHoat = Carbon::parse($trx->ngay_thanh_toan);
            $ngayHetHan = $ngayKichHoat->copy()->addDays($thoiHan);

            $vipHistories[] = [
                'nguoi_dung_id' => $trx->nguoi_dung_id,
                'goi_vip_id' => $trx->doi_tuong_id,
                'giao_dich_id' => $trx->id,
                'ngay_kich_hoat' => $ngayKichHoat,
                'ngay_het_han' => $ngayHetHan,
                'trang_thai' => $ngayHetHan->isFuture() ? 1 : 0,
                'created_at' => now(),
            ];
        }

        if (!empty($vipHistories)) {
            $chunksVip = array_chunk($vipHistories, 50);
            foreach ($chunksVip as $chunk) {
                DB::table('lich_su_goi_vip')->insert($chunk);
            }
        }
    }
}
