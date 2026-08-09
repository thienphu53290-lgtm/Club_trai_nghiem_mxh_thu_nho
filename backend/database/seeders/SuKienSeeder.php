<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class SuKienSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = [
            [
                'tieu_de' => 'Offline Trải Nghiệm Công Nghệ 2026',
                'slug' => Str::slug('Offline Trải Nghiệm Công Nghệ 2026') . '-' . time(),
                'anh_bia' => 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
                'thu_vien_anh' => json_encode([
                    'https://images.unsplash.com/photo-1531297172867-4f4013645e5a?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop'
                ]),
                'mo_ta' => 'Tham gia cùng cộng đồng công nghệ để trải nghiệm những thiết bị mới nhất. Cơ hội bốc thăm trúng thưởng hấp dẫn!',
                'dia_diem' => 'TP. Hồ Chí Minh',
                'hinh_thuc' => 0, // 0: Offline
                'thoi_gian_bat_dau' => Carbon::now()->addDays(5)->setTime(8, 0),
                'thoi_gian_ket_thuc' => Carbon::now()->addDays(5)->setTime(12, 0),
                'so_luong_toi_da' => 120,
                'trang_thai' => 1, // Sắp diễn ra
                'gia_ve' => 250000, // Có phí
                'so_ve_mien_phi' => 0, // 0 vé Free -> Bắt buộc mua
                'giai_thuong' => 'Bàn phím cơ Keychron Q1, Tai nghe Sony WH-1000XM5',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'tieu_de' => 'Workshop: Tối ưu Setup Bàn Làm Việc',
                'slug' => Str::slug('Workshop: Tối ưu Setup Bàn Làm Việc') . '-' . time(),
                'anh_bia' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop',
                'thu_vien_anh' => json_encode([
                    'https://images.unsplash.com/photo-1497215848143-2287c2b64166?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop'
                ]),
                'mo_ta' => 'Khám phá cách setup không gian làm việc lý tưởng từ các chuyên gia.',
                'dia_diem' => 'https://meet.google.com',
                'hinh_thuc' => 1, // 1: Online
                'thoi_gian_bat_dau' => Carbon::now()->addDays(10)->setTime(14, 0),
                'thoi_gian_ket_thuc' => Carbon::now()->addDays(10)->setTime(17, 0),
                'so_luong_toi_da' => 50,
                'trang_thai' => 1, // Sắp diễn ra
                'gia_ve' => 0, // Miễn phí
                'so_ve_mien_phi' => 0,
                'giai_thuong' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'tieu_de' => 'Giao Lưu Cộng Đồng - Coffee Talk',
                'slug' => Str::slug('Giao Lưu Cộng Đồng - Coffee Talk') . '-' . time(),
                'anh_bia' => 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=800&auto=format&fit=crop',
                'thu_vien_anh' => json_encode([
                    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=800&auto=format&fit=crop'
                ]),
                'mo_ta' => 'Gặp gỡ, trò chuyện và thưởng thức specialty coffee cuối tuần.',
                'dia_diem' => 'Đà Nẵng',
                'hinh_thuc' => 0, // Offline
                'thoi_gian_bat_dau' => Carbon::now()->addDays(15)->setTime(9, 0),
                'thoi_gian_ket_thuc' => Carbon::now()->addDays(15)->setTime(11, 30),
                'so_luong_toi_da' => 80,
                'trang_thai' => 1, // Sắp diễn ra
                'gia_ve' => 0, // Miễn phí
                'so_ve_mien_phi' => 0,
                'giai_thuong' => null,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'tieu_de' => 'Triển lãm Công nghệ Audio Hi-End',
                'slug' => Str::slug('Triển lãm Công nghệ Audio Hi-End') . '-' . time(),
                'anh_bia' => 'https://images.unsplash.com/photo-1516280440502-8611598437a4?q=80&w=800&auto=format&fit=crop',
                'thu_vien_anh' => json_encode([
                    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1487180144340-edbfd811c79a?q=80&w=800&auto=format&fit=crop'
                ]),
                'mo_ta' => 'Trải nghiệm hệ thống âm thanh đỉnh cao.',
                'dia_diem' => 'Hà Nội',
                'hinh_thuc' => 0, // Offline
                'thoi_gian_bat_dau' => Carbon::now()->addDays(30)->setTime(9, 0),
                'thoi_gian_ket_thuc' => Carbon::now()->addDays(30)->setTime(18, 0),
                'so_luong_toi_da' => 300,
                'trang_thai' => 1, // Sắp diễn ra
                'gia_ve' => 500000, // Có phí
                'so_ve_mien_phi' => 5, // 5 vé free
                'giai_thuong' => 'Loa Bluetooth Marshall',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        ];

        DB::table('su_kien')->insert($events);
    }
}
