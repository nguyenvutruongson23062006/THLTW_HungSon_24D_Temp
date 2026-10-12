import { apiRequest } from "./apiClient";
import type { KetQuaDangNhap, NguoiDung } from "@/types/admin";

export function dangNhap(diaChiEmail: string, matKhau: string) {
  return apiRequest<KetQuaDangNhap>("/login", {
    method: "POST",
    body: JSON.stringify({
      dia_chi_email: diaChiEmail,
      mat_khau: matKhau,
    }),
  });
}

export function layThongTinNguoiDung() {
  return apiRequest<{ user: NguoiDung }>("/me");
}

export async function dangXuat() {
  try {
    await apiRequest<{ message: string }>("/logout", {
      method: "POST",
    });
  } finally {
    xoaPhienDangNhap();
  }
}

export function luuPhienDangNhap(ketQua: KetQuaDangNhap) {
  localStorage.setItem("auth_token", ketQua.token);
  localStorage.setItem("nguoi_dung", JSON.stringify(ketQua.user));
}

export function xoaPhienDangNhap() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("token");
  localStorage.removeItem("nguoi_dung");
}
