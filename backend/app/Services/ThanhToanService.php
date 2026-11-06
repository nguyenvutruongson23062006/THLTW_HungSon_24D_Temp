<?php

namespace App\Services;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ThanhToanService
{
    public const PHUONG_THUC = [
        'tien_mat' => 'Tiền mặt khi nhận hàng (COD)',
        'chuyen_khoan' => 'Chuyển khoản ngân hàng — cửa hàng xác nhận',
        'vnpay_qr' => 'Quét mã VNPAY-QR',
        'vnpay_atm' => 'Thẻ ATM / tài khoản ngân hàng nội địa',
        'vnpay_the' => 'Thẻ quốc tế Visa / Mastercard / JCB',
    ];

    public function sanSang(): bool
    {
        return (bool) config('thanh_toan.vnpay.enabled')
            && (string) config('thanh_toan.vnpay.tmn_code') !== ''
            && (string) config('thanh_toan.vnpay.hash_secret') !== '';
    }

    public function laOnline(string $phuongThuc): bool
    {
        return in_array($phuongThuc, ['vnpay_qr', 'vnpay_atm', 'vnpay_the'], true);
    }

    public function kiemTra(string $phuongThuc, string $soTien): void
    {
        if (! $this->laOnline($phuongThuc)) return;
        if (! $this->sanSang()) {
            throw ValidationException::withMessages(['phuong_thuc_thanh_toan' => 'VNPay chưa được cấu hình. Vui lòng chọn COD hoặc chuyển khoản.']);
        }
        if (bccomp($soTien, '5000', 2) < 0 || bccomp($soTien, '9999999999', 2) > 0 || bccomp($soTien, bcadd($soTien, '0', 0), 2) !== 0) {
            throw ValidationException::withMessages(['tong_tien' => 'VNPay yêu cầu số tiền nguyên đồng, từ 5.000đ đến 9.999.999.999đ.']);
        }
    }

    // Khóa chỉ cho phép mở/kiểm tra thanh toán, không tiết lộ thông tin giao hàng.
    public function khoa(object $don): string
    {
        return hash_hmac('sha256', 'thanh-toan:'.$don->ma_don_hang.':'.$don->khoa_dat_hang, (string) config('app.key'));
    }

    public function xacThuc(int $ma, string $khoa): object
    {
        $don = DB::table('don_hang')->where('ma_don_hang', $ma)->whereNull('ngay_xoa')->first();
        abort_unless($don && $don->khoa_dat_hang && hash_equals($this->khoa($don), $khoa), 404, 'Không tìm thấy thông tin thanh toán.');
        return $don;
    }

    public function chuKy(array $data): string
    {
        unset($data['vnp_SecureHash'], $data['vnp_SecureHashType']);
        ksort($data);
        return hash_hmac('sha512', http_build_query($data, '', '&', PHP_QUERY_RFC1738), (string) config('thanh_toan.vnpay.hash_secret'));
    }

    public function hopLe(array $data): bool
    {
        if (! $this->sanSang() || ! isset($data['vnp_SecureHash']) || ! is_string($data['vnp_SecureHash'])) return false;
        foreach ($data as $key => $value) {
            if (! str_starts_with($key, 'vnp_') || ! is_scalar($value)) return false;
        }
        return hash_equals($this->chuKy($data), strtolower($data['vnp_SecureHash']))
            && ($data['vnp_TmnCode'] ?? '') === config('thanh_toan.vnpay.tmn_code');
    }

    public function tao(int $ma, string $khoa, string $ip): array
    {
        $this->xacThuc($ma, $khoa);
        return DB::transaction(function () use ($ma, $ip) {
            $don = DB::table('don_hang')->where('ma_don_hang', $ma)->lockForUpdate()->first();
            abort_unless($this->laOnline($don->phuong_thuc_thanh_toan), 422, 'Đơn này không sử dụng VNPay.');
            abort_unless($don->trang_thai === 'cho_xac_nhan' && $don->trang_thai_thanh_toan === 'chua_thanh_toan', 409, 'Đơn đã thanh toán hoặc không còn chờ xác nhận.');
            $this->kiemTra($don->phuong_thuc_thanh_toan, (string) $don->tong_tien);
            $cu = DB::table('giao_dich_thanh_toan')->where('ma_don_hang', $ma)->where('trang_thai', 'dang_cho')->where('het_han', '>', now())->first();
            if ($cu) return ['url' => $cu->duong_dan, 'het_han' => Carbon::parse($cu->het_han)->toISOString()];
            $thamChieu = str_replace('-', '', (string) Str::uuid());
            $luc = now('Asia/Ho_Chi_Minh');
            $hetHan = $luc->copy()->addMinutes(15);
            $data = [
                'vnp_Version' => '2.1.0', 'vnp_Command' => 'pay',
                'vnp_TmnCode' => config('thanh_toan.vnpay.tmn_code'),
                'vnp_Amount' => bcmul((string) $don->tong_tien, '100', 0),
                'vnp_CurrCode' => 'VND', 'vnp_TxnRef' => $thamChieu,
                'vnp_OrderInfo' => 'Thanh toan don hang '.$ma, 'vnp_OrderType' => 'other',
                'vnp_Locale' => 'vn', 'vnp_ReturnUrl' => config('thanh_toan.vnpay.return_url'),
                'vnp_IpAddr' => $ip, 'vnp_CreateDate' => $luc->format('YmdHis'), 'vnp_ExpireDate' => $hetHan->format('YmdHis'),
                'vnp_BankCode' => ['vnpay_qr' => 'VNPAYQR', 'vnpay_atm' => 'VNBANK', 'vnpay_the' => 'INTCARD'][$don->phuong_thuc_thanh_toan],
            ];
            $data['vnp_SecureHash'] = $this->chuKy($data);
            $base = config('thanh_toan.vnpay.sandbox') ? 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html' : 'https://pay.vnpay.vn/vpcpay.html';
            $url = $base.'?'.http_build_query($data, '', '&', PHP_QUERY_RFC1738);
            DB::table('giao_dich_thanh_toan')->insert([
                'ma_don_hang' => $ma, 'ma_tham_chieu' => $thamChieu, 'phuong_thuc' => $don->phuong_thuc_thanh_toan,
                'so_tien' => $don->tong_tien, 'duong_dan' => $url, 'het_han' => $hetHan->copy()->utc(),
                'ngay_tao' => now(), 'ngay_cap_nhat' => now(),
            ]);
            return ['url' => $url, 'het_han' => $hetHan->toISOString()];
        }, 3);
    }

