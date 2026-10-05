<?php

namespace App\Http\Controllers;
use App\Http\Resources\NguoiDungResource;
use App\Models\User;

use Illuminate\Http\Request;

class UserController extends Controller
{
    public function danhSachNguoiDung()
    {
        $nguoiDungs = User::query()
            ->orderBy('ma_nguoi_dung')
            ->get();

        return NguoiDungResource::collection($nguoiDungs);
    }
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'ho_ten' => ['required', 'string', 'max:255'],
            'so_dien_thoai' => ['nullable', 'string', 'max:20'],
        ]);

        $user->update([
            'ho_ten' => $request->ho_ten,
            'so_dien_thoai' => $request->so_dien_thoai,
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
            'mat_khau_cu' => ['required'],
            'mat_khau_moi' => ['required', 'min:6', 'confirmed'],
        ]);

        if (!password_verify($request->mat_khau_cu, $user->mat_khau)) {
            return response()->json([
                'message' => 'Mật khẩu cũ không đúng'
            ], 422);
        }

        $user->update([
            'mat_khau' => $request->mat_khau_moi,
        ]);

        return response()->json([
            'message' => 'Đổi mật khẩu thành công'
        ]);
    }
}