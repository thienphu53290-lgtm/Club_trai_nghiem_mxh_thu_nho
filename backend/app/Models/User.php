<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'nguoi_dung';

    protected $fillable = [
        'vai_tro_id',
        'email',
        'mat_khau',
        'ho_ten',
        'ten_hien_thi',
        'anh_dai_dien',
        'anh_bia',
        'tieu_su',
        'so_dien_thoai',
        'ngay_sinh',
        'gioi_tinh',
        'dia_chi',
        'facebook',
        'instagram',
        'tiktok',
        'website',
        'huy_chuong_danh_hieu',
        'diem_trai_nghiem',
        'cap_bac_id',
        'cap_bac',
        'trang_thai',
        'lan_cuoi_dang_nhap',
        'lan_cuoi_hoat_dong',
        'is_onboarded',
        'onboarding_data',
    ];

    protected $hidden = [
        'mat_khau',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'lan_cuoi_dang_nhap' => 'datetime',
            'lan_cuoi_hoat_dong' => 'datetime',
            'mat_khau' => 'hashed',
            'huy_chuong_danh_hieu' => 'array',
            'is_onboarded' => 'boolean',
            'onboarding_data' => 'array',
        ];
    }

    public function getAuthPasswordName(): string
    {
        return 'mat_khau';
    }

    public function getAuthPassword()
    {
        return $this->mat_khau;
    }

    public function vaiTro()
    {
        return $this->belongsTo(VaiTro::class, 'vai_tro_id');
    }

    public function capBacInfo()
    {
        return $this->belongsTo(CapBac::class, 'cap_bac_id');
    }

    public function updateCapBac()
    {
        $capBac = CapBac::where('diem_toi_thieu', '<=', $this->diem_trai_nghiem)
            ->where('trang_thai', 1)
            ->orderBy('diem_toi_thieu', 'desc')
            ->first();

        if ($capBac && ($this->cap_bac_id != $capBac->id || $this->cap_bac != $capBac->ten_cap_bac)) {
            $this->cap_bac_id = $capBac->id;
            $this->cap_bac = $capBac->ten_cap_bac;
            $this->saveQuietly();
        }
    }
}
