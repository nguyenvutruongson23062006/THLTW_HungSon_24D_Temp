<?php

namespace App\Http\Controllers;

use App\Models\SanPham;
use Illuminate\Http\Request;

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

    // Thêm sản phẩm
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ten_san_pham' => 'required|string|max:255',
            'ma_danh_muc' => 'required|integer',
            'ma_thuong_hieu' => 'required|integer',
            'duong_dan' => 'nullable|string|max:255',
            'gia_ban' => 'required|numeric|min:0',
            'gia_khuyen_mai' => 'nullable|numeric|min:0',
            'so_luong_ton' => 'required|integer|min:0',
            'dung_tich_dong_co' => 'nullable|integer|min:0',
            'nam_san_xuat' => 'nullable|integer|min:1900|max:2100',
            'mau_sac' => 'nullable|string|max:100',
            'anh_dai_dien' => 'nullable|string|max:255',
            'mo_ta' => 'nullable|string',
            'trang_thai' => 'nullable|string|max:50',
            'luot_xem' => 'nullable|integer|min:0',
        ]);

        $sanPham = SanPham::create($validated);

        $sanPham->load([
            'danhMuc',
            'thuongHieu',
            'hinhAnhSanPhams'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thêm sản phẩm thành công',
            'data' => $sanPham
        ], 201);
    }

    // Cập nhật sản phẩm
    public function update(Request $request, SanPham $sanPham)
    {
        $validated = $request->validate([
            'ten_san_pham' => 'sometimes|required|string|max:255',
            'ma_danh_muc' => 'sometimes|required|integer',
            'ma_thuong_hieu' => 'sometimes|required|integer',
            'duong_dan' => 'nullable|string|max:255',
            'gia_ban' => 'sometimes|required|numeric|min:0',
            'gia_khuyen_mai' => 'nullable|numeric|min:0',
            'so_luong_ton' => 'sometimes|required|integer|min:0',
            'dung_tich_dong_co' => 'nullable|integer|min:0',
            'nam_san_xuat' => 'nullable|integer|min:1900|max:2100',
            'mau_sac' => 'nullable|string|max:100',
            'anh_dai_dien' => 'nullable|string|max:255',
            'mo_ta' => 'nullable|string',
            'trang_thai' => 'nullable|string|max:50',
            'luot_xem' => 'nullable|integer|min:0',
        ]);

        $sanPham->update($validated);

        $sanPham->load([
            'danhMuc',
            'thuongHieu',
            'hinhAnhSanPhams'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật sản phẩm thành công',
            'data' => $sanPham
        ]);
    }

    // Xóa sản phẩm
    public function destroy(SanPham $sanPham)
    {
        $sanPham->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa sản phẩm thành công'
        ]);
    }
}
