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
        Schema::create('lien_he', function (Blueprint $table) {
            $table->id('ma_lien_he');

            $table->foreignId('ma_nguoi_dung')->nullable()->constrained('nguoi_dung', 'ma_nguoi_dung')->nullOnDelete();
            $table->string('ho_ten');
            $table->string('dia_chi_email');
            $table->string('so_dien_thoai', 20)->nullable();
            $table->string('tieu_de')->nullable();
            $table->text('noi_dung');
            $table->string('trang_thai')->default('chua_xu_ly')->index();
            $table->text('phan_hoi')->nullable();
            $table->timestamp('thoi_gian_phan_hoi')->nullable();
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
        Schema::dropIfExists('lien_he');
    }
};
