<?php

namespace App\Http\Controllers;

use App\Models\Danhmuc;

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
}