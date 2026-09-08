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
        Schema::create('chi_tiet_don_hang', function (Blueprint $table) {
            $table->id('ma_chi_tiet_don_hang');
            $table->foreignId('ma_don_hang')->constrained('don_hang', 'ma_don_hang')->cascadeOnDelete();
            $table->foreignId('ma_san_pham')->nullable()->constrained('san_pham', 'ma_san_pham')->nullOnDelete();
            $table->string('ten_san_pham');
            $table->unsignedInteger('so_luong');
            $table->decimal('don_gia', 15, 2);
            $table->decimal('thanh_tien', 15, 2);
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
        Schema::dropIfExists('chi_tiet_don_hang');
    }
};
