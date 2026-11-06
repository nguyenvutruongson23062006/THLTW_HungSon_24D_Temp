<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Support\ThongBaoKiemTra;

class LienHeShopController extends Controller
{
    public function store(Request $request)
    {
        $data = ThongBaoKiemTra::duLieu($request, [
            'ho_ten' => 'required|string|max:255', 'dia_chi_email' => 'required|email|max:255',
            'so_dien_thoai' => 'nullable|string|max:20', 'tieu_de' => 'required|string|max:255',
            'noi_dung' => 'required|string|min:10|max:5000',
        ]);
        $user = $request->user('sanctum');
        abort_if($request->bearerToken() && ! $user, 401, 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        abort_if($user && $user->trang_thai !== 'hoat_dong', 403, 'Tài khoản đang tạm ngưng.');
        $id = DB::table('lien_he')->insertGetId([
            ...$data, 'ma_nguoi_dung' => $user?->getKey(), 'trang_thai' => 'chua_xu_ly',
            'ngay_tao' => now(), 'ngay_cap_nhat' => now(),
        ], 'ma_lien_he');
        return response()->json(['data' => ['ma_lien_he' => $id], 'message' => 'Đã gửi liên hệ. Cửa hàng sẽ liên hệ lại qua thông tin bạn cung cấp.'], 201);
    }
}
