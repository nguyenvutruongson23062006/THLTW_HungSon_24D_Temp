"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  layChiTietDonHang,
  capNhatTrangThaiDonHang,
  type ChiTietDonHang,
} from "@/lib/api/donhangApi";

const TRANG_THAI: Record<string, string> = {
  cho_xac_nhan: "Chờ xác nhận",
  da_xac_nhan: "Đã xác nhận",
  dang_giao: "Đang giao",
  hoan_tat: "Hoàn tất",
  da_huy: "Đã hủy",
};

const THANH_TOAN: Record<string, string> = {
  chua_thanh_toan: "Chưa thanh toán",
  da_thanh_toan: "Đã thanh toán",
  da_hoan_tien: "Đã hoàn tiền",
};

const PHUONG_THUC: Record<string, string> = {
  tien_mat: "Tiền mặt",
  chuyen_khoan: "Chuyển khoản",
  tra_gop: "Trả góp",
};

const CHUYEN_TRANG_THAI: Record<string, string[]> = {
  cho_xac_nhan: ["da_xac_nhan", "da_huy"],
  da_xac_nhan: ["dang_giao", "da_huy"],
  dang_giao: ["hoan_tat"],
  hoan_tat: [],
  da_huy: [],
};

function tien(giaTri: string | number) {
  const soTien = Number(giaTri);

  if (!Number.isFinite(soTien)) return "—";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(soTien);
}

function ngay(giaTri: string | null) {
  if (!giaTri) return "—";

  const giaTriNgay = new Date(giaTri);

  if (Number.isNaN(giaTriNgay.getTime())) return "—";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(giaTriNgay);
}

