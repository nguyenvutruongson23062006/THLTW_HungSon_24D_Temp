"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import type {
  DanhMuc,
  SanPham,
  ThuongHieu,
} from "@/types/admin";

import { layDanhSachDanhMuc } from "@/lib/api/danhMucApi";
import {
  capNhatSanPham,
  laySanPham,
  themSanPham,
} from "@/lib/api/sanPhamApi";
import { layDanhSachThuongHieu } from "@/lib/api/thuongHieuApi";

type CheDoBieuMau = "them" | "sua";

type BieuMauSanPhamState = {
  ten_san_pham: string;
  ma_danh_muc: string;
  ma_thuong_hieu: string;
  gia_ban: string;
  gia_khuyen_mai: string;
  so_luong_ton: string;
  dung_tich_dong_co: string;
  nam_san_xuat: string;
  mau_sac: string;
  anh_dai_dien: string;
  anh_files: File[];
  mo_ta: string;
  trang_thai: "hoat_dong" | "tam_ngung";
};

type BieuMauSanPhamProps = {
  cheDo: CheDoBieuMau;
  maSanPham?: number;
};

const bieuMauRong: BieuMauSanPhamState = {
  ten_san_pham: "",
  ma_danh_muc: "",
  ma_thuong_hieu: "",
  gia_ban: "",
  gia_khuyen_mai: "",
  so_luong_ton: "0",
  dung_tich_dong_co: "",
  nam_san_xuat: "",
  mau_sac: "",
  anh_dai_dien: "",
  anh_files: [],
  mo_ta: "",
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

function chuyenThanhChuoi(giaTri: number | string | null | undefined) {
  if (giaTri === null || giaTri === undefined) {
    return "";
  }

  return String(giaTri);
}

export default function BieuMauSanPham({
  cheDo,
  maSanPham,
}: BieuMauSanPhamProps) {
  const router = useRouter();

  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState<DanhMuc[]>([]);
  const [danhSachThuongHieu, setDanhSachThuongHieu] = useState<
    ThuongHieu[]
  >([]);

  const [bieuMau, setBieuMau] =
    useState<BieuMauSanPhamState>(bieuMauRong);

  const [dangTai, setDangTai] = useState(true);
  const [dangLuu, setDangLuu] = useState(false);
  const [loi, setLoi] = useState("");

  const laCheDoSua = cheDo === "sua";

  useEffect(() => {
    async function taiDuLieu() {
      setDangTai(true);
      setLoi("");

      try {
        const [danhMucs, thuongHieus, sanPham] = await Promise.all([
          layDanhSachDanhMuc(),
          layDanhSachThuongHieu(),
          laCheDoSua && maSanPham
            ? laySanPham(maSanPham)
            : Promise.resolve<SanPham | null>(null),
        ]);

        setDanhSachDanhMuc(danhMucs);
        setDanhSachThuongHieu(thuongHieus);

        if (sanPham) {
          setBieuMau({
            ten_san_pham: sanPham.ten_san_pham,
            ma_danh_muc: String(sanPham.ma_danh_muc),
            ma_thuong_hieu: String(sanPham.ma_thuong_hieu),
            gia_ban: chuyenThanhChuoi(sanPham.gia_ban),
            gia_khuyen_mai: chuyenThanhChuoi(
              sanPham.gia_khuyen_mai,
            ),
            so_luong_ton: chuyenThanhChuoi(sanPham.so_luong_ton),
            dung_tich_dong_co: chuyenThanhChuoi(
              sanPham.dung_tich_dong_co,
            ),
            nam_san_xuat: chuyenThanhChuoi(
              sanPham.nam_san_xuat,
            ),
            mau_sac: sanPham.mau_sac ?? "",
            anh_dai_dien: sanPham.anh_dai_dien ?? "",
            anh_files: [],
            mo_ta: sanPham.mo_ta ?? "",
            trang_thai: sanPham.trang_thai,
          });
        }
      } catch (loiApi) {
        setLoi(
          loiApi instanceof Error
            ? loiApi.message
            : "Không thể tải dữ liệu sản phẩm.",
        );
      } finally {
        setDangTai(false);
      }
    }

    taiDuLieu();
  }, [laCheDoSua, maSanPham]);

  function capNhatTruong(
    truong: keyof BieuMauSanPhamState,
    giaTri: string,
  ) {
    setBieuMau((bieuMauCu) => ({
      ...bieuMauCu,
      [truong]: giaTri,
    }));
  }

  function capNhatAnhFiles(files: File[]) {
    setBieuMau((bieuMauCu) => ({
      ...bieuMauCu,
      anh_files: files,
    }));
  }

  function taoDuLieuGuiDi(): FormData {
    const duLieu = new FormData();

    duLieu.append(
      "ten_san_pham",
      bieuMau.ten_san_pham.trim(),
    );
    duLieu.append("ma_danh_muc", bieuMau.ma_danh_muc);
    duLieu.append(
      "ma_thuong_hieu",
      bieuMau.ma_thuong_hieu,
    );
    duLieu.append(
      "duong_dan",
      taoDuongDan(bieuMau.ten_san_pham),
    );
    duLieu.append("gia_ban", bieuMau.gia_ban);
    duLieu.append(
      "so_luong_ton",
      bieuMau.so_luong_ton,
    );
    duLieu.append("trang_thai", bieuMau.trang_thai);

    if (bieuMau.gia_khuyen_mai.trim()) {
      duLieu.append(
        "gia_khuyen_mai",
        bieuMau.gia_khuyen_mai,
      );
    }

    if (bieuMau.dung_tich_dong_co.trim()) {
      duLieu.append(
        "dung_tich_dong_co",
        bieuMau.dung_tich_dong_co,
      );
    }

    if (bieuMau.nam_san_xuat.trim()) {
      duLieu.append(
        "nam_san_xuat",
        bieuMau.nam_san_xuat,
      );
    }

    if (bieuMau.mau_sac.trim()) {
      duLieu.append("mau_sac", bieuMau.mau_sac.trim());
    }

    if (bieuMau.mo_ta.trim()) {
      duLieu.append("mo_ta", bieuMau.mo_ta.trim());
    }

    bieuMau.anh_files.forEach((file) => {
      duLieu.append("hinh_anh[]", file);
    });

    if (bieuMau.anh_files.length > 0) {
      duLieu.append("anh_dai_dien", "");
    }

    if (laCheDoSua) {
      duLieu.append("_method", "PUT");
    }

    return duLieu;
  }

  async function xuLyLuu(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoi("");

    const giaBan = Number(bieuMau.gia_ban);
    const giaKhuyenMai = bieuMau.gia_khuyen_mai.trim()
      ? Number(bieuMau.gia_khuyen_mai)
      : null;

    if (giaKhuyenMai !== null && giaKhuyenMai > giaBan) {
      setLoi("Giá khuyến mãi không được lớn hơn giá bán.");
      return;
    }

    if (laCheDoSua && !maSanPham) {
      setLoi("Không xác định được mã sản phẩm cần sửa.");
      return;
    }

    setDangLuu(true);

    try {
      const duLieu = taoDuLieuGuiDi();

      if (laCheDoSua && maSanPham) {
        await capNhatSanPham(maSanPham, duLieu);
      } else {
        await themSanPham(duLieu);
      }

      router.push("/admin/san-pham");
    } catch (loiApi) {
      setLoi(
        loiApi instanceof Error
          ? loiApi.message
          : "Không thể lưu sản phẩm.",
      );
    } finally {
      setDangLuu(false);
    }
  }

  if (dangTai) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        Đang tải dữ liệu sản phẩm...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-medium text-sky-600">
          Quản trị sản phẩm
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-900">
          {laCheDoSua ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          {laCheDoSua
            ? "Cập nhật thông tin sản phẩm trong cửa hàng."
            : "Thêm sản phẩm mới vào cửa hàng."}
        </p>
      </div>

      {loi && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {loi}
        </div>
      )}

      <form
        onSubmit={xuLyLuu}
        className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <label className="md:col-span-2">
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
              placeholder="Ví dụ: Honda SH Mode 125i 2025"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
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
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
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
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
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
              placeholder="54900000"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Giá khuyến mãi
            </span>

            <input
              min="0"
              type="number"
              value={bieuMau.gia_khuyen_mai}
              onChange={(event) =>
                capNhatTruong(
                  "gia_khuyen_mai",
                  event.target.value,
                )
              }
              placeholder="52900000"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
            />

            <span className="mt-1 block text-xs text-slate-400">
              Để trống nếu sản phẩm không giảm giá.
            </span>
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
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Dung tích động cơ
            </span>

            <input
              min="0"
              type="number"
              value={bieuMau.dung_tich_dong_co}
              onChange={(event) =>
                capNhatTruong(
                  "dung_tich_dong_co",
                  event.target.value,
                )
              }
              placeholder="125"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
            />

            <span className="mt-1 block text-xs text-slate-400">
              Có thể để trống với phụ kiện hoặc dầu nhớt.
            </span>
          </label>

          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Năm sản xuất
            </span>

            <input
              min="1900"
              max="2100"
              type="number"
              value={bieuMau.nam_san_xuat}
              onChange={(event) =>
                capNhatTruong(
                  "nam_san_xuat",
                  event.target.value,
                )
              }
              placeholder="2025"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
            />
          </label>

          <label>
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Màu sắc
            </span>

            <input
              value={bieuMau.mau_sac}
              onChange={(event) =>
                capNhatTruong("mau_sac", event.target.value)
              }
              placeholder="Đỏ đô"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
            />
          </label>

          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Ảnh đại diện
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={(event) =>
                capNhatAnhFiles(
                  Array.from(event.target.files ?? []),
                )
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none file:mr-4 file:rounded-md file:border-0 file:bg-sky-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-sky-700 hover:file:bg-sky-100"
            />

            {bieuMau.anh_files.length > 0 && (
              <div className="mt-2 space-y-1 text-xs text-emerald-600">
                <p>
                  Đã chọn {bieuMau.anh_files.length} ảnh:
                </p>

                {bieuMau.anh_files.map((file) => (
                  <p key={`${file.name}-${file.lastModified}`}>
                    - {file.name}
                  </p>
                ))}
              </div>
            )}

            {bieuMau.anh_files.length === 0 &&
              bieuMau.anh_dai_dien && (
              <p className="mt-2 text-xs text-slate-500">
                Ảnh hiện tại được giữ lại nếu bạn không chọn ảnh mới.
              </p>
              )}

            <span className="mt-1 block text-xs text-slate-400">
              Chỉ nhận ảnh JPG, PNG hoặc WEBP, tối đa 2MB.
            </span>
          </label>

          <label className="md:col-span-2">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Mô tả
            </span>

            <textarea
              rows={5}
              value={bieuMau.mo_ta}
              onChange={(event) =>
                capNhatTruong("mo_ta", event.target.value)
              }
              placeholder="Nhập mô tả sản phẩm..."
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
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
                  event.target.value as
                    | "hoat_dong"
                    | "tam_ngung",
                )
              }
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500"
            >
              <option value="hoat_dong">Hoạt động</option>
              <option value="tam_ngung">Tạm ngưng</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
          <Link
            href="/admin/san-pham"
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Hủy
          </Link>

          <button
            type="submit"
            disabled={dangLuu}
            className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {dangLuu
              ? "Đang lưu..."
              : laCheDoSua
                ? "Cập nhật sản phẩm"
                : "Thêm sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
}
