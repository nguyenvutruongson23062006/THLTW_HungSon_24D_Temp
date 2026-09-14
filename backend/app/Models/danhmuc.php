<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Danhmuc extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'danh_muc';

    protected $primaryKey = 'ma_danh_muc';

    public $incrementing = true;

    public $timestamps = true;

    const CREATED_AT = 'ngay_tao';
    const UPDATED_AT = 'ngay_cap_nhat';
    const DELETED_AT = 'ngay_xoa';

    protected $fillable = [
        'ten_danh_muc',
        'duong_dan',
        'ma_danh_muc_cha',
        'mo_ta',
        'anh_dai_dien',
        'trang_thai',
        'ngay_tao',
        'ngay_cap_nhat',
    ];

    protected $casts = [
        'ma_danh_muc_cha' => 'integer',
        'ngay_tao' => 'datetime',
        'ngay_cap_nhat' => 'datetime',
        'ngay_xoa' => 'datetime',
    ];

    public function parent()
    {
        return $this->belongsTo(Danhmuc::class, 'ma_danh_muc_cha', 'ma_danh_muc');
    }

    public function children()
    {
        return $this->hasMany(Danhmuc::class, 'ma_danh_muc_cha', 'ma_danh_muc');
    }

    public function sanPhams()
    {
        return $this->hasMany(SanPham::class, 'ma_danh_muc', 'ma_danh_muc');
    }
}
