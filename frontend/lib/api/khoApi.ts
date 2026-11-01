import { apiRequest } from "./apiClient";

export type LoaiKho = "nhap" | "xuat";
export type DongPhieuKho = {
  ma_san_pham: number;
  ten_san_pham?: string;
  so_luong: number;
  don_gia?: number | string;
  thanh_tien?: number | string;
  ghi_chu?: string | null;
};
export type PhieuKho = {
  ma_phieu_nhap?: number;
  ma_phieu_xuat?: number;
  so_phieu_nhap?: string;
  so_phieu_xuat?: string;
  nha_cung_cap?: string;
  ly_do_xuat?: string;
  ghi_chu: string | null;
  trang_thai: string;
  tong_tien?: number | string;
  nguoi_lap?: string;
  ngay_tao: string;
  chi_tiet: DongPhieuKho[];
};
export function layPhieuKho(loai: LoaiKho, ma: number, signal?: AbortSignal) {
  return apiRequest<PhieuKho>(`/admin/kho/${loai}/${ma}`, { signal });
}
