<?php

namespace App\Support;

use Illuminate\Http\Request;

class ThongBaoKiemTra
{
    public const NOI_DUNG = [
        'required' => 'Vui lòng nhập :attribute.', 'email' => ':attribute không đúng định dạng email.',
        'string' => ':attribute phải là chuỗi ký tự.', 'integer' => ':attribute phải là số nguyên.',
        'numeric' => ':attribute phải là số.', 'boolean' => ':attribute không hợp lệ.',
        'array' => ':attribute phải là danh sách.', 'distinct' => 'Mỗi sản phẩm chỉ được xuất hiện một lần trong đơn.',
        'min.string' => ':attribute phải có ít nhất :min ký tự.', 'max.string' => ':attribute không được vượt quá :max ký tự.',
        'min.numeric' => ':attribute phải lớn hơn hoặc bằng :min.', 'max.numeric' => ':attribute không được vượt quá :max.',
        'min.array' => ':attribute phải có ít nhất :min mục.', 'max.array' => ':attribute không được vượt quá :max mục.',
        'confirmed' => 'Nhập lại :attribute chưa khớp.', 'unique' => ':attribute đã tồn tại.',
        'date_format' => ':attribute phải có dạng ngày-tháng-năm hợp lệ.', 'after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
        'in' => ':attribute không thuộc các lựa chọn hợp lệ.', 'regex' => ':attribute không đúng định dạng.',
        'uuid' => 'Mã yêu cầu không hợp lệ. Hãy tải lại trang đặt hàng.', 'decimal' => ':attribute chỉ được có tối đa hai chữ số thập phân.',
        'size' => ':attribute không đúng độ dài yêu cầu.',
    ];

    public const TEN_TRUONG = [
        'ho_ten' => 'họ tên', 'ten_dang_nhap' => 'tên đăng nhập', 'dia_chi_email' => 'email', 'so_dien_thoai' => 'số điện thoại',
        'dia_chi' => 'địa chỉ', 'dia_chi_giao_hang' => 'địa chỉ giao hàng', 'mat_khau' => 'mật khẩu',
        'mat_khau_cu' => 'mật khẩu hiện tại', 'mat_khau_moi' => 'mật khẩu mới', 'token' => 'mã khôi phục',
        'chi_tiet' => 'danh sách sản phẩm', 'chi_tiet.*.ma_san_pham' => 'sản phẩm', 'chi_tiet.*.so_luong' => 'số lượng',
        'ma_giam_gia' => 'mã giảm giá', 'ten_khuyen_mai' => 'tên chương trình', 'loai_giam' => 'hình thức giảm',
        'gia_tri_giam' => 'giá trị giảm', 'don_toi_thieu' => 'giá trị đơn tối thiểu', 'giam_toi_da' => 'số tiền giảm tối đa',
        'ngay_bat_dau' => 'ngày bắt đầu', 'ngay_ket_thuc' => 'ngày kết thúc', 'gioi_han_su_dung' => 'giới hạn lượt dùng',
        'chi_thanh_vien' => 'đối tượng áp dụng', 'trang_thai' => 'trạng thái', 'phuong_thuc_thanh_toan' => 'phương thức thanh toán',
        'khoa_dat_hang' => 'mã yêu cầu', 'tong_tien_du_kien' => 'tổng tiền dự kiến', 'ghi_chu' => 'ghi chú', 'page' => 'số trang',
    ];

    public static function duLieu(Request $request, array $rules, array $messages = []): array
    {
        return $request->validate($rules, array_replace(self::NOI_DUNG, $messages), self::TEN_TRUONG);
    }
}
