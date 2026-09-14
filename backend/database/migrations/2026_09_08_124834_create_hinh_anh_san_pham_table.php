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
        Schema::create('hinh_anh_san_pham', function (Blueprint $table) {
            $table->id('ma_hinh_anh');
            $table->foreignId('ma_san_pham')->constrained('san_pham', 'ma_san_pham')->cascadeOnDelete();
            $table->string('duong_dan');
            $table->boolean('la_anh_dai_dien')->default(false);
            $table->unsignedInteger('thu_tu_hien_thi')->default(0);
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
        Schema::dropIfExists('hinh_anh_san_pham');
    }
};
