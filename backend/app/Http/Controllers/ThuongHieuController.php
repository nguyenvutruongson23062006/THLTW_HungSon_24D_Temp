<?php

namespace App\Http\Controllers;

use App\Models\ThuongHieu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ThuongHieuController extends Controller
{
    /**
     * Hiển thị danh sách thương hiệu.
     */
    public function index()
    {
        $thuongHieus = ThuongHieu::latest()->get();

        return view('admin.thuonghieu.index', compact('thuongHieus'));
    }

    /**
     * Hiển thị form thêm thương hiệu.
     */
    public function create()
    {
        return view('admin.thuonghieu.create');
    }

    /**
     * Lưu thương hiệu mới.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ten_thuong_hieu' => ['required', 'string', 'max:255', 'unique:thuong_hieu,ten_thuong_hieu'],
            'duong_dan' => ['nullable', 'string', 'max:255', 'unique:thuong_hieu,duong_dan'],
            'mo_ta' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'trang_thai' => ['nullable', 'string', 'max:50'],
        ]);

        $data = [
            'ten_thuong_hieu' => $validated['ten_thuong_hieu'],
            'duong_dan' => $validated['duong_dan'] ?? Str::slug($validated['ten_thuong_hieu']),
            'mo_ta' => $validated['mo_ta'] ?? null,
            'trang_thai' => $validated['trang_thai'] ?? 'hoat_dong',
        ];

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('thuong-hieu', 'public');
        }

        ThuongHieu::create($data);

        return redirect()->route('thuonghieu.index')->with('success', 'Thêm thương hiệu thành công.');
    }

    /**
     * Hiển thị chi tiết thương hiệu.
     */
    public function show(ThuongHieu $thuongHieu)
    {
        return view('admin.thuonghieu.show', compact('thuongHieu'));
    }

    /**
     * Hiển thị form chỉnh sửa thương hiệu.
     */
    public function edit(ThuongHieu $thuongHieu)
    {
        return view('admin.thuonghieu.edit', compact('thuongHieu'));
    }

    /**
     * Cập nhật thương hiệu.
     */
    public function update(Request $request, ThuongHieu $thuongHieu)
    {
        $validated = $request->validate([
            'ten_thuong_hieu' => ['required', 'string', 'max:255', 'unique:thuong_hieu,ten_thuong_hieu,' . $thuongHieu->ma_thuong_hieu . ',ma_thuong_hieu'],
            'duong_dan' => ['nullable', 'string', 'max:255', 'unique:thuong_hieu,duong_dan,' . $thuongHieu->ma_thuong_hieu . ',ma_thuong_hieu'],
            'mo_ta' => ['nullable', 'string'],
            'logo' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            'trang_thai' => ['nullable', 'string', 'max:50'],
        ]);

        $data = [
            'ten_thuong_hieu' => $validated['ten_thuong_hieu'],
            'duong_dan' => $validated['duong_dan'] ?? Str::slug($validated['ten_thuong_hieu']),
            'mo_ta' => $validated['mo_ta'] ?? null,
            'trang_thai' => $validated['trang_thai'] ?? $thuongHieu->trang_thai,
        ];

        if ($request->hasFile('logo')) {
            if ($thuongHieu->logo && Storage::disk('public')->exists($thuongHieu->logo)) {
                Storage::disk('public')->delete($thuongHieu->logo);
            }

            $data['logo'] = $request->file('logo')->store('thuong-hieu', 'public');
        }

        $thuongHieu->update($data);

        return redirect()->route('thuonghieu.index')->with('success', 'Cập nhật thương hiệu thành công.');
    }

    /**
     * Xóa thương hiệu.
     */
    public function destroy(ThuongHieu $thuongHieu)
    {
        if ($thuongHieu->logo && Storage::disk('public')->exists($thuongHieu->logo)) {
            Storage::disk('public')->delete($thuongHieu->logo);
        }

        $thuongHieu->delete();

        return redirect()->route('thuonghieu.index')->with('success', 'Xóa thương hiệu thành công.');
    }
}
