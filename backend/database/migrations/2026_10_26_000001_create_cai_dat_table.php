<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cai_dat', function (Blueprint $table) {
            $table->string('khoa')->primary();
            $table->text('gia_tri')->nullable();
            $table->timestamp('ngay_cap_nhat')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cai_dat');
    }
};
