"use client";

import Link from "next/link";
import { useState, type SyntheticEvent } from "react";
import type { NguoiDung } from "@/types/admin";
import { useTaiKhoan } from "@/lib/shop/useTaiKhoan";
import { dangXuatShop, guiShop } from "@/lib/shop/api";
import {
  khung,
  nut,
  nutPhu,
  oNhap,
  ThongBaoShop,
} from "@/components/shop/GiaoDien";

function HoSo({ user }: { user: NguoiDung }) {
  const [form, setForm] = useState({
    ho_ten: user.ho_ten,
    so_dien_thoai: user.so_dien_thoai ?? "",
    dia_chi: user.dia_chi ?? "",
  });
  const [mk, setMk] = useState({
    mat_khau_cu: "",
    mat_khau_moi: "",
    mat_khau_moi_confirmation: "",
  });
  const [loi, setLoi] = useState("");
  const [bao, setBao] = useState("");
  const [gui, setGui] = useState(false);
  async function luu(e: SyntheticEvent<HTMLFormElement>, doiMatKhau = false) {
    e.preventDefault();
    if (gui) return;
    setGui(true);
    setLoi("");
    setBao("");
    try {
      const r = await guiShop<{ message: string; user?: NguoiDung }>(
        doiMatKhau ? "/change-password" : "/profile",
        doiMatKhau ? mk : form,
        doiMatKhau ? "POST" : "PUT",
      );
      if (r.user) {
        localStorage.setItem("shop_user", JSON.stringify(r.user));
        window.dispatchEvent(new Event("shop-auth"));
      }
      if (doiMatKhau)
        setMk({
          mat_khau_cu: "",
          mat_khau_moi: "",
          mat_khau_moi_confirmation: "",
        });
      setBao(r.message);
    } catch (error) {
      setLoi(error instanceof Error ? error.message : "Không thể cập nhật.");
    } finally {
      setGui(false);
    }
  }
  return (
    <>
      <ThongBaoShop loi={loi} bao={bao} />
      <div className="grid gap-6 md:grid-cols-2">
        <form onSubmit={(e) => luu(e)} className={khung + " space-y-4"}>
          <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
          <p className="text-sm text-slate-400">{user.dia_chi_email}</p>
          <label className="block text-sm">
            Họ tên
            <input
              required
              maxLength={255}
              autoComplete="name"
              className={oNhap}
              value={form.ho_ten}
              onChange={(e) => setForm({ ...form, ho_ten: e.target.value })}
            />
          </label>
          <label className="block text-sm">
            Số điện thoại
            <input
              maxLength={20}
              autoComplete="tel"
              className={oNhap}
              value={form.so_dien_thoai}
              onChange={(e) =>
                setForm({ ...form, so_dien_thoai: e.target.value })
              }
            />
          </label>
          <label className="block text-sm">
            Địa chỉ
            <textarea
              maxLength={2000}
              autoComplete="street-address"
              className={oNhap}
              value={form.dia_chi}
              onChange={(e) => setForm({ ...form, dia_chi: e.target.value })}
            />
          </label>
          <button disabled={gui} className={nut}>
            Lưu thông tin
          </button>
        </form>
        <form onSubmit={(e) => luu(e, true)} className={khung + " space-y-4"}>
          <h2 className="text-xl font-semibold">Đổi mật khẩu</h2>
          {(
            [
              { ten: "mat_khau_cu", nhan: "Mật khẩu hiện tại" },
              { ten: "mat_khau_moi", nhan: "Mật khẩu mới" },
              {
                ten: "mat_khau_moi_confirmation",
                nhan: "Nhập lại mật khẩu mới",
              },
            ] as const
          ).map((f) => (
            <label key={f.ten} className="block text-sm">
              {f.nhan}
              <input
                required
                type="password"
                minLength={f.ten === "mat_khau_cu" ? undefined : 6}
                maxLength={255}
                autoComplete={
                  f.ten === "mat_khau_cu" ? "current-password" : "new-password"
                }
                className={oNhap}
                value={mk[f.ten]}
                onChange={(e) => setMk({ ...mk, [f.ten]: e.target.value })}
              />
            </label>
          ))}
          <button disabled={gui} className={nut}>
            Đổi mật khẩu
          </button>
        </form>
      </div>
    </>
  );
}

export default function TaiKhoan() {
  const { user, tai, loi } = useTaiKhoan(true);
  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-5 py-10 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Tài khoản của tôi</h1>
        <div className="flex gap-3">
          <Link className={nutPhu} href="/don-hang">
            Đơn hàng của tôi
          </Link>
          <button
            className={nutPhu}
            onClick={() => {
              void dangXuatShop().catch(() => undefined);
            }}
          >
            Đăng xuất
          </button>
        </div>
      </div>
      <ThongBaoShop loi={loi} />
      {tai ? <p>Đang tải tài khoản...</p> : user && <HoSo user={user} />}
    </main>
  );
}
