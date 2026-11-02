<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
return new class extends Migration {
    public function up(): void {
        DB::transaction(function () {
            $ds = DB::table('don_hang')->where('phuong_thuc_thanh_toan', 'chuyen_khoan')->where('trang_thai_thanh_toan', 'chua_thanh_toan')->where('da_tru_kho', true)->orderBy('ma_don_hang')->lockForUpdate()->get();
            foreach ($ds as $don) app(\App\Services\DatHangService::class)->hoanKho($don);
        });
    }
    public function down(): void { /* Không tự trừ lại kho của yêu cầu chưa thanh toán. */ }
};
