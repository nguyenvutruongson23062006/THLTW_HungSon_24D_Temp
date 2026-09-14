<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SanPham extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'san_pham';

    protected $primaryKey = 'ma_san_pham';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = true;

    const CREATED_AT = 'ngay_tao';
    const UPDATED_AT = 'ngay_cap_nhat';
    const DELETED_AT = 'ngay_xoa';

    protected $fillable = [
        'ten_san_pham',
        'ma_danh_muc',
        'ma_thuong_hieu',
        'duong_dan',
        'gia_ban',
        'gia_khuyen_mai',
        'so_luong_ton',
        'dung_tich_dong_co',
        'nam_san_xuat',
        'mau_sac',
        'anh_dai_dien',
        'mo_ta',
        'trang_thai',
        'luot_xem',
    ];

    protected $casts = [
        'gia_ban' => 'decimal:2',
        'gia_khuyen_mai' => 'decimal:2',
        'so_luong_ton' => 'integer',
        'dung_tich_dong_co' => 'integer',
        'nam_san_xuat' => 'integer',
        'luot_xem' => 'integer',
        'ngay_tao' => 'datetime',
        'ngay_cap_nhat' => 'datetime',
        'ngay_xoa' => 'datetime',
    ];

    public function danhMuc()
    {
        return $this->belongsTo(
            Danhmuc::class, 'ma_danh_muc', 'ma_danh_muc'
        );
    }
    public function hinhAnhSanPhams()
    {
        return $this->hasMany(
            HinhAnhSanPham::class, 'ma_san_pham', 'ma_san_pham'
        );
    }
    public function thuongHieu()
    {
        return $this->belongsTo(
            ThuongHieu::class, 'ma_thuong_hieu', 'ma_thuong_hieu'
        );
    }
}