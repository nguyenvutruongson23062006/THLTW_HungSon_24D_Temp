<?php

namespace App\Http\Controllers;

use App\Models\Danhmuc;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DanhMucController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Danhmuc::with('parent')
                ->orderBy('ma_danh_muc')
                ->get()
        ]);
    }

    public function show(Danhmuc $category)
    {
        return response()->json([
            'data' => $category->load('parent', 'children')
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'ten_danh_muc' => 'required|string|max:255|unique:danh_muc,ten_danh_muc',
            'duong_dan' => 'required|string|max:250|unique:danh_muc,duong_dan',
            'ma_danh_muc_cha' => 'nullable|exists:danh_muc,ma_danh_muc',
            'mo_ta' => 'nullable|string',
            'anh_dai_dien' => 'nullable|string|max:255',
            'trang_thai' => ['required', Rule::in(['hoat_dong', 'an'])],
        ]);

        $category = Danhmuc::create($data);

        return response()->json([
            'data' => $category
        ], 201);
    }

    public function update(Request $request, Danhmuc $category)
    {
        $data = $request->validate([
            'ten_danh_muc' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('danh_muc', 'ten_danh_muc')
                    ->ignore($category->ma_danh_muc, 'ma_danh_muc')
            ],
            'duong_dan' => [
                'sometimes',
                'string',
                'max:250',
                Rule::unique('danh_muc', 'duong_dan')
                    ->ignore($category->ma_danh_muc, 'ma_danh_muc')
            ],
            'ma_danh_muc_cha' => 'nullable|exists:danh_muc,ma_danh_muc',
            'mo_ta' => 'nullable|string',
            'anh_dai_dien' => 'nullable|string|max:255',
            'trang_thai' => ['sometimes', Rule::in(['hoat_dong', 'an'])],
            ]);

            $category->update($data);

        return response()->json([
            'data' => $category
        ]);
    }

    public function destroy(Danhmuc $category)
    {
        if ($category->children()->exists() || $category->sanPhams()->exists()) {
            return response()->json([
                'message' => 'Không thể xóa danh mục đang được sử dụng.'
            ], 409);
        }

        $category->delete();

        return response()->json(null, 204);
    }
}