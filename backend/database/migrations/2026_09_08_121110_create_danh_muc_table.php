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
        Schema::create('danh_muc', function (Blueprint $table) {
             $table->id('ma_danh_muc');

            $table->string('ten_danh_muc')->unique();
            $table->string('duong_dan', 250)->unique();
            $table->foreignId('ma_danh_muc_cha')->nullable()->constrained('danh_muc', 'ma_danh_muc')->nullOnDelete();
            $table->text('mo_ta')->nullable();
            $table->string('anh_dai_dien')->nullable()->default('anh-danh-muc-mac-dinh.jpg');
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
        Schema::dropIfExists('danh_muc');
    }
};
