const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

export async function apiRequest<T>(
  duongDan: string,
  tuyChon?: RequestInit,
): Promise<T> {
  const phanHoi = await fetch(`${API_URL}${duongDan}`, {
    ...tuyChon,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...tuyChon?.headers,
    },
  });

  const duLieu = await phanHoi.json();

  if (!phanHoi.ok) {
    throw new Error(duLieu.message ?? "Gọi API thất bại");
  }

  return duLieu.data ?? duLieu;
}