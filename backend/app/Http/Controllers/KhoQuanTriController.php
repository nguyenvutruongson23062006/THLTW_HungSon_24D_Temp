<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class KhoQuanTriController extends Controller
{
    private function cauHinh(string $loai): array
    {
        abort_unless(in_array($loai, ['nhap', 'xuat'], true), 404);

        return ['phieu_'.$loai, 'ma_phieu_'.$loai, 'chi_tiet_phieu_'.$loai, 'ma_chi_tiet_phieu_'.$loai, 'so_phieu_'.$loai];
    }

    public function index(Request $request, string $loai)
    {
        [$bang, $khoa] = $this->cauHinh($loai);
        $request->validate(['thung_rac' => 'nullable|boolean']);
        $query = DB::table($bang.' as p')->leftJoin('nguoi_dung as u', 'p.ma_nguoi_dung', '=', 'u.ma_nguoi_dung')->select('p.*', 'u.ho_ten as nguoi_lap');
        $request->boolean('thung_rac') ? $query->whereNotNull('p.ngay_xoa') : $query->whereNull('p.ngay_xoa');

        return response()->json(['data' => $query->orderByDesc('p.'.$khoa)->get()]);
    }

    public function show(string $loai, int $ma)
    {
        return response()->json(['data' => $this->chiTiet($loai, $ma)]);
    }

    private function chiTiet(string $loai, int $ma): object
    {
        [$bang, $khoa, $chiTiet, $khoaChiTiet] = $this->cauHinh($loai);
        $phieu = DB::table($bang.' as p')->leftJoin('nguoi_dung as u', 'p.ma_nguoi_dung', '=', 'u.ma_nguoi_dung')
            ->where('p.'.$khoa, $ma)->whereNull('p.ngay_xoa')->select('p.*', 'u.ho_ten as nguoi_lap')->first();
        abort_if(! $phieu, 404);
        $phieu->chi_tiet = DB::table($chiTiet.' as c')->leftJoin('san_pham as s', 'c.ma_san_pham', '=', 's.ma_san_pham')
            ->where('c.'.$khoa, $ma)->whereNull('c.ngay_xoa')->orderBy('c.'.$khoaChiTiet)->select('c.*', 's.ten_san_pham', 's.so_luong_ton')->get();

        return $phieu;
    }

    public function store(Request $request, string $loai)
    {
        return $this->luu($request, $loai);
    }

    public function update(Request $request, string $loai, int $ma)
    {
        return $this->luu($request, $loai, $ma);
    }

    private function luu(Request $request, string $loai, ?int $ma = null)
    {
        [$bang, $khoa, $bangChiTiet, , $soPhieu] = $this->cauHinh($loai);
        $rules = [
            $soPhieu => ['nullable', 'string', 'max:255', Rule::unique($bang, $soPhieu)->ignore($ma, $khoa)],
            'ghi_chu' => 'nullable|string|max:10000', 'chi_tiet' => 'required|array|min:1|max:100',
            'chi_tiet.*.ma_san_pham' => ['required', 'integer', 'distinct', Rule::exists('san_pham', 'ma_san_pham')->whereNull('ngay_xoa')],
            'chi_tiet.*.so_luong' => 'required|integer|min:1|max:1000000',
        ];
        if ($loai === 'nhap') {
            $rules['nha_cung_cap'] = 'required|string|max:255';
            $rules['chi_tiet.*.don_gia'] = 'required|numeric|min:0|max:99999999999|decimal:0,2';
        } else {
            $rules['ly_do_xuat'] = ['required', Rule::in(['ban_hang', 'trung_bay', 'tra_hang', 'khac'])];
            $rules['chi_tiet.*.ghi_chu'] = 'nullable|string|max:2000';
        }
        $data = $request->validate($rules, ['chi_tiet.*.ma_san_pham.distinct' => 'Mỗi sản phẩm chỉ được xuất hiện một lần trong phiếu.', '*.required' => 'Vui lòng điền đầy đủ thông tin bắt buộc.']);
        $ma = DB::transaction(function () use ($request, $loai, $ma, $bang, $khoa, $bangChiTiet, $soPhieu, $data) {
            if ($ma) {
                $cu = DB::table($bang)->where($khoa, $ma)->whereNull('ngay_xoa')->lockForUpdate()->first();
                abort_if(! $cu, 404);
                $this->chiChoSuaNhap($cu);
            }
            $header = [
                $soPhieu => $data[$soPhieu] ?? ($cu->{$soPhieu} ?? strtoupper('P'.$loai[0]).'-'.now()->format('Ymd').'-'.Str::upper(Str::random(8))),
                'ghi_chu' => $data['ghi_chu'] ?? null,
                'ngay_cap_nhat' => now(),
            ];
            $loai === 'nhap' ? $header['nha_cung_cap'] = $data['nha_cung_cap'] : $header['ly_do_xuat'] = $data['ly_do_xuat'];
            if (! $ma) {
                $header += ['ma_nguoi_dung' => $request->user()->getKey(), 'trang_thai' => 'ban_nhap', 'ngay_tao' => now()];
                $ma = DB::table($bang)->insertGetId($header, $khoa);
            } else {
                DB::table($bang)->where($khoa, $ma)->update($header);
                DB::table($bangChiTiet)->where($khoa, $ma)->delete();
            }
            $tong = '0.00';
            foreach ($data['chi_tiet'] as $dong) {
                $record = [$khoa => $ma, 'ma_san_pham' => $dong['ma_san_pham'], 'so_luong' => $dong['so_luong'], 'ngay_tao' => now(), 'ngay_cap_nhat' => now()];
                if ($loai === 'nhap') {
                    $record['don_gia'] = $dong['don_gia'];
                    $record['thanh_tien'] = bcmul((string) $dong['don_gia'], (string) $dong['so_luong'], 2);
                    $tong = bcadd($tong, $record['thanh_tien'], 2);
                    if (bccomp($tong, '9999999999999.99', 2) > 0) {
                        throw ValidationException::withMessages(['chi_tiet' => 'Tổng tiền vượt giới hạn cho phép.']);
                    }
                } else {
                    $record['ghi_chu'] = $dong['ghi_chu'] ?? null;
                }
                DB::table($bangChiTiet)->insert($record);
            }
            if ($loai === 'nhap') {
                DB::table($bang)->where($khoa, $ma)->update(['tong_tien' => $tong]);
            }

            return $ma;
        });

        return response()->json(['message' => 'Đã lưu phiếu nháp. Xác nhận hoàn tất để cập nhật tồn kho.', 'data' => $this->chiTiet($loai, $ma)]);
    }

    public function hoanTat(string $loai, int $ma)
    {
        [$bang, $khoa, $chiTiet] = $this->cauHinh($loai);
        DB::transaction(function () use ($loai, $ma, $bang, $khoa, $chiTiet) {
            $phieu = DB::table($bang)->where($khoa, $ma)->whereNull('ngay_xoa')->lockForUpdate()->first();
            abort_if(! $phieu, 404);
            $this->chiChoSuaNhap($phieu);
            $dongPhieu = DB::table($chiTiet)->where($khoa, $ma)->whereNull('ngay_xoa')->orderBy('ma_san_pham')->get();
            if ($dongPhieu->isEmpty()) {
                throw ValidationException::withMessages(['chi_tiet' => 'Phiếu phải có ít nhất một sản phẩm.']);
            }
            // Khóa sản phẩm theo cùng thứ tự để tránh hai phiếu xuất dùng chung tồn kho.
            $sanPhams = DB::table('san_pham')->whereIn('ma_san_pham', $dongPhieu->pluck('ma_san_pham'))->whereNull('ngay_xoa')->orderBy('ma_san_pham')->lockForUpdate()->get()->keyBy('ma_san_pham');
            foreach ($dongPhieu as $dong) {
                $sanPham = $sanPhams->get($dong->ma_san_pham);
                if (! $sanPham || ($loai === 'xuat' && $sanPham->so_luong_ton < $dong->so_luong)) {
                    throw ValidationException::withMessages(['chi_tiet' => 'Sản phẩm đã bị xóa hoặc không đủ tồn kho để xuất.']);
                }
                $tonMoi = $sanPham->so_luong_ton + ($loai === 'nhap' ? $dong->so_luong : -$dong->so_luong);
                if ($tonMoi > 4294967295) {
                    throw ValidationException::withMessages(['chi_tiet' => 'Số lượng tồn vượt giới hạn cho phép.']);
                }
                DB::table('san_pham')->where('ma_san_pham', $dong->ma_san_pham)->update(['so_luong_ton' => $tonMoi, 'ngay_cap_nhat' => now()]);
            }
            DB::table($bang)->where($khoa, $ma)->update(['trang_thai' => 'hoan_tat', 'ngay_cap_nhat' => now()]);
        });

        return response()->json(['message' => 'Đã hoàn tất phiếu và cập nhật tồn kho.', 'data' => $this->chiTiet($loai, $ma)]);
    }

    public function destroy(string $loai, int $ma)
    {
        [$bang, $khoa] = $this->cauHinh($loai);
        DB::transaction(function () use ($bang, $khoa, $ma) {
            $phieu = DB::table($bang)->where($khoa, $ma)->whereNull('ngay_xoa')->lockForUpdate()->first();
            abort_if(! $phieu, 404);
            $this->chiChoSuaNhap($phieu);
            DB::table($bang)->where($khoa, $ma)->update(['ngay_xoa' => now(), 'ngay_cap_nhat' => now()]);
        });

        return response()->json(['message' => 'Đã chuyển phiếu nháp vào thùng rác.']);
    }

    public function khoiPhuc(string $loai, int $ma)
    {
        [$bang, $khoa] = $this->cauHinh($loai);
        abort_unless(DB::table($bang)->where($khoa, $ma)->whereNotNull('ngay_xoa')->where('trang_thai', 'ban_nhap')->exists(), 404);
        DB::table($bang)->where($khoa, $ma)->update(['ngay_xoa' => null, 'ngay_cap_nhat' => now()]);

        return response()->json(['message' => 'Đã khôi phục phiếu nháp.']);
    }

    private function chiChoSuaNhap(object $phieu): void
    {
        if ($phieu->trang_thai !== 'ban_nhap') {
            abort(409, 'Phiếu đã hoàn tất, không được sửa, xóa hoặc xác nhận lại.');
        }
    }
}
