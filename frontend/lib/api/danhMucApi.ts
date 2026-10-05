import { apiRequest } from "./apiClient";
import type { DanhMuc, DanhMucInput } from "@/types/admin";

export function layDanhSachDanhMuc() {
  return apiRequest<DanhMuc[]>("/danhmuc");
}

export function themDanhMuc(duLieu: DanhMucInput) {
  return apiRequest<DanhMuc>("/danhmuc", {
    method: "POST",
    body: JSON.stringify(duLieu),
  });
}

export function capNhatDanhMuc(
  maDanhMuc: number,
  duLieu: Partial<DanhMucInput>,
) {
  return apiRequest<DanhMuc>(`/danhmuc/${maDanhMuc}`, {
    method: "PUT",
    body: JSON.stringify(duLieu),
  });
}

export function xoaDanhMuc(maDanhMuc: number) {
  return apiRequest<void>(`/danhmuc/${maDanhMuc}`, {
    method: "DELETE",
  });
}