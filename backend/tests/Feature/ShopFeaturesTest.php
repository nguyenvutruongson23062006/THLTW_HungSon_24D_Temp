<?php

namespace Tests\Feature;

use App\Mail\DatLaiMatKhauMail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ShopFeaturesTest extends TestCase
{
    use RefreshDatabase;

    private function sanPham(int $ton = 5, array $them = []): int
    {
        $s = uniqid();
        $dm = DB::table('danh_muc')->insertGetId(['ten_danh_muc' => 'DM '.$s, 'duong_dan' => 'dm-'.$s], 'ma_danh_muc');
        $th = DB::table('thuong_hieu')->insertGetId(['ten_thuong_hieu' => 'TH '.$s, 'duong_dan' => 'th-'.$s], 'ma_thuong_hieu');

        return DB::table('san_pham')->insertGetId(array_replace(['ten_san_pham' => 'Xe '.$s, 'duong_dan' => 'xe-'.$s, 'ma_danh_muc' => $dm, 'ma_thuong_hieu' => $th, 'gia_ban' => 100000, 'gia_khuyen_mai' => 90000, 'so_luong_ton' => $ton], $them), 'ma_san_pham');
    }

    private function don(int $ma, array $them = []): array
    {
        return array_replace(['ho_ten' => 'Khách thử', 'dia_chi_email' => 'khach@example.com', 'so_dien_thoai' => '0909000000', 'dia_chi_giao_hang' => '12 Nguyễn Huệ, TP.HCM', 'phuong_thuc_thanh_toan' => 'tien_mat', 'khoa_dat_hang' => (string) Str::uuid(), 'chi_tiet' => [['ma_san_pham' => $ma, 'so_luong' => 2]], 'tong_tien_du_kien' => '180000.00'], $them);
    }

    private function maGiam(array $them = []): int
    {
        return DB::table('khuyen_mai')->insertGetId(array_replace(['ma_giam_gia' => 'GIAM10', 'ten_khuyen_mai' => 'Giảm mười phần trăm', 'loai_giam' => 'phan_tram', 'gia_tri_giam' => 10, 'don_toi_thieu' => 100000, 'ngay_bat_dau' => now('Asia/Ho_Chi_Minh')->subDay()->toDateString(), 'ngay_ket_thuc' => now('Asia/Ho_Chi_Minh')->addDay()->toDateString()], $them), 'ma_khuyen_mai');
    }

    public function test_unpaid_transfer_hidden_until_confirmed(): void
    {
        $member = User::factory()->create();
        Sanctum::actingAs($member);
        $payload = $this->don($this->sanPham(), ['phuong_thuc_thanh_toan' => 'chuyen_khoan']);
        $id = $this->postJson('/api/cua-hang/dat-hang', $payload)->assertCreated()->assertJsonPath('message', 'Đặt hàng thành công.')->json('data.ma_don_hang');
        $this->getJson('/api/cua-hang/don-hang')->assertOk()->assertJsonPath('data.tong', 0);
        Sanctum::actingAs(User::factory()->create(['vai_tro' => 'quan_tri_vien']));
        $this->patchJson('/api/admin/don-hang/'.$id.'/thanh-toan', ['trang_thai_hien_tai' => 'chua_thanh_toan', 'trang_thai_thanh_toan' => 'da_thanh_toan'])->assertOk();
        Sanctum::actingAs($member);
        $this->getJson('/api/cua-hang/don-hang')->assertOk()->assertJsonPath('data.tong', 1)->assertJsonPath('data.danh_sach.0.ma_don_hang', $id);
    }

    public function test_promotion_can_have_no_dates_and_dates_can_be_cleared(): void
    {
        Sanctum::actingAs(User::factory()->create(['vai_tro' => 'quan_tri_vien']));
        $data = ['ma_giam_gia' => 'KHONGHETHAN', 'ten_khuyen_mai' => 'Không hết hạn', 'loai_giam' => 'phan_tram', 'gia_tri_giam' => 10,
            'don_toi_thieu' => 0, 'chi_thanh_vien' => false, 'trang_thai' => 'hoat_dong'];
        $id = $this->postJson('/api/admin/khuyen-mai', $data)->assertOk()->assertJsonPath('data.ngay_bat_dau', null)->assertJsonPath('data.ngay_ket_thuc', null)->json('data.ma_khuyen_mai');
        $sp = $this->sanPham();
        $quote = ['chi_tiet' => [['ma_san_pham' => $sp, 'so_luong' => 1]], 'ma_giam_gia' => 'KHONGHETHAN'];
        $this->postJson('/api/cua-hang/bao-gia', $quote)->assertOk()->assertJsonPath('data.giam_gia', '9000.00');
        $this->putJson('/api/admin/khuyen-mai/'.$id, [...$data, 'ngay_bat_dau' => '2026-12-31', 'ngay_ket_thuc' => '2026-01-01'])->assertUnprocessable();
        $this->putJson('/api/admin/khuyen-mai/'.$id, [...$data, 'ngay_ket_thuc' => '2000-01-01'])->assertOk();
        $this->postJson('/api/cua-hang/bao-gia', $quote)->assertUnprocessable();
        $this->putJson('/api/admin/khuyen-mai/'.$id, [...$data, 'ngay_bat_dau' => '', 'ngay_ket_thuc' => ''])->assertOk()->assertJsonPath('data.ngay_ket_thuc', null);
        $this->postJson('/api/cua-hang/bao-gia', $quote)->assertOk();
    }

    public function test_register_login_profile_logout_for_member(): void
    {
        $payload = ['ho_ten' => 'Người mua', 'ten_dang_nhap' => 'nguoimua', 'dia_chi_email' => 'nguoimua@example.com', 'mat_khau' => 'password', 'mat_khau_confirmation' => 'password', 'vai_tro' => 'quan_tri_vien'];
        $r = $this->postJson('/api/register', $payload)->assertCreated()->assertJsonPath('user.vai_tro', 'thanh_vien')->assertJsonMissingPath('user.mat_khau');
        $this->assertTrue(Hash::check('password', User::first()->mat_khau));
        $this->postJson('/api/login', ['dia_chi_email' => $payload['dia_chi_email'], 'mat_khau' => 'sai'])->assertUnauthorized();
        $token = $this->postJson('/api/login', ['dia_chi_email' => $payload['dia_chi_email'], 'mat_khau' => 'password'])->assertOk()->json('token');
        $headers = ['Authorization' => 'Bearer '.$token];
        $this->putJson('/api/profile', ['ho_ten' => 'Tên mới', 'so_dien_thoai' => '0909000001', 'dia_chi' => 'Địa chỉ mới'], $headers)->assertOk()->assertJsonPath('user.dia_chi', 'Địa chỉ mới');
        $this->postJson('/api/change-password', ['mat_khau_cu' => 'sai', 'mat_khau_moi' => 'new-password', 'mat_khau_moi_confirmation' => 'new-password'], $headers)->assertUnprocessable();
        $this->postJson('/api/change-password', ['mat_khau_cu' => 'password', 'mat_khau_moi' => 'new-password', 'mat_khau_moi_confirmation' => 'new-password'], $headers)->assertOk();
        $this->assertSame(1, User::first()->tokens()->count());
        $this->postJson('/api/logout', [], $headers)->assertOk();
        $this->assertSame(0, User::first()->tokens()->count());
        $this->postJson('/api/register', $payload)->assertUnprocessable();
    }

    public function test_password_reset_email_single_use_expiry_and_token_revocation(): void
    {
        Mail::fake();
        $user = User::factory()->create();
        $user->createToken('old-session');
        $this->postJson('/api/quen-mat-khau', ['dia_chi_email' => $user->dia_chi_email])->assertOk()->assertJsonMissingPath('token');
        $link = null;
        Mail::assertSent(DatLaiMatKhauMail::class, function ($mail) use (&$link, $user) {
            $link = $mail->duongDan;

            return $mail->hasTo($user->dia_chi_email);
        });
        parse_str(parse_url($link, PHP_URL_QUERY), $query);
        $this->assertNotSame($query['token'], $user->refresh()->ma_dat_lai_mat_khau);
        $data = ['dia_chi_email' => $user->dia_chi_email, 'token' => $query['token'], 'mat_khau' => 'reset-password', 'mat_khau_confirmation' => 'reset-password'];
        $this->postJson('/api/dat-lai-mat-khau', [...$data, 'token' => str_repeat('x', 64)])->assertUnprocessable();
        $this->postJson('/api/dat-lai-mat-khau', $data)->assertOk();
        $this->assertTrue(Hash::check('reset-password', $user->refresh()->mat_khau));
        $this->assertSame(0, $user->tokens()->count());
        $this->postJson('/api/dat-lai-mat-khau', $data)->assertUnprocessable();
        $user->update(['ma_dat_lai_mat_khau' => hash('sha256', $query['token']), 'thoi_gian_dat_lai_mat_khau' => now()->subMinutes(61)]);
        $this->postJson('/api/dat-lai-mat-khau', $data)->assertUnprocessable();
        $this->postJson('/api/quen-mat-khau', ['dia_chi_email' => 'unknown@example.com'])->assertOk();
        Mail::assertSentCount(1);
    }

    public function test_guest_checkout_uses_server_price_and_creates_order_details_and_stock(): void
    {
        $ma = $this->sanPham();
        $quote = $this->postJson('/api/cua-hang/bao-gia', ['chi_tiet' => [['ma_san_pham' => $ma, 'so_luong' => 2]], 'tong_tien' => 1])->assertOk();
        $this->assertEquals(180000, $quote->json('data.tong_tien'));
        $payload = $this->don($ma, ['tong_tien' => 1, 'ma_nguoi_dung' => 123, 'trang_thai_thanh_toan' => 'da_thanh_toan']);
        $r = $this->postJson('/api/cua-hang/dat-hang', $payload)->assertCreated()->assertJsonPath('data.ma_nguoi_dung', null)->assertJsonPath('data.trang_thai_thanh_toan', 'chua_thanh_toan');
        $this->assertEquals(180000, $r->json('data.tong_tien'));
        $r->assertJsonCount(1, 'data.chi_tiet_don_hangs')->assertJsonCount(1, 'data.lich_su')->assertJsonMissingPath('data.khoa_dat_hang');
        $this->assertDatabaseHas('san_pham', ['ma_san_pham' => $ma, 'so_luong_ton' => 3]);
    }

    public function test_duplicate_checkout_returns_same_order_without_stock_or_coupon_reuse(): void
    {
        $ma = $this->sanPham();
        $this->maGiam(['gioi_han_su_dung' => 1]);
        $data = $this->don($ma, ['ma_giam_gia' => 'giam10', 'tong_tien_du_kien' => '162000.00']);
        $id = $this->postJson('/api/cua-hang/dat-hang', $data)->assertCreated()->json('data.ma_don_hang');
        $this->postJson('/api/cua-hang/dat-hang', array_reverse($data, true))->assertOk()->assertJsonPath('data.ma_don_hang', $id);
        $this->postJson('/api/cua-hang/dat-hang', [...$data, 'ho_ten' => 'Tên khác'])->assertStatus(409);
        $this->assertDatabaseCount('don_hang', 1);
        $this->assertDatabaseHas('san_pham', ['ma_san_pham' => $ma, 'so_luong_ton' => 3]);
        $this->assertDatabaseHas('khuyen_mai', ['da_su_dung' => 1]);
    }

    public function test_checkout_rolls_back_for_short_stock_price_change_or_inactive_product(): void
    {
        $ma = $this->sanPham(1);
        $this->postJson('/api/cua-hang/dat-hang', $this->don($ma))->assertUnprocessable();
        DB::table('san_pham')->where('ma_san_pham', $ma)->update(['so_luong_ton' => 5]);
        $this->postJson('/api/cua-hang/dat-hang', $this->don($ma, ['tong_tien_du_kien' => 1]))->assertUnprocessable();
        DB::table('san_pham')->where('ma_san_pham', $ma)->update(['trang_thai' => 'tam_ngung']);
        $this->postJson('/api/cua-hang/dat-hang', $this->don($ma))->assertUnprocessable();
        $this->assertDatabaseCount('don_hang', 0);
        $this->assertDatabaseCount('chi_tiet_don_hang', 0);
        $this->assertDatabaseHas('san_pham', ['ma_san_pham' => $ma, 'so_luong_ton' => 5]);
    }

    public function test_duplicate_cart_lines_and_invalid_payment_are_rejected(): void
    {
        $ma = $this->sanPham();
        $data = $this->don($ma);
        $this->postJson('/api/cua-hang/dat-hang', [...$data, 'chi_tiet' => [$data['chi_tiet'][0], $data['chi_tiet'][0]]])->assertUnprocessable();
        $this->postJson('/api/cua-hang/dat-hang', [...$data, 'phuong_thuc_thanh_toan' => 'mien_phi'])->assertUnprocessable();
        $this->postJson('/api/cua-hang/dat-hang', [...$data, 'khoa_dat_hang' => ''])->assertUnprocessable();
        $this->assertDatabaseCount('don_hang', 0);
    }

    public function test_coupon_dates_minimum_member_condition_and_usage_limit(): void
    {
        $ma = $this->sanPham(10);
        $coupon = $this->maGiam(['ngay_ket_thuc' => now('Asia/Ho_Chi_Minh')->subDay()->toDateString()]);
        $q = ['chi_tiet' => [['ma_san_pham' => $ma, 'so_luong' => 2]], 'ma_giam_gia' => 'GIAM10'];
        $this->postJson('/api/cua-hang/bao-gia', [...$q, 'ma_giam_gia' => '0'])->assertUnprocessable();
        $this->postJson('/api/cua-hang/bao-gia', $q)->assertUnprocessable();
        DB::table('khuyen_mai')->where('ma_khuyen_mai', $coupon)->update(['ngay_bat_dau' => now('Asia/Ho_Chi_Minh')->addDay()->toDateString(), 'ngay_ket_thuc' => now('Asia/Ho_Chi_Minh')->addDays(2)->toDateString()]);
        $this->postJson('/api/cua-hang/bao-gia', $q)->assertUnprocessable();
        DB::table('khuyen_mai')->where('ma_khuyen_mai', $coupon)->update(['ngay_bat_dau' => now('Asia/Ho_Chi_Minh')->toDateString(), 'don_toi_thieu' => 200000]);
        $this->postJson('/api/cua-hang/bao-gia', $q)->assertUnprocessable();
        DB::table('khuyen_mai')->where('ma_khuyen_mai', $coupon)->update(['don_toi_thieu' => 0, 'chi_thanh_vien' => true]);
        $this->postJson('/api/cua-hang/bao-gia', $q)->assertUnprocessable();
        Sanctum::actingAs(User::factory()->create());
        $this->postJson('/api/cua-hang/bao-gia', $q)->assertOk();
        DB::table('khuyen_mai')->where('ma_khuyen_mai', $coupon)->update(['gioi_han_su_dung' => 1]);
        $data = $this->don($ma, ['ma_giam_gia' => 'GIAM10', 'tong_tien_du_kien' => 162000]);
        $this->postJson('/api/cua-hang/dat-hang', $data)->assertCreated();
        $this->postJson('/api/cua-hang/dat-hang', [...$data, 'khoa_dat_hang' => (string) Str::uuid()])->assertUnprocessable();
        $this->assertDatabaseCount('don_hang', 1);
        $this->assertDatabaseHas('san_pham', ['ma_san_pham' => $ma, 'so_luong_ton' => 8]);
    }

    public function test_discount_cap_fixed_amount_and_total_never_negative(): void
    {
        $ma = $this->sanPham();
        $coupon = $this->maGiam(['gia_tri_giam' => 50, 'giam_toi_da' => 10000]);
        $q = ['chi_tiet' => [['ma_san_pham' => $ma, 'so_luong' => 2]], 'ma_giam_gia' => 'GIAM10'];
        $r = $this->postJson('/api/cua-hang/bao-gia', $q)->assertOk();
        $this->assertEquals(170000, $r->json('data.tong_tien'));
        DB::table('khuyen_mai')->where('ma_khuyen_mai', $coupon)->update(['loai_giam' => 'so_tien', 'gia_tri_giam' => 999999, 'giam_toi_da' => null]);
        $r = $this->postJson('/api/cua-hang/bao-gia', $q)->assertOk();
        $this->assertEquals(0, $r->json('data.tong_tien'));
    }

    public function test_member_only_sees_own_orders_and_can_cancel_once(): void
    {
        $ma = $this->sanPham();
        $this->maGiam();
        $user = User::factory()->create();
        Sanctum::actingAs($user);
        $id = $this->postJson('/api/cua-hang/dat-hang', $this->don($ma, ['ma_giam_gia' => 'GIAM10', 'tong_tien_du_kien' => 162000]))->assertCreated()->assertJsonPath('data.ma_nguoi_dung', $user->getKey())->json('data.ma_don_hang');
        $this->getJson('/api/cua-hang/don-hang')->assertOk()->assertJsonPath('data.tong', 1);
        $this->getJson('/api/cua-hang/don-hang/'.$id)->assertOk();
        Sanctum::actingAs(User::factory()->create());
        $this->getJson('/api/cua-hang/don-hang/'.$id)->assertNotFound();
        $this->patchJson('/api/cua-hang/don-hang/'.$id.'/huy')->assertNotFound();
        $this->getJson('/api/cua-hang/don-hang')->assertJsonPath('data.tong', 0);
        Sanctum::actingAs($user);
        $this->patchJson('/api/cua-hang/don-hang/'.$id.'/huy')->assertOk()->assertJsonPath('data.trang_thai', 'da_huy')->assertJsonCount(2, 'data.lich_su');
        $this->patchJson('/api/cua-hang/don-hang/'.$id.'/huy')->assertStatus(409);
        $this->assertDatabaseHas('san_pham', ['ma_san_pham' => $ma, 'so_luong_ton' => 5]);
        $this->assertDatabaseHas('khuyen_mai', ['da_su_dung' => 0]);
    }

    public function test_confirmed_or_paid_orders_cannot_be_self_cancelled(): void
    {
        $ma = $this->sanPham();
        Sanctum::actingAs(User::factory()->create());
        $id = $this->postJson('/api/cua-hang/dat-hang', $this->don($ma))->assertCreated()->json('data.ma_don_hang');
        DB::table('don_hang')->where('ma_don_hang', $id)->update(['trang_thai' => 'da_xac_nhan']);
        $this->patchJson('/api/cua-hang/don-hang/'.$id.'/huy')->assertStatus(409);
        DB::table('don_hang')->where('ma_don_hang', $id)->update(['trang_thai' => 'cho_xac_nhan', 'trang_thai_thanh_toan' => 'da_thanh_toan']);
        $this->patchJson('/api/cua-hang/don-hang/'.$id.'/huy')->assertUnprocessable();
        $this->assertDatabaseHas('san_pham', ['ma_san_pham' => $ma, 'so_luong_ton' => 3]);
    }

    public function test_admin_cancel_restores_checkout_stock_and_records_history(): void
    {
        $ma = $this->sanPham();
        $id = $this->postJson('/api/cua-hang/dat-hang', $this->don($ma))->assertCreated()->json('data.ma_don_hang');
        Sanctum::actingAs(User::factory()->create(['vai_tro' => 'quan_tri_vien']));
        $this->patchJson('/api/admin/don-hang/'.$id.'/trang-thai', ['trang_thai_hien_tai' => 'cho_xac_nhan', 'trang_thai' => 'da_huy'])->assertOk();
        $this->getJson('/api/admin/don-hang/'.$id)->assertOk()->assertJsonCount(2, 'data.lich_su');
        $this->assertDatabaseHas('san_pham', ['ma_san_pham' => $ma, 'so_luong_ton' => 5]);
        $this->assertDatabaseHas('don_hang', ['ma_don_hang' => $id, 'da_tru_kho' => false]);
    }

    public function test_inactive_or_invalid_session_cannot_checkout_and_guests_cannot_read_history(): void
    {
        $ma = $this->sanPham();
        $this->getJson('/api/cua-hang/don-hang')->assertUnauthorized();
        $this->postJson('/api/cua-hang/dat-hang', $this->don($ma), ['Authorization' => 'Bearer invalid'])->assertUnauthorized();
        Sanctum::actingAs(User::factory()->create(['trang_thai' => 'khoa']));
        $this->postJson('/api/cua-hang/dat-hang', $this->don($ma))->assertForbidden();
        $this->getJson('/api/cua-hang/don-hang')->assertForbidden();
        $this->assertDatabaseCount('don_hang', 0);
    }

    public function test_admin_coupon_crud_validation_and_used_coupon_cannot_be_purged(): void
    {
        $ma = $this->sanPham();
        $coupon = $this->maGiam();
        $this->postJson('/api/cua-hang/dat-hang', $this->don($ma, ['ma_giam_gia' => 'GIAM10', 'tong_tien_du_kien' => 162000]))->assertCreated();
        Sanctum::actingAs(User::factory()->create());
        $this->getJson('/api/admin/khuyen-mai')->assertForbidden();
        Sanctum::actingAs(User::factory()->create(['vai_tro' => 'quan_tri_vien']));
        $url = '/api/admin/khuyen-mai';
        $data = ['ma_giam_gia' => 'moto20', 'ten_khuyen_mai' => 'Giảm 20%', 'loai_giam' => 'phan_tram', 'gia_tri_giam' => 20, 'don_toi_thieu' => 0, 'ngay_bat_dau' => '2026-01-01', 'ngay_ket_thuc' => '2026-12-31', 'chi_thanh_vien' => '0', 'trang_thai' => 'hoat_dong', 'gioi_han_su_dung' => 0, 'giam_toi_da' => 0];
        $id = $this->postJson($url, $data)->assertOk()->assertJsonPath('data.ma_giam_gia', 'MOTO20')->json('data.ma_khuyen_mai');
        $this->postJson($url, $data)->assertUnprocessable();
        $this->putJson($url.'/'.$id, [...$data, 'gia_tri_giam' => 101])->assertUnprocessable();
        $this->putJson($url.'/'.$id, [...$data, 'ngay_ket_thuc' => '2025-01-01'])->assertUnprocessable();
        $this->putJson($url.'/'.$id, [...$data, 'gia_tri_giam' => 30])->assertOk();
        $this->deleteJson($url.'/'.$id)->assertOk();
        $this->getJson($url.'?thung_rac=1')->assertJsonCount(1, 'data');
        $this->patchJson($url.'/'.$id.'/khoi-phuc')->assertOk();
        $this->deleteJson($url.'/'.$id)->assertOk();
        $this->deleteJson($url.'/'.$id.'/xoa-vinh-vien')->assertOk();
        $this->deleteJson($url.'/'.$coupon)->assertOk();
        $this->deleteJson($url.'/'.$coupon.'/xoa-vinh-vien')->assertUnprocessable();
    }
}
