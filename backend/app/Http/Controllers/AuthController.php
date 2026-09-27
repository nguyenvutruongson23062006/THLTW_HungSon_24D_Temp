<?php

namespace App\Http\Controllers;

use App\Http\Requests\DangNhapRequest;
use App\Http\Requests\DangKyRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // Đăng ký
    public function register(DangKyRequest $request)
    {
        $user = User::create([
            'ho_ten' => $request->ho_ten,
            'ten_dang_nhap' => $request->ten_dang_nhap,
            'dia_chi_email' => $request->dia_chi_email,
            'so_dien_thoai' => $request->so_dien_thoai,
            'mat_khau' => $request->mat_khau,
            'vai_tro' => 'thanh_vien',
            'trang_thai' => 'hoat_dong',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng ký thành công',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    // Đăng nhập
    public function login(DangNhapRequest $request)
    {
        $user = User::where(
            'dia_chi_email',
            $request->dia_chi_email
        )->first();

        if (!$user || !Hash::check($request->mat_khau, $user->mat_khau)) {
            return response()->json([
                'message' => 'Email hoặc mật khẩu không chính xác'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Đăng nhập thành công',
            'user' => $user,
            'token' => $token,
        ]);
    }

    // Lấy thông tin người đang đăng nhập
    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    // Đăng xuất
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Đăng xuất thành công'
        ]);
    }
}