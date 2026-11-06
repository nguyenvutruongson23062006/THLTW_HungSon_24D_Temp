<?php

namespace App\Http\Controllers;

use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ThongKeQuanTriController extends Controller
{
    public function timKiem(Request $request)
    {
        $data = $request->validate(['tu_khoa' => 'required|string|min:2|max:100']);
        $tuKhoa = trim($data['tu_khoa']);
        $ketQua = [];
        foreach ([
            ['san_pham', 'ma_san_pham', 'ten_san_pham', 'Sản phẩm', '/admin/san-pham/'],
            ['nguoi_dung', 'ma_nguoi_dung', 'ho_ten', 'Người dùng', '/admin/nguoi-dung'],
            ['don_hang', 'ma_don_hang', 'ho_ten', 'Đơn hàng', '/admin/don-hang/'],
            ['bai_viet', 'ma_bai_viet', 'tieu_de', 'Bài viết', '/admin/bai-viet'],
            ['lien_he', 'ma_lien_he', 'ho_ten', 'Liên hệ', '/admin/lien-he'],
        ] as [$bang, $khoa, $ten, $nhom, $url]) {
            $query = DB::table($bang)->whereNull('ngay_xoa')->where(function ($q) use ($tuKhoa, $ten, $khoa, $bang) {
                $q->where($ten, 'like', '%'.$tuKhoa.'%');
                if (ctype_digit($tuKhoa)) {
                    $q->orWhere($khoa, (int) $tuKhoa);
                }
                if (in_array($bang, ['nguoi_dung', 'don_hang', 'lien_he'], true)) {
                    $q->orWhere('dia_chi_email', 'like', '%'.$tuKhoa.'%')->orWhere('so_dien_thoai', 'like', '%'.$tuKhoa.'%');
                }
            });
            foreach ($query->limit(10)->get([$khoa, $ten]) as $dong) {
                $ketQua[] = ['nhom' => $nhom, 'ma' => $dong->{$khoa}, 'ten' => $dong->{$ten}, 'duong_dan' => $url.(str_ends_with($url, '/') ? $dong->{$khoa} : '')];
            }
        }

        return response()->json(['data' => $ketQua]);
    }

    public function thongBao()
    {
        $nguong = (int) (DB::table('cai_dat')->where('khoa', 'nguong_ton_kho')->value('gia_tri') ?? 5);

        return response()->json(['data' => [
            'don_cho_xac_nhan' => DB::table('don_hang')->whereNull('ngay_xoa')->where('trang_thai', 'cho_xac_nhan')->count(),
            'lien_he_chua_xu_ly' => DB::table('lien_he')->whereNull('ngay_xoa')->where('trang_thai', 'chua_xu_ly')->count(),
            'san_pham_sap_het' => DB::table('san_pham')->whereNull('ngay_xoa')->where('so_luong_ton', '<=', $nguong)->count(),
        ]]);
    }

    public function index(Request $request)
    {
        $input = $request->validate([
            'tu_ngay' => 'nullable|date_format:Y-m-d', 'den_ngay' => 'nullable|date_format:Y-m-d',
        ]);
        $tu = isset($input['tu_ngay']) ? CarbonImmutable::parse($input['tu_ngay'])->startOfDay() : CarbonImmutable::now()->startOfMonth();
        $den = isset($input['den_ngay']) ? CarbonImmutable::parse($input['den_ngay'])->endOfDay() : CarbonImmutable::now()->endOfDay();
        $tongQuan = $request->is('api/admin/tong-quan');
        if ($tongQuan) {
            $dauTien = DB::table('don_hang')->whereNull('ngay_xoa')->min('ngay_tao');
            $tu = $dauTien ? CarbonImmutable::parse($dauTien)->startOfDay() : CarbonImmutable::now()->startOfMonth();
            $den = CarbonImmutable::now()->endOfDay();
        }
        if ($tu->gt($den) || (! $tongQuan && $tu->diffInDays($den) > 366)) {
            throw ValidationException::withMessages(['tu_ngay' => 'Khoảng báo cáo phải hợp lệ và không quá 366 ngày.']);
        }
        $donHang = DB::table('don_hang')->whereNull('ngay_xoa')->whereBetween('ngay_tao', [$tu, $den]);
        $daThu = (clone $donHang)->where('trang_thai_thanh_toan', 'da_thanh_toan')->where('trang_thai', '!=', 'da_huy');
        $nguong = (int) (DB::table('cai_dat')->where('khoa', 'nguong_ton_kho')->value('gia_tri') ?? 5);
        $banChay = DB::table('chi_tiet_don_hang as c')->join('don_hang as d', 'c.ma_don_hang', '=', 'd.ma_don_hang')
            ->whereNull('c.ngay_xoa')->whereNull('d.ngay_xoa')->whereBetween('d.ngay_tao', [$tu, $den])
            ->whereIn('d.trang_thai', ['hoan_tat', 'da_giao'])
            ->select('c.ma_san_pham', 'c.ten_san_pham')->selectRaw('SUM(c.so_luong) as so_luong_ban, SUM(c.thanh_tien) as thanh_tien')
            ->groupBy('c.ma_san_pham', 'c.ten_san_pham')->orderByDesc('so_luong_ban')->limit(10)->get();
        $theoNgay = (clone $daThu)->select('ngay_tao', 'tong_tien')->get()->groupBy(fn ($don) => substr($don->ngay_tao, 0, 10));
        $bieuDo = [];
        for ($ngay = $tu; ! $tongQuan && $ngay->lte($den); $ngay = $ngay->addDay()) {
            $nhom = $theoNgay->get($ngay->toDateString(), collect());
            $bieuDo[] = ['ngay' => $ngay->toDateString(), 'doanh_thu' => $nhom->sum('tong_tien'), 'so_don' => $nhom->count()];
        }
        $tonKho = DB::table('san_pham as s')->leftJoin('danh_muc as d', 's.ma_danh_muc', '=', 'd.ma_danh_muc')
            ->whereNull('s.ngay_xoa')->select('s.ma_san_pham', 's.ten_san_pham', 's.so_luong_ton', 's.gia_ban', 'd.ten_danh_muc')->orderBy('s.so_luong_ton')->get();

        return response()->json(['data' => [
            'tu_ngay' => $tu->toDateString(), 'den_ngay' => $den->toDateString(), 'nguong_ton_kho' => $nguong,
            'tong_quan' => [
                'doanh_thu' => (clone $daThu)->sum('tong_tien'),
                'so_don_hang' => (clone $donHang)->count(),
                'so_san_pham_ban' => DB::table('chi_tiet_don_hang as c')->join('don_hang as d', 'c.ma_don_hang', '=', 'd.ma_don_hang')
                    ->whereNull('c.ngay_xoa')->whereNull('d.ngay_xoa')->whereBetween('d.ngay_tao', [$tu, $den])->whereIn('d.trang_thai', ['hoan_tat', 'da_giao'])->sum('c.so_luong'),
                'so_nguoi_dung' => DB::table('nguoi_dung')->whereNull('ngay_xoa')->count(),
                'so_san_pham' => $tonKho->count(),
                'so_san_pham_sap_het' => $tonKho->where('so_luong_ton', '<=', $nguong)->count(),
                'tong_ton_kho' => $tonKho->sum('so_luong_ton'),
                'chi_phi_nhap' => DB::table('phieu_nhap')->whereNull('ngay_xoa')->where('trang_thai', 'hoan_tat')->whereBetween('ngay_tao', [$tu, $den])->sum('tong_tien'),
            ],
            'don_hang_gan_day' => (clone $donHang)->orderByDesc('ngay_tao')->limit(8)->get(['ma_don_hang', 'ho_ten', 'tong_tien', 'trang_thai', 'trang_thai_thanh_toan', 'ngay_tao']),
            'ton_kho' => $tonKho, 'ban_chay' => $banChay, 'doanh_thu_theo_ngay' => $bieuDo,
        ]]);
    }
}
