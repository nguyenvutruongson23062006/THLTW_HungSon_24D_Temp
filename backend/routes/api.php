<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DanhMucController;
use App\Http\Controllers\ThuongHieuController;
use App\Http\Controllers\SanPhamController;

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


// ==================== DANH MỤC ====================

Route::get('/danhmuc', [DanhMucController::class, 'index']);
Route::get('/danhmuc/{category}', [DanhMucController::class, 'show']);
Route::post('/danhmuc', [DanhMucController::class, 'store']);
Route::put('/danhmuc/{category}', [DanhMucController::class, 'update']);
Route::delete('/danhmuc/{category}', [DanhMucController::class, 'destroy']);


// ==================== THƯƠNG HIỆU ====================

Route::get('/thuonghieu', [ThuongHieuController::class, 'index']);
Route::get('/thuonghieu/{thuongHieu}', [ThuongHieuController::class, 'show']);
Route::post('/thuonghieu', [ThuongHieuController::class, 'store']);
Route::put('/thuonghieu/{thuongHieu}', [ThuongHieuController::class, 'update']);
Route::delete('/thuonghieu/{thuongHieu}', [ThuongHieuController::class, 'destroy']);


// ==================== SẢN PHẨM ====================

Route::get('/sanpham', [SanPhamController::class, 'index']);
Route::get('/sanpham/{sanPham}', [SanPhamController::class, 'show']);
Route::post('/sanpham', [SanPhamController::class, 'store']);
Route::put('/sanpham/{sanPham}', [SanPhamController::class, 'update']);
Route::delete('/sanpham/{sanPham}', [SanPhamController::class, 'destroy']);