<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use App\Models\DonHang;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DonHangController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $duLieu = $request->validate([
            'tu_khoa' => ['nullable', 'string', 'max:100'],
            'trang_thai' => ['nullable', 'string', 'max:50'],
            'trang_thai_thanh_toan' => ['nullable', 'string', 'max:50'],
            'tu_ngay' => ['nullable', 'date_format:Y-m-d'],
            'den_ngay' => [
                'nullable',
                'date_format:Y-m-d',
                'after_or_equal:tu_ngay',
            ],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $truyVan = DonHang::query()->select([
            'ma_don_hang',
            'ho_ten',
            'so_dien_thoai',
            'phuong_thuc_thanh_toan',
            'tong_tien',
            'trang_thai',
            'trang_thai_thanh_toan',
            'ngay_tao',
        ]);

        $tuKhoa = trim($duLieu['tu_khoa'] ?? '');

        if ($tuKhoa !== '') {
            $truyVan->where(function ($query) use ($tuKhoa) {
                $query->where('ho_ten', 'like', "%{$tuKhoa}%")
                    ->orWhere('so_dien_thoai', 'like', "%{$tuKhoa}%");

                if (ctype_digit($tuKhoa)) {
                    $query->orWhere('ma_don_hang', $tuKhoa);
                }
            });
        }

        if (!empty($duLieu['trang_thai'])) {
            $truyVan->where('trang_thai', $duLieu['trang_thai']);
        }

        if (!empty($duLieu['trang_thai_thanh_toan'])) {
            $truyVan->where(
                'trang_thai_thanh_toan',
                $duLieu['trang_thai_thanh_toan']
            );
        }

        if (!empty($duLieu['tu_ngay'])) {
            $truyVan->whereDate('ngay_tao', '>=', $duLieu['tu_ngay']);
        }

        if (!empty($duLieu['den_ngay'])) {
            $truyVan->whereDate('ngay_tao', '<=', $duLieu['den_ngay']);
        }

        $phanTrang = $truyVan
            ->orderByDesc('ngay_tao')
            ->orderByDesc('ma_don_hang')
            ->paginate($duLieu['per_page'] ?? 10)
            ->withQueryString();

        return response()->json([
            'data' => $phanTrang->items(),
            'meta' => [
                'current_page' => $phanTrang->currentPage(),
                'last_page' => $phanTrang->lastPage(),
                'per_page' => $phanTrang->perPage(),
                'total' => $phanTrang->total(),
            ],
            'links' => [
                'prev' => $phanTrang->previousPageUrl(),
                'next' => $phanTrang->nextPageUrl(),
            ],
        ]);
    }

    public function show(int $maDonHang): JsonResponse
    {
        $donHang = DonHang::query()
            ->with('chiTietDonHangs')
            ->findOrFail($maDonHang);

        return response()->json([
            'data' => [
                'ma_don_hang' => $donHang->ma_don_hang,
                'ma_nguoi_dung' => $donHang->ma_nguoi_dung,
                'ho_ten' => $donHang->ho_ten,
                'dia_chi_email' => $donHang->dia_chi_email,
                'so_dien_thoai' => $donHang->so_dien_thoai,
                'dia_chi_giao_hang' => $donHang->dia_chi_giao_hang,
                'phuong_thuc_thanh_toan' => $donHang->phuong_thuc_thanh_toan,
                'ma_giao_dich' => $donHang->ma_giao_dich,
                'ghi_chu' => $donHang->ghi_chu,
                'tam_tinh' => $donHang->tam_tinh,
                'giam_gia' => $donHang->giam_gia,
                'tong_tien' => $donHang->tong_tien,
                'trang_thai' => $donHang->trang_thai,
                'trang_thai_thanh_toan' => $donHang->trang_thai_thanh_toan,
                'ngay_tao' => $donHang->ngay_tao,
                'ngay_cap_nhat' => $donHang->ngay_cap_nhat,
                'chi_tiet_don_hangs' => $donHang->chiTietDonHangs->map(
                    fn ($chiTiet) => [
                        'ma_chi_tiet_don_hang' => $chiTiet->ma_chi_tiet_don_hang,
                        'ma_san_pham' => $chiTiet->ma_san_pham,
                        'ten_san_pham' => $chiTiet->ten_san_pham,
                        'so_luong' => $chiTiet->so_luong,
                        'don_gia' => $chiTiet->don_gia,
                        'thanh_tien' => $chiTiet->thanh_tien,
                    ]
                )->values(),
            ],
        ]);
    }
        public function updateStatus(Request $request, int $maDonHang): JsonResponse
    {
        $duLieu = $request->validate([
            'trang_thai' => [
                'required',
                'string',
                Rule::in([
                    'cho_xac_nhan',
                    'da_xac_nhan',
                    'dang_giao',
                    'hoan_tat',
                    'da_huy',
                ]),
            ],
            'trang_thai_hien_tai' => ['required', 'string'],
        ]);

        return DB::transaction(function () use ($maDonHang, $duLieu) {
            $donHang = DonHang::query()
                ->lockForUpdate()
                ->findOrFail($maDonHang);

            // Tránh ghi đè khi người khác đã xử lý đơn.
            if ($donHang->trang_thai !== $duLieu['trang_thai_hien_tai']) {
                return response()->json([
                    'message' => 'Đơn hàng đã được cập nhật. Hãy tải lại trước khi thao tác.',
                ], 409);
            }

            $cacBuocChoPhep = [
                'cho_xac_nhan' => ['da_xac_nhan', 'da_huy'],
                'da_xac_nhan' => ['dang_giao', 'da_huy'],
                'dang_giao' => ['hoan_tat'],
                'hoan_tat' => [],
                'da_huy' => [],
            ];

            $trangThaiMoi = $duLieu['trang_thai'];

            if (!in_array(
                $trangThaiMoi,
                $cacBuocChoPhep[$donHang->trang_thai] ?? [],
                true
            )) {
                return response()->json([
                    'message' => 'Không được chuyển sang trạng thái này.',
                ], 422);
            }

            // Chưa có luồng hoàn tiền nên không hủy đơn đã thu tiền.
            if (
                $trangThaiMoi === 'da_huy'
                && $donHang->trang_thai_thanh_toan !== 'chua_thanh_toan'
            ) {
                return response()->json([
                    'message' => 'Đơn này cần xử lý thanh toán/hoàn tiền trước khi hủy.',
                ], 422);
            }

            $donHang->trang_thai = $trangThaiMoi;
            $donHang->save();

            return response()->json([
                'message' => 'Cập nhật trạng thái thành công.',
                'data' => [
                    'ma_don_hang' => $donHang->ma_don_hang,
                    'trang_thai' => $donHang->trang_thai,
                    'ngay_cap_nhat' => $donHang->ngay_cap_nhat,
                ],
            ]);
        });
    }
}