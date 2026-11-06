<?php

namespace App\Http\Controllers;

use App\Support\ThongBaoKiemTra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class KhuyenMaiController extends Controller
{
    public function index(Request $request)
    {
        $request->validate(['thung_rac' => 'nullable|boolean']);
        $q = DB::table('khuyen_mai');
        $request->boolean('thung_rac') ? $q->whereNotNull('ngay_xoa') : $q->whereNull('ngay_xoa');

        return response()->json(['data' => $q->orderByDesc('ma_khuyen_mai')->get()]);
    }

    public function store(Request $request)
    {
        return $this->luu($request);
    }

    public function update(Request $request, int $ma)
    {
        return $this->luu($request, $ma);
    }

    private function luu(Request $request, ?int $ma = null)
    {
        $request->merge(['ma_giam_gia' => strtoupper(trim((string) $request->input('ma_giam_gia')))]);
        $data = ThongBaoKiemTra::duLieu($request, [
            'ma_giam_gia' => ['required', 'regex:/^[A-Z0-9_-]{3,50}$/', Rule::unique('khuyen_mai', 'ma_giam_gia')->ignore($ma, 'ma_khuyen_mai')],
            'ten_khuyen_mai' => 'required|string|max:255', 'loai_giam' => ['required', Rule::in(['phan_tram', 'so_tien'])],
            'gia_tri_giam' => 'required|integer|min:1|max:999999999999', 'don_toi_thieu' => 'required|integer|min:0|max:999999999999',
            'giam_toi_da' => 'nullable|integer|min:0|max:999999999999', 'ngay_bat_dau' => 'nullable|date_format:Y-m-d',
            'ngay_ket_thuc' => ['nullable', 'date_format:Y-m-d', ...($request->filled('ngay_bat_dau') ? ['after_or_equal:ngay_bat_dau'] : [])],
            'gioi_han_su_dung' => 'nullable|integer|min:0|max:1000000000', 'chi_thanh_vien' => 'required|boolean',
            'trang_thai' => ['required', Rule::in(['hoat_dong', 'tam_ngung'])],
        ], ['ma_giam_gia.unique' => 'Mã đã tồn tại, kể cả trong thùng rác.', 'ngay_ket_thuc.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.']);
        if ($data['loai_giam'] === 'phan_tram' && $data['gia_tri_giam'] > 100) {
            throw ValidationException::withMessages(['gia_tri_giam' => 'Phần trăm giảm không được vượt quá 100.']);
        }
        $data['ngay_bat_dau'] = $data['ngay_bat_dau'] ?? null;
        $data['ngay_ket_thuc'] = $data['ngay_ket_thuc'] ?? null;
        $data['giam_toi_da'] = ($data['giam_toi_da'] ?? 0) > 0 ? $data['giam_toi_da'] : null;
        $data['gioi_han_su_dung'] = ($data['gioi_han_su_dung'] ?? 0) > 0 ? $data['gioi_han_su_dung'] : null;
        $ma = DB::transaction(function () use ($ma, $data) {
            if ($ma) {
                $cu = DB::table('khuyen_mai')->where('ma_khuyen_mai', $ma)->whereNull('ngay_xoa')->lockForUpdate()->first();
                abort_if(! $cu, 404);
                if ($data['gioi_han_su_dung'] !== null && $data['gioi_han_su_dung'] < $cu->da_su_dung) {
                    throw ValidationException::withMessages(['gioi_han_su_dung' => 'Giới hạn không được nhỏ hơn số lượt đã sử dụng.']);
                }
                DB::table('khuyen_mai')->where('ma_khuyen_mai', $ma)->update([...$data, 'ngay_cap_nhat' => now()]);
            } else {
                $ma = DB::table('khuyen_mai')->insertGetId([...$data, 'ngay_tao' => now(), 'ngay_cap_nhat' => now()], 'ma_khuyen_mai');
            }

            return $ma;
        });

        return response()->json(['data' => DB::table('khuyen_mai')->where('ma_khuyen_mai', $ma)->first()]);
    }

    public function destroy(int $ma)
    {
        abort_unless(DB::table('khuyen_mai')->where('ma_khuyen_mai', $ma)->whereNull('ngay_xoa')->update(['ngay_xoa' => now(), 'ngay_cap_nhat' => now()]), 404);

        return response()->json(['message' => 'Đã chuyển khuyến mãi vào thùng rác.']);
    }

    public function khoiPhuc(int $ma)
    {
        abort_unless(DB::table('khuyen_mai')->where('ma_khuyen_mai', $ma)->whereNotNull('ngay_xoa')->update(['ngay_xoa' => null, 'ngay_cap_nhat' => now()]), 404);

        return response()->json(['message' => 'Đã khôi phục khuyến mãi.']);
    }

    public function xoaVinhVien(int $ma)
    {
        DB::transaction(function () use ($ma) {
            abort_unless(DB::table('khuyen_mai')->where('ma_khuyen_mai', $ma)->whereNotNull('ngay_xoa')->lockForUpdate()->first(), 404);
            if (DB::table('don_hang')->where('ma_khuyen_mai', $ma)->exists()) {
                throw ValidationException::withMessages(['khuyen_mai' => 'Mã đã được dùng trong đơn hàng. Hãy giữ trong thùng rác để bảo toàn lịch sử.']);
            }
            DB::table('khuyen_mai')->where('ma_khuyen_mai', $ma)->delete();
        });

        return response()->json(['message' => 'Đã xóa vĩnh viễn khuyến mãi.']);
    }
}
