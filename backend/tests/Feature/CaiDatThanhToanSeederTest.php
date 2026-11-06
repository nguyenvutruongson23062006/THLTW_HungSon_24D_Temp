<?php

namespace Tests\Feature;

use Database\Seeders\CaiDatThanhToanSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class CaiDatThanhToanSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_seeds_shared_account_and_can_run_again(): void
    {
        $this->seed(CaiDatThanhToanSeeder::class);
        $this->seed(CaiDatThanhToanSeeder::class);
        $this->assertDatabaseCount('cai_dat', 3);
        $this->assertDatabaseHas('cai_dat', ['khoa' => 'ngan_hang_bin', 'gia_tri' => '970415']);
        $this->assertDatabaseHas('cai_dat', ['khoa' => 'tai_khoan_nhan', 'gia_tri' => '108883079477']);
        $this->assertDatabaseHas('cai_dat', ['khoa' => 'chu_tai_khoan', 'gia_tri' => 'NGUYEN VU TRUONG SON']);
    }

    public function test_preserves_custom_or_partial_account_without_mixing_recipients(): void
    {
        DB::table('cai_dat')->insert(['khoa' => 'tai_khoan_nhan', 'gia_tri' => '0012345678']);
        $this->seed(CaiDatThanhToanSeeder::class);
        $this->assertDatabaseCount('cai_dat', 1);
        $this->assertDatabaseHas('cai_dat', ['khoa' => 'tai_khoan_nhan', 'gia_tri' => '0012345678']);
    }
}
