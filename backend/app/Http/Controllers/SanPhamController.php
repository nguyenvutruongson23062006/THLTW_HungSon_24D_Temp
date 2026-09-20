<?php

namespace App\Http\Controllers;

use App\Models\SanPham;

class SanPhamController extends Controller
{
    // Lấy danh sách sản phẩm
    public function index()
    {
        $sanPhams = SanPham::with([
            'danhMuc',
            'thuongHieu',
            'hinhAnhSanPhams'
        ])
        ->orderBy('ma_san_pham')
        ->get();

        return response()->json([
            'success' => true,
            'data' => $sanPhams
        ]);
    }

    // Lấy thông tin chi tiết sản phẩm
    public function show(SanPham $sanPham)
    {
        $sanPham->load([
            'danhMuc',
            'thuongHieu',
            'hinhAnhSanPhams'
        ]);

        return response()->json([
            'success' => true,
            'data' => $sanPham
        ]);
    }
}