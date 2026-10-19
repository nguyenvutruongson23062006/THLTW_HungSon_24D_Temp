"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  layDanhSachDonHang,
  type DanhSachDonHangResponse,
} from "@/lib/api/donhangApi";

const CAC_TRANG_THAI: Record<string, string> = {
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

const MAU_TRANG_THAI: Record<string, string> = {
  cho_xac_nhan: "bg-amber-50 text-amber-700",
  da_xac_nhan: "bg-blue-50 text-blue-700",
  dang_giao: "bg-violet-50 text-violet-700",
  hoan_tat: "bg-emerald-50 text-emerald-700",
  da_huy: "bg-rose-50 text-rose-700",
};

function dinhDangTien(giaTri: string | number) {
  const soTien = Number(giaTri);

  if (!Number.isFinite(soTien)) return "—";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(soTien);
}

function dinhDangNgay(giaTri: string | null) {
  if (!giaTri) return "—";

  const ngay = new Date(giaTri);

  if (Number.isNaN(ngay.getTime())) return "—";

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(ngay);
}

export default function QuanLyDonHang() {
  const [tuKhoaNhap, setTuKhoaNhap] = useState("");
  const [boLoc, setBoLoc] = useState({
    tu_khoa: "",
    trang_thai: "",
    page: 1,
  });

  const [duLieu, setDuLieu] = useState<DanhSachDonHangResponse | null>(null);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");
  const [lanTai, setLanTai] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function taiDonHang() {
      setDangTai(true);
      setLoi("");

      try {
        const ketQua = await layDanhSachDonHang(
          {
            ...boLoc,
            per_page: 10,
          },
          controller.signal,
        );

        if (!controller.signal.aborted) {
          setDuLieu(ketQua);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setDuLieu(null);
          setLoi(
            error instanceof Error ? error.message : "Không thể tải đơn hàng.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setDangTai(false);
        }
      }
    }

    void taiDonHang();

    return () => controller.abort();
  }, [boLoc, lanTai]);

  function timKiem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setBoLoc((cu) => ({
      ...cu,
      tu_khoa: tuKhoaNhap.trim(),
      page: 1,
    }));
  }

  function xoaBoLoc() {
    setTuKhoaNhap("");
    setBoLoc({
      tu_khoa: "",
      trang_thai: "",
      page: 1,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-600">Quản trị</p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Quản lý đơn hàng
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Tra cứu đơn hàng và theo dõi tình trạng xử lý.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setLanTai((cu) => cu + 1)}
          disabled={dangTai}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Làm mới
        </button>
      </div>

      <section
        aria-busy={dangTai}
        className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="border-b border-slate-100 p-5">
          <form
            onSubmit={timKiem}
            className="flex flex-col gap-3 lg:flex-row lg:items-end"
          >
            <div className="flex-1">
              <label
                htmlFor="tim-don-hang"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Tìm đơn hàng
              </label>

              <input
                id="tim-don-hang"
                value={tuKhoaNhap}
                onChange={(event) => setTuKhoaNhap(event.target.value)}
                placeholder="Mã đơn, tên khách hoặc số điện thoại"
                maxLength={100}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label
                htmlFor="loc-trang-thai"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Trạng thái đơn
              </label>

              <select
                id="loc-trang-thai"
                value={boLoc.trang_thai}
                onChange={(event) =>
                  setBoLoc((cu) => ({
                    ...cu,
                    trang_thai: event.target.value,
                    page: 1,
                  }))
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
              >
                <option value="">Tất cả trạng thái</option>

                {Object.entries(CAC_TRANG_THAI).map(([giaTri, nhan]) => (
                  <option key={giaTri} value={giaTri}>
                    {nhan}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={dangTai}
              className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
            >
              Tìm kiếm
            </button>

            <button
              type="button"
              onClick={xoaBoLoc}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Xóa lọc
            </button>
          </form>
        </div>

        {dangTai ? (
          <p role="status" className="p-10 text-center text-sm text-slate-500">
            Đang tải đơn hàng...
          </p>
        ) : loi ? (
          <div role="alert" className="space-y-3 p-6">
            <p className="text-sm text-rose-700">{loi}</p>

            <button
              type="button"
              onClick={() => setLanTai((cu) => cu + 1)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              Thử lại
            </button>
          </div>
        ) : duLieu && duLieu.data.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-3">
                      Mã đơn
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Khách hàng
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Ngày đặt
                    </th>
                    <th scope="col" className="px-5 py-3 text-right">
                      Tổng tiền
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Thanh toán
                    </th>
                    <th scope="col" className="px-5 py-3">
                      Thao tác
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {duLieu.data.map((donHang) => (
                    <tr
                      key={donHang.ma_don_hang}
                      className="text-slate-700 hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-4 font-semibold text-slate-900">
                        #{donHang.ma_don_hang}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium">{donHang.ho_ten}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {donHang.so_dien_thoai}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4">
                        {dinhDangNgay(donHang.ngay_tao)}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-right font-medium">
                        {dinhDangTien(donHang.tong_tien)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${
                            MAU_TRANG_THAI[donHang.trang_thai] ??
                            "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {CAC_TRANG_THAI[donHang.trang_thai] ??
                            donHang.trang_thai}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        {THANH_TOAN[donHang.trang_thai_thanh_toan] ??
                          donHang.trang_thai_thanh_toan}
                      </td>

                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/don-hang/${donHang.ma_don_hang}`}
                          aria-label={`Xem chi tiết đơn ${donHang.ma_don_hang}`}
                          className="whitespace-nowrap rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium hover:bg-white"
                        >
                          Chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
              <p className="text-sm text-slate-500">
                Tổng {duLieu.meta.total} đơn · Trang {duLieu.meta.current_page}/
                {duLieu.meta.last_page}
              </p>

              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={duLieu.meta.current_page <= 1}
                  onClick={() =>
                    setBoLoc((cu) => ({
                      ...cu,
                      page: Math.max(1, cu.page - 1),
                    }))
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Trước
                </button>

                <button
                  type="button"
                  disabled={duLieu.meta.current_page >= duLieu.meta.last_page}
                  onClick={() =>
                    setBoLoc((cu) => ({
                      ...cu,
                      page: cu.page + 1,
                    }))
                  }
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Sau
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-3 p-10 text-center">
            <p className="text-sm text-slate-500">
              Không tìm thấy đơn hàng phù hợp.
            </p>

            <button
              type="button"
              onClick={xoaBoLoc}
              className="text-sm font-medium text-sky-700 hover:underline"
            >
              Xóa bộ lọc và xem lại
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
