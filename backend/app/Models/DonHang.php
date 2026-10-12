<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DonHang extends Model
{
    use SoftDeletes;

    protected $table = 'don_hang';

    protected $primaryKey = 'ma_don_hang';

    public const CREATED_AT = 'ngay_tao';
    public const UPDATED_AT = 'ngay_cap_nhat';
    public const DELETED_AT = 'ngay_xoa';

    protected $fillable = [
        'ma_nguoi_dung',
        'ho_ten',
        'dia_chi_email',
        'so_dien_thoai',
        'dia_chi_giao_hang',
        'phuong_thuc_thanh_toan',
        'ma_giao_dich',
        'ghi_chu',
        'tam_tinh',
        'giam_gia',
        'tong_tien',
        'trang_thai',
        'trang_thai_thanh_toan',
    ];

    protected function casts(): array
    {
        return [
            'ma_nguoi_dung' => 'integer',
            'tam_tinh' => 'decimal:2',
            'giam_gia' => 'decimal:2',
            'tong_tien' => 'decimal:2',
            'ngay_tao' => 'datetime',
            'ngay_cap_nhat' => 'datetime',
            'ngay_xoa' => 'datetime',
        ];
    }

    public function nguoiDung(): BelongsTo
    {
        return $this->belongsTo(
            User::class,
            'ma_nguoi_dung',
            'ma_nguoi_dung'
        );
    }

    public function chiTietDonHangs(): HasMany
    {
        return $this->hasMany(
            ChiTietDonHang::class,
            'ma_don_hang',
            'ma_don_hang'
        );
    }
}