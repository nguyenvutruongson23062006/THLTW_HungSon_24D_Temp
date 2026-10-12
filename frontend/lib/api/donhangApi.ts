const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api"
).replace(/\/$/, "");

export interface DonHang {
  ma_don_hang: number;
  ho_ten: string;
  so_dien_thoai: string;
  phuong_thuc_thanh_toan: string;
  tong_tien: string | number;
  trang_thai: string;
  trang_thai_thanh_toan: string;
  ngay_tao: string | null;
}

export interface DanhSachDonHangResponse {
  data: DonHang[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    prev: string | null;
    next: string | null;
  };
}

interface BoLocDonHang {
  tu_khoa?: string;
  trang_thai?: string;
  page?: number;
  per_page?: number;
}

export async function layDanhSachDonHang(
  boLoc: BoLocDonHang,
  signal?: AbortSignal,
): Promise<DanhSachDonHangResponse> {
  const token = sessionStorage.getItem("admin_token")?.trim();

  if (!token) {
    throw new Error(
      "Chưa có token Admin. Kiểm tra admin_token trong Session Storage.",
    );
  }

  const params = new URLSearchParams({
    page: String(boLoc.page ?? 1),
    per_page: String(boLoc.per_page ?? 10),
  });

  if (boLoc.tu_khoa?.trim()) {
    params.set("tu_khoa", boLoc.tu_khoa.trim());
  }

  if (boLoc.trang_thai) {
    params.set("trang_thai", boLoc.trang_thai);
  }

  const response = await fetch(
    `${API_URL}/admin/don-hang?${params.toString()}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal,
    },
  );

  if (response.status === 401) {
    throw new Error(
      "Token không hợp lệ hoặc đã hết hiệu lực. Hãy lấy lại token Admin.",
    );
  }

  if (response.status === 403) {
    throw new Error("Tài khoản của token này không có quyền quản trị.");
  }

  const duLieu = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(duLieu?.message ?? `Lỗi API: ${response.status}`);
  }

  if (!Array.isArray(duLieu?.data) || !duLieu?.meta) {
    throw new Error("API trả dữ liệu không đúng cấu trúc phân trang.");
  }

  return duLieu;
}
export interface ChiTietSanPhamDonHang {
  ma_chi_tiet_don_hang: number;
  ma_san_pham: number | null;
  ten_san_pham: string;
  so_luong: number;
  don_gia: string | number;
  thanh_tien: string | number;
}

export interface ChiTietDonHang extends DonHang {
  ma_nguoi_dung: number | null;
  dia_chi_email: string | null;
  dia_chi_giao_hang: string;
  ma_giao_dich: string | null;
  ghi_chu: string | null;
  tam_tinh: string | number;
  giam_gia: string | number;
  ngay_cap_nhat: string | null;
  chi_tiet_don_hangs: ChiTietSanPhamDonHang[];
}

export async function layChiTietDonHang(
  maDonHang: string,
  signal?: AbortSignal,
): Promise<ChiTietDonHang> {
  if (!/^[1-9]\d*$/.test(maDonHang)) {
    throw new Error("Mã đơn hàng không hợp lệ.");
  }

  const token = sessionStorage.getItem("admin_token")?.trim();

  if (!token) {
    throw new Error("Chưa có token Admin trong Session Storage.");
  }

  const response = await fetch(`${API_URL}/admin/don-hang/${maDonHang}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
    signal,
  });

  if (response.status === 401) {
    throw new Error("Token không hợp lệ hoặc đã hết hiệu lực.");
  }

  if (response.status === 403) {
    throw new Error("Tài khoản không có quyền quản trị.");
  }

  if (response.status === 404) {
    throw new Error("Không tìm thấy đơn hàng.");
  }

  const duLieu = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      duLieu?.message ?? `Không thể tải đơn hàng: ${response.status}`,
    );
  }

  if (!duLieu?.data || !Array.isArray(duLieu.data.chi_tiet_don_hangs)) {
    throw new Error("API trả dữ liệu chi tiết không đúng cấu trúc.");
  }

  return duLieu.data;
}
interface KetQuaCapNhatTrangThai {
  message: string;
  data: {
    ma_don_hang: number;
    trang_thai: string;
    ngay_cap_nhat: string | null;
  };
}

export async function capNhatTrangThaiDonHang(
  maDonHang: number,
  trangThaiHienTai: string,
  trangThaiMoi: string,
): Promise<KetQuaCapNhatTrangThai> {
  const token = sessionStorage.getItem("admin_token")?.trim();

  if (!token) {
    throw new Error("Chưa có token Admin.");
  }

  const response = await fetch(
    `${API_URL}/admin/don-hang/${maDonHang}/trang-thai`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        trang_thai: trangThaiMoi,
        trang_thai_hien_tai: trangThaiHienTai,
      }),
    },
  );

  const duLieu = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      duLieu?.message ?? `Không thể cập nhật: ${response.status}`,
    );
  }

  if (!duLieu?.data?.trang_thai) {
    throw new Error("Phản hồi cập nhật không hợp lệ. Hãy tải lại trang.");
  }

  return duLieu;
}