import { apiRequest } from "./apiClient";
import type { ThuongHieu, ThuongHieuInput } from "@/types/admin";

type DuLieuThuongHieu = ThuongHieuInput | FormData;

export function layDanhSachThuongHieu() {
  return apiRequest<ThuongHieu[]>("/thuonghieu");
}

export function themThuongHieu(duLieu: DuLieuThuongHieu) {
  const laFormData = duLieu instanceof FormData;

  return apiRequest<ThuongHieu>("/thuonghieu", {
    method: "POST",
    body: laFormData ? duLieu : JSON.stringify(duLieu),
  });
}

export function capNhatThuongHieu(
  maThuongHieu: number,
  duLieu: Partial<ThuongHieuInput> | FormData,
) {
  const laFormData = duLieu instanceof FormData;

  return apiRequest<ThuongHieu>(`/thuonghieu/${maThuongHieu}`, {
    method: laFormData ? "POST" : "PUT",
    body: laFormData ? duLieu : JSON.stringify(duLieu),
  });
}

export function xoaThuongHieu(maThuongHieu: number) {
  return apiRequest<void>(`/thuonghieu/${maThuongHieu}`, {
    method: "DELETE",
  });
}

export function layDanhSachThuongHieuDaXoa() {
  return apiRequest<ThuongHieu[]>("/thuonghieu/thung-rac");
}

export function khoiPhucThuongHieu(maThuongHieu: number) {
  return apiRequest<ThuongHieu>(
    `/thuonghieu/${maThuongHieu}/khoi-phuc`,
    {
      method: "PATCH",
    },
  );
}

export function xoaVinhVienThuongHieu(maThuongHieu: number) {
  return apiRequest<{
    success: boolean;
    message: string;
  }>(
    `/thuonghieu/${maThuongHieu}/xoa-vinh-vien`,
    {
      method: "DELETE",
    },
  );
}
