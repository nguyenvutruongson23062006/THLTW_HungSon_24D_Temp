<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DanhMucController;
use App\Http\Controllers\ThuongHieuController;
use App\Http\Controllers\SanPhamController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DonHangController;
use App\Http\Controllers\NoiDungQuanTriController;
use App\Http\Controllers\KhoQuanTriController;
use App\Http\Controllers\ThongKeQuanTriController;
use App\Http\Controllers\CaiDatQuanTriController;
use App\Http\Controllers\MatKhauController;
use App\Http\Controllers\DatHangController;
use App\Http\Controllers\KhuyenMaiController;
use App\Http\Controllers\ThanhToanController;
use App\Http\Controllers\LienHeShopController;

Route::post('/cua-hang/lien-he', [LienHeShopController::class, 'store'])->middleware('throttle:5,1,lien-he-shop');

Route::get('/thanh-toan/phuong-thuc', [ThanhToanController::class, 'phuongThuc']);
Route::post('/thanh-toan/tao', [ThanhToanController::class, 'tao'])->middleware('throttle:20,1,tao-thanh-toan');
Route::post('/thanh-toan/trang-thai', [ThanhToanController::class, 'trangThai'])->middleware('throttle:60,1,trang-thai-thanh-toan');
Route::post('/thanh-toan/chuyen-khoan', [ThanhToanController::class, 'chuyenKhoan'])->middleware('throttle:60,1,chuyen-khoan');
Route::get('/thanh-toan/vnpay/ipn', [ThanhToanController::class, 'ipn']);
Route::get('/thanh-toan/vnpay/return', [ThanhToanController::class, 'quayVe']);

// ==================== AUTH ====================

// Đăng ký
Route::post('/register', [AuthController::class, 'register']);

// Đăng nhập
Route::post('/login', [AuthController::class, 'login']);
Route::post('/quen-mat-khau', [MatKhauController::class, 'yeuCau'])->middleware('throttle:5,1,quen-mat-khau');
Route::post('/dat-lai-mat-khau', [MatKhauController::class, 'datLai'])->middleware('throttle:10,1,dat-lai-mat-khau');

Route::post('/cua-hang/bao-gia', [DatHangController::class, 'baoGia'])->middleware('throttle:60,1,bao-gia');
Route::post('/cua-hang/dat-hang', [DatHangController::class, 'store'])->middleware('throttle:20,1,dat-hang');
Route::prefix('cua-hang/don-hang')->middleware(['auth:sanctum', 'tai_khoan_hoat_dong'])->group(function () {
    Route::get('/', [DatHangController::class, 'index']);
    Route::get('/{ma}', [DatHangController::class, 'show'])->whereNumber('ma');
    Route::patch('/{ma}/huy', [DatHangController::class, 'huy'])->whereNumber('ma');
});

// Lấy thông tin người đang đăng nhập
Route::get('/me', [AuthController::class, 'me'])
    ->middleware(['auth:sanctum', 'tai_khoan_hoat_dong']);

// Danh sách người dùng (chỉ dành cho quản trị viên)
Route::get('/admin/members', [UserController::class, 'danhSachNguoiDung'])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);
// Đăng xuất
Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth:sanctum');

Route::put('/profile', [UserController::class, 'updateProfile'])
    ->middleware(['auth:sanctum', 'tai_khoan_hoat_dong']);

Route::post('/change-password', [UserController::class, 'changePassword'])
    ->middleware(['auth:sanctum', 'tai_khoan_hoat_dong']);

// ==================== DANH MỤC ====================

Route::get('/danhmuc', [DanhMucController::class, 'index']);
Route::get('/danhmuc/thung-rac', [DanhMucController::class, 'thungRac'])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);
Route::patch('/danhmuc/{maDanhMuc}/khoi-phuc', [DanhMucController::class, 'khoiPhuc'])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);
Route::delete('/danhmuc/{maDanhMuc}/xoa-vinh-vien', [DanhMucController::class, 'xoaVinhVien'])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);
Route::get('/danhmuc/{category}', [DanhMucController::class, 'show']);
Route::post('/danhmuc', [DanhMucController::class, 'store'])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);
Route::put('/danhmuc/{category}', [DanhMucController::class, 'update'])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);
Route::delete('/danhmuc/{category}', [DanhMucController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);


// ==================== THƯƠNG HIỆU ====================

Route::get('/thuonghieu', [ThuongHieuController::class, 'index']);
Route::get('/thuonghieu/thung-rac', [ThuongHieuController::class, 'thungRac'])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);
Route::patch('/thuonghieu/{maThuongHieu}/khoi-phuc', [ThuongHieuController::class, 'khoiPhuc'])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);
Route::delete('/thuonghieu/{maThuongHieu}/xoa-vinh-vien', [ThuongHieuController::class, 'xoaVinhVien'])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);
Route::get('/thuonghieu/{thuongHieu}', [ThuongHieuController::class, 'show']);
Route::post('/thuonghieu', [ThuongHieuController::class, 'store'])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);
Route::put('/thuonghieu/{thuongHieu}', [ThuongHieuController::class, 'update'])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);
Route::delete('/thuonghieu/{thuongHieu}', [ThuongHieuController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);


// ==================== SẢN PHẨM ====================

Route::get('/sanpham', [SanPhamController::class, 'index']);
Route::get('/sanpham/thung-rac', [SanPhamController::class, 'thungRac',])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);
Route::get('/sanpham/{sanPham}', [SanPhamController::class, 'show']);
Route::post('/sanpham', [SanPhamController::class, 'store'])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);
Route::put('/sanpham/{sanPham}', [SanPhamController::class, 'update'])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);
Route::delete('/sanpham/{sanPham}', [SanPhamController::class, 'destroy'])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);
Route::patch('/sanpham/{maSanPham}/khoi-phuc', [SanPhamController::class, 'khoiPhuc',])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);
Route::delete('/sanpham/{maSanPham}/xoa-vinh-vien', [SanPhamController::class, 'xoaVinhVien',])
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro']);

