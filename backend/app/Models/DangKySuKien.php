<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DangKySuKien extends Model
{
    use HasFactory;

    protected $table = 'dang_ky_su_kien';
    
    // We only want created_at, no updated_at (as per migration timestamp('created_at')->useCurrent())
    public $timestamps = false; 

    protected $fillable = [
        'su_kien_id',
        'nguoi_dung_id',
        'ho_ten',
        'email_nhan_ve',
        'so_dien_thoai',
        'trang_thai',
        'giao_dich_id',
        'giai_thuong_nhan_duoc',
        'created_at'
    ];

    protected $casts = [
        'trang_thai' => 'integer',
        'created_at' => 'datetime'
    ];

    public function suKien()
    {
        return $this->belongsTo(SuKien::class, 'su_kien_id');
    }

    public function nguoiDung()
    {
        return $this->belongsTo(User::class, 'nguoi_dung_id');
    }
}
