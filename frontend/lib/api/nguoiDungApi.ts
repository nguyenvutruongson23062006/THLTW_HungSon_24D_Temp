import { apiRequest } from "./apiClient";
import type { NguoiDung } from "@/types/admin";

export function layDanhSachNguoiDung() {
  return apiRequest<NguoiDung[]>("/admin/members");
}
