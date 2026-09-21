<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DanhMucController;
use App\Http\Controllers\ThuongHieuController;
use App\Http\Controllers\SanPhamController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/danhmuc', [DanhMucController::class, 'index']);
Route::get('/danhmuc/{category}', [DanhMucController::class, 'show']);
Route::post('/danhmuc', [DanhMucController::class, 'store']);
Route::put('/danhmuc/{category}', [DanhMucController::class, 'update']);
Route::delete('/danhmuc/{category}', [DanhMucController::class, 'destroy']);

Route::get('/thuonghieu', [ThuongHieuController::class, 'index']);
Route::get('/thuonghieu/{thuongHieu}', [ThuongHieuController::class, 'show']);
Route::post('/thuonghieu', [ThuongHieuController::class, 'store']);
Route::put('/thuonghieu/{thuongHieu}', [ThuongHieuController::class, 'update']);
Route::delete('/thuonghieu/{thuongHieu}', [ThuongHieuController::class, 'destroy']);

Route::get('/sanpham', [SanPhamController::class, 'index']);
Route::get('/sanpham/{sanPham}', [SanPhamController::class, 'show']);
Route::post('/sanpham', [SanPhamController::class, 'store']);
Route::put('/sanpham/{sanPham}', [SanPhamController::class, 'update']);
Route::delete('/sanpham/{sanPham}', [SanPhamController::class, 'destroy']);