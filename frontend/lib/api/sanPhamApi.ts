import { apiRequest } from "./apiClient";
import type { SanPham, SanPhamInput } from "@/types/admin";

type DuLieuSanPham = SanPhamInput | FormData;

export function layDanhSachSanPham() {
  return apiRequest<SanPham[]>("/sanpham");
}

export function laySanPham(maSanPham: number) {
  return apiRequest<SanPham>(`/sanpham/${maSanPham}`);
}

export function themSanPham(duLieu: DuLieuSanPham) {
  const laFormData = duLieu instanceof FormData;

  return apiRequest<SanPham>("/sanpham", {
    method: "POST",
    body: laFormData ? duLieu : JSON.stringify(duLieu),
  });
}

export function capNhatSanPham(
  maSanPham: number,
  duLieu: Partial<SanPhamInput> | FormData,
) {
  const laFormData = duLieu instanceof FormData;

  return apiRequest<SanPham>(
    `/sanpham/${maSanPham}`,
    {
      method: laFormData ? "POST" : "PUT",
      body: laFormData ? duLieu : JSON.stringify(duLieu),
    },
  );
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