Route::prefix('admin')
    ->middleware(['auth:sanctum', 'kiem_tra_vai_tro'])
    ->group(function () {
        Route::get('/khuyen-mai', [KhuyenMaiController::class, 'index']);
        Route::post('/khuyen-mai', [KhuyenMaiController::class, 'store']);
        Route::put('/khuyen-mai/{ma}', [KhuyenMaiController::class, 'update'])->whereNumber('ma');
        Route::delete('/khuyen-mai/{ma}', [KhuyenMaiController::class, 'destroy'])->whereNumber('ma');
        Route::patch('/khuyen-mai/{ma}/khoi-phuc', [KhuyenMaiController::class, 'khoiPhuc'])->whereNumber('ma');
        Route::delete('/khuyen-mai/{ma}/xoa-vinh-vien', [KhuyenMaiController::class, 'xoaVinhVien'])->whereNumber('ma');
        Route::post('/members', [UserController::class, 'store']);
        Route::put('/members/{maNguoiDung}', [UserController::class, 'update'])->whereNumber('maNguoiDung');
        Route::delete('/members/{maNguoiDung}', [UserController::class, 'destroy'])->whereNumber('maNguoiDung');
        Route::patch('/members/{maNguoiDung}/khoi-phuc', [UserController::class, 'khoiPhuc'])->whereNumber('maNguoiDung');
        Route::delete('/members/{maNguoiDung}/xoa-vinh-vien', [UserController::class, 'xoaVinhVien'])->whereNumber('maNguoiDung');

        Route::get('/tong-quan', [ThongKeQuanTriController::class, 'index']);
        Route::get('/tim-kiem', [ThongKeQuanTriController::class, 'timKiem']);
        Route::get('/thong-bao', [ThongKeQuanTriController::class, 'thongBao']);
        Route::get('/bao-cao', [ThongKeQuanTriController::class, 'index']);
        Route::get('/cai-dat', [CaiDatQuanTriController::class, 'index']);
        Route::put('/cai-dat', [CaiDatQuanTriController::class, 'update']);

        Route::prefix('noi-dung/{loai}')->where(['loai' => 'bai-viet|trang-don|anh-quang-cao|thanh-dieu-huong|lien-he'])->group(function () {
            Route::get('/', [NoiDungQuanTriController::class, 'index']);
            Route::post('/', [NoiDungQuanTriController::class, 'store']);
            Route::get('/{ma}', [NoiDungQuanTriController::class, 'show'])->whereNumber('ma');
            Route::put('/{ma}', [NoiDungQuanTriController::class, 'update'])->whereNumber('ma');
            Route::delete('/{ma}', [NoiDungQuanTriController::class, 'destroy'])->whereNumber('ma');
            Route::patch('/{ma}/khoi-phuc', [NoiDungQuanTriController::class, 'khoiPhuc'])->whereNumber('ma');
            Route::delete('/{ma}/xoa-vinh-vien', [NoiDungQuanTriController::class, 'xoaVinhVien'])->whereNumber('ma');
        });

        Route::prefix('kho/{loai}')->where(['loai' => 'nhap|xuat'])->group(function () {
            Route::get('/', [KhoQuanTriController::class, 'index']);
            Route::post('/', [KhoQuanTriController::class, 'store']);
            Route::get('/{ma}', [KhoQuanTriController::class, 'show'])->whereNumber('ma');
            Route::put('/{ma}', [KhoQuanTriController::class, 'update'])->whereNumber('ma');
            Route::delete('/{ma}', [KhoQuanTriController::class, 'destroy'])->whereNumber('ma');
            Route::patch('/{ma}/hoan-tat', [KhoQuanTriController::class, 'hoanTat'])->whereNumber('ma');
            Route::patch('/{ma}/khoi-phuc', [KhoQuanTriController::class, 'khoiPhuc'])->whereNumber('ma');
        });

        Route::get('/don-hang', [DonHangController::class, 'index']);
        Route::patch('/don-hang/{maDonHang}/thanh-toan', [DonHangController::class, 'updatePayment'])
            ->whereNumber('maDonHang');

        Route::get('/don-hang/{maDonHang}', [DonHangController::class, 'show'])
            ->whereNumber('maDonHang');
        Route::patch(
            '/don-hang/{maDonHang}/trang-thai',
            [DonHangController::class, 'updateStatus']
            )->whereNumber('maDonHang');
    });
