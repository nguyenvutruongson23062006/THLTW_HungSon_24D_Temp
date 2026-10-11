"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { SanPham } from "@/types/admin";
import {
  layDanhSachSanPham,
  xoaSanPham,
} from "@/lib/api/sanPhamApi";

function dinhDangTien(
  gia: number | string | null | undefined,
) {
  if (gia === null || gia === undefined || gia === "") {
    return "-";
  }

  return `${Number(gia).toLocaleString("vi-VN")}đ`;
}

function layTrangThai(trangThai: SanPham["trang_thai"]) {
  if (trangThai === "hoat_dong") {
    return {
      nhan: "Hoạt động",
      mau: "bg-emerald-100 text-emerald-700",
    };
  }

  return {
    nhan: "Tạm ngưng",
    mau: "bg-rose-100 text-rose-700",
  };
}

function AnhDaiDienSanPham({
  duongDan,
  tenSanPham,
}: {
  duongDan?: string | null;
  tenSanPham: string;
}) {
  const [biLoi, setBiLoi] = useState(false);

  if (!duongDan || biLoi) {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
        Không có ảnh
      </div>
    );
  }

  return (
    <Image
      src={duongDan}
      alt={tenSanPham}
      width={56}
      height={56}
      unoptimized
      onError={() => setBiLoi(true)}
      className="h-14 w-14 rounded-lg border border-slate-200 object-cover"
    />
  );
}

export default function QuanLySanPham() {
  const [danhSachSanPham, setDanhSachSanPham] = useState<
    SanPham[]
  >([]);

  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThaiLoc, setTrangThaiLoc] = useState("tat_ca");
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");

  useEffect(() => {
    async function taiDanhSach() {
      setDangTai(true);
      setLoi("");

      try {
        const duLieu = await layDanhSachSanPham();
        setDanhSachSanPham(duLieu);
      } catch (loiApi) {
        setLoi(
          loiApi instanceof Error
            ? loiApi.message
            : "Không thể tải danh sách sản phẩm.",
        );
      } finally {
        setDangTai(false);
      }
    }

    taiDanhSach();
  }, []);

  const danhSachHienThi = danhSachSanPham.filter((sanPham) => {
    const tuKhoaThuong = tuKhoa.toLowerCase();

    const noiDungTimKiem = [
      sanPham.ten_san_pham,
      sanPham.duong_dan,
      sanPham.danh_muc?.ten_danh_muc ?? "",
      sanPham.thuong_hieu?.ten_thuong_hieu ?? "",
    ]
      .join(" ")
      .toLowerCase();

    const khopTuKhoa = noiDungTimKiem.includes(tuKhoaThuong);

    const khopTrangThai =
      trangThaiLoc === "tat_ca" ||
      sanPham.trang_thai === trangThaiLoc;

    return khopTuKhoa && khopTrangThai;
  });

  async function xuLyXoa(sanPham: SanPham) {
    const xacNhan = window.confirm(
      `Bạn có chắc muốn xóa sản phẩm "${sanPham.ten_san_pham}" không?`,
    );

    if (!xacNhan) {
      return;
    }

    try {
      setLoi("");

      await xoaSanPham(sanPham.ma_san_pham);

      setDanhSachSanPham((danhSachCu) =>
        danhSachCu.filter(
          (sanPhamCu) =>
            sanPhamCu.ma_san_pham !== sanPham.ma_san_pham,
        ),
      );
    } catch (loiApi) {
      setLoi(
        loiApi instanceof Error
          ? loiApi.message
          : "Không thể xóa sản phẩm.",
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-sky-600">
            Quản trị
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Quản lý sản phẩm
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Quản lý xe máy, phụ kiện và các sản phẩm trong cửa hàng.
          </p>
        </div>

        <Link
          href="/admin/san-pham/them"
          className="rounded-lg bg-sky-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-sky-700"
        >
          + Thêm sản phẩm
        </Link>
      </div>

      {loi && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {loi}
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Danh sách sản phẩm
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Có {danhSachHienThi.length} sản phẩm phù hợp.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={tuKhoa}
              onChange={(event) => setTuKhoa(event.target.value)}
              placeholder="Tìm sản phẩm..."
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
            />

            <select
              value={trangThaiLoc}
              onChange={(event) =>
                setTrangThaiLoc(event.target.value)
              }
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
            >
              <option value="tat_ca">Tất cả trạng thái</option>
              <option value="hoat_dong">Hoạt động</option>
              <option value="tam_ngung">Tạm ngưng</option>
            </select>
          </div>
        </div>

        {dangTai ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Đang tải danh sách sản phẩm...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-275 text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">
                    Sản phẩm
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Danh mục
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Thương hiệu
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Giá bán
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Giá khuyến mãi
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Tồn kho
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Trạng thái
                  </th>

                  <th className="px-5 py-3 text-center font-medium">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {danhSachHienThi.map((sanPham) => {
                  const trangThai = layTrangThai(
                    sanPham.trang_thai,
                  );

                  return (
                    <tr
                      key={sanPham.ma_san_pham}
                      className="text-slate-700 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <AnhDaiDienSanPham
                            duongDan={sanPham.anh_dai_dien}
                            tenSanPham={sanPham.ten_san_pham}
                          />

                          <div>
                            <p className="font-medium text-slate-900">
                              {sanPham.ten_san_pham}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Mã: {sanPham.ma_san_pham}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {sanPham.danh_muc?.ten_danh_muc ??
                          "Không xác định"}
                      </td>

                      <td className="px-5 py-4">
                        {sanPham.thuong_hieu?.ten_thuong_hieu ??
                          "Không xác định"}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-900">
                        {dinhDangTien(sanPham.gia_ban)}
                      </td>

                      <td className="px-5 py-4">
                        {sanPham.gia_khuyen_mai ? (
                          <span className="font-medium text-rose-600">
                            {dinhDangTien(
                              sanPham.gia_khuyen_mai,
                            )}
                          </span>
                        ) : (
                          <span className="text-slate-400">
                            Không giảm
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {sanPham.so_luong_ton}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${trangThai.mau}`}
                        >
                          {trangThai.nhan}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={`/admin/san-pham/${sanPham.ma_san_pham}`}
                            className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            Sửa
                          </Link>

                          <button
                            type="button"
                            onClick={() => xuLyXoa(sanPham)}
                            className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {danhSachHienThi.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500">
                Không tìm thấy sản phẩm phù hợp.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}