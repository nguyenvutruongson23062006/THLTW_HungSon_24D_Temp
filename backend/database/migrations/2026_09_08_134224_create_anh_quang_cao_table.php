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
        Schema::create('anh_quang_cao', function (Blueprint $table) {
            $table->id('ma_anh_quang_cao');
            $table->string('tieu_de')->nullable();
            $table->string('hinh_anh');
            $table->string('vi_tri')->default('trang_chu');
            $table->string('duong_dan')->nullable();
            $table->unsignedInteger('thu_tu_hien_thi')->default(0);
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
        Schema::dropIfExists('anh_quang_cao');
    }
};
