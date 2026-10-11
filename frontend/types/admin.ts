export interface DanhMuc {
  ma_danh_muc: number;
  ten_danh_muc: string;
  duong_dan: string;
  ma_danh_muc_cha: number | null;
  mo_ta: string | null;
  anh_dai_dien?: string | null;
  trang_thai: "hoat_dong" | "tam_ngung";
}

export interface DanhMucInput {
  ten_danh_muc: string;
  duong_dan?: string;
  ma_danh_muc_cha: number | null;
  mo_ta?: string;
  anh_dai_dien?: string | null;
  trang_thai: "hoat_dong" | "tam_ngung";
}

export interface ThuongHieu {
  ma_thuong_hieu: number;
  ten_thuong_hieu: string;
  duong_dan: string;
  logo: string | null;
  mo_ta: string | null;
  trang_thai: "hoat_dong" | "tam_ngung";
}

export interface ThuongHieuInput {
  ten_thuong_hieu: string;
  duong_dan: string;
  logo?: string;
  mo_ta?: string;
  trang_thai: "hoat_dong" | "tam_ngung";
}

export interface HinhAnhSanPham {
  ma_hinh_anh: number;
  ma_san_pham: number;
  duong_dan: string;
  la_anh_dai_dien: boolean;
  thu_tu_hien_thi: number;
}

export interface SanPham {
  ma_san_pham: number;
  ten_san_pham: string;
  ma_danh_muc: number;
  ma_thuong_hieu: number;
  duong_dan: string;
  gia_ban: number | string;
  gia_khuyen_mai?: number | string | null;
  so_luong_ton: number;
  dung_tich_dong_co?: number | null;
  nam_san_xuat?: number | null;
  mau_sac?: string | null;
  anh_dai_dien?: string | null;
  mo_ta?: string | null;
  trang_thai: "hoat_dong" | "tam_ngung";
  luot_xem?: number;
  danh_muc?: DanhMuc;
  thuong_hieu?: ThuongHieu;
  hinh_anh_san_phams?: HinhAnhSanPham[];
}

export interface SanPhamInput {
  ten_san_pham: string;
  ma_danh_muc: number;
  ma_thuong_hieu: number;
  duong_dan: string;
  gia_ban: number;
  gia_khuyen_mai?: number | null;
  so_luong_ton: number;
  dung_tich_dong_co?: number | null;
  nam_san_xuat?: number | null;
  mau_sac?: string | null;
  anh_dai_dien?: string | null;
  mo_ta?: string | null;
  trang_thai: "hoat_dong" | "tam_ngung";
  luot_xem?: number;
}
