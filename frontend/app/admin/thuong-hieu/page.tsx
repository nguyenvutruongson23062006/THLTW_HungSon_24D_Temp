"use client";

import Image from "next/image";
import Link from "next/link";
import { SyntheticEvent, useEffect, useState } from "react";
import type { ThuongHieu } from "@/types/admin";
import {
  capNhatThuongHieu,
  layDanhSachThuongHieu,
  themThuongHieu,
  xoaThuongHieu,
} from "@/lib/api/thuongHieuApi";

type BieuMauThuongHieu = {
  ten_thuong_hieu: string;
  logo: string;
  logo_file: File | null;
  mo_ta: string;
  trang_thai: "hoat_dong" | "tam_ngung";
};

const bieuMauRong: BieuMauThuongHieu = {
  ten_thuong_hieu: "",
  logo: "",
  logo_file: null,
  mo_ta: "",
  trang_thai: "hoat_dong",
};

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

function taoDuongDan(tenThuongHieu: string) {
  return tenThuongHieu
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function QuanLyThuongHieu() {
  const [danhSachThuongHieu, setDanhSachThuongHieu] = useState<
    ThuongHieu[]
  >([]);
  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThaiLoc, setTrangThaiLoc] = useState("tat_ca");
  const [dangMoForm, setDangMoForm] = useState(false);
  const [thuongHieuDangSua, setThuongHieuDangSua] =
    useState<ThuongHieu | null>(null);
  const [bieuMau, setBieuMau] =
    useState<BieuMauThuongHieu>(bieuMauRong);
  const [dangTai, setDangTai] = useState(true);
  const [dangLuu, setDangLuu] = useState(false);
  const [loi, setLoi] = useState("");

  useEffect(() => {
    async function taiDanhSach() {
      try {
        const duLieu = await layDanhSachThuongHieu();
        setDanhSachThuongHieu(duLieu);
      } catch (loiApi) {
        setLoi(
          loiApi instanceof Error
            ? loiApi.message
            : "Không thể tải thương hiệu",
        );
      } finally {
        setDangTai(false);
      }
    }

    taiDanhSach();
  }, []);

  const thuongHieuHienThi = danhSachThuongHieu.filter((thuongHieu) => {
    const khopTuKhoa = `${thuongHieu.ten_thuong_hieu} ${thuongHieu.duong_dan}`
      .toLowerCase()
      .includes(tuKhoa.toLowerCase());

    const khopTrangThai =
      trangThaiLoc === "tat_ca" ||
      thuongHieu.trang_thai === trangThaiLoc;

    return khopTuKhoa && khopTrangThai;
  });

  function capNhatTruong(
    truong: Exclude<keyof BieuMauThuongHieu, "logo_file">,
    giaTri: string,
  ) {
    setBieuMau((bieuMauCu) => ({
      ...bieuMauCu,
      [truong]: giaTri,
    }));
  }

  function moFormThem() {
    setThuongHieuDangSua(null);
    setBieuMau({ ...bieuMauRong });
    setLoi("");
    setDangMoForm(true);
  }

  function moFormSua(thuongHieu: ThuongHieu) {
    setThuongHieuDangSua(thuongHieu);
    setBieuMau({
      ten_thuong_hieu: thuongHieu.ten_thuong_hieu,
      logo: thuongHieu.logo ?? "",
      logo_file: null,
      mo_ta: thuongHieu.mo_ta ?? "",
      trang_thai: thuongHieu.trang_thai,
    });
    setLoi("");
    setDangMoForm(true);
  }

  function taoDuLieuGuiDi(): FormData {
    const duLieu = new FormData();

    duLieu.append(
      "ten_thuong_hieu",
      bieuMau.ten_thuong_hieu.trim(),
    );
    duLieu.append(
      "duong_dan",
      taoDuongDan(bieuMau.ten_thuong_hieu),
    );
    duLieu.append("mo_ta", bieuMau.mo_ta.trim());
    duLieu.append("trang_thai", bieuMau.trang_thai);

    if (bieuMau.logo_file) {
      duLieu.append("logo", bieuMau.logo_file);
    }

    if (thuongHieuDangSua) {
      duLieu.append("_method", "PUT");
    }

    return duLieu;
  }

  async function xuLyLuu(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setDangLuu(true);
    setLoi("");

    const duLieu = taoDuLieuGuiDi();

    try {
      if (thuongHieuDangSua) {
        const thuongHieuDaSua = await capNhatThuongHieu(
          thuongHieuDangSua.ma_thuong_hieu,
          duLieu,
        );

        setDanhSachThuongHieu((danhSachCu) =>
          danhSachCu.map((thuongHieu) =>
            thuongHieu.ma_thuong_hieu ===
            thuongHieuDangSua.ma_thuong_hieu
              ? thuongHieuDaSua
              : thuongHieu,
          ),
        );
      } else {
        const thuongHieuMoi = await themThuongHieu(duLieu);

        setDanhSachThuongHieu((danhSachCu) => [
          thuongHieuMoi,
          ...danhSachCu,
        ]);
      }

      setDangMoForm(false);
      setBieuMau({ ...bieuMauRong });
      setThuongHieuDangSua(null);
    } catch (loiApi) {
      setLoi(
        loiApi instanceof Error
          ? loiApi.message
          : "Không thể lưu thương hiệu",
      );
    } finally {
      setDangLuu(false);
    }
  }

  async function xuLyXoa(thuongHieu: ThuongHieu) {
    const xacNhan = window.confirm(
      `Bạn có chắc muốn xóa thương hiệu ${thuongHieu.ten_thuong_hieu}?`,
    );

    if (!xacNhan) {
      return;
    }

    try {
      await xoaThuongHieu(thuongHieu.ma_thuong_hieu);

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
          : "Không thể xóa thương hiệu",
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-sky-600">Quản trị</p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Quản lý thương hiệu
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Quản lý các hãng xe đang kinh doanh.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/admin/thuong-hieu/thung-rac"
            className="rounded-lg bg-rose-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-rose-700"
          >
            Thùng rác
          </Link>

          <button
            type="button"
            onClick={moFormThem}
            className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
          >
            + Thêm thương hiệu
          </button>
        </div>
      </div>

      {loi && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {loi}
        </div>
      )}

      <section className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Danh sách thương hiệu
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Có {thuongHieuHienThi.length} thương hiệu phù hợp.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={tuKhoa}
              onChange={(event) => setTuKhoa(event.target.value)}
              placeholder="Tìm thương hiệu..."
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
            />

            <select
              value={trangThaiLoc}
              onChange={(event) => setTrangThaiLoc(event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
            >
              <option value="tat_ca">Tất cả trạng thái</option>
              <option value="hoat_dong">Hoạt động</option>
              <option value="tam_ngung">Tạm ngưng</option>
            </select>
          </div>
        </div>

        {dangTai ? (
          <p className="p-8 text-center text-sm text-slate-500">
            Đang tải thương hiệu...
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">
                    Thương hiệu
                  </th>
                  <th className="px-5 py-3 font-medium">
                    Đường dẫn
                  </th>
                <th className="px-5 py-3 font-medium">
                  Mô tả
                </th>
                <th className="px-5 py-3 font-medium">
                  Trạng thái
                </th>
                  <th className="px-5 py-3 font-medium">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {thuongHieuHienThi.map((thuongHieu) => (
                  <tr
                    key={thuongHieu.ma_thuong_hieu}
                    className="text-slate-700"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <LogoThuongHieu
                          duongDan={thuongHieu.logo}
                          tenThuongHieu={thuongHieu.ten_thuong_hieu}
                        />

                        <div>
                          <p className="font-medium text-slate-900">
                            {thuongHieu.ten_thuong_hieu}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            Mã: {thuongHieu.ma_thuong_hieu}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      /{thuongHieu.duong_dan}
                    </td>

                    <td className="max-w-xs px-5 py-4 text-slate-500">
                      {thuongHieu.mo_ta ?? "Chưa có mô tả"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          thuongHieu.trang_thai === "hoat_dong"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {thuongHieu.trang_thai === "hoat_dong"
                          ? "Hoạt động"
                          : "Tạm ngưng"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => moFormSua(thuongHieu)}
                          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Sửa
                        </button>

                        <button
                          type="button"
                          onClick={() => xuLyXoa(thuongHieu)}
                          className="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {thuongHieuHienThi.length === 0 && (
              <p className="p-8 text-center text-sm text-slate-500">
                Không tìm thấy thương hiệu phù hợp.
              </p>
            )}
          </div>
        )}
      </section>

      {dangMoForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4">
          <div className="mx-auto max-w-xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-900">
                {thuongHieuDangSua
                  ? "Sửa thương hiệu"
                  : "Thêm thương hiệu"}
              </h2>

              <button
                type="button"
                onClick={() => setDangMoForm(false)}
                className="text-2xl leading-none text-slate-400 hover:text-slate-700"
                aria-label="Đóng biểu mẫu"
              >
                ×
              </button>
            </div>

            <form
              onSubmit={xuLyLuu}
              className="space-y-4 p-6"
            >
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Tên thương hiệu
                </span>

                <input
                  required
                  value={bieuMau.ten_thuong_hieu}
                  onChange={(event) =>
                    capNhatTruong(
                      "ten_thuong_hieu",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Logo thương hiệu
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml"
                  onChange={(event) =>
                    setBieuMau((bieuMauCu) => ({
                      ...bieuMauCu,
                      logo_file: event.target.files?.[0] ?? null,
                    }))
                  }
                  className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-sky-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-sky-700"
                />

                {bieuMau.logo_file && (
                  <p className="mt-2 text-xs text-slate-500">
                    Đã chọn: {bieuMau.logo_file.name}
                  </p>
                )}

                {!bieuMau.logo_file && bieuMau.logo && (
                  <div className="mt-3 flex items-center gap-3">
                    <Image
                      src={bieuMau.logo}
                      alt="Logo thương hiệu hiện tại"
                      width={56}
                      height={56}
                      unoptimized
                      className="h-14 w-14 rounded-lg border border-slate-200 object-contain p-1"
                    />
                    <span className="text-xs text-slate-500">
                      Logo hiện tại
                    </span>
                  </div>
                )}
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Trạng thái
                </span>

                <select
                  value={bieuMau.trang_thai}
                  onChange={(event) =>
                    capNhatTruong(
                      "trang_thai",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
                >
                  <option value="hoat_dong">Hoạt động</option>
                  <option value="tam_ngung">Tạm ngưng</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Mô tả
                </span>

                <textarea
                  rows={4}
                  value={bieuMau.mo_ta}
                  onChange={(event) =>
                    capNhatTruong("mo_ta", event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
                />
              </label>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDangMoForm(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={dangLuu}
                  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
                >
                  {dangLuu ? "Đang lưu..." : "Lưu thương hiệu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
