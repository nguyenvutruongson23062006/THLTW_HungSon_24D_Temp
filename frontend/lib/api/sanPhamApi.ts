import { apiRequest } from "./apiClient";
import type { SanPham, SanPhamInput } from "@/types/admin";

export function layDanhSachSanPham() {
  return apiRequest<SanPham[]>("/sanpham");
}

export function laySanPham(maSanPham: number) {
  return apiRequest<SanPham>(`/sanpham/${maSanPham}`);
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

export function layDanhSachSanPhamDaXoa() {
  return apiRequest<SanPham[]>("/sanpham/thung-rac");
}

export function khoiPhucSanPham(maSanPham: number) {
  return apiRequest<SanPham>(
    `/sanpham/${maSanPham}/khoi-phuc`,
    {
      method: "PATCH",
    },
  );
}

export function xoaVinhVienSanPham(maSanPham: number) {
  return apiRequest<{
    success: boolean;
    message: string;
  }>(
    `/sanpham/${maSanPham}/xoa-vinh-vien`,
    {
      method: "DELETE",
    },
  );
}