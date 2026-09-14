<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ContentSeeder extends Seeder
{
    public function run(): void
    {
        $now = now();

        DB::table('trang_don')->insert([
            [
                'ma_trang_don' => 1,
                'ma_nguoi_dung' => 1,
                'tieu_de' => 'Giới thiệu MotoHub',
                'duong_dan' => '/gioi-thieu',
                'noi_dung' => 'MotoHub là showroom chuyên xe máy và phụ kiện, tập trung vào xe tay ga, xe số, xe côn tay, mô tô phân khối lớn và các giải pháp đi tour. Chúng tôi ưu tiên trải nghiệm mua sắm rõ ràng, hỗ trợ trả góp linh hoạt và dịch vụ hậu mãi đáng tin cậy.',
                'trang_thai' => 'hien_thi',
                'ngay_tao' => $now->copy()->subDays(14),
                'ngay_cap_nhat' => $now->copy()->subDays(2),
                'ngay_xoa' => null,
            ],
            [
                'ma_trang_don' => 2,
                'ma_nguoi_dung' => 1,
                'tieu_de' => 'Chính sách bảo hành xe máy',
                'duong_dan' => '/chinh-sach-bao-hanh',
                'noi_dung' => 'Tất cả xe và phụ kiện tại MotoHub đều được tiếp nhận theo chính sách bảo hành của hãng hoặc nhà phân phối. Khách hàng có thể liên hệ hotline, gửi hình ảnh hoặc mang xe đến cửa hàng để được kiểm tra và hỗ trợ nhanh chóng.',
                'trang_thai' => 'hien_thi',
                'ngay_tao' => $now->copy()->subDays(13),
                'ngay_cap_nhat' => $now->copy()->subDays(2),
                'ngay_xoa' => null,
            ],
            [
                'ma_trang_don' => 3,
                'ma_nguoi_dung' => 2,
                'tieu_de' => 'Chính sách đổi trả và thu xe cũ',
                'duong_dan' => '/chinh-sach-doi-tra',
                'noi_dung' => 'MotoHub hỗ trợ đổi trả trong trường hợp sản phẩm lỗi do nhà sản xuất hoặc không đúng mô tả. Với khách hàng muốn lên đời xe mới, chúng tôi cũng hỗ trợ thu xe cũ và tư vấn phương án bù chênh lệch phù hợp.',
                'trang_thai' => 'hien_thi',
                'ngay_tao' => $now->copy()->subDays(12),
                'ngay_cap_nhat' => $now->copy()->subDay(),
                'ngay_xoa' => null,
            ],
            [
                'ma_trang_don' => 4,
                'ma_nguoi_dung' => 1,
                'tieu_de' => 'Hướng dẫn trả góp xe máy',
                'duong_dan' => '/huong-dan-tra-gop',
                'noi_dung' => 'Để mua xe trả góp, khách hàng cần chuẩn bị giấy tờ tùy thân, hồ sơ chứng minh tài chính theo yêu cầu của đối tác cho vay và lựa chọn kỳ hạn phù hợp. MotoHub luôn hỗ trợ tư vấn lãi suất, số tiền trả trước và phương án thanh toán minh bạch.',
                'trang_thai' => 'hien_thi',
                'ngay_tao' => $now->copy()->subDays(11),
                'ngay_cap_nhat' => $now->copy()->subDay(),
                'ngay_xoa' => null,
            ],
        ]);

        DB::table('bai_viet')->insert([
            [
                'ma_bai_viet' => 1,
                'ma_nguoi_dung' => 2,
                'tieu_de' => '5 mẫu xe tay ga đáng mua cho đô thị năm 2026',
                'duong_dan' => '/bai-viet/5-mau-xe-tay-ga-dang-mua-cho-do-thi-nam-2026',
                'anh_dai_dien' => '/images/posts/xe-tay-ga-2026.jpg',
                'tom_tat' => 'Gợi ý những mẫu xe tay ga phù hợp cho người thường xuyên di chuyển trong thành phố.',
                'noi_dung' => 'Xe tay ga luôn là lựa chọn thực dụng cho người dùng đô thị nhờ khả năng vận hành dễ dàng, cốp rộng và tư thế ngồi thoải mái. Trong năm 2026, nhóm khách hàng trẻ thường ưu tiên các mẫu có thiết kế hiện đại, tiết kiệm nhiên liệu và hỗ trợ kết nối thông minh.',
                'trang_thai' => 'hien_thi',
                'luot_xem' => 1240,
                'ngay_tao' => $now->copy()->subDays(8),
                'ngay_cap_nhat' => $now->copy()->subDay(),
                'ngay_xoa' => null,
            ],
            [
                'ma_bai_viet' => 2,
                'ma_nguoi_dung' => 2,
                'tieu_de' => 'So sánh Honda SH Mode và Piaggio Liberty S 125',
                'duong_dan' => '/bai-viet/so-sanh-honda-sh-mode-va-piaggio-liberty-s-125',
                'anh_dai_dien' => '/images/posts/so-sanh-sh-mode-liberty.jpg',
                'tom_tat' => 'Bài viết so sánh hai mẫu xe tay ga phổ biến để giúp bạn chọn xe phù hợp hơn.',
                'noi_dung' => 'Honda SH Mode ghi điểm ở sự gọn gàng, tiết kiệm và dễ sử dụng, trong khi Piaggio Liberty S 125 tạo ấn tượng bởi phong cách châu Âu và cảm giác lái đầm hơn. Nếu bạn đi phố hàng ngày, SH Mode là phương án an toàn; còn nếu thích cá tính và thiết kế khác biệt, Liberty S 125 rất đáng cân nhắc.',
                'trang_thai' => 'hien_thi',
                'luot_xem' => 980,
                'ngay_tao' => $now->copy()->subDays(7),
                'ngay_cap_nhat' => $now->copy()->subDay(),
                'ngay_xoa' => null,
            ],
            [
                'ma_bai_viet' => 3,
                'ma_nguoi_dung' => 2,
                'tieu_de' => 'Kinh nghiệm bảo dưỡng xe máy sau mỗi 2.000 km',
                'duong_dan' => '/bai-viet/kinh-nghiem-bao-duong-xe-may-sau-moi-2000-km',
                'anh_dai_dien' => '/images/posts/bao-duong-xe-may.jpg',
                'tom_tat' => 'Một số hạng mục nên kiểm tra định kỳ để xe vận hành ổn định và an toàn.',
                'noi_dung' => 'Sau mỗi 2.000 km, người dùng nên kiểm tra dầu máy, áp suất lốp, hệ thống phanh, nhông sên dĩa và các chi tiết hao mòn nhanh. Việc bảo dưỡng định kỳ giúp kéo dài tuổi thọ xe, giảm rủi ro hỏng vặt và giữ cảm giác lái ổn định hơn khi di chuyển xa.',
                'trang_thai' => 'an',
                'luot_xem' => 420,
                'ngay_tao' => $now->copy()->subDays(6),
                'ngay_cap_nhat' => $now->copy()->subDay(),
                'ngay_xoa' => null,
            ],
        ]);

        DB::table('anh_quang_cao')->insert([
            [
                'ma_anh_quang_cao' => 1,
                'tieu_de' => 'Ưu đãi xe tay ga cuối tuần',
                'hinh_anh' => '/images/banners/banner-xe-tay-ga.jpg',
                'vi_tri' => 'trang_chu',
                'duong_dan' => '/san-pham/xe-tay-ga',
                'thu_tu_hien_thi' => 1,
                'trang_thai' => 'hoat_dong',
                'ngay_tao' => $now->copy()->subDays(5),
                'ngay_cap_nhat' => $now->copy()->subDay(),
                'ngay_xoa' => null,
            ],
            [
                'ma_anh_quang_cao' => 2,
                'tieu_de' => 'Trả góp xe côn tay lãi suất 0%',
                'hinh_anh' => '/images/banners/banner-tra-gop.jpg',
                'vi_tri' => 'sidebar',
                'duong_dan' => '/khuyen-mai',
                'thu_tu_hien_thi' => 2,
                'trang_thai' => 'hoat_dong',
                'ngay_tao' => $now->copy()->subDays(4),
                'ngay_cap_nhat' => $now->copy()->subDay(),
                'ngay_xoa' => null,
            ],
            [
                'ma_anh_quang_cao' => 3,
                'tieu_de' => 'Combo mũ bảo hiểm và thùng xe',
                'hinh_anh' => '/images/banners/banner-phu-kien-tour.jpg',
                'vi_tri' => 'danh_muc',
                'duong_dan' => '/san-pham/phu-kien-touring',
                'thu_tu_hien_thi' => 3,
                'trang_thai' => 'hoat_dong',
                'ngay_tao' => $now->copy()->subDays(3),
                'ngay_cap_nhat' => $now->copy()->subDay(),
                'ngay_xoa' => null,
            ],
        ]);

        DB::table('lien_he')->insert([
            [
                'ma_lien_he' => 1,
                'ma_nguoi_dung' => 3,
                'ho_ten' => 'Nguyễn Văn Sơn',
                'dia_chi_email' => 'son@motohub.vn',
                'so_dien_thoai' => '0909000003',
                'tieu_de' => 'Tư vấn mua SH Mode trả góp',
                'noi_dung' => 'Tôi muốn hỏi về khoản trả trước, lãi suất và hồ sơ cần chuẩn bị để mua Honda SH Mode 125i.',
                'trang_thai' => 'chua_xu_ly',
                'phan_hoi' => null,
                'thoi_gian_phan_hoi' => null,
                'ngay_tao' => $now->copy()->subDays(2),
                'ngay_cap_nhat' => $now->copy()->subDays(2),
                'ngay_xoa' => null,
            ],
            [
                'ma_lien_he' => 2,
                'ma_nguoi_dung' => null,
                'ho_ten' => 'Trần Thị Mai',
                'dia_chi_email' => 'mai.tran@example.com',
                'so_dien_thoai' => '0911222333',
                'tieu_de' => 'Xin báo giá thùng Givi B32N',
                'noi_dung' => 'Cửa hàng có hỗ trợ lắp thùng Givi B32N cho xe tay ga và xe touring không? Tôi muốn biết giá trọn gói.',
                'trang_thai' => 'da_xu_ly',
                'phan_hoi' => 'MotoHub đã gửi báo giá thùng, phụ kiện lắp đặt và thời gian giao hàng dự kiến cho khách.',
                'thoi_gian_phan_hoi' => $now->copy()->subDay(),
                'ngay_tao' => $now->copy()->subDays(3),
                'ngay_cap_nhat' => $now->copy()->subDay(),
                'ngay_xoa' => null,
            ],
            [
                'ma_lien_he' => 3,
                'ma_nguoi_dung' => 3,
                'ho_ten' => 'Nguyễn Văn Sơn',
                'dia_chi_email' => 'son@motohub.vn',
                'so_dien_thoai' => '0909000003',
                'tieu_de' => 'Hỏi lịch bảo dưỡng xe côn tay',
                'noi_dung' => 'Tôi đang chạy Yamaha Exciter 155 VVA, cho hỏi lịch bảo dưỡng định kỳ và thay dầu thế nào cho hợp lý?',
                'trang_thai' => 'dang_xu_ly',
                'phan_hoi' => null,
                'thoi_gian_phan_hoi' => null,
                'ngay_tao' => $now->copy()->subDay(),
                'ngay_cap_nhat' => $now->copy()->subDay(),
                'ngay_xoa' => null,
            ],
        ]);
    }
}
