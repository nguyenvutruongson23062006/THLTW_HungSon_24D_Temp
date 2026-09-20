<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ThuongHieu;

class ThuongHieuController extends Controller
{
    // Lấy danh sách thương hiệu
    public function index()
    {
        $thuongHieus = ThuongHieu::with('sanPhams')
            ->orderBy('ma_thuong_hieu')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $thuongHieus
        ]);
    }

    // Lấy chi tiết thương hiệu
    public function show(ThuongHieu $thuongHieu)
    {
        $thuongHieu->load('sanPhams');

        return response()->json([
            'success' => true,
            'data' => $thuongHieu
        ]);
    }
}