export type DongDon = {
  ma_san_pham: number | null;
  ten_san_pham: string;
  so_luong: number;
  don_gia: string;
  thanh_tien: string;
};
export type DonCuaToi = {
  ma_don_hang: number;
  ho_ten: string;
  dia_chi_email?: string | null;
  so_dien_thoai?: string;
  dia_chi_giao_hang?: string;
  trang_thai: string;
  trang_thai_thanh_toan: string;
  ngay_tao: string;
  ngay_cap_nhat?: string;
  tam_tinh: string;
  giam_gia: string;
  tong_tien: string;
  phuong_thuc_thanh_toan?: string;
  khoa_thanh_toan?: string;
  so_thang_tra_gop?: number;
  lich_tra_gop?: { ky: number; so_tien: string }[];
  chuyen_khoan?: { ngan_hang_bin: string; tai_khoan_nhan: string; chu_tai_khoan: string; noi_dung: string } | null;
  ma_giam_gia?: string | null;
  chi_tiet_don_hangs: DongDon[];
  lich_su: {
    trang_thai_cu: string | null;
    trang_thai_moi: string;
    ghi_chu: string;
    ngay_tao: string;
  }[];
};
export type BaoGia = {
  chi_tiet: {
    ma_san_pham: number;
    ten_san_pham: string;
    so_luong: number;
    don_gia: string;
    thanh_tien: string;
    ton_kho: number;
  }[];
  tam_tinh: string;
  giam_gia: string;
  tong_tien: string;
  ma_giam_gia: string | null;
};
