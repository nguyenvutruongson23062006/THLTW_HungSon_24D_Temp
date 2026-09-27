<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
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
}