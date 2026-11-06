<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('khuyen_mai', function (Blueprint $table) {
            $table->date('ngay_bat_dau')->nullable()->change();
            $table->date('ngay_ket_thuc')->nullable()->change();
        });
    }

    public function down(): void
    {
        // Giữ cột nullable để bảo toàn các chương trình không có ngày giới hạn.
    }
};
