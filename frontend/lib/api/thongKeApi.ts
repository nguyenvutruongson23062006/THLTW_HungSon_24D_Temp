import { apiRequest } from "./apiClient";

export interface BaoCaoQuanTri {
  tu_ngay: string;
  den_ngay: string;
  nguong_ton_kho: number;
  tong_quan: {
    doanh_thu: number | string;
    so_don_hang: number;
    so_san_pham_ban: number | string;
    so_nguoi_dung: number;
    so_san_pham: number;
    so_san_pham_sap_het: number;
    tong_ton_kho: number;
    chi_phi_nhap: number | string;
  };
  don_hang_gan_day: {
    ma_don_hang: number;
    ho_ten: string;
    tong_tien: number | string;
    trang_thai: string;
    trang_thai_thanh_toan: string;
    ngay_tao: string;
  }[];
  ton_kho: {
    ma_san_pham: number;
    ten_san_pham: string;
    so_luong_ton: number;
    gia_ban: number | string;
    ten_danh_muc: string;
  }[];
  ban_chay: {
    ma_san_pham: number | null;
    ten_san_pham: string;
    so_luong_ban: number | string;
    thanh_tien: number | string;
  }[];
  doanh_thu_theo_ngay: { ngay: string; doanh_thu: number; so_don: number }[];
}

export function layBaoCao(
  tuNgay: string,
  denNgay: string,
  signal?: AbortSignal,
) {
  const params = new URLSearchParams({ tu_ngay: tuNgay, den_ngay: denNgay });
  return apiRequest<BaoCaoQuanTri>(`/admin/bao-cao?${params}`, { signal });
}
