const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export async function apiRequest<T>(
  duongDan: string,
  tuyChon?: RequestInit,
): Promise<T> {
  const laFormData = tuyChon?.body instanceof FormData;
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("auth_token") ??
        window.localStorage.getItem("token")
      : null;

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

  const duLieu = await phanHoi.json();

  if (!phanHoi.ok) {
    if (phanHoi.status === 401 && duongDan !== "/login") {
      throw new Error(
        "Phiên đăng nhập đã hết hạn hoặc chưa đăng nhập tài khoản quản trị.",
      );
    }

    if (phanHoi.status === 403) {
      throw new Error(
        "Bạn không có quyền truy cập chức năng quản trị này.",
      );
    }

    throw new Error(duLieu.message ?? "Gọi API thất bại");
  }

  return duLieu.data ?? duLieu;
}
