<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CaiDatThanhToanSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $cacKhoa = ['ngan_hang_bin', 'tai_khoan_nhan', 'chu_tai_khoan'];
            $cu = DB::table('cai_dat')->whereIn('khoa', $cacKhoa)->lockForUpdate()->pluck('gia_tri', 'khoa');

            // Giữ nguyên cả bộ tài khoản đã cấu hình để tránh ghép thông tin của hai người nhận.
            if ($cu->contains(fn ($giaTri) => trim((string) $giaTri) !== '')) {
                return;
            }

            foreach (['ngan_hang_bin' => '970415', 'tai_khoan_nhan' => '108883079477', 'chu_tai_khoan' => 'NGUYEN VU TRUONG SON'] as $khoa => $giaTri) {
                DB::table('cai_dat')->updateOrInsert(['khoa' => $khoa], ['gia_tri' => $giaTri, 'ngay_cap_nhat' => now()]);
            }
        });
    }
}
