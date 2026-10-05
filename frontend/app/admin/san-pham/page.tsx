"use client";

import { SyntheticEvent, useEffect, useState } from "react";
import type {
  DanhMuc,
  SanPham,
  SanPhamInput,
  ThuongHieu,
} from "@/types/admin";
import { layDanhSachDanhMuc } from "@/lib/api/danhMucApi";
import {
  capNhatSanPham,
  layDanhSachSanPham,
  themSanPham,
  xoaSanPham,
} from "@/lib/api/sanPhamApi";
import { layDanhSachThuongHieu } from "@/lib/api/thuongHieuApi";

type BieuMauSanPham = {
  ten_san_pham: string;
  ma_danh_muc: string;
  ma_thuong_hieu: string;
  gia_ban: string;
  so_luong_ton: string;
  trang_thai: "hoat_dong" | "tam_ngung";
};

const bieuMauRong: BieuMauSanPham = {
  ten_san_pham: "",
  ma_danh_muc: "",
  ma_thuong_hieu: "",
  gia_ban: "",
  so_luong_ton: "0",
  trang_thai: "hoat_dong",
};

function taoDuongDan(tenSanPham: string) {
  return tenSanPham
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function dinhDangTien(gia: number | string) {
  return `${Number(gia).toLocaleString("vi-VN")}đ`;
}

export default function QuanLySanPham() {
  const [danhSachSanPham, setDanhSachSanPham] = useState<SanPham[]>([]);
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState<DanhMuc[]>([]);
  const [danhSachThuongHieu, setDanhSachThuongHieu] = useState<
    ThuongHieu[]
  >([]);

  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThaiLoc, setTrangThaiLoc] = useState("tat_ca");
  const [dangMoForm, setDangMoForm] = useState(false);
  const [sanPhamDangSua, setSanPhamDangSua] =
    useState<SanPham | null>(null);
  const [bieuMau, setBieuMau] =
    useState<BieuMauSanPham>(bieuMauRong);
  const [dangTai, setDangTai] = useState(true);
  const [dangLuu, setDangLuu] = useState(false);
  const [loi, setLoi] = useState("");

  useEffect(() => {
    async function taiDuLieu() {
      try {
        const [sanPhams, danhMucs, thuongHieus] =
          await Promise.all([
            layDanhSachSanPham(),
            layDanhSachDanhMuc(),
            layDanhSachThuongHieu(),
          ]);

        setDanhSachSanPham(sanPhams);
        setDanhSachDanhMuc(danhMucs);
        setDanhSachThuongHieu(thuongHieus);
      } catch (loiApi) {
        setLoi(
          loiApi instanceof Error
            ? loiApi.message
            : "Không thể tải dữ liệu",
        );
      } finally {
        setDangTai(false);
      }
    }

    taiDuLieu();
  }, []);

  const sanPhamHienThi = danhSachSanPham.filter((sanPham) => {
    const khopTuKhoa = sanPham.ten_san_pham
      .toLowerCase()
      .includes(tuKhoa.toLowerCase());

    const khopTrangThai =
      trangThaiLoc === "tat_ca" ||
      sanPham.trang_thai === trangThaiLoc;

    return khopTuKhoa && khopTrangThai;
  });

  function capNhatTruong(
    truong: keyof BieuMauSanPham,
    giaTri: string,
  ) {
    setBieuMau((bieuMauCu) => ({
      ...bieuMauCu,
      [truong]: giaTri,
    }));
  }

  function moFormThem() {
    setSanPhamDangSua(null);
    setBieuMau({ ...bieuMauRong });
    setLoi("");
    setDangMoForm(true);
  }

  function moFormSua(sanPham: SanPham) {
    setSanPhamDangSua(sanPham);
    setBieuMau({
      ten_san_pham: sanPham.ten_san_pham,
      ma_danh_muc: String(sanPham.ma_danh_muc),
      ma_thuong_hieu: String(sanPham.ma_thuong_hieu),
      gia_ban: String(sanPham.gia_ban),
      so_luong_ton: String(sanPham.so_luong_ton),
      trang_thai: sanPham.trang_thai,
    });
    setLoi("");
    setDangMoForm(true);
  }

  async function xuLyLuu(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setDangLuu(true);
    setLoi("");

    const duLieu: SanPhamInput = {
      ten_san_pham: bieuMau.ten_san_pham,
      ma_danh_muc: Number(bieuMau.ma_danh_muc),
      ma_thuong_hieu: Number(bieuMau.ma_thuong_hieu),
      duong_dan: taoDuongDan(bieuMau.ten_san_pham),
      gia_ban: Number(bieuMau.gia_ban),
      so_luong_ton: Number(bieuMau.so_luong_ton),
      trang_thai: bieuMau.trang_thai,
    };

    try {
      if (sanPhamDangSua) {
        const sanPhamDaSua = await capNhatSanPham(
          sanPhamDangSua.ma_san_pham,
          duLieu,
        );

        setDanhSachSanPham((danhSachCu) =>
          danhSachCu.map((sanPham) =>
            sanPham.ma_san_pham === sanPhamDangSua?.ma_san_pham
              ? sanPhamDaSua
              : sanPham,
          ),
        );
      } else {
        const sanPhamMoi = await themSanPham(duLieu);

        setDanhSachSanPham((danhSachCu) => [
          sanPhamMoi,
          ...danhSachCu,
        ]);
      }

      setDangMoForm(false);
      setBieuMau({ ...bieuMauRong });
      setSanPhamDangSua(null);
    } catch (loiApi) {
      setLoi(
        loiApi instanceof Error
          ? loiApi.message
          : "Không thể lưu sản phẩm",
      );
    } finally {
      setDangLuu(false);
    }
  }

  async function xuLyXoa(sanPham: SanPham) {
    const xacNhan = window.confirm(
      `Bạn có chắc muốn xóa ${sanPham.ten_san_pham}?`,
    );

    if (!xacNhan) {
      return;
    }

    try {
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
          : "Không thể xóa sản phẩm",
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-sky-600">Quản trị</p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Quản lý sản phẩm
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Quản lý sản phẩm trong cửa hàng.
          </p>
        </div>

        <button
          type="button"
          onClick={moFormThem}
          className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {loi && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {loi}
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Danh sách sản phẩm
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Có {sanPhamHienThi.length} sản phẩm phù hợp.
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
            Đang tải sản phẩm...
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-left text-sm">
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
                    Tồn kho
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
                {sanPhamHienThi.map((sanPham) => (
                  <tr
                    key={sanPham.ma_san_pham}
                    className="text-slate-700"
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
                        danhSachDanhMuc.find(
                          (danhMuc) =>
                            danhMuc.ma_danh_muc ===
                            sanPham.ma_danh_muc,
                        )?.ten_danh_muc ??
                        "Không xác định"}
                    </td>

                    <td className="px-5 py-4">
                      {sanPham.thuong_hieu?.ten_thuong_hieu ??
                        danhSachThuongHieu.find(
                          (thuongHieu) =>
                            thuongHieu.ma_thuong_hieu ===
                            sanPham.ma_thuong_hieu,
                        )?.ten_thuong_hieu ??
                        "Không xác định"}
                    </td>

                    <td className="px-5 py-4 font-medium">
                      {dinhDangTien(sanPham.gia_ban)}
                    </td>

                    <td className="px-5 py-4">
                      {sanPham.so_luong_ton}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          sanPham.trang_thai === "hoat_dong"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-700"
                        }`}
                      >
                        {sanPham.trang_thai === "hoat_dong"
                          ? "Hoạt động"
                          : "Tạm ngưng"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => moFormSua(sanPham)}
                          className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Sửa
                        </button>

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
                ))}
              </tbody>
            </table>

            {sanPhamHienThi.length === 0 && (
              <p className="p-8 text-center text-sm text-slate-500">
                Không tìm thấy sản phẩm phù hợp.
              </p>
            )}
          </div>
        )}
      </section>

      {dangMoForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4">
          <div className="mx-auto max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-900">
                {sanPhamDangSua
                  ? "Sửa sản phẩm"
                  : "Thêm sản phẩm"}
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
              className="grid gap-4 p-6 sm:grid-cols-2"
            >
              <label className="sm:col-span-2">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Tên sản phẩm
                </span>

                <input
                  required
                  value={bieuMau.ten_san_pham}
                  onChange={(event) =>
                    capNhatTruong(
                      "ten_san_pham",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
                />
              </label>

              <label>
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Danh mục
                </span>

                <select
                  required
                  value={bieuMau.ma_danh_muc}
                  onChange={(event) =>
                    capNhatTruong(
                      "ma_danh_muc",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
                >
                  <option value="">Chọn danh mục</option>

                  {danhSachDanhMuc.map((danhMuc) => (
                    <option
                      key={danhMuc.ma_danh_muc}
                      value={danhMuc.ma_danh_muc}
                    >
                      {danhMuc.ten_danh_muc}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Thương hiệu
                </span>

                <select
                  required
                  value={bieuMau.ma_thuong_hieu}
                  onChange={(event) =>
                    capNhatTruong(
                      "ma_thuong_hieu",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
                >
                  <option value="">Chọn thương hiệu</option>

                  {danhSachThuongHieu.map((thuongHieu) => (
                    <option
                      key={thuongHieu.ma_thuong_hieu}
                      value={thuongHieu.ma_thuong_hieu}
                    >
                      {thuongHieu.ten_thuong_hieu}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Giá bán
                </span>

                <input
                  required
                  min="0"
                  type="number"
                  value={bieuMau.gia_ban}
                  onChange={(event) =>
                    capNhatTruong(
                      "gia_ban",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
                />
              </label>

              <label>
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Số lượng tồn
                </span>

                <input
                  required
                  min="0"
                  type="number"
                  value={bieuMau.so_luong_ton}
                  onChange={(event) =>
                    capNhatTruong(
                      "so_luong_ton",
                      event.target.value,
                    )
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
                />
              </label>

              <label>
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

              <div className="flex justify-end gap-3 sm:col-span-2">
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
                  {dangLuu ? "Đang lưu..." : "Lưu sản phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}