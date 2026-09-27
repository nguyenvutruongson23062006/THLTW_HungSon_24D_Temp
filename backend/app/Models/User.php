<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    /**
     * Tên bảng
     */
    protected $table = 'nguoi_dung';

    /**
     * Khóa chính
     */
    protected $primaryKey = 'ma_nguoi_dung';

    /**
     * Khóa chính tự tăng
     */
    public $incrementing = true;

    /**
     * Kiểu dữ liệu khóa chính
     */
    protected $keyType = 'int';

    /**
     * Tên cột thời gian
     */
    public const CREATED_AT = 'ngay_tao';
    public const UPDATED_AT = 'ngay_cap_nhat';
    public const DELETED_AT = 'ngay_xoa';
    /**
     * Các trường được phép gán hàng loạt
     */
    protected $fillable = [
        'ho_ten',
        'ten_dang_nhap',
        'dia_chi_email',
        'anh_dai_dien',
        'so_dien_thoai',
        'dia_chi',
        'mat_khau',
        'ma_nho_dang_nhap',
        'ma_dat_lai_mat_khau',
        'thoi_gian_dat_lai_mat_khau',
        'thoi_gian_xac_thuc',
        'vai_tro',
        'trang_thai',
    ];

    /**
     * Các trường không được trả về khi serialize
     */
    protected $hidden = [
        'mat_khau',
        'ma_nho_dang_nhap',
        'ma_dat_lai_mat_khau',
    ];

    /**
     * Kiểu dữ liệu
     */
    protected function casts(): array
    {
        return [
            'mat_khau' => 'hashed',
            'thoi_gian_dat_lai_mat_khau' => 'datetime',
            'thoi_gian_xac_thuc' => 'datetime',
            'ngay_tao' => 'datetime',
            'ngay_cap_nhat' => 'datetime',
            'ngay_xoa' => 'datetime',
        ];
    }

    /**
     * Tên cột mật khẩu dùng cho Authentication
     */
    public function getAuthPasswordName()
    {
        return 'mat_khau';
    }

    /**
     * Giá trị mật khẩu dùng cho Authentication
     */
    public function getAuthPassword()
    {
        return $this->mat_khau;
    }

    /**
     * Tên cột remember token
     */
    public function getRememberTokenName()
    {
        return 'ma_nho_dang_nhap';
    }
}