"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import type { NguoiDung } from "@/types/admin";
import { layDanhSachNguoiDung } from "@/lib/api/nguoiDungApi";

function layNhanDien(hoTen: string) {
  return hoTen
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((tu) => tu.charAt(0).toUpperCase())
    .join("");
}

function layNhanVaiTro(vaiTro: string) {
  const cacVaiTro: Record<string, string> = {
    thanh_vien: "Khách hàng",
    nhan_vien: "Nhân viên",
    quan_tri_vien: "Quản trị viên",
  };

  return cacVaiTro[vaiTro] ?? vaiTro;
}

function layMauVaiTro(vaiTro: string) {
  if (vaiTro === "quan_tri_vien") {
    return "bg-violet-100 text-violet-700";
  }

  if (vaiTro === "nhan_vien") {
    return "bg-amber-100 text-amber-700";
  }

  return "bg-sky-100 text-sky-700";
}

function layNhanTrangThai(trangThai: string) {
  const cacTrangThai: Record<string, string> = {
    hoat_dong: "Hoạt động",
    tam_ngung: "Tạm ngưng",
    khoa: "Đã khóa",
  };

  return cacTrangThai[trangThai] ?? trangThai;
}

function layMauTrangThai(trangThai: string) {
  return trangThai === "hoat_dong"
    ? "bg-emerald-100 text-emerald-700"
    : "bg-rose-100 text-rose-700";
}

