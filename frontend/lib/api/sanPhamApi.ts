import { apiRequest } from "./apiClient";
import type { SanPham, SanPhamInput } from "@/types/admin";

export function layDanhSachSanPham() {
  return apiRequest<SanPham[]>("/sanpham");
}

export function themSanPham(duLieu: SanPhamInput) {
  return apiRequest<SanPham>("/sanpham", {
    method: "POST",
    body: JSON.stringify(duLieu),
  });
}

export function capNhatSanPham(
  maSanPham: number,
  duLieu: Partial<SanPhamInput>,
) {
  return apiRequest<SanPham>(`/sanpham/${maSanPham}`, {
    method: "PUT",
    body: JSON.stringify(duLieu),
  });
}

export function xoaSanPham(maSanPham: number) {
  return apiRequest<void>(`/sanpham/${maSanPham}`, {
    method: "DELETE",
  });
}