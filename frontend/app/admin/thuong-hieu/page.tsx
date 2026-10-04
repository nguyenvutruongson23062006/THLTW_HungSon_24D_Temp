"use client";

import { FormEvent, useState } from "react";

type NhanHangMau = {
  ma_thuong_hieu: number;
  ten_thuong_hieu: string;
  duong_dan: string;
  logo: string;
  mo_ta: string;
  trang_thai: "hoat_dong" | "tam_ngung";
  so_luong_san_pham: number;
};

type BieuMauNhanHang = {
  ten_thuong_hieu: string;
  logo: string;
  mo_ta: string;
  trang_thai: "hoat_dong" | "tam_ngung";
};

const danhSachNhanHangMau: NhanHangMau[] = [
  {
    ma_thuong_hieu: 1,
    ten_thuong_hieu: "Honda",
    duong_dan: "honda",
    logo: "/images/brands/honda.png",
    mo_ta: "Nhãn hàng xe máy phổ biến tại Việt Nam.",
    trang_thai: "hoat_dong",
    so_luong_san_pham: 18,
  },
  {
    ma_thuong_hieu: 2,
    ten_thuong_hieu: "Yamaha",
    duong_dan: "yamaha",
    logo: "/images/brands/yamaha.png",
    mo_ta: "Nhãn hàng xe máy phong cách thể thao.",
    trang_thai: "hoat_dong",
    so_luong_san_pham: 15,
  },
  {
    ma_thuong_hieu: 3,
    ten_thuong_hieu: "Suzuki",
    duong_dan: "suzuki",
    logo: "/images/brands/suzuki.png",
    mo_ta: "Nhãn hàng xe máy bền bỉ và tiết kiệm.",
    trang_thai: "hoat_dong",
    so_luong_san_pham: 7,
  },
  {
    ma_thuong_hieu: 4,
    ten_thuong_hieu: "Piaggio",
    duong_dan: "piaggio",
    logo: "/images/brands/piaggio.png",
    mo_ta: "Nhãn hàng xe tay ga phong cách châu Âu.",
    trang_thai: "tam_ngung",
    so_luong_san_pham: 4,
  },
];

const bieuMauRong: BieuMauNhanHang = {
  ten_thuong_hieu: "",
  logo: "",
  mo_ta: "",
  trang_thai: "hoat_dong",
};

