<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DanhMucController;
use App\Http\Controllers\ThuongHieuController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/danhmuc', [DanhMucController::class, 'index']);
Route::get('/danhmuc/{category}', [DanhMucController::class, 'show']);

Route::get('/thuonghieu', [ThuongHieuController::class, 'index']);
Route::get('/thuonghieu/{thuongHieu}', [ThuongHieuController::class, 'show']);