function dinhDangNgay(ngay: string | null) {
  if (!ngay) {
    return "-";
  }

  const giaTriNgay = new Date(ngay);

  if (Number.isNaN(giaTriNgay.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(giaTriNgay);
}

function AnhDaiDienNguoiDung({
  nguoiDung,
}: {
  nguoiDung: NguoiDung;
}) {
  const [biLoi, setBiLoi] = useState(false);
  const coAnhHopLe =
    Boolean(nguoiDung.anh_dai_dien) &&
    (nguoiDung.anh_dai_dien?.startsWith("http") ||
      nguoiDung.anh_dai_dien?.startsWith("/"));

  if (!coAnhHopLe || biLoi) {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
        {layNhanDien(nguoiDung.ho_ten)}
      </div>
    );
  }

  return (
    <Image
      src={nguoiDung.anh_dai_dien as string}
      alt={nguoiDung.ho_ten}
      width={44}
      height={44}
      unoptimized
      onError={() => setBiLoi(true)}
      className="h-11 w-11 rounded-full border border-slate-200 object-cover"
    />
  );
}

export default function QuanLyNguoiDung() {
  const [danhSachNguoiDung, setDanhSachNguoiDung] = useState<
    NguoiDung[]
  >([]);
  const [tuKhoa, setTuKhoa] = useState("");
  const [vaiTroLoc, setVaiTroLoc] = useState("thanh_vien");
  const [trangThaiLoc, setTrangThaiLoc] = useState("tat_ca");
  const [dangTai, setDangTai] = useState(true);
  const [dangTaiLai, setDangTaiLai] = useState(false);
  const [loi, setLoi] = useState("");
  const [nguoiDungDangXem, setNguoiDungDangXem] =
    useState<NguoiDung | null>(null);

  async function taiDanhSachNguoiDung(laTaiLai = false) {
    try {
      if (laTaiLai) {
        setDangTaiLai(true);
      } else {
        setDangTai(true);
      }

      setLoi("");

      const duLieu = await layDanhSachNguoiDung();

      setDanhSachNguoiDung(duLieu);
    } catch (loiApi) {
      setLoi(
        loiApi instanceof Error
          ? loiApi.message
          : "Không thể tải danh sách khách hàng.",
      );
    } finally {
      setDangTai(false);
      setDangTaiLai(false);
    }
  }

  useEffect(() => {
    let daHuy = false;

    layDanhSachNguoiDung()
      .then((duLieu) => {
        if (daHuy) {
          return;
        }

        setDanhSachNguoiDung(duLieu);
      })
      .catch((loiApi) => {
        if (daHuy) {
          return;
        }

        setLoi(
          loiApi instanceof Error
            ? loiApi.message
            : "Không thể tải danh sách khách hàng.",
        );
      })
      .finally(() => {
        if (!daHuy) {
          setDangTai(false);
        }
      });

    return () => {
      daHuy = true;
    };
  }, []);

  const danhSachHienThi = danhSachNguoiDung.filter((nguoiDung) => {
    const noiDungTimKiem = [
      nguoiDung.ho_ten,
      nguoiDung.ten_dang_nhap,
      nguoiDung.dia_chi_email,
      nguoiDung.so_dien_thoai ?? "",
    ]
      .join(" ")
      .toLowerCase();

    const khopTuKhoa = noiDungTimKiem.includes(
      tuKhoa.trim().toLowerCase(),
    );

    const khopVaiTro =
      vaiTroLoc === "tat_ca" || nguoiDung.vai_tro === vaiTroLoc;

    const khopTrangThai =
      trangThaiLoc === "tat_ca" ||
      nguoiDung.trang_thai === trangThaiLoc;

    return khopTuKhoa && khopVaiTro && khopTrangThai;
  });

  const soNguoiHoatDong = danhSachNguoiDung.filter(
    (nguoiDung) => nguoiDung.trang_thai === "hoat_dong",
  ).length;

  const soKhachHang = danhSachNguoiDung.filter(
    (nguoiDung) => nguoiDung.vai_tro === "thanh_vien",
  ).length;

  const soNguoiBiKhoa = danhSachNguoiDung.filter(
    (nguoiDung) => nguoiDung.trang_thai !== "hoat_dong",
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-sky-600">Quản trị</p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Quản lý khách hàng
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Theo dõi thông tin và trạng thái tài khoản trong cửa hàng.
          </p>
        </div>

        <button
          type="button"
          onClick={() => taiDanhSachNguoiDung(true)}
          disabled={dangTaiLai}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {dangTaiLai ? "Đang tải..." : "Tải lại danh sách"}
        </button>
      </div>

      {loi && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <p>{loi}</p>

          {loi.includes("đăng nhập") && (
            <p className="mt-1 text-xs text-rose-600">
              Hãy đăng nhập bằng tài khoản quản trị và lưu token ở
              localStorage với khóa auth_token hoặc token.
            </p>
          )}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Tổng tài khoản</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">
            {danhSachNguoiDung.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Khách hàng</p>
          <p className="mt-2 text-3xl font-bold text-sky-600">
            {soKhachHang}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Đang hoạt động</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {soNguoiHoatDong}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Không hoạt động</p>
          <p className="mt-2 text-3xl font-bold text-rose-600">
            {soNguoiBiKhoa}
          </p>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Danh sách khách hàng
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Có {danhSachHienThi.length} tài khoản phù hợp.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={tuKhoa}
              onChange={(event) => setTuKhoa(event.target.value)}
              placeholder="Tìm tên, email, số điện thoại..."
              className="min-w-64 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
            />

            <select
              value={vaiTroLoc}
              onChange={(event) => setVaiTroLoc(event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
            >
              <option value="thanh_vien">Khách hàng</option>
              <option value="tat_ca">Tất cả vai trò</option>
              <option value="nhan_vien">Nhân viên</option>
              <option value="quan_tri_vien">Quản trị viên</option>
            </select>

            <select
              value={trangThaiLoc}
              onChange={(event) => setTrangThaiLoc(event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-sky-500"
            >
              <option value="tat_ca">Tất cả trạng thái</option>
              <option value="hoat_dong">Hoạt động</option>
              <option value="tam_ngung">Tạm ngưng</option>
              <option value="khoa">Đã khóa</option>
            </select>
          </div>
        </div>

        {dangTai ? (
          <div className="p-8 text-center text-sm text-slate-500">
            Đang tải danh sách khách hàng...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Khách hàng</th>
                  <th className="px-5 py-3 font-medium">Liên hệ</th>
                  <th className="px-5 py-3 font-medium">Địa chỉ</th>
                  <th className="px-5 py-3 font-medium">Vai trò</th>
                  <th className="px-5 py-3 font-medium">Trạng thái</th>
                  <th className="px-5 py-3 font-medium">Ngày tham gia</th>
                  <th className="px-5 py-3 text-center font-medium">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {danhSachHienThi.map((nguoiDung) => (
                  <tr
                    key={nguoiDung.ma_nguoi_dung}
                    className="text-slate-700 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <AnhDaiDienNguoiDung nguoiDung={nguoiDung} />

                        <div>
                          <p className="font-medium text-slate-900">
                            {nguoiDung.ho_ten}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            @{nguoiDung.ten_dang_nhap} · Mã: {nguoiDung.ma_nguoi_dung}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-slate-700">
                        {nguoiDung.dia_chi_email}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {nguoiDung.so_dien_thoai ?? "Chưa có số điện thoại"}
                      </p>
                    </td>

                    <td className="max-w-xs px-5 py-4 text-slate-500">
                      <span className="line-clamp-2">
                        {nguoiDung.dia_chi ?? "Chưa cập nhật địa chỉ"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${layMauVaiTro(nguoiDung.vai_tro)}`}
                      >
                        {layNhanVaiTro(nguoiDung.vai_tro)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${layMauTrangThai(nguoiDung.trang_thai)}`}
                      >
                        {layNhanTrangThai(nguoiDung.trang_thai)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {dinhDangNgay(nguoiDung.ngay_tao)}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => setNguoiDungDangXem(nguoiDung)}
                        className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {danhSachHienThi.length === 0 && !loi && (
              <div className="p-8 text-center text-sm text-slate-500">
                Không tìm thấy khách hàng phù hợp.
              </div>
            )}
          </div>
        )}
      </section>

      {nguoiDungDangXem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 p-4">
          <div className="mx-auto max-w-xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="font-semibold text-slate-900">
                Chi tiết tài khoản
              </h2>

              <button
                type="button"
                onClick={() => setNguoiDungDangXem(null)}
                className="text-2xl leading-none text-slate-400 hover:text-slate-700"
                aria-label="Đóng chi tiết tài khoản"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 p-6 text-sm">
              <div className="flex items-center gap-3">
                <AnhDaiDienNguoiDung nguoiDung={nguoiDungDangXem} />
                <div>
                  <p className="font-semibold text-slate-900">
                    {nguoiDungDangXem.ho_ten}
                  </p>
                  <p className="text-slate-500">
                    @{nguoiDungDangXem.ten_dang_nhap}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="mt-1 text-slate-700">
                    {nguoiDungDangXem.dia_chi_email}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Số điện thoại</p>
                  <p className="mt-1 text-slate-700">
                    {nguoiDungDangXem.so_dien_thoai ?? "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Vai trò</p>
                  <p className="mt-1 text-slate-700">
                    {layNhanVaiTro(nguoiDungDangXem.vai_tro)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Trạng thái</p>
                  <p className="mt-1 text-slate-700">
                    {layNhanTrangThai(nguoiDungDangXem.trang_thai)}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs text-slate-400">Địa chỉ</p>
                  <p className="mt-1 text-slate-700">
                    {nguoiDungDangXem.dia_chi ?? "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Ngày tạo</p>
                  <p className="mt-1 text-slate-700">
                    {dinhDangNgay(nguoiDungDangXem.ngay_tao)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Cập nhật gần nhất</p>
                  <p className="mt-1 text-slate-700">
                    {dinhDangNgay(nguoiDungDangXem.ngay_cap_nhat)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
