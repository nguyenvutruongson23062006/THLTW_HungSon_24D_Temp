<?php

namespace App\Http\Controllers;

use App\Models\Danhmuc;
use Illuminate\Http\Request;

class DanhMucController extends Controller
{
    // Lấy danh sách danh mục
    public function index()
    {
        $danhMucs = Danhmuc::with('parent')
            ->orderBy('ma_danh_muc')
            ->get();

        return response()->json([
            'data' => $danhMucs
        ]);
    }

    // Xem chi tiết một danh mục
    public function show(Danhmuc $category)
    {
        $category->load('parent', 'children', 'sanPhams');

        return response()->json([
            'data' => $category
        ]);
    }

    // Thêm danh mục
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ten_danh_muc' => 'required|string|max:255',
            'duong_dan' => 'nullable|string|max:255',
            'ma_danh_muc_cha' => 'nullable|integer',
            'mo_ta' => 'nullable|string',
            'anh_dai_dien' => 'nullable|string|max:255',
            'trang_thai' => 'nullable|string|max:50',
        ]);

        $danhMuc = Danhmuc::create($validated);

        $danhMuc->load('parent', 'children', 'sanPhams');

        return response()->json([
            'data' => $danhMuc,
            'message' => 'Thêm danh mục thành công'
        ], 201);
    }

    // Cập nhật danh mục
    public function update(Request $request, Danhmuc $category)
    {
        $validated = $request->validate([
            'ten_danh_muc' => 'sometimes|required|string|max:255',
            'duong_dan' => 'nullable|string|max:255',
            'ma_danh_muc_cha' => 'nullable|integer',
            'mo_ta' => 'nullable|string',
            'anh_dai_dien' => 'nullable|string|max:255',
            'trang_thai' => 'nullable|string|max:50',
        ]);

        $category->update($validated);

        $category->load('parent', 'children', 'sanPhams');

        return response()->json([
            'data' => $category,
            'message' => 'Cập nhật danh mục thành công'
        ]);
    }

    // Xóa danh mục
    public function destroy(Danhmuc $category)
    {
        $category->delete();

        return response()->json([
            'message' => 'Xóa danh mục thành công'
        ]);
    }
}