"use client";

import Link from "next/link";
import { useEffect, useState, type SyntheticEvent } from "react";
import { layBaoCao, type BaoCaoQuanTri } from "@/lib/api/thongKeApi";

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

function xuatCsv(data: BaoCaoQuanTri) {
  const dong: (string | number)[][] = [
    ["Báo cáo cửa hàng", data.tu_ngay, data.den_ngay],
    ["Doanh thu đã thu", data.tong_quan.doanh_thu],
    ["Số đơn hàng", data.tong_quan.so_don_hang],
    ["Số sản phẩm đã giao", data.tong_quan.so_san_pham_ban],
    ["Chi phí nhập kho", data.tong_quan.chi_phi_nhap],
    [],
    ["Mã sản phẩm", "Tên sản phẩm", "Danh mục", "Tồn kho", "Giá bán"],
    ...data.ton_kho.map((p) => [
      p.ma_san_pham,
      p.ten_san_pham,
      p.ten_danh_muc,
      p.so_luong_ton,
      p.gia_ban,
    ]),
    [],
    ["Sản phẩm bán chạy", "Số lượng", "Thành tiền sản phẩm"],
    ...data.ban_chay.map((p) => [p.ten_san_pham, p.so_luong_ban, p.thanh_tien]),
    [],
    ["Ngày", "Doanh thu đã thu", "Số đơn đã thu"],
    ...data.doanh_thu_theo_ngay.map((d) => [d.ngay, d.doanh_thu, d.so_don]),
  ];
  const csv = dong
    .map((row) =>
      row
        .map((v) => {
          const text = String(v ?? "");
          return `"${(/^[=+@-]/.test(text) ? "'" + text : text).replaceAll('"', '""')}"`;
        })
        .join(","),
    )
    .join("\r\n");
  const url = URL.createObjectURL(
    new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `bao-cao-${data.tu_ngay}-${data.den_ngay}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ThongKeQuanTri({
  baoCao = false,
}: {
  baoCao?: boolean;
}) {
  const homNay = new Date().toISOString().slice(0, 10);
  const [tuNgay, setTuNgay] = useState(homNay.slice(0, 4) + "-01-01");
  const [denNgay, setDenNgay] = useState(homNay);
  const [boLoc, setBoLoc] = useState({ tu: tuNgay, den: denNgay, lan: 0 });
  const [data, setData] = useState<BaoCaoQuanTri | null>(null);
  const [tai, setTai] = useState(true);
  const [loi, setLoi] = useState("");
  const [tuKhoa, setTuKhoa] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    layBaoCao(boLoc.tu, boLoc.den, ac.signal)
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
  }, [boLoc]);

  function apDung(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setTai(true);
    setLoi("");
    setBoLoc({ tu: tuNgay, den: denNgay, lan: boLoc.lan + 1 });
  }
  const tonKho =
    data?.ton_kho.filter((p) =>
      `${p.ten_san_pham} ${p.ten_danh_muc}`
        .toLowerCase()
        .includes(tuKhoa.toLowerCase()),
    ) ?? [];
  const buoc = Math.ceil((data?.doanh_thu_theo_ngay.length ?? 1) / 24);
  const bieuDo: { ngay: string; doanh_thu: number }[] = [];
  for (let i = 0; data && i < data.doanh_thu_theo_ngay.length; i += buoc) {
    const nhom = data.doanh_thu_theo_ngay.slice(i, i + buoc);
    bieuDo.push({
      ngay: nhom[0].ngay,
      doanh_thu: nhom.reduce((s, d) => s + Number(d.doanh_thu), 0),
    });
  }
  const max = Math.max(1, ...bieuDo.map((d) => d.doanh_thu));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-sky-600">Quản trị</p>
          <h1 className="mt-1 text-3xl font-bold">
            {baoCao ? "Báo cáo kinh doanh" : "Tổng quan cửa hàng"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Số liệu từ database. Doanh thu chỉ tính đơn đã thanh toán và chưa bị
            hủy.
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          {!baoCao && (
            <Link href="/admin/bao-cao" className={button}>
              Xem báo cáo
            </Link>
          )}
          <button
            className={button}
            disabled={!data || tai}
            onClick={() => data && xuatCsv(data)}
          >
            Xuất CSV
          </button>
          <button className={button} onClick={() => window.print()}>
            In báo cáo
          </button>
        </div>
      </div>
      <form
        onSubmit={apDung}
        className="flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 print:hidden"
      >
        <label className="text-sm text-slate-600">
          Từ ngày
          <input
            required
            type="date"
            value={tuNgay}
            max={denNgay}
            onChange={(e) => setTuNgay(e.target.value)}
            className="mt-1 block rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="text-sm text-slate-600">
          Đến ngày
          <input
            required
            type="date"
            value={denNgay}
            min={tuNgay}
            onChange={(e) => setDenNgay(e.target.value)}
            className="mt-1 block rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <button
          disabled={tai}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {tai ? "Đang tải..." : "Áp dụng"}
        </button>
        <button
          type="button"
          className={button}
          onClick={() => {
            setTuNgay(homNay.slice(0, 7) + "-01");
            setDenNgay(homNay);
          }}
        >
          Chọn tháng này
        </button>
      </form>
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
              Kỳ báo cáo: {data.tu_ngay} đến {data.den_ngay}
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
            {baoCao && (
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  ["Chi phí nhập kho", tien(data.tong_quan.chi_phi_nhap)],
                  ["Tổng số lượng tồn", data.tong_quan.tong_ton_kho],
                  ["Sản phẩm sắp hết", data.tong_quan.so_san_pham_sap_het],
                ].map(([nhan, value]) => (
                  <div
                    key={nhan}
                    className="rounded-xl border border-slate-200 bg-white p-5"
                  >
                    <p className="text-sm text-slate-500">{nhan}</p>
                    <p className="mt-2 text-xl font-bold">{value}</p>
                  </div>
                ))}
              </div>
            )}
            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <h2 className="font-semibold">Doanh thu theo thời gian</h2>
              <p className="mt-1 text-xs text-slate-500">
                {buoc > 1
                  ? `Mỗi cột gộp tối đa ${buoc} ngày.`
                  : "Mỗi cột là một ngày."}{" "}
                Rê chuột vào cột để xem số tiền.
              </p>
              <div
                className="mt-5 flex h-40 items-end gap-1 border-b border-slate-200"
                role="img"
                aria-label={`Biểu đồ doanh thu, tổng ${tien(data.tong_quan.doanh_thu)}`}
              >
                {bieuDo.map((d) => (
                  <div
                    key={d.ngay}
                    className="flex h-full min-w-0 flex-1 items-end"
                    title={`${d.ngay}: ${tien(d.doanh_thu)}`}
                  >
                    <div
                      className={`w-full rounded-t ${d.doanh_thu > 0 ? "bg-sky-500" : "bg-slate-100"}`}
                      style={{
                        height: `${Math.max(2, (d.doanh_thu / max) * 100)}%`,
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-between text-xs text-slate-400">
                <span>{data.tu_ngay}</span>
                <span>{data.den_ngay}</span>
              </div>
            </section>
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
