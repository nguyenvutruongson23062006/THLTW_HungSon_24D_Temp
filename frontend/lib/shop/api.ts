import type { NguoiDung } from "@/types/admin";

const API = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api"
).replace(/\/$/, "");
export class LoiShop extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export function tokenShop() {
  return typeof window === "undefined"
    ? null
    : localStorage.getItem("shop_token");
}
export function luuTaiKhoan(data: { token: string; user: NguoiDung }) {
  localStorage.setItem("shop_token", data.token);
  localStorage.setItem("shop_user", JSON.stringify(data.user));
  window.dispatchEvent(new Event("shop-auth"));
}
export function xoaTaiKhoan() {
  localStorage.removeItem("shop_token");
  localStorage.removeItem("shop_user");
  for (const key of Object.keys(sessionStorage)) {
    if (key.startsWith("shop_don_")) sessionStorage.removeItem(key);
  }
  window.dispatchEvent(new Event("shop-auth"));
}
export async function shopApi<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const token = tokenShop();
  const response = await fetch(API + url, {
    ...options,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && url !== "/login" && token) xoaTaiKhoan();
    const errors = data?.errors
      ? Object.values(data.errors).flat().join(" ")
      : "";
    throw new LoiShop(
      errors || data?.message || "Không thể kết nối chức năng cửa hàng.",
      response.status,
    );
  }
  if (data === null) throw new Error("Server không trả dữ liệu hợp lệ.");
  return data.data ?? data;
}
export async function dangXuatShop() {
  try {
    if (tokenShop()) await shopApi("/logout", { method: "POST" });
  } finally {
    xoaTaiKhoan();
  }
}
export const guiShop = <T>(url: string, data: unknown, method = "POST") =>
  shopApi<T>(url, { method, body: JSON.stringify(data) });
