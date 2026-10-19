<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class PublicProductImagesSeeder extends Seeder
{
    public function run(): void
    {
        $mapping = [
            'Honda SH Mode 125i 2025' => ['shmode-white.jpg', 'shmode-gray.png'],
            'Yamaha Exciter 155 VVA 2025' => ['Exciter-155-VVA-GP-ABS_005.webp', 'Exciter-155-VVA-Grey-Mint-ABS_005.webp'],
            'Honda Wave Alpha 110 2025' => ['wave-white.jpg'],
            'Suzuki Raider R150 2025' => ['raider-special.jpg', 'raider-grayblue.jpg'],
            'Kawasaki Ninja 500 2025' => ['ninja500-green.png', 'ninja500-blue.png', 'ninja500-black.png'],
            'Piaggio Liberty S 125 2025' => ['Liberty 125S-bllue.avif', 'Liberty125-white.avif'],
            'LS2 FF800 Storm II' => ['FF800-white.jpg', 'FF800-black.jpg'],
            'Motul 5100 10W40 1L' => ['MOTUL 5100 4T 10W40.webp'],
            'Givi B32N' => ['b32nnew-3583.jpg'],
            'Givi Airflow' => ['givi-airflow-moto-descr.png'],
            'Yamaha MT-07' => ['yamaha-mt07.jpg'],
            'Yamaha YZF-R7' => ['yamaha-yzf-r7.jpg'],
            'Triumph Daytona 660 Snowdonia White' => ['daytona 660_snowdonia white.avif'],
        ];
        foreach ($mapping as $files) {
            foreach ($files as $file) {
                if (@getimagesize(base_path('../frontend/public/products/'.$file)) === false) {
                    throw new \RuntimeException('Invalid product image: '.$file);
                }
            }
        }
        $backup = storage_path('app/private/catalog-backups');
        File::ensureDirectoryExists($backup);
        File::put($backup.'/images-'.now()->format('Ymd-His-u').'.json', json_encode([
            'san_pham' => DB::table('san_pham')->get(),
            'hinh_anh_san_pham' => DB::table('hinh_anh_san_pham')->get(),
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR));

        $count = 0;
        DB::transaction(function () use ($mapping, &$count) {
            foreach ($mapping as $name => $files) {
                $product = DB::table('san_pham')->where('ten_san_pham', $name)->whereNull('ngay_xoa')->first();
                if (! $product) {
                    continue;
                }
                $primary = '/products/'.$files[0];
                DB::table('san_pham')->where('ma_san_pham', $product->ma_san_pham)
                    ->update(['anh_dai_dien' => $primary, 'ngay_cap_nhat' => now()]);
                $images = DB::table('hinh_anh_san_pham')->where('ma_san_pham', $product->ma_san_pham)->whereNull('ngay_xoa');
                // Retire only missing seeded placeholder images; retain actual gallery uploads.
                foreach ((clone $images)->get() as $image) {
                    if (str_starts_with($image->duong_dan, '/images/products/')
                        && ! File::isFile(base_path('../frontend/public'.$image->duong_dan))) {
                        DB::table('hinh_anh_san_pham')->where('ma_hinh_anh', $image->ma_hinh_anh)
                            ->update(['ngay_xoa' => now(), 'la_anh_dai_dien' => false]);
                    }
                }
                (clone $images)->update(['la_anh_dai_dien' => false]);
                foreach ($files as $order => $file) {
                    $path = '/products/'.$file;
                    $existing = (clone $images)->where('duong_dan', $path)->first();
                    $values = ['la_anh_dai_dien' => $order === 0, 'thu_tu_hien_thi' => $order, 'ngay_cap_nhat' => now()];
                    if ($existing) {
                        DB::table('hinh_anh_san_pham')->where('ma_hinh_anh', $existing->ma_hinh_anh)->update($values);
                    } else {
                        DB::table('hinh_anh_san_pham')->insert($values + [
                            'ma_san_pham' => $product->ma_san_pham,
                            'duong_dan' => $path,
                            'ngay_tao' => now(),
                        ]);
                    }
                }
                $count++;
            }
        });
        $this->command?->info("Linked public images for {$count} products.");
    }
}
