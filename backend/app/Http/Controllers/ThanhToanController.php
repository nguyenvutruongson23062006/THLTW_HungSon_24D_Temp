<?php

namespace App\Http\Controllers;

use App\Services\ThanhToanService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ThanhToanController extends Controller
{
    private function thamSoCong(Request $request): array
    {
        // Giữ nguyên dữ liệu ký, không dùng query đã qua TrimStrings / ConvertEmptyStringsToNull.
        parse_str((string) $request->server('QUERY_STRING', ''), $data);
        return $data;
    }

    public function phuongThuc(ThanhToanService $service)
    {
        $data = [];
        foreach (ThanhToanService::PHUONG_THUC as $ma => $ten) {
            if (! in_array($ma, ['tien_mat', 'chuyen_khoan'], true)) continue;
            $online = $service->laOnline($ma);
            $data[] = ['ma' => $ma, 'ten' => $ten, 'online' => $online, 'san_sang' => ! $online || $service->sanSang(),
                'mo_ta' => $online ? ($service->sanSang() ? (config('thanh_toan.vnpay.sandbox') ? 'VNPay thử nghiệm — không dùng tiền thật.' : 'Thanh toán bảo mật tại VNPay.') : 'Chưa kích hoạt cổng thanh toán.') : ($ma === 'tien_mat' ? 'Thanh toán cho nhân viên khi nhận hàng.' : 'Cửa hàng liên hệ cung cấp thông tin tài khoản và xác nhận tiền nhận được.')];
        }
        return response()->json(['data' => $data])->header('Cache-Control', 'no-store');
    }

    public function tao(Request $request, ThanhToanService $service)
    {
        $data = $request->validate(['ma_don_hang' => 'required|integer|min:1', 'khoa' => 'required|string|size:64']);
        return response()->json(['data' => $service->tao($data['ma_don_hang'], $data['khoa'], $request->ip())])->header('Cache-Control', 'no-store');
    }

    public function trangThai(Request $request, ThanhToanService $service)
    {
        $data = $request->validate(['ma_don_hang' => 'required|integer|min:1', 'khoa' => 'required|string|size:64']);
        return response()->json(['data' => $service->trangThai($data['ma_don_hang'], $data['khoa'])])->header('Cache-Control', 'no-store');
    }

    public function chuyenKhoan(Request $request, ThanhToanService $service)
    {
        $data = $request->validate(['ma_don_hang' => 'required|integer|min:1', 'khoa' => 'required|string|size:64']);
        $don = $service->xacThuc($data['ma_don_hang'], $data['khoa']);
        abort_unless($don->phuong_thuc_thanh_toan === 'chuyen_khoan', 404);
        $chiTiet = app(\App\Services\DatHangService::class)->chiTiet($don->ma_don_hang);
        return response()->json(['data' => array_intersect_key($chiTiet, array_flip(['ma_don_hang', 'tong_tien', 'trang_thai', 'trang_thai_thanh_toan', 'chuyen_khoan', 'so_thang_tra_gop', 'lich_tra_gop']))])->header('Cache-Control', 'no-store');
    }

    public function ipn(Request $request, ThanhToanService $service)
    {
        return response()->json($service->ipn($this->thamSoCong($request)))->header('Cache-Control', 'no-store');
    }

    public function quayVe(Request $request, ThanhToanService $service)
    {
        $base = rtrim(config('app.frontend_url'), '/').'/order/thanh-toan';
        $data = $this->thamSoCong($request);
        if (! $service->hopLe($data)) return redirect()->away($base.'?loi=chu_ky')->header('Referrer-Policy', 'no-referrer');
        $gd = DB::table('giao_dich_thanh_toan')->where('ma_tham_chieu', $data['vnp_TxnRef'] ?? '')->first();
        $don = $gd ? DB::table('don_hang')->where('ma_don_hang', $gd->ma_don_hang)->first() : null;
        if (! $don) return redirect()->away($base.'?loi=khong_tim_thay');
        // Return URL không ghi nhận thu tiền. Chỉ IPN đã kiểm tra chữ ký mới cập nhật DB.
        return redirect()->away($base.'#'.http_build_query(['ma' => $don->ma_don_hang, 'khoa' => $service->khoa($don)]))
            ->header('Referrer-Policy', 'no-referrer')->header('Cache-Control', 'no-store');
    }
}
