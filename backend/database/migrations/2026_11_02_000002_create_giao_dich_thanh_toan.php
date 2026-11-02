<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('giao_dich_thanh_toan', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('ma_don_hang');
            $table->foreign('ma_don_hang')->references('ma_don_hang')->on('don_hang')->restrictOnDelete();
            $table->string('ma_tham_chieu', 32)->unique();
            $table->string('phuong_thuc', 30);
            $table->decimal('so_tien', 15, 2);
            $table->string('trang_thai', 30)->default('dang_cho');
            $table->text('duong_dan');
            $table->string('ma_giao_dich_cong', 100)->nullable()->unique();
            $table->string('ma_phan_hoi', 10)->nullable();
            $table->boolean('can_doi_soat')->default(false);
            $table->timestamp('het_han');
            $table->timestamp('ngay_tao');
            $table->timestamp('ngay_cap_nhat');
            $table->index(['ma_don_hang', 'trang_thai']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('giao_dich_thanh_toan');
    }
};
