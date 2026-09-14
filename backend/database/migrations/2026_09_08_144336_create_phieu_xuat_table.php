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
        Schema::create('phieu_xuat', function (Blueprint $table) {
            $table->id('ma_phieu_xuat');
            $table->foreignId('ma_nguoi_dung')->nullable()->constrained('nguoi_dung', 'ma_nguoi_dung')->nullOnDelete();
            $table->string('so_phieu_xuat')->unique();
            $table->string('ly_do_xuat')->default('khac');
            $table->text('ghi_chu')->nullable();
            $table->string('trang_thai')->default('hoan_tat')->index();
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
        Schema::dropIfExists('phieu_xuat');
    }
};
