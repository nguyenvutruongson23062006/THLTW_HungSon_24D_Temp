export type LuaChon = { giaTri: string; nhan: string };
export type TruongDuLieu = {
  ten: string;
  nhan: string;
  kieu?: "text" | "textarea" | "email" | "number" | "select" | "password";
  batBuoc?: boolean;
  luaChon?: LuaChon[];
  laMucCha?: boolean;
};
export type CotDuLieu = {
  ten: string;
  nhan: string;
  kieu?: "anh" | "ngay" | "trang_thai";
};
export type CauHinhDuLieu = {
  tieuDe: string;
  moTa: string;
  endpoint: string;
  khoa: string;
  cotTen: string;
  truong: TruongDuLieu[];
  cot: CotDuLieu[];
  trangThai: LuaChon[];
  truongAnh?: string;
  choThem?: boolean;
  chiTiet?: CotDuLieu[];
};

const hoatDong: LuaChon[] = [
  { giaTri: "hoat_dong", nhan: "Hoạt động" },
  { giaTri: "tam_ngung", nhan: "Tạm ngưng" },
];
const hienThi: LuaChon[] = [
  { giaTri: "hien_thi", nhan: "Hiển thị" },
  { giaTri: "an", nhan: "Ẩn" },
];
const vaiTro: LuaChon[] = [
  { giaTri: "thanh_vien", nhan: "Khách hàng" },
  { giaTri: "nhan_vien", nhan: "Nhân viên" },
  { giaTri: "quan_tri_vien", nhan: "Quản trị viên" },
];
const slug: TruongDuLieu = {
  ten: "duong_dan",
  nhan: "Đường dẫn (để trống để tự tạo)",
};

