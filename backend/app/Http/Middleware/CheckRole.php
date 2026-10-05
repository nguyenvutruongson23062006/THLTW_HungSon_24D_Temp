<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    public function handle(
        Request $request,
        Closure $next,
        ...$vaiTro
    ): Response {
        $nguoiDung = $request->user();

        if (!$nguoiDung) {
            return response()->json([
                'message' => 'Bạn chưa đăng nhập.'
            ], 401);
        }

        if (empty($vaiTro)) {
            $vaiTro = ['quan_tri_vien'];
        }

        if (!in_array($nguoiDung->vai_tro, $vaiTro, true)) {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện thao tác này.'
            ], 403);
        }

        return $next($request);
    }
}