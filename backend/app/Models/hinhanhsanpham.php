<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class HinhAnhSanPham extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'hinh_anh_san_pham';

    protected $primaryKey = 'ma_hinh_anh';

    public $incrementing = true;

    protected $keyType = 'int';

    public $timestamps = true;

    const CREATED_AT = 'ngay_tao';
    const UPDATED_AT = 'ngay_cap_nhat';
    const DELETED_AT = 'ngay_xoa';

    protected $fillable = [
        'ma_san_pham',
        'duong_dan',
        'la_anh_dai_dien',
        'thu_tu_hien_thi',
    ];

    protected $casts = [
        'ma_san_pham' => 'integer',
        'la_anh_dai_dien' => 'boolean',
        'thu_tu_hien_thi' => 'integer',
        'ngay_tao' => 'datetime',
        'ngay_cap_nhat' => 'datetime',
        'ngay_xoa' => 'datetime',
    ];

    public function sanPham()
    {
        return $this->belongsTo(
            SanPham::class,
            'ma_san_pham',
            'ma_san_pham'
        );
    }
}