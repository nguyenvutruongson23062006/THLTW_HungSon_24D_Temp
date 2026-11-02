<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DatHangService
{
    public function tinhTien(array $dong, ?string $maGiamGia, ?User $user, bool $khoa = false): array
    {
        $q = DB::table('san_pham')->whereIn('ma_san_pham', array_column($dong, 'ma_san_pham'))->whereNull('ngay_xoa')->orderBy('ma_san_pham');
        if ($khoa) {
            $q->lockForUpdate();
        }
        $sanPhams = $q->get()->keyBy('ma_san_pham');
        $tamTinh = '0.00';
        $chiTiet = [];
        foreach ($dong as $d) {
            $p = $sanPhams->get($d['ma_san_pham']);
            if (! $p || $p->trang_thai !== 'hoat_dong' || $p->so_luong_ton < $d['so_luong']) {
                throw ValidationException::withMessages(['chi_tiet' => 'Sản phẩm #'.$d['ma_san_pham'].' đã ngừng bán hoặc không đủ tồn kho. Hãy cập nhật giỏ hàng.']);
            }
            $gia = $p->gia_khuyen_mai !== null ? (string) $p->gia_khuyen_mai : (string) $p->gia_ban;
            $thanhTien = bcmul($gia, (string) $d['so_luong'], 2);
            $tamTinh = bcadd($tamTinh, $thanhTien, 2);
            if (bccomp($tamTinh, '9999999999999.99', 2) > 0) {
                throw ValidationException::withMessages(['chi_tiet' => 'Tổng đơn vượt giới hạn cho phép.']);
            }
            $chiTiet[] = ['ma_san_pham' => $p->ma_san_pham, 'ten_san_pham' => $p->ten_san_pham, 'anh_dai_dien' => $p->anh_dai_dien,
                'so_luong' => (int) $d['so_luong'], 'don_gia' => $gia, 'thanh_tien' => $thanhTien, 'ton_kho' => $p->so_luong_ton];
        }
        $giam = '0.00';
        $khuyenMai = null;
        if ($maGiamGia !== null && trim($maGiamGia) !== '') {
            $q = DB::table('khuyen_mai')->where('ma_giam_gia', strtoupper(trim($maGiamGia)))->whereNull('ngay_xoa');
            if ($khoa) {
                $q->lockForUpdate();
            }
            $khuyenMai = $q->first();
            $homNay = now('Asia/Ho_Chi_Minh')->toDateString();
            if (! $khuyenMai || $khuyenMai->trang_thai !== 'hoat_dong' || ($khuyenMai->ngay_bat_dau !== null && $khuyenMai->ngay_bat_dau > $homNay) || ($khuyenMai->ngay_ket_thuc !== null && $khuyenMai->ngay_ket_thuc < $homNay)) {
                throw ValidationException::withMessages(['ma_giam_gia' => 'Mã khuyến mãi không hợp lệ hoặc không trong thời gian áp dụng.']);
            }
            if ($khuyenMai->chi_thanh_vien && ! $user) {
                throw ValidationException::withMessages(['ma_giam_gia' => 'Vui lòng đăng nhập để sử dụng mã dành cho thành viên.']);
            }
            if ($khuyenMai->gioi_han_su_dung !== null && $khuyenMai->da_su_dung >= $khuyenMai->gioi_han_su_dung) {
                throw ValidationException::withMessages(['ma_giam_gia' => 'Mã khuyến mãi đã hết lượt sử dụng.']);
            }
            if (bccomp($tamTinh, (string) $khuyenMai->don_toi_thieu, 2) < 0) {
                throw ValidationException::withMessages(['ma_giam_gia' => 'Đơn hàng chưa đạt giá trị tối thiểu của mã khuyến mãi.']);
            }
            $giam = $khuyenMai->loai_giam === 'phan_tram' ? bcdiv(bcmul($tamTinh, (string) $khuyenMai->gia_tri_giam, 4), '100', 2) : (string) $khuyenMai->gia_tri_giam;
            if ($khuyenMai->giam_toi_da !== null && bccomp($giam, (string) $khuyenMai->giam_toi_da, 2) > 0) {
                $giam = (string) $khuyenMai->giam_toi_da;
            }
            if (bccomp($giam, $tamTinh, 2) > 0) {
                $giam = $tamTinh;
            }
        }

        return ['chi_tiet' => $chiTiet, 'tam_tinh' => $tamTinh, 'giam_gia' => $giam, 'tong_tien' => bcsub($tamTinh, $giam, 2),
            'ma_giam_gia' => $khuyenMai?->ma_giam_gia, 'ma_khuyen_mai' => $khuyenMai?->ma_khuyen_mai];
    }

    public function taoDon(array $data, ?User $user): array
    {
        usort($data['chi_tiet'], fn ($a, $b) => $a['ma_san_pham'] <=> $b['ma_san_pham']);
        $data['chi_tiet'] = array_map(fn ($d) => ['ma_san_pham' => (int) $d['ma_san_pham'], 'so_luong' => (int) $d['so_luong']], $data['chi_tiet']);
        $data['ma_giam_gia'] = strtoupper(trim($data['ma_giam_gia'] ?? ''));
        $data['ghi_chu'] = $data['ghi_chu'] ?? null;
        $data['dia_chi_email'] = $data['dia_chi_email'] ?? null;
        $data['so_thang_tra_gop'] = (int) ($data['so_thang_tra_gop'] ?? 0);
        ksort($data);
        $dauVan = hash('sha256', json_encode([$data, $user?->getKey()], JSON_UNESCAPED_UNICODE));
        if ($cu = DB::table('don_hang')->where('khoa_dat_hang', $data['khoa_dat_hang'])->first()) {
            return $this->donDaTao($cu, $dauVan);
        }
        try {
            $ma = DB::transaction(function () use ($data, $user, $dauVan) {
                // Đặt khóa duy nhất trước khi trừ kho: gửi lại yêu cầu không tạo thêm đơn.
                $ma = DB::table('don_hang')->insertGetId([
                    'ma_nguoi_dung' => $user?->getKey(), 'ho_ten' => $data['ho_ten'], 'dia_chi_email' => $data['dia_chi_email'],
                    'so_dien_thoai' => $data['so_dien_thoai'], 'dia_chi_giao_hang' => $data['dia_chi_giao_hang'],
                    'phuong_thuc_thanh_toan' => $data['phuong_thuc_thanh_toan'], 'ghi_chu' => $data['ghi_chu'],
                    'so_thang_tra_gop' => $data['so_thang_tra_gop'],
                    'khoa_dat_hang' => $data['khoa_dat_hang'], 'dau_van_dat_hang' => $dauVan, 'ngay_tao' => now(), 'ngay_cap_nhat' => now(),
                ], 'ma_don_hang');
                $tinh = $this->tinhTien($data['chi_tiet'], $data['ma_giam_gia'], $user, true);
                if (bccomp((string) $data['tong_tien_du_kien'], $tinh['tong_tien'], 2) !== 0) {
                    throw ValidationException::withMessages(['tong_tien_du_kien' => 'Giá hoặc ưu đãi đã thay đổi. Hãy cập nhật báo giá và xác nhận lại tổng tiền.']);
                }
                app(ThanhToanService::class)->kiemTra($data['phuong_thuc_thanh_toan'], $tinh['tong_tien']);
                foreach ($tinh['chi_tiet'] as $d) {
                    DB::table('chi_tiet_don_hang')->insert([
                        'ma_don_hang' => $ma, 'ma_san_pham' => $d['ma_san_pham'], 'ten_san_pham' => $d['ten_san_pham'],
                        'so_luong' => $d['so_luong'], 'don_gia' => $d['don_gia'], 'thanh_tien' => $d['thanh_tien'], 'ngay_tao' => now(), 'ngay_cap_nhat' => now(),
                    ]);
                    if ($data['phuong_thuc_thanh_toan'] !== 'chuyen_khoan') DB::table('san_pham')->where('ma_san_pham', $d['ma_san_pham'])->update(['so_luong_ton' => $d['ton_kho'] - $d['so_luong'], 'ngay_cap_nhat' => now()]);
                }
                if ($tinh['ma_khuyen_mai'] && $data['phuong_thuc_thanh_toan'] !== 'chuyen_khoan') {
                    DB::table('khuyen_mai')->where('ma_khuyen_mai', $tinh['ma_khuyen_mai'])->increment('da_su_dung');
                }
                unset($tinh['chi_tiet']);
                DB::table('don_hang')->where('ma_don_hang', $ma)->update([...$tinh, 'da_tru_kho' => $data['phuong_thuc_thanh_toan'] !== 'chuyen_khoan']);
                $this->lichSu($ma, null, 'cho_xac_nhan', $user?->getKey(), 'Tạo đơn hàng từ cửa hàng.');

                return $ma;
            }, 3);
        } catch (QueryException $error) {
            // Chỉ chấp nhận retry khi cùng khóa và cùng dữ liệu; lỗi DB khác vẫn được báo.
            if ($cu = DB::table('don_hang')->where('khoa_dat_hang', $data['khoa_dat_hang'])->first()) {
                return $this->donDaTao($cu, $dauVan);
            }
            throw $error;
        }

        return ['don_hang' => $this->chiTiet($ma), 'da_ton_tai' => false];
    }

    private function donDaTao(object $cu, string $dauVan): array
    {
        abort_unless($cu->dau_van_dat_hang && hash_equals($cu->dau_van_dat_hang, $dauVan), 409, 'Yêu cầu đặt hàng này đã được dùng với dữ liệu khác. Hãy tải lại trang.');

        return ['don_hang' => $this->chiTiet($cu->ma_don_hang), 'da_ton_tai' => true];
    }

    public function chiTiet(int $ma): array
    {
        $don = DB::table('don_hang')->where('ma_don_hang', $ma)->whereNull('ngay_xoa')->first();
        abort_if(! $don, 404);
        $data = (array) $don;
        $data['ngay_tao'] = $don->ngay_tao ? Carbon::parse($don->ngay_tao)->toISOString() : null;
        $data['ngay_cap_nhat'] = $don->ngay_cap_nhat ? Carbon::parse($don->ngay_cap_nhat)->toISOString() : null;
        unset($data['khoa_dat_hang'], $data['dau_van_dat_hang']);
        $data['lich_tra_gop'] = [];
        if ($don->so_thang_tra_gop > 0) {
            $moiThang = bcdiv((string) $don->tong_tien, (string) $don->so_thang_tra_gop, 0);
            for ($i = 1; $i <= $don->so_thang_tra_gop; $i++) {
                $data['lich_tra_gop'][] = ['ky' => $i, 'so_tien' => $i === $don->so_thang_tra_gop ? bcsub((string) $don->tong_tien, bcmul($moiThang, (string) ($i - 1), 2), 2) : $moiThang];
            }
        }
        if ($don->phuong_thuc_thanh_toan === 'chuyen_khoan') {
            $c = DB::table('cai_dat')->whereIn('khoa', ['ngan_hang_bin', 'tai_khoan_nhan', 'chu_tai_khoan'])->pluck('gia_tri', 'khoa');
            $data['chuyen_khoan'] = null;
            if (preg_match('/^[0-9]{6}$/D', $c['ngan_hang_bin'] ?? '') && preg_match('/^[0-9]{1,19}$/D', $c['tai_khoan_nhan'] ?? '') && ! empty($c['chu_tai_khoan'])) {
                $data['chuyen_khoan'] = ['ngan_hang_bin' => $c['ngan_hang_bin'], 'tai_khoan_nhan' => $c['tai_khoan_nhan'], 'chu_tai_khoan' => $c['chu_tai_khoan'], 'noi_dung' => 'THANH TOAN DH'.$ma];
            }
        }
        if ($don->phuong_thuc_thanh_toan === 'chuyen_khoan' || app(ThanhToanService::class)->laOnline($don->phuong_thuc_thanh_toan)) {
            $data['khoa_thanh_toan'] = app(ThanhToanService::class)->khoa($don);
        }
        $data['chi_tiet_don_hangs'] = DB::table('chi_tiet_don_hang')->where('ma_don_hang', $ma)->whereNull('ngay_xoa')->get();
        $data['lich_su'] = DB::table('lich_su_don_hang')->where('ma_don_hang', $ma)->orderBy('ma_lich_su')->get(['trang_thai_cu', 'trang_thai_moi', 'ghi_chu', 'ngay_tao'])->map(function ($l) {
            $l->ngay_tao = Carbon::parse($l->ngay_tao)->toISOString();

            return $l;
        });

        return $data;
    }

    // Gọi bên trong transaction đã khóa đơn hàng, dùng chung cho thành viên và admin.
    public function hoanKho(object $don): void
    {
        abort_if(DB::table('giao_dich_thanh_toan')->where('ma_don_hang', $don->ma_don_hang)->where('trang_thai', 'dang_cho')->where('het_han', '>', now())->exists(), 409, 'Đang có phiên thanh toán VNPay. Vui lòng chờ kết quả hoặc chờ hết hạn 15 phút trước khi hủy.');
        if (! $don->da_tru_kho) {
            return;
        }
        $dong = DB::table('chi_tiet_don_hang')->where('ma_don_hang', $don->ma_don_hang)->whereNull('ngay_xoa')->orderBy('ma_san_pham')->get();
        $sanPhams = DB::table('san_pham')->whereIn('ma_san_pham', $dong->pluck('ma_san_pham'))->orderBy('ma_san_pham')->lockForUpdate()->get()->keyBy('ma_san_pham');
        foreach ($dong as $d) {
            $p = $sanPhams->get($d->ma_san_pham);
            if (! $p || $p->so_luong_ton + $d->so_luong > 4294967295) {
                throw ValidationException::withMessages(['ton_kho' => 'Không thể hoàn kho do sản phẩm không tồn tại hoặc tồn kho vượt giới hạn.']);
            }
            DB::table('san_pham')->where('ma_san_pham', $d->ma_san_pham)->update(['so_luong_ton' => $p->so_luong_ton + $d->so_luong, 'ngay_cap_nhat' => now()]);
        }
        if ($don->ma_khuyen_mai) {
            $km = DB::table('khuyen_mai')->where('ma_khuyen_mai', $don->ma_khuyen_mai)->lockForUpdate()->first();
            if ($km && $km->da_su_dung > 0) {
                DB::table('khuyen_mai')->where('ma_khuyen_mai', $don->ma_khuyen_mai)->decrement('da_su_dung');
            }
        }
        DB::table('don_hang')->where('ma_don_hang', $don->ma_don_hang)->update(['da_tru_kho' => false]);
    }

    public function truKhoKhiNhanTien(object $don): void
    {
        if ($don->da_tru_kho) return;
        $dong = DB::table('chi_tiet_don_hang')->where('ma_don_hang', $don->ma_don_hang)->whereNull('ngay_xoa')->orderBy('ma_san_pham')->get();
        foreach ($dong as $d) {
            $p = DB::table('san_pham')->where('ma_san_pham', $d->ma_san_pham)->lockForUpdate()->first();
            if (! $p || $p->ngay_xoa || $p->so_luong_ton < $d->so_luong) throw ValidationException::withMessages(['ton_kho' => 'Không đủ hàng để xác nhận nhận tiền. Cần đối soát và liên hệ khách để xử lý hoặc hoàn tiền.']);
            DB::table('san_pham')->where('ma_san_pham', $p->ma_san_pham)->decrement('so_luong_ton', $d->so_luong);
        }
        if ($don->ma_khuyen_mai) DB::table('khuyen_mai')->where('ma_khuyen_mai', $don->ma_khuyen_mai)->increment('da_su_dung');
        DB::table('don_hang')->where('ma_don_hang', $don->ma_don_hang)->update(['da_tru_kho' => true]);
    }

    public function lichSu(int $ma, ?string $cu, string $moi, ?int $nguoiDung, string $ghiChu): void
    {
        DB::table('lich_su_don_hang')->insert(['ma_don_hang' => $ma, 'ma_nguoi_dung' => $nguoiDung, 'trang_thai_cu' => $cu, 'trang_thai_moi' => $moi, 'ghi_chu' => $ghiChu, 'ngay_tao' => now()]);
    }
}
