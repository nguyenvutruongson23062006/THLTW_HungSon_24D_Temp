<?php

namespace App\Http\Controllers;

use App\Models\SanPham;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

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

    // Lấy danh sách sản phẩm đã xóa mềm
    public function thungRac()
    {
        $sanPhams = SanPham::onlyTrashed()
            ->with([
                'danhMuc',
                'thuongHieu',
                'hinhAnhSanPhams',
            ])
            ->orderByDesc('ngay_xoa')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $sanPhams,
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
            'ten_san_pham' => [
                'required',
                'string',
                'max:255',
                Rule::unique('san_pham', 'ten_san_pham'),
            ],
            'ma_danh_muc' => 'required|integer',
            'ma_thuong_hieu' => 'required|integer',
            'duong_dan' => 'nullable|string|max:255',
            'gia_ban' => 'required|numeric|min:0',
            'gia_khuyen_mai' => 'nullable|numeric|min:0',
            'so_luong_ton' => 'required|integer|min:0',
            'dung_tich_dong_co' => 'nullable|integer|min:0',
            'nam_san_xuat' => 'nullable|integer|min:1900|max:2100',
            'mau_sac' => 'nullable|string|max:100',
            'hinh_anh' => [
                'nullable',
                'array',
                'max:10',
            ],
            'hinh_anh.*' => [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
            'mo_ta' => 'nullable|string',
            'trang_thai' => 'nullable|string|max:50',
            'luot_xem' => 'nullable|integer|min:0',
        ], [
            'ten_san_pham.unique' => 'Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác.',
        ]);

        unset($validated['hinh_anh']);

        $sanPham = SanPham::create($validated);

        $this->luuHinhAnhSanPham($request, $sanPham);

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
            'ten_san_pham' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('san_pham', 'ten_san_pham')->ignore(
                    $sanPham->ma_san_pham,
                    'ma_san_pham',
                ),
            ],
            'ma_danh_muc' => 'sometimes|required|integer',
            'ma_thuong_hieu' => 'sometimes|required|integer',
            'duong_dan' => 'nullable|string|max:255',
            'gia_ban' => 'sometimes|required|numeric|min:0',
            'gia_khuyen_mai' => 'nullable|numeric|min:0',
            'so_luong_ton' => 'sometimes|required|integer|min:0',
            'dung_tich_dong_co' => 'nullable|integer|min:0',
            'nam_san_xuat' => 'nullable|integer|min:1900|max:2100',
            'mau_sac' => 'nullable|string|max:100',
            'hinh_anh' => [
                'nullable',
                'array',
                'max:10',
            ],
            'hinh_anh.*' => [
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
            'mo_ta' => 'nullable|string',
            'trang_thai' => 'nullable|string|max:50',
            'luot_xem' => 'nullable|integer|min:0',
        ], [
            'ten_san_pham.unique' => 'Tên sản phẩm đã tồn tại. Vui lòng chọn tên khác.',
        ]);

        unset($validated['hinh_anh']);

        $sanPham->update($validated);

        $this->luuHinhAnhSanPham($request, $sanPham);

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

    // Lưu nhiều ảnh cho một sản phẩm
    private function luuHinhAnhSanPham(
        Request $request,
        SanPham $sanPham,
    ): void {
        $files = $request->file('hinh_anh', []);

        if (!is_array($files) || count($files) === 0) {
            return;
        }

        $sanPham->hinhAnhSanPhams()
            ->where('la_anh_dai_dien', true)
            ->update(['la_anh_dai_dien' => false]);

        $anhDaiDien = null;

        foreach ($files as $thuTu => $file) {
            $duongDanAnh = $file
                ->store('products', 'public');

            $duongDanCongKhai = url(
                Storage::url($duongDanAnh),
            );

            $sanPham->hinhAnhSanPhams()->create([
                'duong_dan' => $duongDanCongKhai,
                'la_anh_dai_dien' => $thuTu === 0,
                'thu_tu_hien_thi' => $thuTu,
            ]);

            if ($thuTu === 0) {
                $anhDaiDien = $duongDanCongKhai;
            }
        }

        if ($anhDaiDien !== null) {
            $sanPham->update([
                'anh_dai_dien' => $anhDaiDien,
            ]);
        }
    }

    // Xóa mềm sản phẩm
    public function destroy(SanPham $sanPham)
    {
        $sanPham->delete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa sản phẩm thành công'
        ]);
    }

    // Khôi phục sản phẩm đã xóa mềm
    public function khoiPhuc(int $maSanPham)
    {
        $sanPham = SanPham::onlyTrashed()
            ->findOrFail($maSanPham);

        $sanPham->restore();

        $sanPham->load([
            'danhMuc',
            'thuongHieu',
            'hinhAnhSanPhams',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Khôi phục sản phẩm thành công',
            'data' => $sanPham,
        ]);
    }

    // Xóa vĩnh viễn sản phẩm
    public function xoaVinhVien(int $maSanPham)
    {
        $sanPham = SanPham::onlyTrashed()
            ->findOrFail($maSanPham);

        $sanPham->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa vĩnh viễn sản phẩm thành công',
        ]);
    }
}

