<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DanhMucController;
use App\Http\Controllers\ThuongHieuController;
use App\Http\Controllers\SanPhamController;
use App\Http\Controllers\UserController;

// ==================== AUTH ====================

// Đăng ký
Route::post('/register', [AuthController::class, 'register']);

// Đăng nhập
Route::post('/login', [AuthController::class, 'login']);

// Lấy thông tin người đang đăng nhập
Route::get('/me', [AuthController::class, 'me'])
    ->middleware('auth:sanctum');

// Đăng xuất
Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum');

Route::put('/profile', [UserController::class, 'updateProfile'])
    ->middleware('auth:sanctum');

Route::post('/change-password', [UserController::class, 'changePassword'])
    ->middleware('auth:sanctum');       

// ==================== DANH MỤC ====================

Route::get('/danhmuc', [DanhMucController::class, 'index']);
Route::get('/danhmuc/{category}', [DanhMucController::class, 'show']);


// ==================== THƯƠNG HIỆU ====================

Route::get('/thuonghieu', [ThuongHieuController::class, 'index']);
Route::get('/thuonghieu/{thuongHieu}', [ThuongHieuController::class, 'show']);


// ==================== SẢN PHẨM ====================

Route::get('/sanpham', [SanPhamController::class, 'index']);
Route::get('/sanpham/{sanPham}', [SanPhamController::class, 'show']);