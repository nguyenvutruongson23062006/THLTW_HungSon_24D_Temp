"use client";

import Link from "next/link";
import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { dangNhap, luuPhienDangNhap } from "@/lib/api/authApi";
import { apiRequest } from "@/lib/api/apiClient";

export default function DangNhapQuanTri() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [loi, setLoi] = useState("");
  const [dangGui, setDangGui] = useState(false);

  async function dangNhapQuanTri(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    setDangGui(true);
    setLoi("");
    try {
      const ketQua = await dangNhap(email.trim(), matKhau);
      if (
        ketQua.user.vai_tro !== "quan_tri_vien" ||
        ketQua.user.trang_thai !== "hoat_dong"
      ) {
        await apiRequest("/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${ketQua.token}` },
        }).catch(() => undefined);
        throw new Error(
          "Cần tài khoản quản trị viên đang hoạt động để truy cập.",
        );
      }
      luuPhienDangNhap(ketQua);
      router.replace("/admin");
    } catch (error) {
      setLoi(error instanceof Error ? error.message : "Không thể đăng nhập.");
    } finally {
      setDangGui(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-5">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <p className="text-sm font-bold text-sky-600">MotoShop · Quản trị</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Đăng nhập quản trị
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Quản lý cửa hàng bằng tài khoản quản trị viên.
        </p>
        {loi && (
          <p
            role="alert"
            className="mt-5 rounded-lg bg-rose-50 p-3 text-sm text-rose-700"
          >
            {loi}
          </p>
        )}
        <form onSubmit={dangNhapQuanTri} className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              required
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Mật khẩu
            <input
              required
              type="password"
              autoComplete="current-password"
              value={matKhau}
              onChange={(e) => setMatKhau(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            />
          </label>
          <button
            disabled={dangGui}
            className="w-full rounded-lg bg-sky-600 py-3 font-semibold text-white hover:bg-sky-700 disabled:opacity-50"
          >
            {dangGui ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
        <Link href="/" className="mt-5 block text-center text-sm text-sky-700">
          Về cửa hàng
        </Link>
      </section>
    </main>
  );
}
