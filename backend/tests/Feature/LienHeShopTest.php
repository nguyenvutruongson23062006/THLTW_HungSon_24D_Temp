<?php
namespace Tests\Feature;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
class LienHeShopTest extends TestCase
{
    use RefreshDatabase;
    public function test_guest_can_send_contact_but_cannot_set_reply_or_status(): void
    {
        $data = ['ho_ten'=>'Khách thử','dia_chi_email'=>'khach@example.test','tieu_de'=>'Tư vấn xe','noi_dung'=>'Tôi muốn tư vấn sản phẩm.','trang_thai'=>'da_xu_ly','phan_hoi'=>'giả'];
        $this->postJson('/api/cua-hang/lien-he',$data)->assertCreated();
        $this->assertDatabaseHas('lien_he',['dia_chi_email'=>'khach@example.test','trang_thai'=>'chua_xu_ly','phan_hoi'=>null,'ma_nguoi_dung'=>null]);
        $this->postJson('/api/cua-hang/lien-he',[])->assertUnprocessable();
    }
}
