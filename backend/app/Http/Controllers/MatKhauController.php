<?php

namespace App\Http\Controllers;

use App\Mail\DatLaiMatKhauMail;
use App\Models\User;
use App\Support\ThongBaoKiemTra;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class MatKhauController extends Controller
{
    public function yeuCau(Request $request)
    {
        $data = ThongBaoKiemTra::duLieu($request, ['dia_chi_email' => 'required|email|max:255']);
        $thu = DB::transaction(function () use ($data) {
            $user = User::where('dia_chi_email', $data['dia_chi_email'])->where('trang_thai', 'hoat_dong')->lockForUpdate()->first();
            if (! $user || ($user->thoi_gian_dat_lai_mat_khau && $user->thoi_gian_dat_lai_mat_khau->gt(now()->subMinute()))) {
                return null;
            }
            $token = Str::random(64);
            $user->update(['ma_dat_lai_mat_khau' => hash('sha256', $token), 'thoi_gian_dat_lai_mat_khau' => now()]);

            return [$user->dia_chi_email, $token];
        });
        if ($thu) {
            $url = rtrim(config('app.frontend_url'), '/').'/dat-lai-mat-khau?'.http_build_query(['email' => $thu[0], 'token' => $thu[1]]);
            try {
                Mail::to($thu[0])->send(new DatLaiMatKhauMail($url));
            } catch (\Throwable $error) {
                report($error);
            }
        }

        return response()->json(['message' => 'Nếu email thuộc tài khoản đang hoạt động, hướng dẫn đặt lại mật khẩu sẽ được gửi đến email đó.']);
    }

    public function datLai(Request $request)
    {
        $data = ThongBaoKiemTra::duLieu($request, [
            'dia_chi_email' => 'required|email|max:255', 'token' => 'required|string|size:64',
            'mat_khau' => 'required|string|min:6|max:255|confirmed',
        ]);
        DB::transaction(function () use ($data) {
            $user = User::where('dia_chi_email', $data['dia_chi_email'])->where('trang_thai', 'hoat_dong')->lockForUpdate()->first();
            if (! $user || ! $user->ma_dat_lai_mat_khau || ! $user->thoi_gian_dat_lai_mat_khau || $user->thoi_gian_dat_lai_mat_khau->lt(now()->subHour()) || ! hash_equals($user->ma_dat_lai_mat_khau, hash('sha256', $data['token']))) {
                throw ValidationException::withMessages(['token' => 'Liên kết không hợp lệ hoặc đã hết hạn. Hãy yêu cầu liên kết mới.']);
            }
            $user->update(['mat_khau' => $data['mat_khau'], 'ma_dat_lai_mat_khau' => null, 'thoi_gian_dat_lai_mat_khau' => null, 'ma_nho_dang_nhap' => null]);
            $user->tokens()->delete();
        });

        return response()->json(['message' => 'Đã đặt lại mật khẩu. Vui lòng đăng nhập bằng mật khẩu mới.']);
    }
}
