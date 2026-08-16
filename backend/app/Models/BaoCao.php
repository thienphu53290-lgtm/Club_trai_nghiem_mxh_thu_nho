<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BaoCao extends Model
{
    protected $table = 'bao_cao';
    public $timestamps = false; // Bảng này chỉ có created_at, không có updated_at

    protected $fillable = [
        'nguoi_gui_id',
        'loai',
        'doi_tuong_id',
        'ly_do',
        'trang_thai',
        'created_at'
    ];

    public function nguoiGui()
    {
        return $this->belongsTo(User::class, 'nguoi_gui_id');
    }
}
