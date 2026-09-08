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
        Schema::create('thanh_dieu_huong', function (Blueprint $table) {
             $table->id('ma_thanh_dieu_huong');
            $table->string('ten_hien_thi');
            $table->string('duong_dan', 250)->unique();
            $table->foreignId('ma_thanh_dieu_huong_cha')->nullable()->constrained('thanh_dieu_huong', 'ma_thanh_dieu_huong')->nullOnDelete();
            $table->unsignedInteger('thu_tu_hien_thi')->default(0)->index();
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
        Schema::dropIfExists('thanh_dieu_huong');
    }
};
