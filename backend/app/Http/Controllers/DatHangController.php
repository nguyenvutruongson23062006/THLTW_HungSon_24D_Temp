<?php

namespace App\Http\Controllers;

use App\Services\DatHangService;
use App\Support\ThongBaoKiemTra;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class DatHangController extends Controller
{
    private function dongQuyTac(): array
    {
        return ['chi_tiet' => 'required|array|min:1|max:100', 'chi_tiet.*.ma_san_pham' => 'required|integer|min:1|distinct',
            'chi_tiet.*.so_luong' => 'required|integer|min:1|max:1000000', 'ma_giam_gia' => 'nullable|string|max:50'];
    }

    private function nguoiDung(Request $request)
    {
        $user = $request->user('sanctum');
        abort_if($request->bearerToken() && ! $user, 401, 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        abort_if($user && $user->trang_thai !== 'hoat_dong', 403, 'Tài khoản đang bị khóa hoặc tạm ngưng.');

        return $user;
    }

    public function baoGia(Request $request, DatHangService $service)
    {
        $data = ThongBaoKiemTra::duLieu($request, $this->dongQuyTac());
        $tinh = $service->tinhTien($data['chi_tiet'], $data['ma_giam_gia'] ?? null, $this->nguoiDung($request));
        unset($tinh['ma_khuyen_mai']);

        return response()->json(['data' => $tinh]);
    }

    public function store(Request $request, DatHangService $service)
    {
        $data = ThongBaoKiemTra::duLieu($request, [...$this->dongQuyTac(),
            'ho_ten' => 'required|string|max:255', 'dia_chi_email' => 'nullable|email|max:255',
            'so_dien_thoai' => 'required|string|max:20', 'dia_chi_giao_hang' => 'required|string|max:2000',
            'ghi_chu' => 'nullable|string|max:2000', 'phuong_thuc_thanh_toan' => ['required', Rule::in(array_keys(\App\Services\ThanhToanService::PHUONG_THUC))],
            'khoa_dat_hang' => 'required|uuid',
            'so_thang_tra_gop' => ['nullable', 'integer', Rule::in([0, 6, 12, 18])],
            'tong_tien_du_kien' => 'required|numeric|min:0|decimal:0,2',
        ]);
        // Chỉ lấy các trường hợp lệ; tuyệt đối không nhận tổng tiền/giá bán từ trình duyệt.
        $data = array_intersect_key($data, $this->dongQuyTac() + array_fill_keys(['ho_ten', 'dia_chi_email', 'so_dien_thoai', 'dia_chi_giao_hang', 'ghi_chu', 'phuong_thuc_thanh_toan', 'khoa_dat_hang', 'tong_tien_du_kien', 'so_thang_tra_gop'], true));
        $ketQua = $service->taoDon($data, $this->nguoiDung($request));

        return response()->json(['data' => $ketQua['don_hang'], 'message' => 'Đặt hàng thành công.'], $ketQua['da_ton_tai'] ? 200 : 201);
    }

    public function index(Request $request)
    {
        $data = ThongBaoKiemTra::duLieu($request, ['page' => 'nullable|integer|min:1', 'trang_thai' => 'nullable|string|max:50']);
        $q = DB::table('don_hang')->where('ma_nguoi_dung', $request->user()->getKey())->whereNull('ngay_xoa');
        $q->where(function ($q) { $q->where('phuong_thuc_thanh_toan', '!=', 'chuyen_khoan')->orWhereIn('trang_thai_thanh_toan', ['da_thanh_toan', 'da_hoan_tien']); });
        if (! empty($data['trang_thai'])) {
            $q->where('trang_thai', $data['trang_thai']);
        }
        $p = $q->orderByDesc('ma_don_hang')->paginate(10, ['ma_don_hang', 'ho_ten', 'ngay_tao', 'tong_tien', 'trang_thai', 'trang_thai_thanh_toan']);
        $p->getCollection()->transform(function ($don) {
            $don->ngay_tao = $don->ngay_tao ? Carbon::parse($don->ngay_tao)->toISOString() : null;

            return $don;
        });

        return response()->json(['data' => ['danh_sach' => $p->items(), 'trang' => $p->currentPage(), 'so_trang' => $p->lastPage(), 'tong' => $p->total()]]);
    }

    public function show(Request $request, int $ma, DatHangService $service)
    {
        $this->kiemTraChuDon($request, $ma);

        return response()->json(['data' => $service->chiTiet($ma)]);
    }

    private function kiemTraChuDon(Request $request, int $ma): void
    {
        abort_unless(DB::table('don_hang')->where('ma_don_hang', $ma)->where('ma_nguoi_dung', $request->user()->getKey())->whereNull('ngay_xoa')->exists(), 404);
    }

    public function huy(Request $request, int $ma, DatHangService $service)
    {
        DB::transaction(function () use ($request, $ma, $service) {
            $don = DB::table('don_hang')->where('ma_don_hang', $ma)->where('ma_nguoi_dung', $request->user()->getKey())->whereNull('ngay_xoa')->lockForUpdate()->first();
            abort_if(! $don, 404);
            abort_unless($don->trang_thai === 'cho_xac_nhan', 409, 'Chỉ được tự hủy đơn đang chờ xác nhận. Hãy tải lại đơn hàng.');
            abort_if($don->trang_thai_thanh_toan === 'da_thanh_toan', 422, 'Đơn đã thu tiền. Vui lòng liên hệ cửa hàng để xử lý hoàn tiền trước khi hủy.');
            $service->hoanKho($don);
            DB::table('don_hang')->where('ma_don_hang', $ma)->update(['trang_thai' => 'da_huy', 'ngay_cap_nhat' => now()]);
            $service->lichSu($ma, $don->trang_thai, 'da_huy', $request->user()->getKey(), 'Thành viên hủy đơn.');
        }, 3);

        return response()->json(['message' => 'Đã hủy đơn hàng.', 'data' => $service->chiTiet($ma)]);
    }
}
