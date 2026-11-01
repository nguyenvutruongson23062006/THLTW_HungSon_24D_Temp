<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CaiDatQuanTriController extends Controller
{
    private const MAC_DINH = [
        'ten_cua_hang' => 'MotoShop', 'dia_chi_email' => '', 'so_dien_thoai' => '',
        'dia_chi' => '', 'nguong_ton_kho' => 5,
    ];

    public function index()
    {
        $data = array_replace(self::MAC_DINH, DB::table('cai_dat')->pluck('gia_tri', 'khoa')->all());
        $data['nguong_ton_kho'] = (int) $data['nguong_ton_kho'];

        return response()->json(['data' => $data]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'ten_cua_hang' => 'required|string|max:100', 'dia_chi_email' => 'nullable|email|max:255',
            'so_dien_thoai' => 'nullable|string|max:20', 'dia_chi' => 'nullable|string|max:1000',
            'nguong_ton_kho' => 'required|integer|min:0|max:1000000',
        ]);
        DB::transaction(function () use ($data) {
            foreach ($data as $khoa => $giaTri) {
                DB::table('cai_dat')->updateOrInsert(['khoa' => $khoa], ['gia_tri' => $giaTri === null ? '' : (string) $giaTri, 'ngay_cap_nhat' => now()]);
            }
        });

        return response()->json(['message' => 'Đã lưu cài đặt cửa hàng.']);
    }
}
