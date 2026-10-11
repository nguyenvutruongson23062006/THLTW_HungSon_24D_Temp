import { apiRequest } from "./apiClient";
import type { DanhMuc, DanhMucInput } from "@/types/admin";

type DuLieuDanhMuc = DanhMucInput | FormData;

export function layDanhSachDanhMuc() {
  return apiRequest<DanhMuc[]>("/danhmuc");
}

export function themDanhMuc(duLieu: DuLieuDanhMuc) {
  const laFormData = duLieu instanceof FormData;

  return apiRequest<DanhMuc>("/danhmuc", {
    method: "POST",
    body: laFormData ? duLieu : JSON.stringify(duLieu),
  });
}

export function capNhatDanhMuc(
  maDanhMuc: number,
  duLieu: Partial<DanhMucInput> | FormData,
) {
  const laFormData = duLieu instanceof FormData;

  return apiRequest<DanhMuc>(`/danhmuc/${maDanhMuc}`, {
    method: laFormData ? "POST" : "PUT",
    body: laFormData ? duLieu : JSON.stringify(duLieu),
  });
}

export function xoaDanhMuc(maDanhMuc: number) {
  return apiRequest<void>(`/danhmuc/${maDanhMuc}`, {
    method: "DELETE",
  });
}

export function layDanhSachDanhMucDaXoa() {
  return apiRequest<DanhMuc[]>("/danhmuc/thung-rac");
}

export function khoiPhucDanhMuc(maDanhMuc: number) {
  return apiRequest<DanhMuc>(
    `/danhmuc/${maDanhMuc}/khoi-phuc`,
    {
      method: "PATCH",
    },
  );
}

export function xoaVinhVienDanhMuc(maDanhMuc: number) {
  return apiRequest<{
    success: boolean;
    message: string;
  }>(
    `/danhmuc/${maDanhMuc}/xoa-vinh-vien`,
    {
      method: "DELETE",
    },
  );
}
