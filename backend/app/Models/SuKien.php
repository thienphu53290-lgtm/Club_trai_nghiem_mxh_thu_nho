<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuKien extends Model
{
    use HasFactory;

    protected $table = 'su_kien';

    protected $fillable = [
        'tieu_de',
        'slug',
        'anh_bia',
        'mo_ta',
        'dia_diem',
        'hinh_thuc',
        'thoi_gian_bat_dau',
        'thoi_gian_ket_thuc',
        'so_luong_toi_da',
        'trang_thai',
        'gia_ve',
        'so_ve_mien_phi',
        'giai_thuong',
        'thu_vien_anh'
    ];

    protected $casts = [
        'thoi_gian_bat_dau' => 'datetime',
        'thoi_gian_ket_thuc' => 'datetime',
        'hinh_thuc' => 'integer',
        'trang_thai' => 'integer',
        'gia_ve' => 'decimal:2',
        'so_ve_mien_phi' => 'integer',
        'so_luong_toi_da' => 'integer',
        'thu_vien_anh' => 'array',
    ];

    public function dangKySuKien()
    {
        return $this->hasMany(DangKySuKien::class, 'su_kien_id');
    }
}
