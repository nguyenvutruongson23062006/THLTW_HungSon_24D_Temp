export interface DanhMuc {
  ma_danh_muc: number;
  ten_danh_muc: string;
  duong_dan: string;
  ma_danh_muc_cha: number | null;
  mo_ta: string | null;
  anh_dai_dien?: string | null;
  trang_thai: "hoat_dong" | "tam_ngung";
  so_luong_san_pham?: number;
}

export interface DanhMucInput {
  ten_danh_muc: string;
  duong_dan?: string;
  ma_danh_muc_cha: number | null;
  mo_ta?: string;
  anh_dai_dien?: string;
  trang_thai: "hoat_dong" | "tam_ngung";
}

export interface ThuongHieu {
  ma_thuong_hieu: number;
  ten_thuong_hieu: string;
  duong_dan: string;
  logo: string | null;
  mo_ta: string | null;
  trang_thai: "hoat_dong" | "tam_ngung";
  so_luong_san_pham?: number;
}

export interface ThuongHieuInput {
  ten_thuong_hieu: string;
  duong_dan: string;
  logo?: string;
  mo_ta?: string;
  trang_thai: "hoat_dong" | "tam_ngung";
}