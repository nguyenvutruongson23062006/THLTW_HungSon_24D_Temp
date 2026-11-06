<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class TaiKhoanHoatDong
{
    public function handle(Request $request, Closure $next)
    {
        abort_unless($request->user()?->trang_thai === 'hoat_dong', 403, 'Tài khoản đang bị khóa hoặc tạm ngưng.');

        return $next($request);
    }
}
