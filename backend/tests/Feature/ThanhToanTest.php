<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\ThanhToanService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ThanhToanTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        config(['thanh_toan.vnpay.enabled' => true, 'thanh_toan.vnpay.sandbox' => true,
            'thanh_toan.vnpay.tmn_code' => 'TESTCODE', 'thanh_toan.vnpay.hash_secret' => 'secret-for-automated-tests-only']);
    }

    private function payload(string $phuongThuc = 'vnpay_qr'): array
    {
        $dm = DB::table('danh_muc')->insertGetId(['ten_danh_muc' => 'DM', 'duong_dan' => 'dm'], 'ma_danh_muc');
        $th = DB::table('thuong_hieu')->insertGetId(['ten_thuong_hieu' => 'TH', 'duong_dan' => 'th'], 'ma_thuong_hieu');
        $sp = DB::table('san_pham')->insertGetId(['ten_san_pham' => 'Xe thử', 'duong_dan' => 'xe-thu', 'ma_danh_muc' => $dm, 'ma_thuong_hieu' => $th,
            'gia_ban' => 100000, 'so_luong_ton' => 5], 'ma_san_pham');
        return ['ho_ten' => 'Khách thử', 'so_dien_thoai' => '0909000000', 'dia_chi_giao_hang' => 'TP.HCM',
            'phuong_thuc_thanh_toan' => $phuongThuc, 'khoa_dat_hang' => (string) Str::uuid(),
            'chi_tiet' => [['ma_san_pham' => $sp, 'so_luong' => 1]], 'tong_tien_du_kien' => '100000'];
    }

    private function tao(): array
    {
        $don = $this->postJson('/api/cua-hang/dat-hang', $this->payload())->assertCreated()->json('data');
        $khoa = ['ma_don_hang' => $don['ma_don_hang'], 'khoa' => $don['khoa_thanh_toan']];
        $url = $this->postJson('/api/thanh-toan/tao', $khoa)->assertOk()->json('data.url');
        parse_str(parse_url($url, PHP_URL_QUERY), $query);
        return [$don, $khoa, $query, $url];
    }

    private function duLieuCong(array $query, array $them = []): array
    {
        $data = array_replace(['vnp_TmnCode' => 'TESTCODE', 'vnp_TxnRef' => $query['vnp_TxnRef'], 'vnp_Amount' => $query['vnp_Amount'],
            'vnp_ResponseCode' => '00', 'vnp_TransactionStatus' => '00', 'vnp_TransactionNo' => '12345678', 'vnp_BankCode' => 'NCB', 'vnp_PayDate' => now('Asia/Ho_Chi_Minh')->format('YmdHis')], $them);
        // Mã hóa độc lập với service để phát hiện sai chuẩn ký/encoding.
        ksort($data);
        $parts = [];
        foreach ($data as $key => $value) $parts[] = urlencode($key).'='.urlencode($value);
        $data['vnp_SecureHash'] = hash_hmac('sha512', implode('&', $parts), 'secret-for-automated-tests-only');
        return $data;
    }

    private function ipn(array $data)
    {
        return $this->getJson('/api/thanh-toan/vnpay/ipn?'.http_build_query($data));
    }

    public function test_unconfigured_gateway_is_disabled_and_checkout_does_not_deduct_stock(): void
    {
        config(['thanh_toan.vnpay.hash_secret' => '']);
        $this->getJson('/api/thanh-toan/phuong-thuc')->assertOk()->assertJsonCount(2, 'data')->assertJsonPath('data.0.ma', 'tien_mat')->assertJsonPath('data.0.san_sang', true)->assertJsonPath('data.1.ma', 'chuyen_khoan')->assertJsonPath('data.1.san_sang', true)->assertJsonMissingPath('data.1.hash_secret');
        $this->postJson('/api/cua-hang/dat-hang', $this->payload())->assertUnprocessable();
        $this->assertDatabaseCount('don_hang', 0);
        $this->assertDatabaseHas('san_pham', ['so_luong_ton' => 5]);
    }

    public function test_payment_url_has_server_amount_signature_bank_and_reuses_pending_attempt(): void
    {
        [$don, $khoa, $q, $url] = $this->tao();
        $this->assertStringStartsWith('https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?', $url);
        $this->assertSame('10000000', $q['vnp_Amount']);
        $this->assertSame('VNPAYQR', $q['vnp_BankCode']);
        $this->assertTrue(app(ThanhToanService::class)->hopLe($q));
        $this->assertSame(now('Asia/Ho_Chi_Minh')->format('YmdHi'), substr($q['vnp_CreateDate'], 0, 12));
        $this->postJson('/api/thanh-toan/tao', [...$khoa, 'tong_tien' => 1])->assertOk()->assertJsonPath('data.url', $url);
        $this->assertDatabaseCount('giao_dich_thanh_toan', 1);
        $this->postJson('/api/thanh-toan/tao', [...$khoa, 'khoa' => str_repeat('a', 64)])->assertNotFound();
        $this->postJson('/api/thanh-toan/trang-thai', [...$khoa, 'ma_don_hang' => 9999])->assertNotFound();
        $this->postJson('/api/thanh-toan/trang-thai', $khoa)->assertOk()->assertJsonMissingPath('data.ho_ten')->assertJsonMissingPath('data.duong_dan');
    }

    public function test_tampered_signature_wrong_merchant_amount_and_arrays_cannot_confirm_payment(): void
    {
        [$don, $khoa, $q] = $this->tao();
        $data = $this->duLieuCong($q);
        $this->ipn([...$data, 'vnp_Amount' => '1'])->assertJsonPath('RspCode', '97');
        $this->ipn($this->duLieuCong($q, ['vnp_TmnCode' => 'OTHER']))->assertJsonPath('RspCode', '97');
        $this->ipn($this->duLieuCong($q, ['vnp_Amount' => '100']))->assertJsonPath('RspCode', '04');
        $this->ipn([...$data, 'vnp_Amount' => ['10000000']])->assertJsonPath('RspCode', '97');
        $this->ipn($this->duLieuCong($q, ['vnp_TxnRef' => 'unknown']))->assertJsonPath('RspCode', '01');
        $this->assertDatabaseHas('don_hang', ['ma_don_hang' => $don['ma_don_hang'], 'trang_thai_thanh_toan' => 'chua_thanh_toan']);
    }

    public function test_return_never_marks_paid_and_verified_ipn_is_idempotent(): void
    {
        [$don, $khoa, $q] = $this->tao();
        $callback = $this->duLieuCong($q, ['vnp_BankTranNo' => '', 'vnp_OrderInfo' => 'Thanh toan don hang 1']);
        $this->get('/api/thanh-toan/vnpay/return?'.http_build_query($callback))->assertRedirectContains('/order/thanh-toan#');
        $this->assertDatabaseHas('don_hang', ['trang_thai_thanh_toan' => 'chua_thanh_toan']);
        $this->ipn($callback)->assertJsonPath('RspCode', '00');
        $this->ipn($callback)->assertJsonPath('RspCode', '02');
        $this->postJson('/api/thanh-toan/trang-thai', $khoa)->assertOk()->assertJsonPath('data.trang_thai_thanh_toan', 'da_thanh_toan')->assertJsonPath('data.can_doi_soat', false);
        $this->assertDatabaseHas('don_hang', ['ma_giao_dich' => '12345678']);
        $this->assertDatabaseHas('san_pham', ['so_luong_ton' => 4]);
        $this->assertDatabaseCount('lich_su_don_hang', 2);
        $this->postJson('/api/thanh-toan/tao', $khoa)->assertConflict();
    }

    public function test_failed_payment_retry_and_expired_session_never_mark_paid(): void
    {
        [$don, $khoa, $q, $url] = $this->tao();
        $this->ipn($this->duLieuCong($q, ['vnp_ResponseCode' => '24', 'vnp_TransactionStatus' => '02', 'vnp_TransactionNo' => '0']))->assertJsonPath('RspCode', '00');
        $this->postJson('/api/thanh-toan/trang-thai', $khoa)->assertJsonPath('data.giao_dich.trang_thai', 'that_bai')->assertJsonPath('data.trang_thai_thanh_toan', 'chua_thanh_toan');
        $newUrl = $this->postJson('/api/thanh-toan/tao', $khoa)->assertOk()->json('data.url');
        $this->assertNotSame($url, $newUrl);
        $this->travel(16)->minutes();
        $this->postJson('/api/thanh-toan/trang-thai', $khoa)->assertJsonPath('data.giao_dich.trang_thai', 'het_han');
        $this->postJson('/api/thanh-toan/tao', $khoa)->assertOk();
        $this->assertDatabaseCount('giao_dich_thanh_toan', 3);
        $this->assertDatabaseCount('don_hang', 1);
        $this->assertDatabaseHas('san_pham', ['so_luong_ton' => 4]);
    }

    public function test_pending_payment_blocks_cancellation_and_late_paid_cancelled_order_requires_reconciliation(): void
    {
        Sanctum::actingAs(User::factory()->create());
        [$don, $khoa, $q] = $this->tao();
        $this->patchJson('/api/cua-hang/don-hang/'.$don['ma_don_hang'].'/huy')->assertConflict();
        $this->travel(16)->minutes();
        $this->patchJson('/api/cua-hang/don-hang/'.$don['ma_don_hang'].'/huy')->assertOk();
        $this->assertDatabaseHas('san_pham', ['so_luong_ton' => 5]);
        $this->ipn($this->duLieuCong($q))->assertJsonPath('RspCode', '00');
        $this->postJson('/api/thanh-toan/trang-thai', $khoa)->assertJsonPath('data.trang_thai_don', 'da_huy')->assertJsonPath('data.trang_thai_thanh_toan', 'da_thanh_toan')->assertJsonPath('data.can_doi_soat', true);
        $this->assertDatabaseHas('san_pham', ['so_luong_ton' => 5]);
    }

    public function test_online_orders_cannot_be_manually_paid_or_fulfilled_before_gateway_confirmation(): void
    {
        [$don] = $this->tao();
        Sanctum::actingAs(User::factory()->create(['vai_tro' => 'quan_tri_vien']));
        $this->patchJson('/api/admin/don-hang/'.$don['ma_don_hang'].'/thanh-toan', ['trang_thai_thanh_toan' => 'da_thanh_toan', 'trang_thai_hien_tai' => 'chua_thanh_toan'])->assertUnprocessable();
        $this->patchJson('/api/admin/don-hang/'.$don['ma_don_hang'].'/trang-thai', ['trang_thai' => 'da_xac_nhan', 'trang_thai_hien_tai' => 'cho_xac_nhan'])->assertUnprocessable();
    }

    public function test_all_online_methods_use_correct_bank_codes_and_checkout_retry_is_stable(): void
    {
        $data = $this->payload('vnpay_atm');
        $don = $this->postJson('/api/cua-hang/dat-hang', $data)->assertCreated()->json('data');
        $this->postJson('/api/cua-hang/dat-hang', $data)->assertOk()->assertJsonPath('data.khoa_thanh_toan', $don['khoa_thanh_toan']);
        $url = $this->postJson('/api/thanh-toan/tao', ['ma_don_hang' => $don['ma_don_hang'], 'khoa' => $don['khoa_thanh_toan']])->json('data.url');
        parse_str(parse_url($url, PHP_URL_QUERY), $q);
        $this->assertSame('VNBANK', $q['vnp_BankCode']);
        $data['phuong_thuc_thanh_toan'] = 'vnpay_the'; $data['khoa_dat_hang'] = (string) Str::uuid();
        $don = $this->postJson('/api/cua-hang/dat-hang', $data)->assertCreated()->json('data');
        $url = $this->postJson('/api/thanh-toan/tao', ['ma_don_hang' => $don['ma_don_hang'], 'khoa' => $don['khoa_thanh_toan']])->json('data.url');
        parse_str(parse_url($url, PHP_URL_QUERY), $q);
        $this->assertSame('INTCARD', $q['vnp_BankCode']);
    }

    public function test_gateway_amount_limits_and_double_payment_reconciliation(): void
    {
        $service = app(ThanhToanService::class);
        foreach (['4999', '10000.50', '10000000000'] as $soTien) {
            try {
                $service->kiemTra('vnpay_qr', $soTien);
                $this->fail('Phải từ chối số tiền ngoài giới hạn của VNPay.');
            } catch (\Illuminate\Validation\ValidationException $e) {
                $this->assertArrayHasKey('tong_tien', $e->errors());
            }
        }
        [$don, $khoa, $q] = $this->tao();
        $this->travel(16)->minutes();
        $url = $this->postJson('/api/thanh-toan/tao', $khoa)->assertOk()->json('data.url');
        parse_str(parse_url($url, PHP_URL_QUERY), $q2);
        $this->ipn($this->duLieuCong($q))->assertJsonPath('RspCode', '00');
        $this->ipn($this->duLieuCong($q2, ['vnp_TransactionNo' => '87654321']))->assertJsonPath('RspCode', '00');
        $this->postJson('/api/thanh-toan/trang-thai', $khoa)->assertJsonPath('data.can_doi_soat', true);
        $this->assertDatabaseHas('don_hang', ['ma_giao_dich' => '12345678']);
        $this->assertDatabaseHas('san_pham', ['so_luong_ton' => 4]);
        Sanctum::actingAs(User::factory()->create(['vai_tro' => 'quan_tri_vien']));
        $this->getJson('/api/admin/don-hang/'.$don['ma_don_hang'])->assertOk()->assertJsonCount(2, 'data.giao_dich_online')->assertJsonMissingPath('data.giao_dich_online.0.duong_dan');
    }
}
