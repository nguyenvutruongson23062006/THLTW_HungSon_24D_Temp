"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { type BaoCaoQuanTri } from "@/lib/api/thongKeApi";
import { apiRequest } from "@/lib/api/apiClient";

const tien = (n: number | string) => Number(n).toLocaleString("vi-VN") + "đ";
const button =
  "rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50";
const trangThai: Record<string, string> = {
  cho_xac_nhan: "Chờ xác nhận",
  da_xac_nhan: "Đã xác nhận",
  dang_xu_ly: "Đang xử lý",
  dang_giao: "Đang giao",
  da_giao: "Đã giao",
  hoan_tat: "Hoàn tất",
  da_huy: "Đã hủy",
};

export default function ThongKeQuanTri() {
  const [data, setData] = useState<BaoCaoQuanTri | null>(null);
  const [tai, setTai] = useState(true);
  const [loi, setLoi] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    apiRequest<BaoCaoQuanTri>("/admin/tong-quan", { signal: ac.signal })
      .then((v) => {
        if (!ac.signal.aborted) setData(v);
      })
      .catch((e) => {
        if (!ac.signal.aborted)
          setLoi(e instanceof Error ? e.message : "Không thể tải thống kê.");
      })
      .finally(() => {
        if (!ac.signal.aborted) setTai(false);
      });
    return () => ac.abort();
  }, []);

  const tonKho =
    data?.ton_kho.filter((p) =>
      `${p.ten_san_pham} ${p.ten_danh_muc}`
        .toLowerCase()
        .includes(tuKhoa.toLowerCase()),
    ) ?? [];
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-sky-600">Quản trị</p>
          <h1 className="mt-1 text-3xl font-bold">
            Tổng quan cửa hàng
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Số liệu từ database. Doanh thu chỉ tính đơn đã thanh toán và chưa bị
            hủy.
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          {(
            <Link href="/admin/bao-cao" className={button}>
              Xem báo cáo
            </Link>
          )}

        </div>
      </div>
      {loi && (
        <p
          role="alert"
          className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700"
        >
          {loi}
        </p>
      )}
      {tai ? (
        <p className="p-8 text-center text-slate-500">Đang tải thống kê...</p>
      ) : (
        data && (
          <>
            <p className="text-sm text-slate-500">
              Tổng quan toàn bộ dữ liệu đến hiện tại · {data.tu_ngay} đến {data.den_ngay}
            </p>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                [
                  "Doanh thu đã thu",
                  tien(data.tong_quan.doanh_thu),
                  "text-sky-600",
                ],
                ["Đơn hàng", data.tong_quan.so_don_hang, "text-emerald-600"],
                [
                  "Sản phẩm đã giao",
                  Number(data.tong_quan.so_san_pham_ban).toLocaleString(
                    "vi-VN",
                  ),
                  "text-amber-600",
                ],
                ["Người dùng", data.tong_quan.so_nguoi_dung, "text-indigo-600"],
              ].map(([nhan, value, color]) => (
                <article
                  key={nhan}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm text-slate-500">{nhan}</p>
                  <p className={`mt-3 break-words text-2xl font-bold ${color}`}>
                    {value}
                  </p>
                </article>
              ))}
            </div>
            <div className="grid gap-6 xl:grid-cols-2">
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-100 p-5">
                  <h2 className="font-semibold">Đơn hàng gần đây</h2>
                  <Link href="/admin/don-hang" className="text-sm text-sky-600">
                    Xem tất cả
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-110 text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="p-3">Mã đơn</th>
                        <th className="p-3">Khách hàng</th>
                        <th className="p-3">Tổng tiền</th>
                        <th className="p-3">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.don_hang_gan_day.map((d) => (
                        <tr
                          key={d.ma_don_hang}
                          className="border-t border-slate-100"
                        >
                          <td className="p-3">
                            <Link
                              href={`/admin/don-hang/${d.ma_don_hang}`}
                              className="text-sky-600"
                            >
                              #{d.ma_don_hang}
                            </Link>
                          </td>
                          <td className="p-3">{d.ho_ten}</td>
                          <td className="p-3">{tien(d.tong_tien)}</td>
                          <td className="p-3">
                            {trangThai[d.trang_thai] ?? d.trang_thai}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {data.don_hang_gan_day.length === 0 && (
                    <p className="p-6 text-center text-slate-500">
                      Chưa có đơn trong kỳ báo cáo.
                    </p>
                  )}
                </div>
              </section>
              <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 p-5">
                  <h2 className="font-semibold">Sản phẩm bán chạy</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Tính trên đơn đã giao hoặc hoàn tất.
                  </p>
                </div>
                {data.ban_chay.length === 0 ? (
                  <p className="p-6 text-center text-slate-500">
                    Chưa có sản phẩm đã giao trong kỳ.
                  </p>
                ) : (
                  data.ban_chay.map((p, i) => (
                    <div
                      key={`${p.ma_san_pham}-${p.ten_san_pham}`}
                      className="flex items-center justify-between gap-3 border-b border-slate-100 p-4 text-sm"
                    >
                      <span>
                        {i + 1}. {p.ten_san_pham}
                      </span>
                      <span className="shrink-0 font-semibold">
                        {p.so_luong_ban} sản phẩm
                      </span>
                    </div>
                  ))
                )}
              </section>
            </div>
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-5">
                <div>
                  <h2 className="font-semibold">Tình trạng tồn kho</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Sắp hết khi tồn kho ≤ {data.nguong_ton_kho}. Tồn kho là số
                    hiện tại, không phụ thuộc kỳ báo cáo.
                  </p>
                </div>
                <input
                  aria-label="Tìm tồn kho"
                  value={tuKhoa}
                  onChange={(e) => setTuKhoa(e.target.value)}
                  placeholder="Tìm sản phẩm..."
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm print:hidden"
                />
              </div>
              <div className="max-h-100 overflow-auto print:max-h-none print:overflow-visible">
                <table className="w-full min-w-125 text-left text-sm">
                  <thead className="sticky top-0 bg-slate-50 text-slate-500">
                    <tr>
                      <th className="p-3">Sản phẩm</th>
                      <th className="p-3">Danh mục</th>
                      <th className="p-3">Tồn</th>
                      <th className="p-3">Tình trạng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tonKho.map((p) => (
                      <tr
                        key={p.ma_san_pham}
                        className="border-t border-slate-100"
                      >
                        <td className="p-3">
                          <Link
                            className="text-sky-700"
                            href={`/admin/san-pham/${p.ma_san_pham}`}
                          >
                            {p.ten_san_pham}
                          </Link>
                        </td>
                        <td className="p-3">{p.ten_danh_muc}</td>
                        <td className="p-3">{p.so_luong_ton}</td>
                        <td className="p-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs ${p.so_luong_ton <= data.nguong_ton_kho ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}
                          >
                            {p.so_luong_ton === 0
                              ? "Hết hàng"
                              : p.so_luong_ton <= data.nguong_ton_kho
                                ? "Sắp hết"
                                : "Còn hàng"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {tonKho.length === 0 && (
                  <p className="p-6 text-center text-slate-500">
                    Không có sản phẩm phù hợp.
                  </p>
                )}
              </div>
            </section>
          </>
        )
      )}
    </div>
  );
}