    public function ipn(array $data): array
    {
        $tra = fn (string $code, string $message) => ['RspCode' => $code, 'Message' => $message];
        if (! $this->hopLe($data)) return $tra('97', 'Invalid signature');
        $gd = DB::table('giao_dich_thanh_toan')->where('ma_tham_chieu', $data['vnp_TxnRef'] ?? '')->first();
        if (! $gd) return $tra('01', 'Order not found');
        return DB::transaction(function () use ($gd, $data, $tra) {
            // Luôn khóa đơn trước giao dịch để đồng bộ với tạo thanh toán / hủy đơn.
            $don = DB::table('don_hang')->where('ma_don_hang', $gd->ma_don_hang)->lockForUpdate()->first();
            $gd = DB::table('giao_dich_thanh_toan')->where('id', $gd->id)->lockForUpdate()->first();
            if (! $don) return $tra('01', 'Order not found');
            if (! preg_match('/^\d+$/D', (string) ($data['vnp_Amount'] ?? '')) || bccomp((string) $data['vnp_Amount'], bcmul((string) $gd->so_tien, '100', 0), 0) !== 0) return $tra('04', 'Invalid amount');
            if ($gd->trang_thai === 'thanh_cong') return $tra('02', 'Order already confirmed');
            $thanhCong = ($data['vnp_ResponseCode'] ?? '') === '00' && ($data['vnp_TransactionStatus'] ?? '') === '00';
            $maCong = (string) ($data['vnp_TransactionNo'] ?? '');
            if ($thanhCong && (! preg_match('/^\d{1,100}$/D', $maCong) || $maCong === '0')) return $tra('99', 'Invalid transaction');
            if ($thanhCong && DB::table('giao_dich_thanh_toan')->where('ma_giao_dich_cong', $maCong)->where('id', '!=', $gd->id)->exists()) return $tra('99', 'Duplicate gateway transaction');
            $doiSoat = $thanhCong && ($don->trang_thai === 'da_huy' || $don->ngay_xoa !== null || $don->trang_thai_thanh_toan !== 'chua_thanh_toan');
            DB::table('giao_dich_thanh_toan')->where('id', $gd->id)->update([
                'trang_thai' => $thanhCong ? 'thanh_cong' : 'that_bai', 'ma_phan_hoi' => $data['vnp_ResponseCode'] ?? '',
                'ma_giao_dich_cong' => $thanhCong ? $maCong : null, 'can_doi_soat' => $doiSoat, 'ngay_cap_nhat' => now(),
            ]);
            if ($thanhCong) {
                if ($don->trang_thai_thanh_toan === 'chua_thanh_toan') {
                    DB::table('don_hang')->where('ma_don_hang', $don->ma_don_hang)->update(['trang_thai_thanh_toan' => 'da_thanh_toan', 'ma_giao_dich' => $maCong, 'ngay_cap_nhat' => now()]);
                }
                app(DatHangService::class)->lichSu($don->ma_don_hang, $don->trang_thai, $don->trang_thai, null,
                    $doiSoat ? 'VNPay nhận tiền sau khi đơn đã hủy hoặc có giao dịch khác. CẦN ĐỐI SOÁT / HOÀN TIỀN với cửa hàng.' : 'VNPay đã xác nhận thanh toán. Mã giao dịch: '.$maCong);
            }
            return $tra('00', 'Confirm success');
        }, 3);
    }

    public function trangThai(int $ma, string $khoa): array
    {
        $don = $this->xacThuc($ma, $khoa);
        $gd = DB::table('giao_dich_thanh_toan')->where('ma_don_hang', $ma)->latest('id')->first();
        return ['ma_don_hang' => $ma, 'tong_tien' => $don->tong_tien, 'phuong_thuc' => $don->phuong_thuc_thanh_toan,
            'trang_thai_don' => $don->trang_thai, 'trang_thai_thanh_toan' => $don->trang_thai_thanh_toan,
            'giao_dich' => $gd ? ['trang_thai' => $gd->trang_thai === 'dang_cho' && Carbon::parse($gd->het_han)->isPast() ? 'het_han' : $gd->trang_thai,
                'ma_phan_hoi' => $gd->ma_phan_hoi, 'het_han' => Carbon::parse($gd->het_han)->toISOString(), 'ma_giao_dich' => $gd->ma_giao_dich_cong] : null,
            'can_doi_soat' => DB::table('giao_dich_thanh_toan')->where('ma_don_hang', $ma)->where('can_doi_soat', true)->exists()];
    }
}
