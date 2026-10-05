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