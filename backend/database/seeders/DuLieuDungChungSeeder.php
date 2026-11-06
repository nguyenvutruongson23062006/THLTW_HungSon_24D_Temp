<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class DuLieuDungChungSeeder extends Seeder
{
    public function run(): void
    {
        $data = json_decode(File::get(database_path('catalog/shared-orders.json')), true, flags: JSON_THROW_ON_ERROR);
        $khoa = ['khuyen_mai' => 'ma_khuyen_mai', 'don_hang' => 'ma_don_hang', 'chi_tiet_don_hang' => 'ma_chi_tiet_don_hang', 'lich_su_don_hang' => 'ma_lich_su'];
        DB::transaction(function () use ($data, $khoa) {
            foreach ($khoa as $bang => $id) {
                foreach ($data[$bang] as $dong) {
                    // Không ghi đè giao dịch hoặc cấu hình đã được thành viên chỉnh trên máy riêng.
                    if (DB::table($bang)->where($id, $dong[$id])->exists()) continue;
                    if ($bang === 'khuyen_mai' && DB::table($bang)->where('ma_giam_gia', $dong['ma_giam_gia'])->exists()) continue;
                    DB::table($bang)->insert($dong);
                }
            }
        });
    }
}
