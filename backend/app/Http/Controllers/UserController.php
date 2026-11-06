<?php

namespace App\Http\Controllers;
use App\Http\Resources\NguoiDungResource;
use App\Models\User;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function danhSachNguoiDung(Request $request)
    {
        $request->validate(['thung_rac' => 'nullable|boolean']);
        $query = $request->boolean('thung_rac') ? User::onlyTrashed() : User::query();
        $nguoiDungs = $query->orderBy('ma_nguoi_dung')->get();

        return NguoiDungResource::collection($nguoiDungs);
    }

    public function store(Request $request)
    {
        $data = $this->duLieuQuanTri($request);
        $user = User::create($data);

        return (new NguoiDungResource($user))->response()->setStatusCode(201);
    }

    public function update(Request $request, int $maNguoiDung)
    {
        $user = User::findOrFail($maNguoiDung);
        $data = $this->duLieuQuanTri($request, $user);
        DB::transaction(function () use ($request, $user, $data) {
            $this->baoVeQuanTri($request, $user, $data);
            $thuHoi = $user->vai_tro !== $data['vai_tro'] || $user->trang_thai !== $data['trang_thai'] || isset($data['mat_khau']);
            $user->update($data);
            if ($thuHoi) {
                $user->tokens()->delete();
            }
        });

        return new NguoiDungResource($user->refresh());
    }

    private function duLieuQuanTri(Request $request, ?User $user = null): array
    {
        return $request->validate([
            'ho_ten' => 'required|string|max:255',
            'ten_dang_nhap' => ['required', 'string', 'max:255', Rule::unique('nguoi_dung', 'ten_dang_nhap')->ignore($user?->getKey(), 'ma_nguoi_dung')],
            'dia_chi_email' => ['required', 'email', 'max:255', Rule::unique('nguoi_dung', 'dia_chi_email')->ignore($user?->getKey(), 'ma_nguoi_dung')],
            'so_dien_thoai' => 'nullable|string|max:20', 'dia_chi' => 'nullable|string|max:2000',
            'vai_tro' => ['required', Rule::in(['thanh_vien', 'nhan_vien', 'quan_tri_vien'])],
            'trang_thai' => ['required', Rule::in(['hoat_dong', 'tam_ngung', 'khoa'])],
            'mat_khau' => $user ? 'sometimes|required|string|min:6|max:255' : 'required|string|min:6|max:255',
        ], ['*.unique' => 'Tên đăng nhập hoặc email đã tồn tại, kể cả trong thùng rác.', '*.required' => 'Vui lòng điền đầy đủ thông tin bắt buộc.']);
    }

    private function baoVeQuanTri(Request $request, User $user, array $data): void
    {
        $biHanChe = ($data['vai_tro'] ?? '') !== 'quan_tri_vien' || ($data['trang_thai'] ?? '') !== 'hoat_dong';
        if ($user->getKey() === $request->user()->getKey() && $biHanChe) {
            throw ValidationException::withMessages(['vai_tro' => 'Không thể tự xóa, khóa hoặc hạ quyền tài khoản đang đăng nhập.']);
        }
        $quanTri = User::where('vai_tro', 'quan_tri_vien')->where('trang_thai', 'hoat_dong')->lockForUpdate()->get();
        if ($user->vai_tro === 'quan_tri_vien' && $user->trang_thai === 'hoat_dong' && $biHanChe && $quanTri->count() <= 1) {
            throw ValidationException::withMessages(['vai_tro' => 'Phải giữ ít nhất một quản trị viên đang hoạt động.']);
        }
    }

    public function destroy(Request $request, int $maNguoiDung)
    {
        DB::transaction(function () use ($request, $maNguoiDung) {
            $user = User::findOrFail($maNguoiDung);
            $this->baoVeQuanTri($request, $user, []);
            $user->tokens()->delete();
            $user->delete();
        });

        return response()->json(['message' => 'Đã chuyển người dùng vào thùng rác.']);
    }

    public function khoiPhuc(int $maNguoiDung)
    {
        $user = User::onlyTrashed()->findOrFail($maNguoiDung);
        $user->restore();

        return new NguoiDungResource($user);
    }

    public function xoaVinhVien(int $maNguoiDung)
    {
        $user = User::onlyTrashed()->findOrFail($maNguoiDung);
        foreach (['don_hang', 'bai_viet', 'trang_don', 'phieu_nhap', 'phieu_xuat', 'lien_he'] as $bang) {
            if (DB::table($bang)->where('ma_nguoi_dung', $maNguoiDung)->exists()) {
                throw ValidationException::withMessages(['nguoi_dung' => 'Tài khoản có dữ liệu liên quan. Hãy giữ trong thùng rác để bảo toàn lịch sử.']);
            }
        }
        $user->tokens()->delete();
        $user->forceDelete();

        return response()->json(['message' => 'Đã xóa vĩnh viễn người dùng.']);
    }
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'ho_ten' => ['required', 'string', 'max:255'],
            'so_dien_thoai' => ['nullable', 'string', 'max:20'],
            'dia_chi' => ['nullable', 'string', 'max:2000'],
        ]);

        $user->update([
            'ho_ten' => $request->ho_ten,
            'so_dien_thoai' => $request->so_dien_thoai,
            'dia_chi' => $request->input('dia_chi', $user->dia_chi),
        ]);

        return response()->json([
            'message' => 'Cập nhật thông tin thành công',
            'user' => $user,
        ]);
    }
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'mat_khau_cu' => ['required', 'string'],
            'mat_khau_moi' => ['required', 'string', 'min:6', 'max:255', 'confirmed'],
        ]);

        if (!password_verify($request->mat_khau_cu, $user->mat_khau)) {
            return response()->json([
                'message' => 'Mật khẩu cũ không đúng'
            ], 422);
        }

        $user->update([
            'mat_khau' => $request->mat_khau_moi,
            'ma_dat_lai_mat_khau' => null,
            'thoi_gian_dat_lai_mat_khau' => null,
        ]);
        $tokenHienTai = $user->currentAccessToken();
        $user->tokens()->when($tokenHienTai instanceof \Laravel\Sanctum\PersonalAccessToken, fn ($q) => $q->where('id', '!=', $tokenHienTai->getKey()))->delete();

        return response()->json([
            'message' => 'Đổi mật khẩu thành công'
        ]);
    }
}
