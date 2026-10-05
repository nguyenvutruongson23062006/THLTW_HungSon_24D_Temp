"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import type { DanhMuc, DanhMucInput } from "@/types/admin";
import {
  capNhatDanhMuc,
  layDanhSachDanhMuc,
  themDanhMuc,
  xoaDanhMuc,
} from "@/lib/api/danhMucApi";

type BieuMauDanhMuc = {
  ten_danh_muc: string;
  ma_danh_muc_cha: string;
  mo_ta: string;
  trang_thai: "hoat_dong" | "tam_ngung";
};

const bieuMauRong: BieuMauDanhMuc = {
  ten_danh_muc: "",
  ma_danh_muc_cha: "",
  mo_ta: "",
  trang_thai: "hoat_dong",
};

function taoDuongDan(tenDanhMuc: string) {
  return tenDanhMuc
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function QuanLyDanhMuc() {
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState<DanhMuc[]>([]);
  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThaiLoc, setTrangThaiLoc] = useState("tat_ca");
  const [dangMoForm, setDangMoForm] = useState(false);
  const [danhMucDangSua, setDanhMucDangSua] = useState<DanhMuc | null>(
    null,
  );
  const [bieuMau, setBieuMau] =
    useState<BieuMauDanhMuc>(bieuMauRong);
  const [dangTai, setDangTai] = useState(true);
  const [dangLuu, setDangLuu] = useState(false);
  const [loi, setLoi] = useState("");

  useEffect(() => {
    async function taiDanhSachDanhMuc() {
      try {
        const duLieu = await layDanhSachDanhMuc();
        setDanhSachDanhMuc(duLieu);
      } catch (loiApi) {
        setLoi(
          loiApi instanceof Error
            ? loiApi.message
            : "Không thể tải danh mục",
        );
      } finally {
        setDangTai(false);
      }
    }

    taiDanhSachDanhMuc();
  }, []);

  const danhMucHienThi = danhSachDanhMuc.filter((danhMuc) => {
    const khopTuKhoa = `${danhMuc.ten_danh_muc} ${danhMuc.duong_dan}`
      .toLowerCase()
      .includes(tuKhoa.toLowerCase());

    const khopTrangThai =
      trangThaiLoc === "tat_ca" ||
      danhMuc.trang_thai === trangThaiLoc;

    return khopTuKhoa && khopTrangThai;
  });

  function capNhatTruong(
    truong: keyof BieuMauDanhMuc,
    giaTri: string,
  ) {
    setBieuMau((bieuMauCu) => ({
      ...bieuMauCu,
      [truong]: giaTri,
    }));
  }

  function moFormThem() {
    setDanhMucDangSua(null);
    setBieuMau({ ...bieuMauRong });
    setLoi("");
    setDangMoForm(true);
  }

  function moFormSua(danhMuc: DanhMuc) {
    setDanhMucDangSua(danhMuc);
    setBieuMau({
      ten_danh_muc: danhMuc.ten_danh_muc,
      ma_danh_muc_cha: danhMuc.ma_danh_muc_cha
        ? String(danhMuc.ma_danh_muc_cha)
        : "",
      mo_ta: danhMuc.mo_ta ?? "",
      trang_thai: danhMuc.trang_thai,
    });
    setLoi("");
    setDangMoForm(true);
  }

  async function xuLyLuu(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setDangLuu(true);
    setLoi("");

    const duLieu: DanhMucInput = {
      ten_danh_muc: bieuMau.ten_danh_muc,
      duong_dan: taoDuongDan(bieuMau.ten_danh_muc),
      ma_danh_muc_cha: bieuMau.ma_danh_muc_cha
        ? Number(bieuMau.ma_danh_muc_cha)
        : null,
      mo_ta: bieuMau.mo_ta || undefined,
      trang_thai: bieuMau.trang_thai,
    };

    try {
      if (danhMucDangSua) {
        const danhMucDaSua = await capNhatDanhMuc(
          danhMucDangSua.ma_danh_muc,
          duLieu,
        );

        setDanhSachDanhMuc((danhSachCu) =>
          danhSachCu.map((danhMuc) =>
            danhMuc.ma_danh_muc === danhMucDangSua.ma_danh_muc
              ? danhMucDaSua
              : danhMuc,
          ),
        );
      } else {
        const danhMucMoi = await themDanhMuc(duLieu);
        setDanhSachDanhMuc((danhSachCu) => [
          danhMucMoi,
          ...danhSachCu,
        ]);
      }

      setDangMoForm(false);
      setBieuMau({ ...bieuMauRong });
      setDanhMucDangSua(null);
    } catch (loiApi) {
      setLoi(
        loiApi instanceof Error
          ? loiApi.message
          : "Không thể lưu danh mục",
      );
    } finally {
      setDangLuu(false);
    }
  }

  async function xuLyXoa(danhMuc: DanhMuc) {
    const xacNhan = window.confirm(
      `Bạn có chắc muốn xóa danh mục ${danhMuc.ten_danh_muc}?`,
    );

    if (!xacNhan) {
      return;
    }

    try {
      await xoaDanhMuc(danhMuc.ma_danh_muc);

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
          : "Không thể xóa danh mục",
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-sky-600">Quản trị</p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Quản lý danh mục
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Phân loại các dòng xe trong cửa hàng.
          </p>
        </div>

        <button
          type="button"
          onClick={moFormThem}
          className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
        >
          + Thêm danh mục
        </button>
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
              Danh sách danh mục
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Có {danhMucHienThi.length} danh mục phù hợp.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={tuKhoa}
              onChange={(event) => setTuKhoa(event.target.value)}
              placeholder="Tìm danh mục..."
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
            Đang tải danh mục...
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">
                    Tên danh mục
                  </th>
                  <th className="px-5 py-3 font-medium">
                    Đường dẫn
                  </th>
                  <th className="px-5 py-3 font-medium">
                    Danh mục cha
                  </th>
                  <th className="px-5 py-3 font-medium">
                    Số sản phẩm
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
                {danhMucHienThi.map((danhMuc) => (
                  <tr
                    key={danhMuc.ma_danh_muc}
                    className="text-slate-700"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">
                        {danhMuc.ten_danh_muc}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Mã: {danhMuc.ma_danh_muc}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      /{danhMuc.duong_dan}
                    </td>

                    <td className="px-5 py-4">
                      {danhMuc.ma_danh_muc_cha
                        ? danhSachDanhMuc.find(
                            (danhMucCha) =>
                              danhMucCha.ma_danh_muc ===
                              danhMuc.ma_danh_muc_cha,
                          )?.ten_danh_muc ?? "Không xác định"
                        : "Danh mục gốc"}
                    </td>

                    <td className="px-5 py-4">
                      {danhMuc.so_luong_san_pham ?? 0}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          danhMuc.trang_thai === "hoat_dong"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {danhMuc.trang_thai === "hoat_dong"
                          ? "Hoạt động"
                          : "Tạm ngưng"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => moFormSua(danhMuc)}
                          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Sửa
                        </button>

                        <button
                          type="button"
                          onClick={() => xuLyXoa(danhMuc)}
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

            {danhMucHienThi.length === 0 && (
              <p className="p-8 text-center text-sm text-slate-500">
                Không tìm thấy danh mục phù hợp.
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
                {danhMucDangSua
                  ? "Sửa danh mục"
                  : "Thêm danh mục"}
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
                  Tên danh mục
                </span>

                <input
                  required
                  value={bieuMau.ten_danh_muc}
                  onChange={(event) =>
                    capNhatTruong(
                      "ten_danh_muc",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Danh mục cha
                </span>

                <select
                  value={bieuMau.ma_danh_muc_cha}
                  onChange={(event) =>
                    capNhatTruong(
                      "ma_danh_muc_cha",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
                >
                  <option value="">
                    Không có, danh mục gốc
                  </option>

                  {danhSachDanhMuc
                    .filter(
                      (danhMuc) =>
                        danhMuc.ma_danh_muc !==
                        danhMucDangSua?.ma_danh_muc,
                    )
                    .map((danhMuc) => (
                      <option
                        key={danhMuc.ma_danh_muc}
                        value={danhMuc.ma_danh_muc}
                      >
                        {danhMuc.ten_danh_muc}
                      </option>
                    ))}
                </select>
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
                    capNhatTruong(
                      "mo_ta",
                      event.target.value,
                    )
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
                  {dangLuu ? "Đang lưu..." : "Lưu danh mục"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}