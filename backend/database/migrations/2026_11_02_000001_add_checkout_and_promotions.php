<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('khuyen_mai', function (Blueprint $table) {
            $table->id('ma_khuyen_mai');
            $table->string('ma_giam_gia', 50)->unique();
            $table->string('ten_khuyen_mai');
            $table->string('loai_giam', 20);
            $table->decimal('gia_tri_giam', 15, 2);
            $table->decimal('don_toi_thieu', 15, 2)->default(0);
            $table->decimal('giam_toi_da', 15, 2)->nullable();
            $table->date('ngay_bat_dau');
            $table->date('ngay_ket_thuc');
            $table->unsignedInteger('gioi_han_su_dung')->nullable();
            $table->unsignedInteger('da_su_dung')->default(0);
            $table->boolean('chi_thanh_vien')->default(false);
            $table->string('trang_thai')->default('hoat_dong');
            $table->timestamp('ngay_tao')->nullable();
            $table->timestamp('ngay_cap_nhat')->nullable();
            $table->softDeletes('ngay_xoa');
        });
        Schema::table('don_hang', function (Blueprint $table) {
            $table->foreignId('ma_khuyen_mai')->nullable()->constrained('khuyen_mai', 'ma_khuyen_mai')->nullOnDelete();
            $table->string('ma_giam_gia', 50)->nullable();
            // Đơn cũ giữ false: không tự hoàn kho khi chưa biết đã trừ kho hay chưa.
            $table->boolean('da_tru_kho')->default(false);
            $table->uuid('khoa_dat_hang')->nullable()->unique();
            $table->string('dau_van_dat_hang', 64)->nullable();
        });
        Schema::create('lich_su_don_hang', function (Blueprint $table) {
            $table->id('ma_lich_su');
            $table->foreignId('ma_don_hang')->constrained('don_hang', 'ma_don_hang')->cascadeOnDelete();
            $table->foreignId('ma_nguoi_dung')->nullable()->constrained('nguoi_dung', 'ma_nguoi_dung')->nullOnDelete();
            $table->string('trang_thai_cu')->nullable();
            $table->string('trang_thai_moi');
            $table->string('ghi_chu')->nullable();
            $table->timestamp('ngay_tao');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lich_su_don_hang');
        Schema::table('don_hang', function (Blueprint $table) {
            $table->dropConstrainedForeignId('ma_khuyen_mai');
            $table->dropUnique(['khoa_dat_hang']);
            $table->dropColumn(['ma_giam_gia', 'da_tru_kho', 'khoa_dat_hang', 'dau_van_dat_hang']);
        });
        Schema::dropIfExists('khuyen_mai');
    }
};
