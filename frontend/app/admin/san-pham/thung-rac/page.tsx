"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { SanPham } from "@/types/admin";
import {
  khoiPhucSanPham,
  layDanhSachSanPhamDaXoa,
  xoaVinhVienSanPham,
} from "@/lib/api/sanPhamApi";

function dinhDangTien(
  gia: number | string | null | undefined,
) {
  if (gia === null || gia === undefined || gia === "") {
    return "-";
  }

  return `${Number(gia).toLocaleString("vi-VN")}đ`;
}

export default function ThungRacSanPham() {
  const [danhSachSanPham, setDanhSachSanPham] = useState<
    SanPham[]
  >([]);

  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");
  const [maDangXuLy, setMaDangXuLy] = useState<number | null>(
    null,
  );

  useEffect(() => {
    async function taiSanPhamDaXoa() {
      try {
        setDangTai(true);
        setLoi("");

        const duLieu = await layDanhSachSanPhamDaXoa();

        setDanhSachSanPham(duLieu);
      } catch (loiApi) {
        setLoi(
          loiApi instanceof Error
            ? loiApi.message
            : "Không thể tải sản phẩm đã xóa.",
        );
      } finally {
        setDangTai(false);
      }
    }

    taiSanPhamDaXoa();
  }, []);

  async function xuLyKhoiPhuc(sanPham: SanPham) {
    const xacNhan = window.confirm(
      `Bạn có muốn khôi phục sản phẩm "${sanPham.ten_san_pham}" không?`,
    );

    if (!xacNhan) {
      return;
    }

    try {
      setMaDangXuLy(sanPham.ma_san_pham);
      setLoi("");

      await khoiPhucSanPham(sanPham.ma_san_pham);

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
          : "Không thể khôi phục sản phẩm.",
      );
    } finally {
      setMaDangXuLy(null);
    }
  }

  async function xuLyXoaVinhVien(sanPham: SanPham) {
    const xacNhan = window.confirm(
      `Sản phẩm "${sanPham.ten_san_pham}" sẽ bị xóa vĩnh viễn và không thể khôi phục. Bạn có chắc chắn không?`,
    );

    if (!xacNhan) {
      return;
    }

    try {
      setMaDangXuLy(sanPham.ma_san_pham);
      setLoi("");

      await xoaVinhVienSanPham(sanPham.ma_san_pham);

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
          : "Không thể xóa vĩnh viễn sản phẩm.",
      );
    } finally {
      setMaDangXuLy(null);
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
            Thùng rác sản phẩm
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Danh sách sản phẩm đã bị xóa mềm.
          </p>
        </div>

        <Link
          href="/admin/san-pham"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Quay lại sản phẩm
        </Link>
      </div>

      {loi && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {loi}
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h2 className="font-semibold text-slate-900">
            Sản phẩm đã xóa
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Có {danhSachSanPham.length} sản phẩm trong thùng rác.
          </p>
        </div>

        {dangTai ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Đang tải danh sách sản phẩm...
          </div>
        ) : danhSachSanPham.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Thùng rác đang trống.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
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

                  <th className="px-5 py-3 text-center font-medium">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {danhSachSanPham.map((sanPham) => {
                  const dangXuLy =
                    maDangXuLy === sanPham.ma_san_pham;

                  return (
                    <tr
                      key={sanPham.ma_san_pham}
                      className="text-slate-700 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-900">
                          {sanPham.ten_san_pham}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Mã: {sanPham.ma_san_pham}
                        </p>
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
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            disabled={dangXuLy}
                            onClick={() =>
                              xuLyKhoiPhuc(sanPham)
                            }
                            className="rounded-md border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {dangXuLy
                              ? "Đang xử lý..."
                              : "Khôi phục"}
                          </button>

                          <button
                            type="button"
                            disabled={dangXuLy}
                            onClick={() =>
                              xuLyXoaVinhVien(sanPham)
                            }
                            className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {dangXuLy
                              ? "Đang xử lý..."
                              : "Xóa vĩnh viễn"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}