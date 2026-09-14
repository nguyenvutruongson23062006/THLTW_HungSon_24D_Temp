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
        Schema::create('thuong_hieu', function (Blueprint $table) {
            $table->id('ma_thuong_hieu');
            $table->string('ten_thuong_hieu')->unique();
            $table->string('duong_dan')->unique();
            $table->string('logo')->nullable();
            $table->text('mo_ta')->nullable();
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
        Schema::dropIfExists('thuong_hieu');
    }
};
