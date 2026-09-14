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
        Schema::create('don_hang', function (Blueprint $table) {
            $table->id('ma_don_hang');
            $table->foreignId('ma_nguoi_dung')->nullable()->constrained('nguoi_dung', 'ma_nguoi_dung')->nullOnDelete();
            $table->string('ho_ten');
            $table->string('dia_chi_email')->nullable();
            $table->string('so_dien_thoai', 20);
            $table->text('dia_chi_giao_hang');
            $table->string('phuong_thuc_thanh_toan')->default('tien_mat');
            $table->string('ma_giao_dich')->nullable();
            $table->text('ghi_chu')->nullable();
            $table->decimal('tam_tinh', 15, 2)->default(0);
            $table->decimal('giam_gia', 15, 2)->default(0);
            $table->decimal('tong_tien', 15, 2)->default(0);
            $table->string('trang_thai')->default('cho_xac_nhan')->index();
            $table->string('trang_thai_thanh_toan')->default('chua_thanh_toan')->index();
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
        Schema::dropIfExists('don_hang');
    }
};
