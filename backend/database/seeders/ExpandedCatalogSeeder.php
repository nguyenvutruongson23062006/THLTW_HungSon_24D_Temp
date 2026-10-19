<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ExpandedCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $items = json_decode(File::get(database_path('catalog/products.json')), true, flags: JSON_THROW_ON_ERROR);
        $names = [1 => 'Xe tay ga', 2 => 'Xe số', 3 => 'Xe côn tay', 4 => 'Mô tô phân khối lớn', 5 => 'Mũ bảo hiểm'];
        $categories = DB::table('danh_muc')->whereNull('ngay_xoa')->pluck('ma_danh_muc', 'ten_danh_muc');
        foreach ($items as $item) {
            if (! isset($categories[$names[$item['category']]])) {
                throw new \RuntimeException('Missing category: '.$names[$item['category']]);
            }
            foreach ($item['gallery'] as $image) {
                if (! File::isFile(base_path('../frontend/public'.$image))
                    || @getimagesize(base_path('../frontend/public'.$image)) === false) {
                    throw new \RuntimeException('Missing image: '.$image);
                }
            }
        }

        // Keep a local snapshot before adding records; never reset the database.
        $backup = storage_path('app/private/catalog-backups');
        File::ensureDirectoryExists($backup);
        File::put($backup.'/'.now()->format('Ymd-His-u').'.json', json_encode([
            'san_pham' => DB::table('san_pham')->get(),
            'hinh_anh_san_pham' => DB::table('hinh_anh_san_pham')->get(),
            'thuong_hieu' => DB::table('thuong_hieu')->get(),
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR));

        $added = 0;
        DB::transaction(function () use ($items, $names, $categories, &$added) {
            $now = now();
            foreach ($items as $index => $item) {
                $slug = '/'.$item['slug'];
                // Preserve price, stock and edits on repeat runs, including soft-deleted products.
                if (DB::table('san_pham')->where('duong_dan', $slug)->orWhere('ten_san_pham', $item['name'])->exists()) {
                    continue;
                }
                $brand = DB::table('thuong_hieu')->where('ten_thuong_hieu', $item['brand'])->first();
                if ($brand && $brand->ngay_xoa !== null) {
                    throw new \RuntimeException('Brand is deleted: '.$item['brand']);
                }
                $brandId = $brand?->ma_thuong_hieu ?? DB::table('thuong_hieu')->insertGetId([
                    'ten_thuong_hieu' => $item['brand'],
                    'duong_dan' => '/thuong-hieu/'.strtolower($item['brand']),
                    'trang_thai' => 'hoat_dong',
                    'ngay_tao' => $now,
                    'ngay_cap_nhat' => $now,
                ], 'ma_thuong_hieu');
                $id = DB::table('san_pham')->insertGetId([
                    'ten_san_pham' => $item['name'],
                    'ma_danh_muc' => $categories[$names[$item['category']]],
                    'ma_thuong_hieu' => $brandId,
                    'duong_dan' => $slug,
                    'gia_ban' => $item['price'],
                    'gia_khuyen_mai' => null,
                    'so_luong_ton' => 1 + ($index % 10),
                    'mau_sac' => $item['color'] ?? null,
                    'anh_dai_dien' => $item['image'],
                    'mo_ta' => $item['category'] === 5
                        ? $item['name'].'. Mũ bảo hiểm fullface thuộc dòng LS2 Stream II.'
                        : $item['name'].'. Thuộc danh mục '.$names[$item['category']].'.',
                    'trang_thai' => 'hoat_dong',
                    'luot_xem' => 0,
                    'ngay_tao' => $now,
                    'ngay_cap_nhat' => $now,
                ], 'ma_san_pham');
                foreach (array_unique($item['gallery']) as $order => $image) {
                    DB::table('hinh_anh_san_pham')->insert([
                        'ma_san_pham' => $id,
                        'duong_dan' => $image,
                        'la_anh_dai_dien' => $image === $item['image'],
                        'thu_tu_hien_thi' => $order,
                        'ngay_tao' => $now,
                        'ngay_cap_nhat' => $now,
                    ]);
                }
                $added++;
            }
        });
        $this->command?->info("Added {$added} products; existing products unchanged.");
    }
}
