import { apiRequest } from "./apiClient";
import type { ThuongHieu, ThuongHieuInput } from "@/types/admin";

export function layDanhSachThuongHieu() {
  return apiRequest<ThuongHieu[]>("/thuonghieu");
}

export function themThuongHieu(duLieu: ThuongHieuInput) {
  return apiRequest<ThuongHieu>("/thuonghieu", {
    method: "POST",
    body: JSON.stringify(duLieu),
  });
}

export function capNhatThuongHieu(
  maThuongHieu: number,
  duLieu: Partial<ThuongHieuInput>,
) {
  return apiRequest<ThuongHieu>(`/thuonghieu/${maThuongHieu}`, {
    method: "PUT",
    body: JSON.stringify(duLieu),
  });
}

export function xoaThuongHieu(maThuongHieu: number) {
  return apiRequest<void>(`/thuonghieu/${maThuongHieu}`, {
    method: "DELETE",
  });
}