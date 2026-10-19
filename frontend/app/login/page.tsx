"use client";

import Link from "next/link";
import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";

import {
  dangNhap,
  luuPhienDangNhap,
} from "@/lib/api/authApi";

export default function DangNhapPage() {
  const router = useRouter();
  const [diaChiEmail, setDiaChiEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState("");

  async function xuLyDangNhap(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setLoi("");
    setDangGui(true);

    try {
      const ketQua = await dangNhap(diaChiEmail.trim(), matKhau);

      if (ketQua.user.vai_tro !== "quan_tri_vien") {
        setLoi(
          "Tài khoản này không có quyền quản trị viên để truy cập trang admin.",
        );
        return;
      }

      if (ketQua.user.trang_thai !== "hoat_dong") {
        setLoi("Tài khoản quản trị viên hiện không hoạt động.");
        return;
      }

      luuPhienDangNhap(ketQua);
      router.replace("/admin");
    } catch (loiApi) {
      setLoi(
        loiApi instanceof Error
          ? loiApi.message
          : "Không thể đăng nhập. Vui lòng thử lại.",
      );
    } finally {
      setDangGui(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center bg-slate-50 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <p className="text-sm font-medium text-sky-600">MotoShop</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Đăng nhập
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Đăng nhập để sử dụng khu vực quản trị cửa hàng.
          </p>
        </div>

        {loi && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {loi}
          </div>
        )}

        <form onSubmit={xuLyDangNhap} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Địa chỉ email
            </span>
            <input
              required
              type="email"
              value={diaChiEmail}
              onChange={(event) => setDiaChiEmail(event.target.value)}
              placeholder="admin@motohub.vn"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">
              Mật khẩu
            </span>
            <input
              required
              type="password"
              value={matKhau}
              onChange={(event) => setMatKhau(event.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>

          <button
            type="submit"
            disabled={dangGui}
            className="w-full rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {dangGui ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <Link
          href="/"
          className="mt-5 block text-center text-sm text-slate-500 hover:text-sky-600"
        >
          Quay về trang chủ
        </Link>
      </section>
    </main>
  );
}
