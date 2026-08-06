<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VaiTro extends Model
{
    use HasFactory;

    protected $table = 'vai_tro';

    protected $fillable = [
        'ten',
        'mo_ta',
        'trang_thai',
    ];

    public function nguoiDung()
    {
        return $this->hasMany(User::class, 'vai_tro_id');
    }
}