function taoDuongDan(tenNhanHang: string) {
  return tenNhanHang
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function QuanLyNhanHang() {
  const [danhSachNhanHang, setDanhSachNhanHang] = useState(
    danhSachNhanHangMau,
  );
  const [tuKhoa, setTuKhoa] = useState("");
  const [trangThaiLoc, setTrangThaiLoc] = useState("tat_ca");
  const [dangMoForm, setDangMoForm] = useState(false);
  const [nhanHangDangSua, setNhanHangDangSua] = useState<NhanHangMau | null>(
    null,
  );
  const [bieuMau, setBieuMau] = useState<BieuMauNhanHang>(bieuMauRong);

  const nhanHangHienThi = danhSachNhanHang.filter((nhanHang) => {
    const khopTuKhoa = `${nhanHang.ten_thuong_hieu} ${nhanHang.duong_dan}`
      .toLowerCase()
      .includes(tuKhoa.toLowerCase());
    const khopTrangThai =
      trangThaiLoc === "tat_ca" || nhanHang.trang_thai === trangThaiLoc;

    return khopTuKhoa && khopTrangThai;
  });

  function capNhatTruong(
    truong: keyof BieuMauNhanHang,
    giaTri: string,
  ) {
    setBieuMau((bieuMauCu) => ({
      ...bieuMauCu,
      [truong]: giaTri,
    }));
  }

  function moFormThem() {
    setNhanHangDangSua(null);
    setBieuMau(bieuMauRong);
    setDangMoForm(true);
  }

  function moFormSua(nhanHang: NhanHangMau) {
    setNhanHangDangSua(nhanHang);
    setBieuMau({
      ten_thuong_hieu: nhanHang.ten_thuong_hieu,
      logo: nhanHang.logo,
      mo_ta: nhanHang.mo_ta,
      trang_thai: nhanHang.trang_thai,
    });
    setDangMoForm(true);
  }

  function xuLyLuu(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nhanHangMoi: NhanHangMau = {
      ma_thuong_hieu:
        nhanHangDangSua?.ma_thuong_hieu ??
        Math.max(
          0,
          ...danhSachNhanHang.map((nhanHang) => nhanHang.ma_thuong_hieu),
        ) + 1,
      ten_thuong_hieu: bieuMau.ten_thuong_hieu,
      duong_dan: taoDuongDan(bieuMau.ten_thuong_hieu),
      logo: bieuMau.logo,
      mo_ta: bieuMau.mo_ta,
      trang_thai: bieuMau.trang_thai,
      so_luong_san_pham: nhanHangDangSua?.so_luong_san_pham ?? 0,
    };

    if (nhanHangDangSua) {
      setDanhSachNhanHang((danhSachCu) =>
        danhSachCu.map((nhanHang) =>
          nhanHang.ma_thuong_hieu === nhanHangMoi.ma_thuong_hieu
            ? nhanHangMoi
            : nhanHang,
        ),
      );
    } else {
      setDanhSachNhanHang((danhSachCu) => [nhanHangMoi, ...danhSachCu]);
    }

    setDangMoForm(false);
  }

  function xuLyXoa(nhanHang: NhanHangMau) {
    if (
      !window.confirm(
        `Bạn có chắc muốn xóa nhãn hàng ${nhanHang.ten_thuong_hieu}?`,
      )
    ) {
      return;
    }

    setDanhSachNhanHang((danhSachCu) =>
      danhSachCu.filter(
        (nhanHangCu) =>
          nhanHangCu.ma_thuong_hieu !== nhanHang.ma_thuong_hieu,
      ),
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-sky-600">Quản trị</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Quản lý nhãn hàng
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Quản lý các hãng xe đang kinh doanh.
          </p>
        </div>

        <button
          type="button"
          onClick={moFormThem}
          className="rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700"
        >
          + Thêm nhãn hàng
        </button>
      </div>

      <section className="rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Danh sách nhãn hàng
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Có {nhanHangHienThi.length} nhãn hàng phù hợp.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={tuKhoa}
              onChange={(event) => setTuKhoa(event.target.value)}
              placeholder="Tìm nhãn hàng..."
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

        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="bg-slate-50 text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Nhãn hàng</th>
                <th className="px-5 py-3 font-medium">Đường dẫn</th>
                <th className="px-5 py-3 font-medium">Mô tả</th>
                <th className="px-5 py-3 font-medium">Sản phẩm</th>
                <th className="px-5 py-3 font-medium">Trạng thái</th>
                <th className="px-5 py-3 font-medium">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {nhanHangHienThi.map((nhanHang) => (
                <tr key={nhanHang.ma_thuong_hieu} className="text-slate-700">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-xs font-bold text-slate-500">
                        {nhanHang.ten_thuong_hieu.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {nhanHang.ten_thuong_hieu}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Mã: {nhanHang.ma_thuong_hieu}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    /{nhanHang.duong_dan}
                  </td>
                  <td className="max-w-xs px-5 py-4 text-slate-500">
                    {nhanHang.mo_ta}
                  </td>
                  <td className="px-5 py-4">{nhanHang.so_luong_san_pham}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        nhanHang.trang_thai === "hoat_dong"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {nhanHang.trang_thai === "hoat_dong"
                        ? "Hoạt động"
                        : "Tạm ngưng"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => moFormSua(nhanHang)}
                        className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        onClick={() => xuLyXoa(nhanHang)}
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

          {nhanHangHienThi.length === 0 && (
            <p className="p-8 text-center text-sm text-slate-500">
              Không tìm thấy nhãn hàng phù hợp.
            </p>
          )}
        </div>
      </section>

      {dangMoForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4">
          <div className="mx-auto max-w-xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-900">
                {nhanHangDangSua ? "Sửa nhãn hàng" : "Thêm nhãn hàng"}
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

            <form onSubmit={xuLyLuu} className="space-y-4 p-6">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Tên nhãn hàng
                </span>
                <input
                  required
                  value={bieuMau.ten_thuong_hieu}
                  onChange={(event) =>
                    capNhatTruong("ten_thuong_hieu", event.target.value)
                  }
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Đường dẫn logo
                </span>
                <input
                  value={bieuMau.logo}
                  onChange={(event) =>
                    capNhatTruong("logo", event.target.value)
                  }
                  placeholder="/images/brands/honda.png"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
                />
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
                      event.target.value as BieuMauNhanHang["trang_thai"],
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
                  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                >
                  Lưu nhãn hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
