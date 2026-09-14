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
        Schema::create('san_pham', function (Blueprint $table) {
             $table->id('ma_san_pham');
            $table->string('ten_san_pham');
            $table->foreignId('ma_danh_muc')->constrained('danh_muc', 'ma_danh_muc')->restrictOnDelete();
            $table->foreignId('ma_thuong_hieu')->constrained('thuong_hieu', 'ma_thuong_hieu')->restrictOnDelete();
            $table->string('duong_dan', 250)->unique();
            $table->decimal('gia_ban', 15, 2);
            $table->decimal('gia_khuyen_mai', 15, 2)->nullable();
            $table->unsignedInteger('so_luong_ton')->default(0);
            $table->unsignedInteger('dung_tich_dong_co')->nullable();
            $table->unsignedSmallInteger('nam_san_xuat')->nullable();
            $table->string('mau_sac')->nullable();
            $table->string('anh_dai_dien')->nullable();
            $table->text('mo_ta')->nullable();
            $table->string('trang_thai')->default('hoat_dong')->index();
            $table->unsignedInteger('luot_xem')->default(0);
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
        Schema::dropIfExists('table_san_pham');
    }
};
