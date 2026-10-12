<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class ChiTietDonHang extends Model
{
    use SoftDeletes;

    protected $table = 'chi_tiet_don_hang';

    protected $primaryKey = 'ma_chi_tiet_don_hang';

    public const CREATED_AT = 'ngay_tao';
    public const UPDATED_AT = 'ngay_cap_nhat';
    public const DELETED_AT = 'ngay_xoa';

    protected $fillable = [
        'ma_don_hang',
        'ma_san_pham',
        'ten_san_pham',
        'so_luong',
        'don_gia',
        'thanh_tien',
    ];

    protected function casts(): array
    {
        return [
            'ma_don_hang' => 'integer',
            'ma_san_pham' => 'integer',
            'so_luong' => 'integer',
            'don_gia' => 'decimal:2',
            'thanh_tien' => 'decimal:2',
            'ngay_tao' => 'datetime',
            'ngay_cap_nhat' => 'datetime',
            'ngay_xoa' => 'datetime',
        ];
    }

    public function donHang(): BelongsTo
    {
        return $this->belongsTo(
            DonHang::class,
            'ma_don_hang',
            'ma_don_hang'
        );
    }

    public function sanPham(): BelongsTo
    {
        return $this->belongsTo(
            SanPham::class,
            'ma_san_pham',
            'ma_san_pham'
        );
    }
}