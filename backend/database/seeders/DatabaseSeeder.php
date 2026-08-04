<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\VaiTro;
use App\Models\CapBac;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $commonPassword = Hash::make('@Thienphu2005');

        $roleReader = VaiTro::firstOrCreate(
            ['id' => 1],
            ['ten' => 'Người Đọc', 'mo_ta' => 'Thành viên đọc bài, thưởng thức và thảo luận trải nghiệm', 'trang_thai' => 1]
        );

        $roleAdmin = VaiTro::firstOrCreate(
            ['id' => 2],
            ['ten' => 'Quản Trị Viên (Admin)', 'mo_ta' => 'Quản trị viên duyệt bài, quản lý thành viên và nội dung', 'trang_thai' => 1]
        );

        $roleSuperAdmin = VaiTro::firstOrCreate(
            ['id' => 3],
            ['ten' => 'Siêu Quản Trị (Super Admin)', 'mo_ta' => 'Chủ sở hữu hệ thống với đặc quyền toàn vẹn tối cao', 'trang_thai' => 1]
        );

        $ranks = [
            [
                'id' => 1,
                'ten_cap_bac' => '🥉 Đồng Tiên Phong',
                'diem_toi_thieu' => 0,
                'diem_toi_da' => 999,
                'anh_cap_bac' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80',
                'icon' => '🥉',
                'mau_sac' => 'text-amber-800 bg-amber-50 border-amber-300',
                'mo_ta' => 'Thành viên mới bắt đầu khám phá và chia sẻ trải nghiệm',
                'trang_thai' => 1,
            ],
            [
                'id' => 2,
                'ten_cap_bac' => '🥈 Bạc Đam Mê',
                'diem_toi_thieu' => 1000,
                'diem_toi_da' => 2499,
                'anh_cap_bac' => 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&auto=format&fit=crop&q=80',
                'icon' => '🥈',
                'mau_sac' => 'text-slate-700 bg-slate-100 border-slate-300',
                'mo_ta' => 'Thành viên tích cực thảo luận và đánh giá định kỳ',
                'trang_thai' => 1,
            ],
            [
                'id' => 3,
                'ten_cap_bac' => '🥇 Vàng Thượng Hạng',
                'diem_toi_thieu' => 2500,
                'diem_toi_da' => 3799,
                'anh_cap_bac' => 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&auto=format&fit=crop&q=80',
                'icon' => '🥇',
                'mau_sac' => 'text-amber-900 bg-amber-100/80 border-amber-400',
                'mo_ta' => 'Chuyên gia trải nghiệm với những bài review sâu sắc',
                'trang_thai' => 1,
            ],
            [
                'id' => 4,
                'ten_cap_bac' => '👑 Kim Cương VIP',
                'diem_toi_thieu' => 3800,
                'diem_toi_da' => 4999,
                'anh_cap_bac' => 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop&q=80',
                'icon' => '👑',
                'mau_sac' => 'text-indigo-950 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 border-indigo-300',
                'mo_ta' => 'Đại sứ thương hiệu và nhân vật ảnh hưởng vượt trội của Club',
                'trang_thai' => 1,
            ],
            [
                'id' => 5,
                'ten_cap_bac' => '🔥 Huyền Thoại Club',
                'diem_toi_thieu' => 5000,
                'diem_toi_da' => null,
                'anh_cap_bac' => 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=400&auto=format&fit=crop&q=80',
                'icon' => '🔥',
                'mau_sac' => 'text-rose-950 bg-gradient-to-r from-rose-200 via-amber-200 to-yellow-200 border-rose-400',
                'mo_ta' => 'Đỉnh cao tối thượng của cộng đồng trải nghiệm chuyên gia',
                'trang_thai' => 1,
            ]
        ];

        foreach ($ranks as $rank) {
            CapBac::firstOrCreate(['id' => $rank['id']], $rank);
        }

        $superAdmin = User::firstOrCreate(
            ['email' => 'superadmin@clubtrainghiem.com'],
            [
                'vai_tro_id' => $roleSuperAdmin->id,
                'mat_khau' => $commonPassword,
                'ho_ten' => 'Thành Long (Super Admin 👑)',
                'ten_hien_thi' => 'Long Founder 👑',
                'anh_dai_dien' => null,
                'anh_bia' => null,
                'tieu_su' => 'Kiến trúc sư nền tảng Club Trải Nghiệm & Mạng Xã Hội Đánh Giá Realtime. Luôn tò mò, đam mê khám phá giới hạn công nghệ, nghệ thuật thưởng ngoạn cà phê và những trải nghiệm sống thượng hạng.',
                'so_dien_thoai' => '0988.888.888',
                'ngay_sinh' => '2005-01-01',
                'gioi_tinh' => 1,
                'dia_chi' => 'Thành phố Hồ Chí Minh, Việt Nam',
                'facebook' => 'https://facebook.com/thanhlong.club',
                'instagram' => 'https://instagram.com/long.experience',
                'tiktok' => 'https://tiktok.com/@long.founder',
                'website' => 'https://clubtrainghiem.com',
                'huy_chuong_danh_hieu' => json_encode([
                    ['ten' => '👑 VIP Club Founder', 'mo_ta' => 'Người Sáng Lập Hệ Thống', 'mau_sc' => '#eab308'],
                    ['ten' => '☕ Chuyên Gia Cà Phê', 'mo_ta' => 'Đã review trên 50 không gian cà phê nghệ thuật', 'mau_sc' => '#8b5cf6'],
                    ['ten' => '🚀 Pioneer 2026', 'mo_ta' => 'Thành viên tiên phong phong cách sống mới', 'mau_sc' => '#3b82f6'],
                    ['ten' => '🔥 Realtime Master', 'mo_ta' => 'Kiểm soát kết nối WebSocket tốc độ cao', 'mau_sc' => '#ef4444']
                ], JSON_UNESCAPED_UNICODE),
                'diem_trai_nghiem' => 3850,
                'cap_bac' => '👑 Kim Cương VIP',
                'trang_thai' => 1,
                'lan_cuoi_dang_nhap' => now(),
            ]
        );

        $admins = [
            [
                'email' => 'admin1@clubtrainghiem.com',
                'ho_ten' => 'Quản Trị Viên 1 (Duyệt Bài)',
                'ten_hien_thi' => 'Admin Duyệt Bài 🛡️',
                'tieu_su' => 'Phụ trách duyệt các bài viết review trải nghiệm chất lượng cao.',
                'anh_dai_dien' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
                'diem_trai_nghiem' => 2450,
                'cap_bac' => 'Vàng Thượng Hạng'
            ],
            [
                'email' => 'admin2@clubtrainghiem.com',
                'ho_ten' => 'Quản Trị Viên 2 (Sự Kiện)',
                'ten_hien_thi' => 'Admin Sự Kiện 🎉',
                'tieu_su' => 'Điều phối viên tổ chức các event và buổi offline trải nghiệm.',
                'anh_dai_dien' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
                'diem_trai_nghiem' => 2100,
                'cap_bac' => 'Vàng Thượng Hạng'
            ],
            [
                'email' => 'admin3@clubtrainghiem.com',
                'ho_ten' => 'Quản Trị Viên 3 (Kiểm Duyệt)',
                'ten_hien_thi' => 'Admin Kiểm Duyệt ⚖️',
                'tieu_su' => 'Chuyên viên kiểm duyệt nội dung và hỗ trợ thành viên cộng đồng.',
                'anh_dai_dien' => 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80',
                'diem_trai_nghiem' => 1950,
                'cap_bac' => 'Bạc Tiên Phong'
            ],
        ];

        foreach ($admins as $admin) {
            User::firstOrCreate(
                ['email' => $admin['email']],
                [
                    'vai_tro_id' => $roleAdmin->id,
                    'mat_khau' => $commonPassword,
                    'ho_ten' => $admin['ho_ten'],
                    'ten_hien_thi' => $admin['ten_hien_thi'],
                    'tieu_su' => $admin['tieu_su'],
                    'anh_dai_dien' => $admin['anh_dai_dien'],
                    'huy_chuong_danh_hieu' => json_encode([
                        ['ten' => '🛡️ Quản Trị Viên', 'mo_ta' => 'Cán bộ quản trị cộng đồng', 'mau_sc' => '#3b82f6']
                    ], JSON_UNESCAPED_UNICODE),
                    'diem_trai_nghiem' => $admin['diem_trai_nghiem'],
                    'cap_bac' => $admin['cap_bac'],
                    'trang_thai' => 1,
                    'lan_cuoi_dang_nhap' => now(),
                ]
            );
        }

        $readers = [
            [
                'email' => 'nguoidoc1@gmail.com',
                'ho_ten' => 'Minh Anh (VIP Reader)',
                'ten_hien_thi' => 'Minh Anh ✨',
                'tieu_su' => 'Người yêu cầu tinh tế, đam mê khám phá không gian cà phê đẹp và thưởng ngoạn sách.',
                'anh_dai_dien' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
                'diem_trai_nghiem' => 1250,
                'cap_bac' => 'Bạc Tiên Phong'
            ],
            [
                'email' => 'nguoidoc2@gmail.com',
                'ho_ten' => 'Thanh Tùng (Coffee Reviewer)',
                'ten_hien_thi' => 'Tùng Coffee ☕',
                'tieu_su' => 'Thử thách mỗi tuần ghé thăm một quán cafe có góc làm việc yên tĩnh.',
                'anh_dai_dien' => 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
                'diem_trai_nghiem' => 980,
                'cap_bac' => 'Bạc Tiên Phong'
            ],
            [
                'email' => 'nguoidoc3@gmail.com',
                'ho_ten' => 'Bích Phương (Tech Explorer)',
                'ten_hien_thi' => 'Phương Tech 💻',
                'tieu_su' => 'Thích đọc review công nghệ và trải nghiệm gadgets thông minh cho setup làm việc.',
                'anh_dai_dien' => 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
                'diem_trai_nghiem' => 840,
                'cap_bac' => 'Đồng Tiên Phong'
            ],
            [
                'email' => 'nguoidoc4@gmail.com',
                'ho_ten' => 'Quang Hiếu (Event Seeker)',
                'ten_hien_thi' => 'Hiếu Travel ✈️',
                'tieu_su' => 'Luôn tìm kiếm các sự kiện trải nghiệm cuối tuần và các chuyến hành trình mạo hiểm.',
                'anh_dai_dien' => 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
                'diem_trai_nghiem' => 760,
                'cap_bac' => 'Đồng Tiên Phong'
            ],
        ];

        $readerUsers = [];
        foreach ($readers as $reader) {
            $readerUsers[] = User::firstOrCreate(
                ['email' => $reader['email']],
                [
                    'vai_tro_id' => $roleReader->id,
                    'mat_khau' => $commonPassword,
                    'ho_ten' => $reader['ho_ten'],
                    'ten_hien_thi' => $reader['ten_hien_thi'],
                    'tieu_su' => $reader['tieu_su'],
                    'anh_dai_dien' => $reader['anh_dai_dien'],
                    'huy_chuong_danh_hieu' => json_encode([
                        ['ten' => '🌟 Thành Viên Tích Cực', 'mo_ta' => 'Thành viên chia sẻ đam mê', 'mau_sc' => '#10b981']
                    ], JSON_UNESCAPED_UNICODE),
                    'diem_trai_nghiem' => $reader['diem_trai_nghiem'],
                    'cap_bac' => $reader['cap_bac'],
                    'trang_thai' => 1,
                    'lan_cuoi_dang_nhap' => now(),
                ]
            );
        }

        User::all()->each(function ($u) {
            $u->updateCapBac();
        });

        DB::table('danh_muc')->insertOrIgnore([
            ['id' => 1, 'loai_danh_muc' => 'bai_viet', 'ten' => 'Review Quán Cà Phê', 'slug' => 'review-quan-ca-phe', 'mo_ta' => 'Những không gian cafe thư giãn và độc đáo nhất', 'thu_tu' => 1, 'trang_thai' => 1],
            ['id' => 2, 'loai_danh_muc' => 'bai_viet', 'ten' => 'Trải Nghiệm Công Nghệ', 'slug' => 'trai-nghiem-cong-nghe', 'mo_ta' => 'Đánh giá các thiết bị số và giải pháp sáng tạo', 'thu_tu' => 2, 'trang_thai' => 1],
            ['id' => 3, 'loai_danh_muc' => 'san_pham', 'ten' => 'Góc Setup & Gadget', 'slug' => 'goc-setup-gadget', 'mo_ta' => 'Các món đồ công nghệ đáng trải nghiệm', 'thu_tu' => 1, 'trang_thai' => 1],
        ]);

        foreach ($readerUsers as $ru) {
            DB::table('theo_doi')->insertOrIgnore([
                'nguoi_theo_doi_id' => $ru->id,
                'nguoi_duoc_theo_doi_id' => $superAdmin->id,
                'trang_thai' => 1,
                'created_at' => now()
            ]);
        }

        DB::table('bai_viet')->insertOrIgnore([
            [
                'id' => 1,
                'nguoi_dung_id' => $superAdmin->id,
                'danh_muc_id' => 1,
                'loai_bai_viet' => 'review',
                'tieu_de' => 'Chào mừng đến với Club Trải Nghiệm 2026 - Nơi Kết Nối Những Tâm Hồn Tự Do! ✨',
                'slug' => 'chao-mung-den-voi-club-trai-nghiem-2026',
                'noi_dung' => "Xin chào toàn thể anh em bạn bè đã đặt chân đến với Club Trải Nghiệm!\n\nTụi mình tạo ra mạng xã hội này với mục tiêu tôn vinh những góc nhìn sắc sảo nhất về Cà Phê, Công Nghệ và Nghệ Thuật Sống. Đừng quên thử tính năng thông báo Realtime chớp nhoáng của Club nhé! Chúc cả nhà có những phút giây review tuyệt hảo!",
                'anh_bia' => 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=80',
                'hashtags' => json_encode(['#ClubTraiNghiem', '#Realtime2026', '#Welcome'], JSON_UNESCAPED_UNICODE),
                'luot_xem' => 1250,
                'ghim' => 1,
                'trang_thai' => 1,
                'created_at' => now()->subDays(2),
            ],
            [
                'id' => 2,
                'nguoi_dung_id' => $superAdmin->id,
                'danh_muc_id' => 1,
                'loai_bai_viet' => 'check_in',
                'tieu_de' => 'Trải Nghiệm Không Gian Specialty Coffee Ấn Tượng Ngay Trong Lòng Sài Gòn ☕📍',
                'slug' => 'trai-nghiem-khong-gian-specialty-coffee-an-tuong',
                'noi_dung' => "Sáng nay ghé thử một giang quán nằm ẩn mình trên tầng 3 chung cư cũ. Mùi thơm của cà phê Ethiopia pha pour-over hòa quện với tiếng nhạc lofi êm êm thật sự là điểm tựa hoàn hảo cho một ngày code năng suất!",
                'anh_bia' => 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&auto=format&fit=crop&q=80',
                'hashtags' => json_encode(['#SpecialtyCoffee', '#SaiGonChill', '#PourOver'], JSON_UNESCAPED_UNICODE),
                'luot_xem' => 680,
                'ghim' => 0,
                'trang_thai' => 1,
                'created_at' => now()->subDay(),
            ],
            [
                'id' => 3,
                'nguoi_dung_id' => $superAdmin->id,
                'danh_muc_id' => 2,
                'loai_bai_viet' => 'review',
                'tieu_de' => 'Đánh giá chi tiết bộ Setup Bàn Làm Việc Tối Giản & Sức Mạnh Màn Hình 4K 💻🔥',
                'slug' => 'danh-gia-chi-tiet-bo-setup-ban-lam-viec-toi-gian',
                'noi_dung' => "Để duy trì độ tập trung khi viết từng chuỗi code kiến trúc vi mô, sự tĩnh lặng và hệ thống ánh sáng bàn làm việc đóng vai trò số 1. Trong bài review này, hãy cùng mình lướt qua chi tiết từng phụ kiện mà mình đang tâm đắc nhất nhé!",
                'anh_bia' => 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
                'hashtags' => json_encode(['#DeskSetup2026', '#Minimalism', '#TechLife'], JSON_UNESCAPED_UNICODE),
                'luot_xem' => 940,
                'ghim' => 0,
                'trang_thai' => 1,
                'created_at' => now(),
            ],
        ]);

        DB::table('san_pham')->insertOrIgnore([
            [
                'id' => 1,
                'danh_muc_id' => 3,
                'ten' => 'Bàn phím cơ không dây Custom 75% cho không gian làm việc tĩnh lặng',
                'slug' => 'ban-phim-co-khong-day-custom-75',
                'mo_ta' => 'Trang bị switch Silent Red siêu êm ái cùng khung nhôm nguyên khối, phù hợp làm việc đêm khuya và văn phòng.',
                'anh_dai_dien' => 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
                'gia_tham_khao' => 2850000.00,
                'luot_xem' => 420,
                'trang_thai' => 1,
                'created_at' => now()->subDays(5)
            ],
            [
                'id' => 2,
                'danh_muc_id' => 3,
                'ten' => 'Máy pha cà phê Espresso cầm tay Flair Pro 2 cho hành trình cắm trại',
                'slug' => 'may-pha-ca-phe-espresso-cam-tay-flair-pro-2',
                'mo_ta' => 'Thiết kế cơ khí không dùng điện lực ném 9 bar cho ra ly cafe chuẩn nhà hát ở bất kỳ đỉnh núi hay quán cafe nào.',
                'anh_dai_dien' => 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80',
                'gia_tham_khao' => 6900000.00,
                'luot_xem' => 510,
                'trang_thai' => 1,
                'created_at' => now()->subDays(3)
            ]
        ]);

        DB::table('da_luu')->insertOrIgnore([
            [
                'nguoi_dung_id' => $superAdmin->id,
                'ten_bo_suu_tap' => '☕ Top Quán Cà Phê & Dụng Cụ Pha Chế',
                'loai' => 'post',
                'doi_tuong_id' => 2,
                'created_at' => now()->subHours(10)
            ],
            [
                'nguoi_dung_id' => $superAdmin->id,
                'ten_bo_suu_tap' => '☕ Top Quán Cà Phê & Dụng Cụ Pha Chế',
                'loai' => 'product',
                'doi_tuong_id' => 2,
                'created_at' => now()->subHours(9)
            ],
            [
                'nguoi_dung_id' => $superAdmin->id,
                'ten_bo_suu_tap' => '💻 Setup Bàn Làm Việc Tối Giản Năng Suất 2026',
                'loai' => 'post',
                'doi_tuong_id' => 3,
                'created_at' => now()->subHours(6)
            ],
            [
                'nguoi_dung_id' => $superAdmin->id,
                'ten_bo_suu_tap' => '💻 Setup Bàn Làm Việc Tối Giản Năng Suất 2026',
                'loai' => 'product',
                'doi_tuong_id' => 1,
                'created_at' => now()->subHours(5)
            ],
        ]);

        DB::table('su_kien')->insertOrIgnore([
            [
                'id' => 1,
                'tieu_de' => 'Workshop: Nghệ thuật Review Cà Phê & Công Nghệ Realtime 2026',
                'slug' => 'workshop-nghe-thuat-review-ca-phe-va-realtime-2026',
                'anh_bia' => 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1000&auto=format&fit=crop&q=80',
                'mo_ta' => 'Giao lưu kiến trúc mạng xã hội tốc độ cao và trải nghiệm cà phê trực tiếp cùng founder.',
                'dia_diem' => 'Club Trải Nghiệm Lounge, Quận 1, TP. HCM',
                'thoi_gian_bat_dau' => '2026-08-25 09:00:00',
                'thoi_gian_ket_thuc' => '2026-08-25 12:00:00',
                'so_luong_toi_da' => 50,
                'trang_thai' => 1,
                'created_at' => now()
            ],
            [
                'id' => 2,
                'tieu_de' => 'Offline Club Trải Nghiệm & Thưởng ngoạn Âm thanh Hi-Fi Thượng Hạng',
                'slug' => 'offline-club-trai-nghiem-am-thanh-hi-fi',
                'anh_bia' => 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&auto=format&fit=crop&q=80',
                'mo_ta' => 'Buổi trà chiều thẩm âm loa màng kim cương và kết nối các nhà sáng tạo nội dung.',
                'dia_diem' => 'Hi-Fi Cafe & Audio Studio, Thảo Điền, TP. HCM',
                'thoi_gian_bat_dau' => '2026-09-05 14:00:00',
                'thoi_gian_ket_thuc' => '2026-09-05 17:00:00',
                'so_luong_toi_da' => 30,
                'trang_thai' => 1,
                'created_at' => now()
            ],
        ]);

        DB::table('dang_ky_su_kien')->insertOrIgnore([
            [
                'su_kien_id' => 1,
                'nguoi_dung_id' => $superAdmin->id,
                'ho_ten' => 'Thành Long (Super Admin)',
                'so_dien_thoai' => '0988.888.888',
                'trang_thai' => 1,
                'created_at' => now()->subDays(1)
            ],
            [
                'su_kien_id' => 2,
                'nguoi_dung_id' => $superAdmin->id,
                'ho_ten' => 'Thành Long (Super Admin)',
                'so_dien_thoai' => '0988.888.888',
                'trang_thai' => 1,
                'created_at' => now()
            ]
        ]);

        foreach ($readerUsers as $idx => $readerUser) {
            DB::table('cam_xuc')->insertOrIgnore([
                'bai_viet_id' => 1,
                'nguoi_dung_id' => $readerUser->id,
                'loai' => 'like',
                'created_at' => now()
            ]);

            DB::table('binh_luan')->insertOrIgnore([
                'bai_viet_id' => 1,
                'nguoi_dung_id' => $readerUser->id,
                'parent_id' => null,
                'noi_dung' => 'Chúc mừng Club Trải Nghiệm chính thức bùng nổ! Giao diện quá đỉnh cao ạ 🔥✨',
                'trang_thai' => 1,
                'created_at' => now()
            ]);
        }
    }
}
