<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ThuongHieu;
use Illuminate\Http\Request;

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

    // Thêm thương hiệu
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ten_thuong_hieu' => 'required|string|max:255',
            'duong_dan' => 'nullable|string|max:255',
            'logo' => 'nullable|string|max:255',
            'mo_ta' => 'nullable|string',
            'trang_thai' => 'nullable|string|max:50',
        ]);

        $thuongHieu = ThuongHieu::create($validated);

        $thuongHieu->load('sanPhams');

        return response()->json([
            'success' => true,
            'message' => 'Thêm thương hiệu thành công',
            'data' => $thuongHieu
        ], 201);
    }

    // Cập nhật thương hiệu
    public function update(Request $request, ThuongHieu $thuongHieu)
    {
        $validated = $request->validate([
            'ten_thuong_hieu' => 'sometimes|required|string|max:255',
            'duong_dan' => 'nullable|string|max:255',
            'logo' => 'nullable|string|max:255',
            'mo_ta' => 'nullable|string',
            'trang_thai' => 'nullable|string|max:50',
        ]);

        $thuongHieu->update($validated);

        $thuongHieu->load('sanPhams');

        return response()->json([
            'success' => true,
            'message' => 'Cập nhật thương hiệu thành công',
            'data' => $thuongHieu
        ]);
    }

    // Xóa thương hiệu
    public function destroy(ThuongHieu $thuongHieu)
    {
        $thuongHieu->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa thương hiệu thành công'
        ]);
    }
}