export default function TrangChiTietDonHang() {
  const { maDonHang } = useParams<{ maDonHang: string }>();

  const [donHang, setDonHang] = useState<ChiTietDonHang | null>(null);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");
  const [lanTai, setLanTai] = useState(0);
  const [trangThaiMoi, setTrangThaiMoi] = useState("");
  const [dangLuu, setDangLuu] = useState(false);
  const [loiCapNhat, setLoiCapNhat] = useState("");
  const [thongBao, setThongBao] = useState("");

  const trangThaiChoPhep = donHang
    ? (CHUYEN_TRANG_THAI[donHang.trang_thai] ?? []).filter(
        (trangThai) =>
          trangThai !== "da_huy" ||
          donHang.trang_thai_thanh_toan === "chua_thanh_toan",
      )
    : [];

  async function luuTrangThai() {
    if (!donHang || !trangThaiMoi || dangLuu) return;

    const xacNhan = window.confirm(
      `Chuyển đơn #${donHang.ma_don_hang} sang "${
        TRANG_THAI[trangThaiMoi] ?? trangThaiMoi
      }"?`,
    );

    if (!xacNhan) return;

    setDangLuu(true);
    setLoiCapNhat("");
    setThongBao("");

    try {
      const ketQua = await capNhatTrangThaiDonHang(
        donHang.ma_don_hang,
        donHang.trang_thai,
        trangThaiMoi,
      );

      setDonHang((cu) =>
        cu
          ? {
              ...cu,
              trang_thai: ketQua.data.trang_thai,
              ngay_cap_nhat: ketQua.data.ngay_cap_nhat,
            }
          : cu,
      );

      setTrangThaiMoi("");
      setThongBao(ketQua.message);
    } catch (error) {
      setLoiCapNhat(
        error instanceof Error
          ? error.message
          : "Không thể cập nhật trạng thái.",
      );
    } finally {
      setDangLuu(false);
    }
  }
  useEffect(() => {
    const controller = new AbortController();

    async function taiChiTiet() {
      setDangTai(true);
      setLoi("");
      setDonHang(null);

      try {
        const duLieu = await layChiTietDonHang(maDonHang, controller.signal);

        if (!controller.signal.aborted) {
          setDonHang(duLieu);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setLoi(
            error instanceof Error
              ? error.message
              : "Không thể tải chi tiết đơn hàng.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setDangTai(false);
        }
      }
    }

    void taiChiTiet();

    return () => controller.abort();
  }, [maDonHang, lanTai]);

  return (
    <div className="space-y-6">
      <Link
        href="/admin/don-hang"
        className="inline-block text-sm font-medium text-sky-700 hover:underline"
      >
        ← Danh sách đơn hàng
      </Link>

      {dangTai ? (
        <p
          role="status"
          className="rounded-xl bg-white p-10 text-center text-sm text-slate-500"
        >
          Đang tải chi tiết đơn hàng...
        </p>
      ) : loi ? (
        <div
          role="alert"
          className="space-y-3 rounded-xl border border-rose-200 bg-white p-6"
        >
          <p className="text-sm text-rose-700">{loi}</p>

          <button
            type="button"
            onClick={() => setLanTai((cu) => cu + 1)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
          >
            Thử lại
          </button>
        </div>
      ) : donHang ? (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-sky-600">Quản trị</p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                Đơn hàng #{donHang.ma_don_hang}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Ngày đặt: {ngay(donHang.ngay_tao)}
              </p>
            </div>

            <span className="rounded-full bg-sky-100 px-3 py-1.5 text-sm font-medium text-sky-800">
              {TRANG_THAI[donHang.trang_thai] ?? donHang.trang_thai}
            </span>
          </div>
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Xử lý đơn hàng
            </h2>

            {trangThaiChoPhep.length > 0 ? (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="flex-1">
                  <label
                    htmlFor="trang-thai-moi"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Chuyển trạng thái
                  </label>

                  <select
                    id="trang-thai-moi"
                    value={trangThaiMoi}
                    disabled={dangLuu}
                    onChange={(event) => {
                      setTrangThaiMoi(event.target.value);
                      setThongBao("");
                      setLoiCapNhat("");
                    }}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-50"
                  >
                    <option value="">Chọn trạng thái tiếp theo</option>

                    {trangThaiChoPhep.map((trangThai) => (
                      <option key={trangThai} value={trangThai}>
                        {TRANG_THAI[trangThai] ?? trangThai}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={luuTrangThai}
                  disabled={dangLuu || !trangThaiChoPhep.includes(trangThaiMoi)}
                  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {dangLuu ? "Đang lưu..." : "Lưu trạng thái"}
                </button>
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                Đơn hàng không có bước chuyển trạng thái tiếp theo trong luồng
                hiện tại.
              </p>
            )}

            {thongBao && (
              <p role="status" className="mt-3 text-sm text-emerald-700">
                {thongBao}
              </p>
            )}

            {loiCapNhat && (
              <div role="alert" className="mt-3 space-y-2">
                <p className="text-sm text-rose-700">{loiCapNhat}</p>

                <button
                  type="button"
                  disabled={dangLuu}
                  onClick={() => {
                    setTrangThaiMoi("");
                    setLoiCapNhat("");
                    setThongBao("");
                    setLanTai((cu) => cu + 1);
                  }}
                  className="text-sm font-medium text-sky-700 underline"
                >
                  Tải lại dữ liệu đơn hàng
                </button>
              </div>
            )}
          </section>
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">
                  Thông tin người nhận
                </h2>

                <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-slate-500">Họ tên</dt>
                    <dd className="mt-1 font-medium">{donHang.ho_ten}</dd>
                  </div>

                  <div>
                    <dt className="text-slate-500">Số điện thoại</dt>
                    <dd className="mt-1">{donHang.so_dien_thoai}</dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-slate-500">Email</dt>
                    <dd className="mt-1 break-words">
                      {donHang.dia_chi_email || "Không cung cấp"}
                    </dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-slate-500">Địa chỉ giao hàng</dt>
                    <dd className="mt-1 whitespace-pre-wrap break-words">
                      {donHang.dia_chi_giao_hang}
                    </dd>
                  </div>

                  <div className="sm:col-span-2">
                    <dt className="text-slate-500">Ghi chú</dt>
                    <dd className="mt-1 whitespace-pre-wrap break-words">
                      {donHang.ghi_chu || "Không có ghi chú"}
                    </dd>
                  </div>
                </dl>
              </section>

              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <h2 className="border-b border-slate-100 p-5 text-lg font-semibold text-slate-900">
                  Sản phẩm trong đơn
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs text-slate-500">
                      <tr>
                        <th scope="col" className="px-5 py-3">
                          Sản phẩm
                        </th>
                        <th scope="col" className="px-5 py-3 text-center">
                          Số lượng
                        </th>
                        <th scope="col" className="px-5 py-3 text-right">
                          Đơn giá
                        </th>
                        <th scope="col" className="px-5 py-3 text-right">
                          Thành tiền
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {donHang.chi_tiet_don_hangs.map((chiTiet) => (
                        <tr key={chiTiet.ma_chi_tiet_don_hang}>
                          <td className="px-5 py-4 font-medium text-slate-900">
                            {chiTiet.ten_san_pham}
                          </td>

                          <td className="px-5 py-4 text-center">
                            {chiTiet.so_luong}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-right">
                            {tien(chiTiet.don_gia)}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-right font-medium">
                            {tien(chiTiet.thanh_tien)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {donHang.chi_tiet_don_hangs.length === 0 && (
                  <p className="p-6 text-center text-sm text-slate-500">
                    Đơn hàng chưa có dòng sản phẩm.
                  </p>
                )}
              </section>
            </div>

            <section className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">
                Thanh toán
              </h2>

              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-slate-500">Phương thức</dt>
                  <dd className="mt-1 font-medium">
                    {PHUONG_THUC[donHang.phuong_thuc_thanh_toan] ??
                      donHang.phuong_thuc_thanh_toan}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">Trạng thái thanh toán</dt>
                  <dd className="mt-1 font-medium">
                    {THANH_TOAN[donHang.trang_thai_thanh_toan] ??
                      donHang.trang_thai_thanh_toan}
                  </dd>
                </div>

                <div>
                  <dt className="text-slate-500">Mã giao dịch</dt>
                  <dd className="mt-1 break-words">
                    {donHang.ma_giao_dich || "Chưa có"}
                  </dd>
                </div>
              </dl>

              <dl className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Tạm tính</dt>
                  <dd>{tien(donHang.tam_tinh)}</dd>
                </div>

                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Giảm giá</dt>
                  <dd>{tien(donHang.giam_gia)}</dd>
                </div>

                <div className="flex justify-between gap-4 border-t border-slate-100 pt-3 text-base font-bold">
                  <dt>Tổng tiền</dt>
                  <dd className="text-sky-700">{tien(donHang.tong_tien)}</dd>
                </div>
              </dl>

              <p className="mt-5 text-xs text-slate-400">
                Cập nhật: {ngay(donHang.ngay_cap_nhat)}
              </p>
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
}
