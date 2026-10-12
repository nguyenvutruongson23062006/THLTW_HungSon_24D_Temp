"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { ThuongHieu } from "@/types/admin";
import {
  khoiPhucThuongHieu,
  layDanhSachThuongHieuDaXoa,
  xoaVinhVienThuongHieu,
} from "@/lib/api/thuongHieuApi";

function LogoThuongHieu({
  duongDan,
  tenThuongHieu,
}: {
  duongDan?: string | null;
  tenThuongHieu: string;
}) {
  const [biLoi, setBiLoi] = useState(false);

  if (!duongDan || biLoi) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-400">
        Không có logo
      </div>
    );
  }

  return (
    <Image
      src={duongDan}
      alt={tenThuongHieu}
      width={48}
      height={48}
      unoptimized
      onError={() => setBiLoi(true)}
      className="h-12 w-12 rounded-lg border border-slate-200 object-contain p-1"
    />
  );
}

export default function ThungRacThuongHieu() {
  const [danhSachThuongHieu, setDanhSachThuongHieu] = useState<
    ThuongHieu[]
  >([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");
  const [maDangXuLy, setMaDangXuLy] = useState<number | null>(null);

  useEffect(() => {
    async function taiThuongHieuDaXoa() {
      try {
        setDangTai(true);
        setLoi("");

        const duLieu = await layDanhSachThuongHieuDaXoa();

        setDanhSachThuongHieu(duLieu);
      } catch (loiApi) {
        setLoi(
          loiApi instanceof Error
            ? loiApi.message
            : "Không thể tải thương hiệu đã xóa.",
        );
      } finally {
        setDangTai(false);
      }
    }

    taiThuongHieuDaXoa();
  }, []);

  async function xuLyKhoiPhuc(thuongHieu: ThuongHieu) {
    const xacNhan = window.confirm(
      `Bạn có muốn khôi phục thương hiệu "${thuongHieu.ten_thuong_hieu}" không?`,
    );

    if (!xacNhan) {
      return;
    }

    try {
      setMaDangXuLy(thuongHieu.ma_thuong_hieu);
      setLoi("");

      await khoiPhucThuongHieu(thuongHieu.ma_thuong_hieu);

      setDanhSachThuongHieu((danhSachCu) =>
        danhSachCu.filter(
          (thuongHieuCu) =>
            thuongHieuCu.ma_thuong_hieu !==
            thuongHieu.ma_thuong_hieu,
        ),
      );
    } catch (loiApi) {
      setLoi(
        loiApi instanceof Error
          ? loiApi.message
          : "Không thể khôi phục thương hiệu.",
      );
    } finally {
      setMaDangXuLy(null);
    }
  }

  async function xuLyXoaVinhVien(thuongHieu: ThuongHieu) {
    const xacNhan = window.confirm(
      `Thương hiệu "${thuongHieu.ten_thuong_hieu}" sẽ bị xóa vĩnh viễn và không thể khôi phục. Bạn có chắc chắn không?`,
    );

    if (!xacNhan) {
      return;
    }

    try {
      setMaDangXuLy(thuongHieu.ma_thuong_hieu);
      setLoi("");

      await xoaVinhVienThuongHieu(thuongHieu.ma_thuong_hieu);

      setDanhSachThuongHieu((danhSachCu) =>
        danhSachCu.filter(
          (thuongHieuCu) =>
            thuongHieuCu.ma_thuong_hieu !==
            thuongHieu.ma_thuong_hieu,
        ),
      );
    } catch (loiApi) {
      setLoi(
        loiApi instanceof Error
          ? loiApi.message
          : "Không thể xóa vĩnh viễn thương hiệu.",
      );
    } finally {
      setMaDangXuLy(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-sky-600">Quản trị</p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Thùng rác thương hiệu
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Danh sách thương hiệu đã bị xóa mềm.
          </p>
        </div>

        <Link
          href="/admin/thuong-hieu"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Quay lại thương hiệu
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
            Thương hiệu đã xóa
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Có {danhSachThuongHieu.length} thương hiệu trong thùng rác.
          </p>
        </div>

        {dangTai ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Đang tải danh sách thương hiệu...
          </div>
        ) : danhSachThuongHieu.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Thùng rác đang trống.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Thương hiệu</th>
                  <th className="px-5 py-3 font-medium">Đường dẫn</th>
                  <th className="px-5 py-3 font-medium">Mã thương hiệu</th>
                  <th className="px-5 py-3 text-center font-medium">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {danhSachThuongHieu.map((thuongHieu) => {
                  const dangXuLy =
                    maDangXuLy === thuongHieu.ma_thuong_hieu;

                  return (
                    <tr
                      key={thuongHieu.ma_thuong_hieu}
                      className="text-slate-700 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <LogoThuongHieu
                            duongDan={thuongHieu.logo}
                            tenThuongHieu={thuongHieu.ten_thuong_hieu}
                          />

                          <span className="font-medium text-slate-900">
                            {thuongHieu.ten_thuong_hieu}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        /{thuongHieu.duong_dan}
                      </td>

                      <td className="px-5 py-4">
                        {thuongHieu.ma_thuong_hieu}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            disabled={dangXuLy}
                            onClick={() => xuLyKhoiPhuc(thuongHieu)}
                            className="rounded-md border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {dangXuLy ? "Đang xử lý..." : "Khôi phục"}
                          </button>

                          <button
                            type="button"
                            disabled={dangXuLy}
                            onClick={() => xuLyXoaVinhVien(thuongHieu)}
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
