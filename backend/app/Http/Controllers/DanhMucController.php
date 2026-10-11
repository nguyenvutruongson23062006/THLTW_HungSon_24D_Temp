<?php

namespace App\Http\Controllers;

use App\Models\Danhmuc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

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

    // Lấy danh sách danh mục đã xóa mềm
    public function thungRac()
    {
        $danhMucs = Danhmuc::onlyTrashed()
            ->with('parent')
            ->orderByDesc('ngay_xoa')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $danhMucs,
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
            'ten_danh_muc' => [
                'required',
                'string',
                'max:255',
                Rule::unique('danh_muc', 'ten_danh_muc'),
            ],
            'duong_dan' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('danh_muc', 'duong_dan'),
            ],
            'ma_danh_muc_cha' => 'nullable|integer',
            'mo_ta' => 'nullable|string',
            'anh_dai_dien' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
            'trang_thai' => 'nullable|string|max:50',
        ], [
            'ten_danh_muc.unique' => 'Tên danh mục đã tồn tại. Vui lòng chọn tên khác.',
            'duong_dan.unique' => 'Đường dẫn danh mục đã tồn tại. Vui lòng chọn tên khác.',
        ]);

        unset($validated['anh_dai_dien']);

        $danhMuc = Danhmuc::create($validated);

        $this->luuAnhDaiDien($request, $danhMuc);

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
            'ten_danh_muc' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('danh_muc', 'ten_danh_muc')->ignore(
                    $category->ma_danh_muc,
                    'ma_danh_muc',
                ),
            ],
            'duong_dan' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('danh_muc', 'duong_dan')->ignore(
                    $category->ma_danh_muc,
                    'ma_danh_muc',
                ),
            ],
            'ma_danh_muc_cha' => 'nullable|integer',
            'mo_ta' => 'nullable|string',
            'anh_dai_dien' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
            'trang_thai' => 'nullable|string|max:50',
        ], [
            'ten_danh_muc.unique' => 'Tên danh mục đã tồn tại. Vui lòng chọn tên khác.',
            'duong_dan.unique' => 'Đường dẫn danh mục đã tồn tại. Vui lòng chọn tên khác.',
        ]);

        unset($validated['anh_dai_dien']);

        $category->update($validated);

        $this->luuAnhDaiDien($request, $category);

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
            'success' => true,
            'message' => 'Xóa danh mục thành công'
        ]);
    }

    // Khôi phục danh mục đã xóa mềm
    public function khoiPhuc(int $maDanhMuc)
    {
        $danhMuc = Danhmuc::onlyTrashed()
            ->findOrFail($maDanhMuc);

        $danhMuc->restore();
        $danhMuc->load('parent', 'children', 'sanPhams');

        return response()->json([
            'success' => true,
            'message' => 'Khôi phục danh mục thành công',
            'data' => $danhMuc,
        ]);
    }

    // Xóa vĩnh viễn danh mục đã xóa mềm
    public function xoaVinhVien(int $maDanhMuc)
    {
        $danhMuc = Danhmuc::onlyTrashed()
            ->findOrFail($maDanhMuc);

        if ($danhMuc->sanPhams()->withTrashed()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa vĩnh viễn danh mục đang có sản phẩm.',
            ], 422);
        }

        $this->xoaAnhDaiDien($danhMuc->anh_dai_dien);
        $danhMuc->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa vĩnh viễn danh mục thành công',
        ]);
    }

    private function luuAnhDaiDien(
        Request $request,
        Danhmuc $danhMuc,
    ): void {
        $file = $request->file('anh_dai_dien');

        if ($file === null) {
            return;
        }

        $anhCu = $danhMuc->anh_dai_dien;
        $duongDanAnh = $file->store('categories', 'public');
        $duongDanCongKhai = url(Storage::url($duongDanAnh));

        $danhMuc->update([
            'anh_dai_dien' => $duongDanCongKhai,
        ]);

        $this->xoaAnhDaiDien($anhCu);
    }

    private function xoaAnhDaiDien(?string $duongDan): void
    {
        if (!$duongDan) {
            return;
        }

        $duongDanUrl = parse_url($duongDan, PHP_URL_PATH);

        if (!is_string($duongDanUrl)) {
            return;
        }

        $tienTo = '/storage/';

        if (!str_starts_with($duongDanUrl, $tienTo)) {
            return;
        }

        Storage::disk('public')->delete(
            substr($duongDanUrl, strlen($tienTo)),
        );
    }
}
