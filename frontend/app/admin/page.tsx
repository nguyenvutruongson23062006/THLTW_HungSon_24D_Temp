"use client";

import { useState } from "react";

type DonHang = {
  maDon: string;
  khachHang: string;
  sanPham: string;
  tongTien: string;
  trangThai: "Đang xử lý" | "Đã giao" | "Đang giao" | "Đã hủy";
  ngayDat: string;
};

const danhSachDonHang: DonHang[] = [
  {
    maDon: "DH0012",
    khachHang: "Nguyễn Văn A",
    sanPham: "Honda SH 160i",
    tongTien: "85.000.000đ",
    trangThai: "Đang xử lý",
    ngayDat: "20/09/2025",
  },
  {
    maDon: "DH0011",
    khachHang: "Trần Thị B",
    sanPham: "Yamaha Exciter 155",
    tongTien: "52.000.000đ",
    trangThai: "Đã giao",
    ngayDat: "19/09/2025",
  },
  {
    maDon: "DH0010",
    khachHang: "Lê Văn C",
    sanPham: "Honda Wave Alpha",
    tongTien: "28.000.000đ",
    trangThai: "Đang giao",
    ngayDat: "18/09/2025",
  },
  {
    maDon: "DH0009",
    khachHang: "Phạm Thị D",
    sanPham: "Suzuki Raider R150",
    tongTien: "62.000.000đ",
    trangThai: "Đã giao",
    ngayDat: "17/09/2025",
  },
];

const danhSachTonKho = [
  { sanPham: "Honda SH 160i", tonKho: 5, trangThai: "Sắp hết" },
  { sanPham: "Yamaha Exciter 155", tonKho: 12, trangThai: "Còn hàng" },
  { sanPham: "Honda Wave Alpha", tonKho: 20, trangThai: "Còn hàng" },
  { sanPham: "Yamaha Grande", tonKho: 8, trangThai: "Sắp hết" },
  { sanPham: "Suzuki Raider R150", tonKho: 3, trangThai: "Sắp hết" },
];

const mauTrangThai: Record<string, string> = {
  "Đang xử lý": "bg-amber-100 text-amber-700",
  "Đã giao": "bg-emerald-100 text-emerald-700",
  "Đang giao": "bg-sky-100 text-sky-700",
  "Đã hủy": "bg-rose-100 text-rose-700",
  "Còn hàng": "bg-emerald-100 text-emerald-700",
  "Sắp hết": "bg-rose-100 text-rose-700",
};

export default function TrangTongQuanQuanTri() {
  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThai, setTrangThai] = useState("Tất cả");

  const donHangHienThi = danhSachDonHang.filter((donHang) => {
    const khopTuKhoa = `${donHang.maDon} ${donHang.khachHang} ${donHang.sanPham}`
      .toLowerCase()
      .includes(tuKhoa.toLowerCase());

    const khopTrangThai =
      trangThai === "Tất cả" || donHang.trangThai === trangThai;

    return khopTuKhoa && khopTrangThai;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-medium text-sky-600">Tổng quan</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Theo dõi hoạt động kinh doanh của cửa hàng.
          </p>
        </div>

        <button className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm">
          Tháng 9, 2025
        </button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Doanh thu", "482.500.000đ", "12,5%"],
          ["Đơn hàng", "86", "8,2%"],
          ["Xe đã bán", "72", "15,3%"],
          ["Khách hàng", "65", "10,7%"],
        ].map(([nhan, giaTri, thayDoi]) => (
          <article
            key={nhan}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{nhan}</p>

            <p className="mt-3 text-2xl font-bold text-slate-900">
              {giaTri}
            </p>

            <p className="mt-2 text-xs text-emerald-600">
              ↑ {thayDoi}{" "}
              <span className="text-slate-400">
                so với tháng trước
              </span>
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Đơn hàng gần đây
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Danh sách đơn hàng mới nhất
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={tuKhoa}
                onChange={(event) => setTuKhoa(event.target.value)}
                placeholder="Tìm đơn hàng..."
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
              />

              <select
                value={trangThai}
                onChange={(event) => setTrangThai(event.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
              >
                <option>Tất cả</option>
                <option>Đang xử lý</option>
                <option>Đang giao</option>
                <option>Đã giao</option>
                <option>Đã hủy</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-170 text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Mã đơn</th>
                  <th className="px-5 py-3 font-medium">Khách hàng</th>
                  <th className="px-5 py-3 font-medium">Sản phẩm</th>
                  <th className="px-5 py-3 font-medium">Tổng tiền</th>
                  <th className="px-5 py-3 font-medium">Trạng thái</th>
                  <th className="px-5 py-3 font-medium">Ngày đặt</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {donHangHienThi.map((donHang) => (
                  <tr key={donHang.maDon} className="text-slate-700">
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {donHang.maDon}
                    </td>

                    <td className="px-5 py-4">
                      {donHang.khachHang}
                    </td>

                    <td className="px-5 py-4">
                      {donHang.sanPham}
                    </td>

                    <td className="px-5 py-4 font-medium">
                      {donHang.tongTien}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${mauTrangThai[donHang.trangThai]}`}
                      >
                        {donHang.trangThai}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {donHang.ngayDat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {donHangHienThi.length === 0 && (
            <p className="p-8 text-center text-sm text-slate-500">
              Không tìm thấy đơn hàng phù hợp.
            </p>
          )}
        </article>

        <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <h2 className="font-semibold text-slate-900">
              Tình trạng kho
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Theo dõi số lượng sản phẩm hiện có
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {danhSachTonKho.map((sanPham) => (
              <div
                key={sanPham.sanPham}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {sanPham.sanPham}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Tồn kho: {sanPham.tonKho}
                  </p>
                </div>

                <span
                  className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${mauTrangThai[sanPham.trangThai]}`}
                >
                  {sanPham.trangThai}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}