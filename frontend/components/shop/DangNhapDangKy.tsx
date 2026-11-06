"use client";

import Link from "next/link";
import { useState, type SyntheticEvent } from "react";
import { useRouter } from "next/navigation";
import type { KetQuaDangNhap } from "@/types/admin";
import { guiShop, luuTaiKhoan } from "@/lib/shop/api";
import { khung, nut, oNhap, ThongBaoShop } from "./GiaoDien";

export default function DangNhapDangKy({
  dangKy = false,
  next = "/tai-khoan",
}: {
  dangKy?: boolean;
  next?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    ho_ten: "",
    ten_dang_nhap: "",
    dia_chi_email: "",
    so_dien_thoai: "",
    mat_khau: "",
    mat_khau_confirmation: "",
  });
  const [loi, setLoi] = useState("");
  const [gui, setGui] = useState(false);
  const dich = /^\/(?:order|tai-khoan|don-hang)(?:[/?]|$)/.test(next)
    ? next
    : "/tai-khoan";
  async function luu(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (gui) return;
    setGui(true);
    setLoi("");
    try {
      const data = await guiShop<KetQuaDangNhap>(
        dangKy ? "/register" : "/login",
        dangKy
          ? form
          : {
              dia_chi_email: form.dia_chi_email.trim(),
              mat_khau: form.mat_khau,
            },
      );
      luuTaiKhoan(data);
      router.replace(dich);
    } catch (error) {
      setLoi(error instanceof Error ? error.message : "Không thể đăng nhập.");
    } finally {
      setGui(false);
    }
  }
  const truong = [
    ...(dangKy
      ? [
          { ten: "ho_ten", nhan: "Họ tên", type: "text", auto: "name" },
          {
            ten: "ten_dang_nhap",
            nhan: "Tên đăng nhập",
            type: "text",
            auto: "username",
          },
          {
            ten: "so_dien_thoai",
            nhan: "Số điện thoại (không bắt buộc)",
            type: "tel",
            auto: "tel",
          },
        ]
      : []),
    { ten: "dia_chi_email", nhan: "Email", type: "email", auto: "email" },
    {
      ten: "mat_khau",
      nhan: "Mật khẩu",
      type: "password",
      auto: dangKy ? "new-password" : "current-password",
    },
    ...(dangKy
      ? [
          {
            ten: "mat_khau_confirmation",
            nhan: "Nhập lại mật khẩu",
            type: "password",
            auto: "new-password",
          },
        ]
      : []),
  ];
  return (
    <main className="mx-auto w-full max-w-lg px-5 py-12 text-white">
      <section className={khung}>
        <p className="text-sm text-blue-400">MOTOCYCLELEGEND</p>
        <h1 className="mt-2 text-3xl font-bold">
          {dangKy ? "Đăng ký thành viên" : "Đăng nhập"}
        </h1>
        <p className="my-5 text-sm text-slate-400">
          Mua sắm và theo dõi đơn hàng của bạn.
        </p>
        <ThongBaoShop loi={loi} />
        <form onSubmit={luu} className="mt-5 space-y-4">
          {truong.map((f) => (
            <label key={f.ten} className="block text-sm">
              {f.nhan}
              <input
                required={f.ten !== "so_dien_thoai"}
                type={f.type}
                autoComplete={f.auto}
                maxLength={f.ten === "so_dien_thoai" ? 20 : 255}
                minLength={f.type === "password" && dangKy ? 6 : undefined}
                className={oNhap}
                value={form[f.ten as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f.ten]: e.target.value })}
              />
            </label>
          ))}
          <button disabled={gui} className={nut + " w-full"}>
            {gui ? "Đang xử lý..." : dangKy ? "Đăng ký" : "Đăng nhập"}
          </button>
        </form>
        <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm text-blue-400">
          <Link
            href={`${dangKy ? "/login" : "/dang-ky"}?next=${encodeURIComponent(dich)}`}
          >
            {dangKy
              ? "Đã có tài khoản? Đăng nhập"
              : "Chưa có tài khoản? Đăng ký"}
          </Link>
          {!dangKy && <Link href="/quen-mat-khau">Quên mật khẩu?</Link>}
        </div>
        <Link
          href="/admin/dang-nhap"
          className="mt-6 block text-xs text-slate-400"
        >
          Đăng nhập khu vực quản trị
        </Link>
      </section>
    </main>
  );
}
