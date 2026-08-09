<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GoiDichVuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('goi_dich_vu')->insert([
            [
                'ten_goi' => 'Gói Starter',
                'mo_ta' => 'Miễn phí tạo sự kiện quy mô nhỏ dưới 20 người tham gia. Phù hợp cho workshop hoặc họp mặt nội bộ.',
                'so_luong_toi_da' => 20,
                'loai_phi' => 'free',
                'gia_tri' => 0,
                'trang_thai' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'ten_goi' => 'Gói Basic',
                'mo_ta' => 'Phí cố định 799k. Cho phép tổ chức sự kiện lên đến 100 người tham gia.',
                'so_luong_toi_da' => 100,
                'loai_phi' => 'flat',
                'gia_tri' => 799000,
                'trang_thai' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'ten_goi' => 'Gói Pro',
                'mo_ta' => 'Phí cố định 2,000,000đ. Cho phép tổ chức sự kiện quy mô vừa lên đến 300 người tham gia.',
                'so_luong_toi_da' => 300,
                'loai_phi' => 'flat',
                'gia_tri' => 2000000,
                'trang_thai' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'ten_goi' => 'Gói Enterprise',
                'mo_ta' => 'Sự kiện quy mô lớn không giới hạn người tham gia. Hệ thống sẽ thu phí 3% doanh thu trên mỗi vé bán ra. Vui lòng liên hệ Admin.',
                'so_luong_toi_da' => null, // Không giới hạn
                'loai_phi' => 'percent',
                'gia_tri' => 3, // 3%
                'trang_thai' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ]);
    }
}