export const CAU_HINH_DU_LIEU: Record<string, CauHinhDuLieu> = {
  "bai-viet": {
    tieuDe: "Quản lý bài viết",
    moTa: "Soạn bài viết, quản lý hiển thị và ảnh đại diện.",
    endpoint: "/admin/noi-dung/bai-viet",
    khoa: "ma_bai_viet",
    cotTen: "tieu_de",
    truongAnh: "anh_dai_dien",
    trangThai: hienThi,
    truong: [
      { ten: "tieu_de", nhan: "Tiêu đề", batBuoc: true },
      slug,
      { ten: "tom_tat", nhan: "Tóm tắt", kieu: "textarea" },
      { ten: "noi_dung", nhan: "Nội dung", kieu: "textarea", batBuoc: true },
      { ten: "anh_dai_dien", nhan: "Đường dẫn ảnh" },
    ],
    cot: [
      { ten: "anh_dai_dien", nhan: "Ảnh", kieu: "anh" },
      { ten: "tieu_de", nhan: "Tiêu đề" },
      { ten: "duong_dan", nhan: "Đường dẫn" },
      { ten: "luot_xem", nhan: "Lượt xem" },
      { ten: "trang_thai", nhan: "Trạng thái", kieu: "trang_thai" },
    ],
  },
  "trang-don": {
    tieuDe: "Quản lý trang đơn",
    moTa: "Quản lý trang giới thiệu, chính sách và nội dung cố định.",
    endpoint: "/admin/noi-dung/trang-don",
    khoa: "ma_trang_don",
    cotTen: "tieu_de",
    trangThai: hienThi,
    truong: [
      { ten: "tieu_de", nhan: "Tiêu đề", batBuoc: true },
      slug,
      { ten: "noi_dung", nhan: "Nội dung", kieu: "textarea", batBuoc: true },
    ],
    cot: [
      { ten: "tieu_de", nhan: "Tiêu đề" },
      { ten: "duong_dan", nhan: "Đường dẫn" },
      { ten: "trang_thai", nhan: "Trạng thái", kieu: "trang_thai" },
      { ten: "ngay_cap_nhat", nhan: "Cập nhật", kieu: "ngay" },
    ],
  },
  "anh-quang-cao": {
    tieuDe: "Quản lý ảnh quảng cáo",
    moTa: "Tải banner, chọn vị trí và thứ tự hiển thị.",
    endpoint: "/admin/noi-dung/anh-quang-cao",
    khoa: "ma_anh_quang_cao",
    cotTen: "tieu_de",
    truongAnh: "hinh_anh",
    trangThai: hoatDong,
    truong: [
      { ten: "tieu_de", nhan: "Tiêu đề" },
      { ten: "hinh_anh", nhan: "Đường dẫn ảnh (hoặc chọn tệp bên dưới)" },
      {
        ten: "vi_tri",
        nhan: "Vị trí",
        kieu: "select",
        luaChon: [
          { giaTri: "trang_chu", nhan: "Trang chủ" },
          { giaTri: "sidebar", nhan: "Thanh bên" },
          { giaTri: "danh_muc", nhan: "Danh mục" },
        ],
      },
      { ten: "duong_dan", nhan: "Liên kết khi bấm vào ảnh" },
      { ten: "thu_tu_hien_thi", nhan: "Thứ tự", kieu: "number", batBuoc: true },
    ],
    cot: [
      { ten: "hinh_anh", nhan: "Ảnh", kieu: "anh" },
      { ten: "tieu_de", nhan: "Tiêu đề" },
      { ten: "vi_tri", nhan: "Vị trí" },
      { ten: "thu_tu_hien_thi", nhan: "Thứ tự" },
      { ten: "trang_thai", nhan: "Trạng thái", kieu: "trang_thai" },
    ],
  },
  "thanh-dieu-huong": {
    tieuDe: "Quản lý thanh điều hướng",
    moTa: "Tạo các mục menu và sắp xếp menu cha, con.",
    endpoint: "/admin/noi-dung/thanh-dieu-huong",
    khoa: "ma_thanh_dieu_huong",
    cotTen: "ten_hien_thi",
    trangThai: hoatDong,
    truong: [
      { ten: "ten_hien_thi", nhan: "Tên hiển thị", batBuoc: true },
      { ten: "duong_dan", nhan: "Liên kết (ví dụ: /products)", batBuoc: true },
      {
        ten: "ma_thanh_dieu_huong_cha",
        nhan: "Mục cha",
        kieu: "select",
        laMucCha: true,
      },
      { ten: "thu_tu_hien_thi", nhan: "Thứ tự", kieu: "number", batBuoc: true },
    ],
    cot: [
      { ten: "ten_hien_thi", nhan: "Tên hiển thị" },
      { ten: "duong_dan", nhan: "Liên kết" },
      { ten: "ma_thanh_dieu_huong_cha", nhan: "Mã mục cha" },
      { ten: "thu_tu_hien_thi", nhan: "Thứ tự" },
      { ten: "trang_thai", nhan: "Trạng thái", kieu: "trang_thai" },
    ],
  },
  "lien-he": {
    tieuDe: "Quản lý liên hệ",
    moTa: "Đọc yêu cầu của khách hàng và lưu nội dung phản hồi.",
    choThem: false,
    endpoint: "/admin/noi-dung/lien-he",
    khoa: "ma_lien_he",
    cotTen: "ho_ten",
    trangThai: [
      { giaTri: "chua_xu_ly", nhan: "Chưa xử lý" },
      { giaTri: "dang_xu_ly", nhan: "Đang xử lý" },
      { giaTri: "da_xu_ly", nhan: "Đã xử lý" },
      { giaTri: "da_phan_hoi", nhan: "Đã phản hồi" },
    ],
    truong: [{ ten: "phan_hoi", nhan: "Nội dung phản hồi", kieu: "textarea" }],
    chiTiet: [
      { ten: "ho_ten", nhan: "Họ tên" },
      { ten: "dia_chi_email", nhan: "Email" },
      { ten: "so_dien_thoai", nhan: "Điện thoại" },
      { ten: "tieu_de", nhan: "Tiêu đề" },
      { ten: "noi_dung", nhan: "Nội dung khách gửi" },
    ],
    cot: [
      { ten: "ho_ten", nhan: "Khách hàng" },
      { ten: "dia_chi_email", nhan: "Email" },
      { ten: "tieu_de", nhan: "Tiêu đề" },
      { ten: "trang_thai", nhan: "Trạng thái", kieu: "trang_thai" },
      { ten: "ngay_tao", nhan: "Ngày gửi", kieu: "ngay" },
    ],
  },
  "nguoi-dung": {
    tieuDe: "Quản lý người dùng",
    moTa: "Quản lý tất cả tài khoản, vai trò và trạng thái hoạt động.",
    endpoint: "/admin/members",
    khoa: "ma_nguoi_dung",
    cotTen: "ho_ten",
    trangThai: [...hoatDong, { giaTri: "khoa", nhan: "Đã khóa" }],
    truong: [
      { ten: "ho_ten", nhan: "Họ tên", batBuoc: true },
      { ten: "ten_dang_nhap", nhan: "Tên đăng nhập", batBuoc: true },
      { ten: "dia_chi_email", nhan: "Email", kieu: "email", batBuoc: true },
      { ten: "so_dien_thoai", nhan: "Số điện thoại" },
      { ten: "dia_chi", nhan: "Địa chỉ", kieu: "textarea" },
      {
        ten: "vai_tro",
        nhan: "Vai trò",
        kieu: "select",
        luaChon: vaiTro,
        batBuoc: true,
      },
      {
        ten: "mat_khau",
        nhan: "Mật khẩu (khi sửa: để trống để giữ nguyên)",
        kieu: "password",
        batBuoc: true,
      },
    ],
    cot: [
      { ten: "ho_ten", nhan: "Họ tên" },
      { ten: "ten_dang_nhap", nhan: "Tên đăng nhập" },
      { ten: "dia_chi_email", nhan: "Email" },
      { ten: "so_dien_thoai", nhan: "Điện thoại" },
      { ten: "vai_tro", nhan: "Vai trò" },
      { ten: "trang_thai", nhan: "Trạng thái", kieu: "trang_thai" },
    ],
  },
};
