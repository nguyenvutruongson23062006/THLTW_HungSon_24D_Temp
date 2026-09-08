<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class NguoiDungSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        DB::table('nguoi_dung')->insert([
            [
                'ma_nguoi_dung' => 1,
                'ho_ten' => 'Lê Minh An',
                'ten_dang_nhap' => 'admin',
                'dia_chi_email' => 'admin@motohub.vn',
                'anh_dai_dien' => '/images/users/admin.jpg',
                'so_dien_thoai' => '0909000001',
                'dia_chi' => '12 Nguyễn Huệ, Quận 1, TP.HCM',
                'mat_khau' => Hash::make('password'),
                'ma_nho_dang_nhap' => null,
                'ma_dat_lai_mat_khau' => null,
                'thoi_gian_dat_lai_mat_khau' => null,
                'thoi_gian_xac_thuc' => $now->copy()->subDays(30),
                'vai_tro' => 'quan_tri_vien',
                'trang_thai' => 'hoat_dong',
                'ngay_tao' => $now->copy()->subDays(30),
                'ngay_cap_nhat' => $now->copy()->subDays(2),
                'ngay_xoa' => null,
            ],
            [
                'ma_nguoi_dung' => 2,
                'ho_ten' => 'Trần Thu Hà',
                'ten_dang_nhap' => 'staff.ha',
                'dia_chi_email' => 'ha@motohub.vn',
                'anh_dai_dien' => '/images/users/staff-ha.jpg',
                'so_dien_thoai' => '0909000002',
                'dia_chi' => '45 Lý Tự Trọng, Quận 1, TP.HCM',
                'mat_khau' => Hash::make('password'),
                'ma_nho_dang_nhap' => null,
                'ma_dat_lai_mat_khau' => null,
                'thoi_gian_dat_lai_mat_khau' => null,
                'thoi_gian_xac_thuc' => $now->copy()->subDays(20),
                'vai_tro' => 'nhan_vien',
                'trang_thai' => 'hoat_dong',
                'ngay_tao' => $now->copy()->subDays(20),
                'ngay_cap_nhat' => $now->copy()->subDays(1),
                'ngay_xoa' => null,
            ],
            [
                'ma_nguoi_dung' => 3,
                'ho_ten' => 'Nguyễn Văn Sơn',
                'ten_dang_nhap' => 'son.nguyen',
                'dia_chi_email' => 'son@motohub.vn',
                'anh_dai_dien' => '/images/users/customer-son.jpg',
                'so_dien_thoai' => '0909000003',
                'dia_chi' => '88 Trần Hưng Đạo, Quận 5, TP.HCM',
                'mat_khau' => Hash::make('password'),
                'ma_nho_dang_nhap' => null,
                'ma_dat_lai_mat_khau' => null,
                'thoi_gian_dat_lai_mat_khau' => null,
                'thoi_gian_xac_thuc' => $now->copy()->subDays(10),
                'vai_tro' => 'thanh_vien',
                'trang_thai' => 'hoat_dong',
                'ngay_tao' => $now->copy()->subDays(10),
                'ngay_cap_nhat' => $now->copy()->subDay(),
                'ngay_xoa' => null,
            ],
        ]);
    }
}
