<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CapBac extends Model
{
    use HasFactory;

    protected $table = 'cap_bac';

    protected $fillable = [
        'ten_cap_bac',
        'diem_toi_thieu',
        'diem_toi_da',
        'anh_cap_bac',
        'icon',
        'mau_sac',
        'mo_ta',
        'trang_thai'
    ];

    public function nguoiDung()
    {
        return $this->hasMany(User::class, 'cap_bac_id');
    }
}
