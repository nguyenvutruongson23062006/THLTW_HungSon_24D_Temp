"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { DanhMuc } from "@/types/admin";
import {
  khoiPhucDanhMuc,
  layDanhSachDanhMucDaXoa,
  xoaVinhVienDanhMuc,
} from "@/lib/api/danhMucApi";

function AnhDaiDienDanhMuc({
  duongDan,
  tenDanhMuc,
}: {
  duongDan?: string | null;
  tenDanhMuc: string;
}) {
  const [biLoi, setBiLoi] = useState(false);

  if (!duongDan || biLoi) {
    return (
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-400">
        Không có ảnh
      </div>
    );
  }

  return (
    <Image
      src={duongDan}
      alt={tenDanhMuc}
      width={48}
      height={48}
      unoptimized
      onError={() => setBiLoi(true)}
      className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
    />
  );
}

export default function ThungRacDanhMuc() {
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState<DanhMuc[]>([]);
  const [dangTai, setDangTai] = useState(true);
  const [loi, setLoi] = useState("");
  const [maDangXuLy, setMaDangXuLy] = useState<number | null>(null);

  useEffect(() => {
    async function taiDanhMucDaXoa() {
      try {
        setDangTai(true);
        setLoi("");

        const duLieu = await layDanhSachDanhMucDaXoa();

        setDanhSachDanhMuc(duLieu);
      } catch (loiApi) {
        setLoi(
          loiApi instanceof Error
            ? loiApi.message
            : "Không thể tải danh mục đã xóa.",
        );
      } finally {
        setDangTai(false);
      }
    }

    taiDanhMucDaXoa();
  }, []);

  async function xuLyKhoiPhuc(danhMuc: DanhMuc) {
    const xacNhan = window.confirm(
      `Bạn có muốn khôi phục danh mục "${danhMuc.ten_danh_muc}" không?`,
    );

    if (!xacNhan) {
      return;
    }

    try {
      setMaDangXuLy(danhMuc.ma_danh_muc);
      setLoi("");

      await khoiPhucDanhMuc(danhMuc.ma_danh_muc);

      setDanhSachDanhMuc((danhSachCu) =>
        danhSachCu.filter(
          (danhMucCu) =>
            danhMucCu.ma_danh_muc !== danhMuc.ma_danh_muc,
        ),
      );
    } catch (loiApi) {
      setLoi(
        loiApi instanceof Error
          ? loiApi.message
          : "Không thể khôi phục danh mục.",
      );
    } finally {
      setMaDangXuLy(null);
    }
  }

  async function xuLyXoaVinhVien(danhMuc: DanhMuc) {
    const xacNhan = window.confirm(
      `Danh mục "${danhMuc.ten_danh_muc}" sẽ bị xóa vĩnh viễn và không thể khôi phục. Bạn có chắc chắn không?`,
    );

    if (!xacNhan) {
      return;
    }

    try {
      setMaDangXuLy(danhMuc.ma_danh_muc);
      setLoi("");

      await xoaVinhVienDanhMuc(danhMuc.ma_danh_muc);

      setDanhSachDanhMuc((danhSachCu) =>
        danhSachCu.filter(
          (danhMucCu) =>
            danhMucCu.ma_danh_muc !== danhMuc.ma_danh_muc,
        ),
      );
    } catch (loiApi) {
      setLoi(
        loiApi instanceof Error
          ? loiApi.message
          : "Không thể xóa vĩnh viễn danh mục.",
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
            Thùng rác danh mục
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Danh sách danh mục đã bị xóa mềm.
          </p>
        </div>

        <Link
          href="/admin/danh-muc"
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Quay lại danh mục
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
            Danh mục đã xóa
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Có {danhSachDanhMuc.length} danh mục trong thùng rác.
          </p>
        </div>

        {dangTai ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Đang tải danh sách danh mục...
          </div>
        ) : danhSachDanhMuc.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Thùng rác đang trống.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Danh mục</th>
                  <th className="px-5 py-3 font-medium">Đường dẫn</th>
                  <th className="px-5 py-3 font-medium">Mã danh mục</th>
                  <th className="px-5 py-3 text-center font-medium">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {danhSachDanhMuc.map((danhMuc) => {
                  const dangXuLy =
                    maDangXuLy === danhMuc.ma_danh_muc;

                  return (
                    <tr
                      key={danhMuc.ma_danh_muc}
                      className="text-slate-700 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <AnhDaiDienDanhMuc
                            duongDan={danhMuc.anh_dai_dien}
                            tenDanhMuc={danhMuc.ten_danh_muc}
                          />

                          <span className="font-medium text-slate-900">
                            {danhMuc.ten_danh_muc}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        /{danhMuc.duong_dan}
                      </td>

                      <td className="px-5 py-4">
                        {danhMuc.ma_danh_muc}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            type="button"
                            disabled={dangXuLy}
                            onClick={() => xuLyKhoiPhuc(danhMuc)}
                            className="rounded-md border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {dangXuLy ? "Đang xử lý..." : "Khôi phục"}
                          </button>

                          <button
                            type="button"
                            disabled={dangXuLy}
                            onClick={() => xuLyXoaVinhVien(danhMuc)}
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
