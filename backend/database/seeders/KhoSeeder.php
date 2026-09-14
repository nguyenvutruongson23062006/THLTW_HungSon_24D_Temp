<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KhoSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        DB::table('phieu_nhap')->insert([
            [
                'ma_phieu_nhap' => 1,
                'ma_nguoi_dung' => 1,
                'so_phieu_nhap' => 'PN-MOTO-2026-0908-001',
                'nha_cung_cap' => 'Công ty Honda Việt Nam',
                'ghi_chu' => 'Nhập xe tay ga và xe số cho đợt bán đầu tháng 9.',
                'tong_tien' => 705000000.00,
                'trang_thai' => 'hoan_tat',
                'ngay_tao' => $now->copy()->subDays(4),
                'ngay_cap_nhat' => $now->copy()->subDays(4),
                'ngay_xoa' => null,
            ],
            [
                'ma_phieu_nhap' => 2,
                'ma_nguoi_dung' => 2,
                'so_phieu_nhap' => 'PN-MOTO-2026-0908-002',
                'nha_cung_cap' => 'Tổng kho xe máy Sài Gòn',
                'ghi_chu' => 'Bổ sung xe côn tay, xe tay ga và phụ kiện touring.',
                'tong_tien' => 1102000000.00,
                'trang_thai' => 'hoan_tat',
                'ngay_tao' => $now->copy()->subDays(3),
                'ngay_cap_nhat' => $now->copy()->subDays(3),
                'ngay_xoa' => null,
            ],
        ]);

        DB::table('chi_tiet_phieu_nhap')->insert([
            [
                'ma_chi_tiet_phieu_nhap' => 1,
                'ma_phieu_nhap' => 1,
                'ma_san_pham' => 1,
                'so_luong' => 5,
                'don_gia' => 51000000.00,
                'thanh_tien' => 255000000.00,
                'ngay_tao' => $now->copy()->subDays(4),
                'ngay_cap_nhat' => $now->copy()->subDays(4),
                'ngay_xoa' => null,
            ],
            [
                'ma_chi_tiet_phieu_nhap' => 2,
                'ma_phieu_nhap' => 1,
                'ma_san_pham' => 3,
                'so_luong' => 30,
                'don_gia' => 15000000.00,
                'thanh_tien' => 450000000.00,
                'ngay_tao' => $now->copy()->subDays(4),
                'ngay_cap_nhat' => $now->copy()->subDays(4),
                'ngay_xoa' => null,
            ],
            [
                'ma_chi_tiet_phieu_nhap' => 3,
                'ma_phieu_nhap' => 2,
                'ma_san_pham' => 2,
                'so_luong' => 8,
                'don_gia' => 47000000.00,
                'thanh_tien' => 376000000.00,
                'ngay_tao' => $now->copy()->subDays(3),
                'ngay_cap_nhat' => $now->copy()->subDays(3),
                'ngay_xoa' => null,
            ],
            [
                'ma_chi_tiet_phieu_nhap' => 4,
                'ma_phieu_nhap' => 2,
                'ma_san_pham' => 4,
                'so_luong' => 10,
                'don_gia' => 41000000.00,
                'thanh_tien' => 410000000.00,
                'ngay_tao' => $now->copy()->subDays(3),
                'ngay_cap_nhat' => $now->copy()->subDays(3),
                'ngay_xoa' => null,
            ],
            [
                'ma_chi_tiet_phieu_nhap' => 5,
                'ma_phieu_nhap' => 2,
                'ma_san_pham' => 6,
                'so_luong' => 4,
                'don_gia' => 53000000.00,
                'thanh_tien' => 212000000.00,
                'ngay_tao' => $now->copy()->subDays(3),
                'ngay_cap_nhat' => $now->copy()->subDays(3),
                'ngay_xoa' => null,
            ],
            [
                'ma_chi_tiet_phieu_nhap' => 6,
                'ma_phieu_nhap' => 2,
                'ma_san_pham' => 7,
                'so_luong' => 40,
                'don_gia' => 2100000.00,
                'thanh_tien' => 84000000.00,
                'ngay_tao' => $now->copy()->subDays(3),
                'ngay_cap_nhat' => $now->copy()->subDays(3),
                'ngay_xoa' => null,
            ],
            [
                'ma_chi_tiet_phieu_nhap' => 7,
                'ma_phieu_nhap' => 2,
                'ma_san_pham' => 10,
                'so_luong' => 20,
                'don_gia' => 1000000.00,
                'thanh_tien' => 20000000.00,
                'ngay_tao' => $now->copy()->subDays(3),
                'ngay_cap_nhat' => $now->copy()->subDays(3),
                'ngay_xoa' => null,
            ],
        ]);

        DB::table('phieu_xuat')->insert([
            [
                'ma_phieu_xuat' => 1,
                'ma_nguoi_dung' => 2,
                'so_phieu_xuat' => 'PX-MOTO-2026-0908-001',
                'ly_do_xuat' => 'ban_hang',
                'ghi_chu' => 'Xuất xe giao khách trong ngày.',
                'trang_thai' => 'hoan_tat',
                'ngay_tao' => $now->copy()->subDay(),
                'ngay_cap_nhat' => $now->copy()->subDay(),
                'ngay_xoa' => null,
            ],
            [
                'ma_phieu_xuat' => 2,
                'ma_nguoi_dung' => 1,
                'so_phieu_xuat' => 'PX-MOTO-2026-0908-002',
                'ly_do_xuat' => 'trung_bay',
                'ghi_chu' => 'Trưng bày showroom và xe lái thử cuối tuần.',
                'trang_thai' => 'hoan_tat',
                'ngay_tao' => $now->copy()->subHours(20),
                'ngay_cap_nhat' => $now->copy()->subHours(20),
                'ngay_xoa' => null,
            ],
        ]);

        DB::table('chi_tiet_phieu_xuat')->insert([
            [
                'ma_chi_tiet_phieu_xuat' => 1,
                'ma_phieu_xuat' => 1,
                'ma_san_pham' => 1,
                'so_luong' => 2,
                'ghi_chu' => 'Xuất phục vụ đơn đặt cọc.',
                'ngay_tao' => $now->copy()->subDay(),
                'ngay_cap_nhat' => $now->copy()->subDay(),
                'ngay_xoa' => null,
            ],
            [
                'ma_chi_tiet_phieu_xuat' => 2,
                'ma_phieu_xuat' => 1,
                'ma_san_pham' => 3,
                'so_luong' => 4,
                'ghi_chu' => 'Xuất giao khách mua xe số.',
                'ngay_tao' => $now->copy()->subDay(),
                'ngay_cap_nhat' => $now->copy()->subDay(),
                'ngay_xoa' => null,
            ],
            [
                'ma_chi_tiet_phieu_xuat' => 3,
                'ma_phieu_xuat' => 1,
                'ma_san_pham' => 7,
                'so_luong' => 8,
                'ghi_chu' => 'Xuất mũ bảo hiểm kèm xe.',
                'ngay_tao' => $now->copy()->subDay(),
                'ngay_cap_nhat' => $now->copy()->subDay(),
                'ngay_xoa' => null,
            ],
            [
                'ma_chi_tiet_phieu_xuat' => 4,
                'ma_phieu_xuat' => 2,
                'ma_san_pham' => 5,
                'so_luong' => 1,
                'ghi_chu' => 'Xe trưng bày khu mô tô PKL.',
                'ngay_tao' => $now->copy()->subHours(20),
                'ngay_cap_nhat' => $now->copy()->subHours(20),
                'ngay_xoa' => null,
            ],
            [
                'ma_chi_tiet_phieu_xuat' => 5,
                'ma_phieu_xuat' => 2,
                'ma_san_pham' => 9,
                'so_luong' => 2,
                'ghi_chu' => 'Thùng xe cho chương trình tour.',
                'ngay_tao' => $now->copy()->subHours(20),
                'ngay_cap_nhat' => $now->copy()->subHours(20),
                'ngay_xoa' => null,
            ],
            [
                'ma_chi_tiet_phieu_xuat' => 6,
                'ma_phieu_xuat' => 2,
                'ma_san_pham' => 10,
                'so_luong' => 2,
                'ghi_chu' => 'Kính chắn gió cho xe lái thử.',
                'ngay_tao' => $now->copy()->subHours(20),
                'ngay_cap_nhat' => $now->copy()->subHours(20),
                'ngay_xoa' => null,
            ],
            [
                'ma_chi_tiet_phieu_xuat' => 7,
                'ma_phieu_xuat' => 2,
                'ma_san_pham' => 8,
                'so_luong' => 10,
                'ghi_chu' => 'Dùng cho quà tặng và khuyến mãi dịch vụ.',
                'ngay_tao' => $now->copy()->subHours(20),
                'ngay_cap_nhat' => $now->copy()->subHours(20),
                'ngay_xoa' => null,
            ],
        ]);
    }
}
