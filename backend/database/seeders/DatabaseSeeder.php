<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CaiDatThanhToanSeeder::class,
            NguoiDungSeeder::class,
            CatalogSeeder::class,
            SanPhamSeeder::class,
            ExpandedCatalogSeeder::class,
            PublicProductImagesSeeder::class,
            AnhDanhMucThuongHieuSeeder::class,
            ContentSeeder::class,
            DonHangSeeder::class,
            KhoSeeder::class,
            DuLieuDungChungSeeder::class,
        ]);
    }
}
