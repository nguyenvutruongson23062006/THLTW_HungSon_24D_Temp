<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\ThuongHieu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

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

    // Lấy danh sách thương hiệu đã xóa mềm
    public function thungRac()
    {
        $thuongHieus = ThuongHieu::onlyTrashed()
            ->with('sanPhams')
            ->orderByDesc('ngay_xoa')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $thuongHieus,
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
            'ten_thuong_hieu' => [
                'required',
                'string',
                'max:255',
                Rule::unique('thuong_hieu', 'ten_thuong_hieu'),
            ],
            'duong_dan' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('thuong_hieu', 'duong_dan'),
            ],
            'logo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp,svg',
                'max:2048',
            ],
            'mo_ta' => 'nullable|string',
            'trang_thai' => 'nullable|string|max:50',
        ], [
            'ten_thuong_hieu.unique' => 'Tên thương hiệu đã tồn tại. Vui lòng chọn tên khác.',
            'duong_dan.unique' => 'Đường dẫn thương hiệu đã tồn tại. Vui lòng chọn tên khác.',
        ]);

        unset($validated['logo']);

        $thuongHieu = ThuongHieu::create($validated);

        $this->luuLogo($request, $thuongHieu);

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
            'ten_thuong_hieu' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('thuong_hieu', 'ten_thuong_hieu')->ignore(
                    $thuongHieu->ma_thuong_hieu,
                    'ma_thuong_hieu',
                ),
            ],
            'duong_dan' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('thuong_hieu', 'duong_dan')->ignore(
                    $thuongHieu->ma_thuong_hieu,
                    'ma_thuong_hieu',
                ),
            ],
            'logo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp,svg',
                'max:2048',
            ],
            'mo_ta' => 'nullable|string',
            'trang_thai' => 'nullable|string|max:50',
        ], [
            'ten_thuong_hieu.unique' => 'Tên thương hiệu đã tồn tại. Vui lòng chọn tên khác.',
            'duong_dan.unique' => 'Đường dẫn thương hiệu đã tồn tại. Vui lòng chọn tên khác.',
        ]);

        unset($validated['logo']);

        $thuongHieu->update($validated);

        $this->luuLogo($request, $thuongHieu);

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

    // Khôi phục thương hiệu đã xóa mềm
    public function khoiPhuc(int $maThuongHieu)
    {
        $thuongHieu = ThuongHieu::onlyTrashed()
            ->findOrFail($maThuongHieu);

        $thuongHieu->restore();
        $thuongHieu->load('sanPhams');

        return response()->json([
            'success' => true,
            'message' => 'Khôi phục thương hiệu thành công',
            'data' => $thuongHieu,
        ]);
    }

    // Xóa vĩnh viễn thương hiệu đã xóa mềm
    public function xoaVinhVien(int $maThuongHieu)
    {
        $thuongHieu = ThuongHieu::onlyTrashed()
            ->findOrFail($maThuongHieu);

        if ($thuongHieu->sanPhams()->withTrashed()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể xóa vĩnh viễn thương hiệu đang có sản phẩm.',
            ], 422);
        }

        $this->xoaLogo($thuongHieu->logo);
        $thuongHieu->forceDelete();

        return response()->json([
            'success' => true,
            'message' => 'Xóa vĩnh viễn thương hiệu thành công',
        ]);
    }

    private function luuLogo(
        Request $request,
        ThuongHieu $thuongHieu,
    ): void {
        $file = $request->file('logo');

        if ($file === null) {
            return;
        }

        $logoCu = $thuongHieu->logo;
        $duongDanLogo = $file->store('brands', 'public');
        $duongDanCongKhai = url(Storage::url($duongDanLogo));

        $thuongHieu->update([
            'logo' => $duongDanCongKhai,
        ]);

        $this->xoaLogo($logoCu);
    }

    private function xoaLogo(?string $duongDan): void
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
