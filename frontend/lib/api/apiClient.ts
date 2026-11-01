const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export function layTokenDangNhap() {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("auth_token") ??
    sessionStorage.getItem("admin_token") ??
    localStorage.getItem("token")
  );
}

export class LoiApi extends Error {
  constructor(
    message: string,
    public trangThai: number,
  ) {
    super(message);
    this.name = "LoiApi";
  }
}

export async function apiRequest<T>(
  duongDan: string,
  tuyChon?: RequestInit,
): Promise<T> {
  const laFormData = tuyChon?.body instanceof FormData;
  const token = layTokenDangNhap();

  const phanHoi = await fetch(`${API_URL}${duongDan}`, {
    ...tuyChon,
    headers: {
      Accept: "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
      ...(laFormData
        ? {}
        : {
            "Content-Type": "application/json",
          }),
      ...tuyChon?.headers,
    },
  });

  if (phanHoi.status === 204) return undefined as T;
  const duLieu = await phanHoi.json().catch(() => null);

  if (!phanHoi.ok) {
    if (phanHoi.status === 401 && duongDan !== "/login") {
      if (typeof window !== "undefined")
        window.dispatchEvent(new Event("phien-quan-tri-het-han"));
      throw new LoiApi(
        "Phiên đăng nhập đã hết hạn hoặc chưa đăng nhập tài khoản quản trị.",
        phanHoi.status,
      );
    }

    if (phanHoi.status === 403) {
      throw new LoiApi(
        duLieu?.message ??
          "Bạn không có quyền truy cập chức năng quản trị này.",
        phanHoi.status,
      );
    }

    const cacLoi = duLieu?.errors
      ? Object.values(duLieu.errors).flat().join(" ")
      : "";
    throw new LoiApi(
      cacLoi || duLieu?.message || "Gọi API thất bại",
      phanHoi.status,
    );
  }

  if (duLieu === null) throw new Error("API không trả dữ liệu JSON hợp lệ.");
  if (
    typeof window !== "undefined" &&
    tuyChon?.method &&
    !["GET", "HEAD"].includes(tuyChon.method.toUpperCase()) &&
    /^\/(admin|sanpham|danhmuc|thuonghieu)(\/|$)/.test(duongDan)
  ) {
    window.dispatchEvent(new Event("du-lieu-quan-tri-thay-doi"));
  }
  return duLieu.data ?? duLieu;
}
