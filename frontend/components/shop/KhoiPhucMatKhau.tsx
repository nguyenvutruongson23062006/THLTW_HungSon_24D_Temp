"use client";

import Link from "next/link";
import { useState, type SyntheticEvent } from "react";
import { guiShop } from "@/lib/shop/api";
import { khung, nut, oNhap, ThongBaoShop } from "./GiaoDien";

export default function KhoiPhucMatKhau({
  datLai = false,
  email = "",
  token = "",
}: {
  datLai?: boolean;
  email?: string;
  token?: string;
}) {
  const [form, setForm] = useState({
    dia_chi_email: email,
    mat_khau: "",
    mat_khau_confirmation: "",
  });
  const [loi, setLoi] = useState("");
  const [bao, setBao] = useState("");
  const [gui, setGui] = useState(false);
  async function luu(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (gui) return;
    setGui(true);
    setLoi("");
    setBao("");
    try {
      const r = await guiShop<{ message: string }>(
        datLai ? "/dat-lai-mat-khau" : "/quen-mat-khau",
        datLai ? { ...form, token } : { dia_chi_email: form.dia_chi_email },
      );
      setBao(r.message);
      setForm({ ...form, mat_khau: "", mat_khau_confirmation: "" });
    } catch (error) {
      setLoi(
        error instanceof Error ? error.message : "Không thể xử lý yêu cầu.",
      );
    } finally {
      setGui(false);
    }
  }
  return (
    <main className="mx-auto w-full max-w-lg px-5 py-12 text-white">
      <section className={khung}>
        <h1 className="mb-5 text-2xl font-bold">
          {datLai ? "Đặt lại mật khẩu" : "Quên mật khẩu"}
        </h1>
        <ThongBaoShop loi={loi} bao={bao} />
        {datLai && (!token || !email) ? (
          <p className="text-rose-300">
            Liên kết không đầy đủ. Hãy mở liên kết trong email hoặc yêu cầu liên
            kết mới.
          </p>
        ) : (
          <form className="mt-5 space-y-4" onSubmit={luu}>
            <label className="block text-sm">
              Email
              <input
                required
                type="email"
                autoComplete="email"
                className={oNhap}
                value={form.dia_chi_email}
                readOnly={datLai}
                onChange={(e) =>
                  setForm({ ...form, dia_chi_email: e.target.value })
                }
              />
            </label>
            {datLai && (
              <>
                <label className="block text-sm">
                  Mật khẩu mới
                  <input
                    required
                    type="password"
                    minLength={6}
                    maxLength={255}
                    autoComplete="new-password"
                    className={oNhap}
                    value={form.mat_khau}
                    onChange={(e) =>
                      setForm({ ...form, mat_khau: e.target.value })
                    }
                  />
                </label>
                <label className="block text-sm">
                  Nhập lại mật khẩu
                  <input
                    required
                    type="password"
                    minLength={6}
                    autoComplete="new-password"
                    className={oNhap}
                    value={form.mat_khau_confirmation}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        mat_khau_confirmation: e.target.value,
                      })
                    }
                  />
                </label>
              </>
            )}
            <button disabled={gui || !!bao} className={nut}>
              {gui
                ? "Đang gửi..."
                : datLai
                  ? "Đặt lại mật khẩu"
                  : "Gửi hướng dẫn"}
            </button>
          </form>
        )}
        <div className="mt-5 flex gap-5 text-sm text-blue-400">
          <Link href="/login">Về đăng nhập</Link>
          {datLai && <Link href="/quen-mat-khau">Yêu cầu liên kết mới</Link>}
        </div>
      </section>
    </main>
  );
}
