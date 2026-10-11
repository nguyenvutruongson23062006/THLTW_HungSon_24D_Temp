<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('san_pham', function (Blueprint $table) {
            $table->unique(
                'ten_san_pham',
                'san_pham_ten_san_pham_unique',
            );
        });
    }

    public function down(): void
    {
        Schema::table('san_pham', function (Blueprint $table) {
            $table->dropUnique(
                'san_pham_ten_san_pham_unique',
            );
        });
    }
};
