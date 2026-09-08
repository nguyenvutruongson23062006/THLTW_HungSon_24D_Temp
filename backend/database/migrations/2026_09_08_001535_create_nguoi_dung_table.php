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
        Schema::create('nguoi_dung', function (Blueprint $table) {
            $table->id('ma_nguoi_dung');
            $table->string('ho_ten');
            $table->string('ten_dang_nhap')->unique();
            $table->string('dia_chi_email')->unique();
            $table->string('anh_dai_dien')->nullable()->default('anh-dai-dien-mac-dinh.jpg');
            $table->string('so_dien_thoai', 20)->nullable();
            $table->text('dia_chi')->nullable();
            $table->string('mat_khau');
            $table->string('ma_nho_dang_nhap')->nullable();
            $table->string('ma_dat_lai_mat_khau')->nullable();
            $table->timestamp('thoi_gian_dat_lai_mat_khau')->nullable();
            $table->timestamp('thoi_gian_xac_thuc')->nullable();
            $table->string('vai_tro')->default('thanh_vien')->index();
            $table->string('trang_thai')->default('hoat_dong')->index();
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
        Schema::dropIfExists('nguoi_dung');
    }
};
