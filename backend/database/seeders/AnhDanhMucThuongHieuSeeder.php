<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnhDanhMucThuongHieuSeeder extends Seeder
{
    public function run(): void
    {
        $danhMuc = [
            'Xe tay ga' => 'shmode-white.jpg', 'Xe số' => 'wave-white.jpg',
            'Xe côn tay' => 'Exciter-155-VVA-GP-ABS_005.webp',
            'Mô tô phân khối lớn' => 'ninja500-green.png', 'Mũ bảo hiểm' => 'FF800-white.jpg',
            'Dầu nhớt' => 'MOTUL 5100 4T 10W40.webp', 'Phụ kiện touring' => 'b32nnew-3583.jpg',
            'Phụ tùng' => 'givi-airflow-moto-descr.png', 'Thùng xe' => 'b32nnew-3583.jpg',
            'Kính chắn gió' => 'givi-airflow-moto-descr.png',
        ];
        $hang = ['Honda', 'Yamaha', 'Suzuki', 'Kawasaki', 'Piaggio', 'LS2', 'Motul', 'Givi', 'Triumph'];
        DB::transaction(function () use ($danhMuc, $hang) {
            foreach ($danhMuc as $ten => $file) $this->gan('danh_muc', 'ten_danh_muc', $ten, 'anh_dai_dien', '/products/'.$file);
            foreach ($hang as $ten) $this->gan('thuong_hieu', 'ten_thuong_hieu', $ten, 'logo', '/images/brands/'.strtolower($ten).'.svg');
        });
    }

    private function gan(string $bang, string $cotTen, string $ten, string $cotAnh, string $duongDan): void
    {
        if (! is_file(base_path('../frontend/public'.$duongDan))) throw new \RuntimeException('Thiếu ảnh: '.$duongDan);
        $dong = DB::table($bang)->where($cotTen, $ten)->lockForUpdate()->first();
        if (! $dong) return;
        $cu = $dong->$cotAnh;
        // Chỉ bổ sung ảnh trống hoặc placeholder thiếu file; giữ ảnh riêng đã được tải lên.
        if ($cu && (str_starts_with($cu, '/storage/') || preg_match('#^https?://#', $cu) || is_file(base_path('../frontend/public'.$cu)))) return;
        DB::table($bang)->where($cotTen, $ten)->update([$cotAnh => $duongDan, 'ngay_cap_nhat' => now()]);
    }
}
