<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminFeaturesTest extends TestCase
{
    use RefreshDatabase;

    private function quanTri(): User
    {
        $user = User::factory()->create(['vai_tro' => 'quan_tri_vien']);
        Sanctum::actingAs($user);

        return $user;
    }

    private function sanPham(int $ton = 5): int
    {
        $suffix = uniqid();
        $danhMuc = DB::table('danh_muc')->insertGetId(['ten_danh_muc' => 'Danh mục '.$suffix, 'duong_dan' => 'dm-'.$suffix], 'ma_danh_muc');
        $thuongHieu = DB::table('thuong_hieu')->insertGetId(['ten_thuong_hieu' => 'Hãng '.$suffix, 'duong_dan' => 'th-'.$suffix], 'ma_thuong_hieu');

        return DB::table('san_pham')->insertGetId([
            'ten_san_pham' => 'Xe '.$suffix, 'duong_dan' => 'xe-'.$suffix, 'gia_ban' => 100000,
            'ma_danh_muc' => $danhMuc, 'ma_thuong_hieu' => $thuongHieu, 'so_luong_ton' => $ton,
        ], 'ma_san_pham');
    }

    private function donHang(array $them = []): int
    {
        return DB::table('don_hang')->insertGetId(array_replace([
            'ho_ten' => 'Khách thử', 'so_dien_thoai' => '0909000000', 'dia_chi_giao_hang' => 'TP.HCM',
            'tong_tien' => 100000, 'ngay_tao' => '2026-10-10 10:00:00',
        ], $them), 'ma_don_hang');
    }

    public function test_admin_endpoints_require_login_and_admin_role(): void
    {
        $this->assertSame('sqlite', config('database.default'));
        $this->assertSame(':memory:', config('database.connections.sqlite.database'));
        $this->getJson('/api/admin/tong-quan')->assertUnauthorized();
        $this->postJson('/api/sanpham', [])->assertUnauthorized();
        Sanctum::actingAs(User::factory()->create());
        foreach (['tong-quan', 'bao-cao', 'cai-dat', 'noi-dung/bai-viet', 'kho/nhap', 'members'] as $url) {
            $this->getJson('/api/admin/'.$url)->assertForbidden();
        }
        $this->postJson('/api/danhmuc', [])->assertForbidden();
        $this->sanPham();
        $this->deleteJson('/api/thuonghieu/1')->assertForbidden();
    }

    public function test_content_crud_trash_restore_and_unique_slug(): void
    {
        $admin = $this->quanTri();
        foreach (['bai-viet' => 'ma_bai_viet', 'trang-don' => 'ma_trang_don'] as $loai => $khoa) {
            $url = '/api/admin/noi-dung/'.$loai;
            $payload = ['tieu_de' => 'Giới thiệu '.$loai, 'noi_dung' => 'Nội dung thử', 'trang_thai' => 'hien_thi'];
            $response = $this->postJson($url, $payload)->assertCreated()->assertJsonPath('data.ma_nguoi_dung', $admin->getKey());
            $ma = $response->json('data.'.$khoa);
            $this->putJson($url.'/'.$ma, [...$payload, 'noi_dung' => 'Đã cập nhật'])->assertOk()->assertJsonPath('data.noi_dung', 'Đã cập nhật');
            $this->deleteJson($url.'/'.$ma)->assertOk();
            $this->getJson($url)->assertJsonCount(0, 'data');
            $this->getJson($url.'?thung_rac=1')->assertJsonCount(1, 'data');
            $this->postJson($url, $payload)->assertUnprocessable()->assertJsonValidationErrors('duong_dan');
            $this->patchJson($url.'/'.$ma.'/khoi-phuc')->assertOk();
            $this->getJson($url)->assertJsonCount(1, 'data');
            $this->deleteJson($url.'/'.$ma)->assertOk();
            $this->deleteJson($url.'/'.$ma.'/xoa-vinh-vien')->assertOk();
            $this->getJson($url.'/'.$ma)->assertNotFound();
        }
    }

    public function test_banner_upload_validation_and_file_cleanup(): void
    {
        $this->quanTri();
        Storage::fake('public');
        $url = '/api/admin/noi-dung/anh-quang-cao';
        $data = ['tieu_de' => 'Banner', 'vi_tri' => 'trang_chu', 'thu_tu_hien_thi' => 0, 'trang_thai' => 'hoat_dong'];
        $this->postJson($url, $data)->assertUnprocessable();
        $png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=');
        $r = $this->post($url, [...$data, 'tep_anh' => UploadedFile::fake()->createWithContent('banner.png', $png)], ['Accept' => 'application/json'])->assertCreated();
        $ma = $r->json('data.ma_anh_quang_cao');
        $this->assertCount(1, Storage::disk('public')->allFiles());
        $this->deleteJson($url.'/'.$ma)->assertOk();
        $this->assertCount(1, Storage::disk('public')->allFiles());
        $this->deleteJson($url.'/'.$ma.'/xoa-vinh-vien')->assertOk();
        $this->assertCount(0, Storage::disk('public')->allFiles());
    }

    public function test_navigation_rejects_cycles_and_deleting_parent_first(): void
    {
        $this->quanTri();
        $url = '/api/admin/noi-dung/thanh-dieu-huong';
        $data = ['ten_hien_thi' => 'Menu', 'duong_dan' => '/products', 'thu_tu_hien_thi' => 1, 'trang_thai' => 'hoat_dong'];
        $cha = $this->postJson($url, $data)->assertCreated()->json('data.ma_thanh_dieu_huong');
        $con = $this->postJson($url, [...$data, 'duong_dan' => '/products/new', 'ma_thanh_dieu_huong_cha' => $cha])->assertCreated()->json('data.ma_thanh_dieu_huong');
        $this->putJson($url.'/'.$cha, [...$data, 'ma_thanh_dieu_huong_cha' => $con])->assertUnprocessable();
        $this->deleteJson($url.'/'.$cha)->assertUnprocessable();
        $this->deleteJson($url.'/'.$con)->assertOk();
        $this->deleteJson($url.'/'.$cha)->assertOk();
        $this->patchJson($url.'/'.$con.'/khoi-phuc')->assertUnprocessable();
        $this->deleteJson($url.'/'.$cha.'/xoa-vinh-vien')->assertUnprocessable();
        $this->patchJson($url.'/'.$cha.'/khoi-phuc')->assertOk();
        $this->patchJson($url.'/'.$con.'/khoi-phuc')->assertOk();
        $this->postJson($url, [...$data, 'duong_dan' => 'javascript:alert(1)'])->assertUnprocessable();
    }

    public function test_contact_reply_is_saved_without_overwriting_customer_message(): void
    {
        $this->quanTri();
        $ma = DB::table('lien_he')->insertGetId(['ho_ten' => 'Khách', 'dia_chi_email' => 'khach@example.com', 'noi_dung' => 'Tư vấn xe'], 'ma_lien_he');
        $url = '/api/admin/noi-dung/lien-he/'.$ma;
        $this->putJson($url, ['trang_thai' => 'da_phan_hoi'])->assertUnprocessable();
        $this->putJson($url, ['trang_thai' => 'da_phan_hoi', 'phan_hoi' => 'Mời bạn đến cửa hàng', 'noi_dung' => 'Không được ghi đè'])->assertOk()
            ->assertJsonPath('data.noi_dung', 'Tư vấn xe')->assertJsonPath('data.phan_hoi', 'Mời bạn đến cửa hàng');
        $this->assertNotNull(DB::table('lien_he')->where('ma_lien_he', $ma)->value('thoi_gian_phan_hoi'));
        $this->postJson('/api/admin/noi-dung/lien-he', [])->assertStatus(405);
    }

    public function test_user_management_prevents_self_lock_and_revokes_disabled_tokens(): void
    {
        $admin = $this->quanTri();
        $data = ['ho_ten' => 'Nhân viên', 'ten_dang_nhap' => 'nhanvien', 'dia_chi_email' => 'nhanvien@example.com', 'vai_tro' => 'nhan_vien', 'trang_thai' => 'hoat_dong', 'mat_khau' => 'password'];
        $r = $this->postJson('/api/admin/members', $data)->assertCreated()->assertJsonMissingPath('data.mat_khau');
        $ma = $r->json('data.ma_nguoi_dung');
        User::findOrFail($ma)->createToken('test');
        unset($data['mat_khau']);
        $this->putJson('/api/admin/members/'.$ma, [...$data, 'trang_thai' => 'khoa'])->assertOk();
        $this->assertSame(0, User::findOrFail($ma)->tokens()->count());
        $this->putJson('/api/admin/members/'.$admin->getKey(), [
            'ho_ten' => $admin->ho_ten, 'ten_dang_nhap' => $admin->ten_dang_nhap, 'dia_chi_email' => $admin->dia_chi_email,
            'vai_tro' => 'thanh_vien', 'trang_thai' => 'hoat_dong',
        ])->assertUnprocessable();
        $this->deleteJson('/api/admin/members/'.$admin->getKey())->assertUnprocessable();
        $this->deleteJson('/api/admin/members/'.$ma)->assertOk();
        $this->getJson('/api/admin/members?thung_rac=1')->assertJsonCount(1, 'data');
        $this->patchJson('/api/admin/members/'.$ma.'/khoi-phuc')->assertOk();
        $this->deleteJson('/api/admin/members/'.$ma)->assertOk();
        $this->deleteJson('/api/admin/members/'.$ma.'/xoa-vinh-vien')->assertOk();
    }

    public function test_user_with_history_cannot_be_permanently_deleted(): void
    {
        $this->quanTri();
        $user = User::factory()->create();
        $this->donHang(['ma_nguoi_dung' => $user->getKey()]);
        $this->deleteJson('/api/admin/members/'.$user->getKey())->assertOk();
        $this->deleteJson('/api/admin/members/'.$user->getKey().'/xoa-vinh-vien')->assertUnprocessable();
        $this->assertDatabaseHas('don_hang', ['ma_nguoi_dung' => $user->getKey()]);
    }

    public function test_inactive_account_cannot_login(): void
    {
        $user = User::factory()->create(['trang_thai' => 'khoa', 'mat_khau' => 'password']);
        $this->postJson('/api/login', ['dia_chi_email' => $user->dia_chi_email, 'mat_khau' => 'password'])->assertForbidden();
        $this->assertSame(0, $user->tokens()->count());
    }

    public function test_inventory_drafts_do_not_change_stock_and_completion_is_idempotent(): void
    {
        $this->quanTri();
        $ma = $this->sanPham(5);
        $data = ['nha_cung_cap' => 'Đại lý', 'chi_tiet' => [['ma_san_pham' => $ma, 'so_luong' => 3, 'don_gia' => 100.25]]];
        $r = $this->postJson('/api/admin/kho/nhap', $data)->assertOk()->assertJsonPath('data.trang_thai', 'ban_nhap');
        $phieu = $r->json('data.ma_phieu_nhap');
        $this->assertEquals(300.75, $r->json('data.tong_tien'));
        $this->assertDatabaseHas('san_pham', ['ma_san_pham' => $ma, 'so_luong_ton' => 5]);
        $this->patchJson('/api/admin/kho/nhap/'.$phieu.'/hoan-tat')->assertOk();
        $this->assertDatabaseHas('san_pham', ['ma_san_pham' => $ma, 'so_luong_ton' => 8]);
        $this->patchJson('/api/admin/kho/nhap/'.$phieu.'/hoan-tat')->assertStatus(409);
        $this->putJson('/api/admin/kho/nhap/'.$phieu, $data)->assertStatus(409);
        $this->deleteJson('/api/admin/kho/nhap/'.$phieu)->assertStatus(409);
        $this->assertDatabaseHas('san_pham', ['ma_san_pham' => $ma, 'so_luong_ton' => 8]);
    }

    public function test_export_is_atomic_when_one_product_has_insufficient_stock(): void
    {
        $this->quanTri();
        $a = $this->sanPham(5);
        $b = $this->sanPham(1);
        $data = ['ly_do_xuat' => 'ban_hang', 'chi_tiet' => [['ma_san_pham' => $a, 'so_luong' => 2], ['ma_san_pham' => $b, 'so_luong' => 2]]];
        $phieu = $this->postJson('/api/admin/kho/xuat', $data)->assertOk()->json('data.ma_phieu_xuat');
        $this->patchJson('/api/admin/kho/xuat/'.$phieu.'/hoan-tat')->assertUnprocessable();
        $this->assertDatabaseHas('san_pham', ['ma_san_pham' => $a, 'so_luong_ton' => 5]);
        $this->assertDatabaseHas('san_pham', ['ma_san_pham' => $b, 'so_luong_ton' => 1]);
        $data['chi_tiet'][1]['so_luong'] = 1;
        $this->putJson('/api/admin/kho/xuat/'.$phieu, $data)->assertOk();
        $this->patchJson('/api/admin/kho/xuat/'.$phieu.'/hoan-tat')->assertOk();
        $this->assertDatabaseHas('san_pham', ['ma_san_pham' => $a, 'so_luong_ton' => 3]);
        $this->assertDatabaseHas('san_pham', ['ma_san_pham' => $b, 'so_luong_ton' => 0]);
    }

    public function test_stock_draft_trash_restore_and_duplicate_lines_validation(): void
    {
        $this->quanTri();
        $ma = $this->sanPham();
        $dong = ['ma_san_pham' => $ma, 'so_luong' => 1];
        $data = ['ly_do_xuat' => 'khac', 'chi_tiet' => [$dong]];
        $this->postJson('/api/admin/kho/xuat', [...$data, 'chi_tiet' => [$dong, $dong]])->assertUnprocessable();
        $phieu = $this->postJson('/api/admin/kho/xuat', $data)->assertOk()->json('data.ma_phieu_xuat');
        $this->deleteJson('/api/admin/kho/xuat/'.$phieu)->assertOk();
        $this->getJson('/api/admin/kho/xuat')->assertJsonCount(0, 'data');
        $this->getJson('/api/admin/kho/xuat?thung_rac=1')->assertJsonCount(1, 'data');
        $this->patchJson('/api/admin/kho/xuat/'.$phieu.'/hoan-tat')->assertNotFound();
        $this->patchJson('/api/admin/kho/xuat/'.$phieu.'/khoi-phuc')->assertOk();
        $this->getJson('/api/admin/kho/xuat/'.$phieu)->assertOk()->assertJsonCount(1, 'data.chi_tiet');
    }

    public function test_reports_exclude_unpaid_refunded_cancelled_and_outside_period(): void
    {
        $this->quanTri();
        $ma = $this->sanPham(3);
        $don = $this->donHang(['trang_thai' => 'da_giao', 'trang_thai_thanh_toan' => 'da_thanh_toan']);
        DB::table('chi_tiet_don_hang')->insert(['ma_don_hang' => $don, 'ma_san_pham' => $ma, 'ten_san_pham' => 'Xe thử', 'so_luong' => 2, 'don_gia' => 50000, 'thanh_tien' => 100000]);
        $this->donHang();
        $this->donHang(['trang_thai' => 'da_huy', 'trang_thai_thanh_toan' => 'da_thanh_toan']);
        $this->donHang(['trang_thai_thanh_toan' => 'da_hoan_tien']);
        $this->donHang(['trang_thai_thanh_toan' => 'da_thanh_toan', 'ngay_tao' => '2025-01-01 00:00:00']);
        $r = $this->getJson('/api/admin/bao-cao?tu_ngay=2026-10-01&den_ngay=2026-10-31')->assertOk();
        $this->assertEquals(100000, $r->json('data.tong_quan.doanh_thu'));
        $r->assertJsonPath('data.tong_quan.so_don_hang', 4)->assertJsonPath('data.tong_quan.so_san_pham_ban', 2)->assertJsonCount(31, 'data.doanh_thu_theo_ngay');
        $this->getJson('/api/admin/bao-cao?tu_ngay=2026-10-31&den_ngay=2026-10-01')->assertUnprocessable();
    }

    public function test_settings_persist_and_control_low_stock_notifications_and_search(): void
    {
        $this->quanTri();
        $this->sanPham(3);
        $this->putJson('/api/admin/cai-dat', ['ten_cua_hang' => 'Moto Test', 'nguong_ton_kho' => 2])->assertOk();
        $this->getJson('/api/admin/cai-dat')->assertJsonPath('data.ten_cua_hang', 'Moto Test')->assertJsonPath('data.nguong_ton_kho', 2);
        $this->getJson('/api/admin/thong-bao')->assertJsonPath('data.san_pham_sap_het', 0);
        $this->putJson('/api/admin/cai-dat', ['ten_cua_hang' => 'Moto Test', 'nguong_ton_kho' => 3])->assertOk();
        $this->getJson('/api/admin/thong-bao')->assertJsonPath('data.san_pham_sap_het', 1);
        $this->getJson('/api/admin/tim-kiem?tu_khoa=Xe')->assertOk()->assertJsonCount(1, 'data');
    }

    public function test_payment_refund_and_legacy_order_status_transitions(): void
    {
        $this->quanTri();
        $ma = $this->donHang(['trang_thai' => 'dang_xu_ly']);
        $url = '/api/admin/don-hang/'.$ma;
        $paid = ['trang_thai_thanh_toan' => 'da_thanh_toan', 'trang_thai_hien_tai' => 'chua_thanh_toan', 'ma_giao_dich' => 'GD-TEST'];
        $this->patchJson($url.'/thanh-toan', $paid)->assertOk()->assertJsonPath('data.ma_giao_dich', 'GD-TEST');
        $this->patchJson($url.'/thanh-toan', $paid)->assertStatus(409);
        $this->patchJson($url.'/trang-thai', ['trang_thai' => 'da_huy', 'trang_thai_hien_tai' => 'dang_xu_ly'])->assertUnprocessable();
        $this->patchJson($url.'/thanh-toan', ['trang_thai_thanh_toan' => 'da_hoan_tien', 'trang_thai_hien_tai' => 'da_thanh_toan'])->assertOk();
        $this->patchJson($url.'/trang-thai', ['trang_thai' => 'da_huy', 'trang_thai_hien_tai' => 'dang_xu_ly'])->assertOk();
        $this->patchJson($url.'/thanh-toan', $paid)->assertStatus(409);
        $khac = $this->donHang(['trang_thai' => 'dang_xu_ly']);
        $this->patchJson('/api/admin/don-hang/'.$khac.'/trang-thai', ['trang_thai' => 'dang_giao', 'trang_thai_hien_tai' => 'dang_xu_ly'])->assertOk();
    }
}
