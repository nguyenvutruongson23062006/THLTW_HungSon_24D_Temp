<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('chi_tiet_phieu_xuat', function (Blueprint $table) {
            $table->id('ma_chi_tiet_phieu_xuat');
            $table->foreignId('ma_phieu_xuat')->constrained('phieu_xuat', 'ma_phieu_xuat')->cascadeOnDelete();
            $table->foreignId('ma_san_pham')->nullable()->constrained('san_pham', 'ma_san_pham')->nullOnDelete();
            $table->unsignedInteger('so_luong');
            $table->text('ghi_chu')->nullable();
            $table->timestamp('ngay_tao')->nullable();
            $table->timestamp('ngay_cap_nhat')->nullable();
            $table->softDeletes('ngay_xoa');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chi_tiet_phieu_xuat');
    }
};
