"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
import { apiRequest } from "@/lib/api/apiClient";
import { layThongTinNguoiDung } from "@/lib/api/authApi";
import type { NguoiDung } from "@/types/admin";

type CaiDat = {
  ten_cua_hang: string;
  dia_chi_email: string;
  so_dien_thoai: string;
  dia_chi: string;
  nguong_ton_kho: number;
};
const input =
  "mt-1 block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-500";
const button =
  "rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50";

export default function CaiDatQuanTri() {
  const [caiDat, setCaiDat] = useState<CaiDat | null>(null);
  const [user, setUser] = useState<NguoiDung | null>(null);
  const [loi, setLoi] = useState("");
  const [bao, setBao] = useState("");
  const [luu, setLuu] = useState("");
  const [matKhau, setMatKhau] = useState({
    mat_khau_cu: "",
    mat_khau_moi: "",
    mat_khau_moi_confirmation: "",
  });
  useEffect(() => {
    let huy = false;
    Promise.all([apiRequest<CaiDat>("/admin/cai-dat"), layThongTinNguoiDung()])
      .then(([c, u]) => {
        if (!huy) {
          setCaiDat(c);
          setUser(u.user);
        }
      })
      .catch((e) => {
        if (!huy)
          setLoi(e instanceof Error ? e.message : "Không thể tải cài đặt.");
      });
    return () => {
      huy = true;
    };
  }, []);

  async function xuLy(
    e: SyntheticEvent<HTMLFormElement>,
    loai: "cua-hang" | "ho-so" | "mat-khau",
  ) {
    e.preventDefault();
    if (luu) return;
    setLuu(loai);
    setLoi("");
    setBao("");
    try {
      if (loai === "cua-hang") {
        await apiRequest("/admin/cai-dat", {
          method: "PUT",
          body: JSON.stringify(caiDat),
        });
        window.dispatchEvent(new Event("cap-nhat-cai-dat"));
      } else if (loai === "ho-so" && user) {
        await apiRequest("/profile", {
          method: "PUT",
          body: JSON.stringify({
            ho_ten: user.ho_ten,
            so_dien_thoai: user.so_dien_thoai,
            dia_chi: user.dia_chi,
          }),
        });
        localStorage.setItem("nguoi_dung", JSON.stringify(user));
        window.dispatchEvent(new Event("cap-nhat-nguoi-dung"));
      } else {
        await apiRequest("/change-password", {
          method: "POST",
          body: JSON.stringify(matKhau),
        });
        setMatKhau({
          mat_khau_cu: "",
          mat_khau_moi: "",
          mat_khau_moi_confirmation: "",
        });
      }
      setBao("Đã lưu thay đổi thành công.");
    } catch (error) {
      setLoi(error instanceof Error ? error.message : "Không thể lưu cài đặt.");
    } finally {
      setLuu("");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-sky-600">Quản trị</p>
        <h1 className="mt-1 text-3xl font-bold">Cài đặt</h1>
        <p className="mt-2 text-sm text-slate-500">
          Thông tin cửa hàng, hồ sơ quản trị và mật khẩu.
        </p>
      </div>
      {loi && (
        <p
          role="alert"
          className="rounded-lg bg-rose-50 p-4 text-sm text-rose-700"
        >
          {loi}
        </p>
      )}
      {bao && (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          {bao}
        </p>
      )}
      {!caiDat || !user ? (
        !loi && (
          <p className="p-8 text-center text-slate-500">Đang tải cài đặt...</p>
        )
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          <form
            onSubmit={(e) => xuLy(e, "cua-hang")}
            className="space-y-4 rounded-xl border border-slate-200 bg-white p-6"
          >
            <h2 className="font-semibold">Thông tin cửa hàng</h2>
            {(
              [
                {
                  ten: "ten_cua_hang",
                  nhan: "Tên cửa hàng",
                  type: "text",
                  required: true,
                },
                { ten: "dia_chi_email", nhan: "Email liên hệ", type: "email" },
                { ten: "so_dien_thoai", nhan: "Số điện thoại", type: "text" },
                { ten: "dia_chi", nhan: "Địa chỉ", type: "text" },
              ] as const
            ).map((f) => (
              <label key={f.ten} className="block text-sm">
                {f.nhan}
                <input
                  required={f.ten === "ten_cua_hang"}
                  type={f.type}
                  className={input}
                  value={caiDat[f.ten]}
                  onChange={(e) =>
                    setCaiDat({ ...caiDat, [f.ten]: e.target.value })
                  }
                />
              </label>
            ))}
            <label className="block text-sm">
              Ngưỡng cảnh báo tồn kho
              <input
                required
                type="number"
                min={0}
                max={1000000}
                className={input}
                value={caiDat.nguong_ton_kho}
                onChange={(e) =>
                  setCaiDat({
                    ...caiDat,
                    nguong_ton_kho: Number(e.target.value),
                  })
                }
              />
            </label>
            <p className="text-xs text-slate-500">
              Dashboard và báo cáo cảnh báo khi số lượng tồn nhỏ hơn hoặc bằng
              ngưỡng này.
            </p>
            <button className={button} disabled={Boolean(luu)}>
              {luu === "cua-hang" ? "Đang lưu..." : "Lưu cài đặt"}
            </button>
          </form>
          <div className="space-y-6">
            <form
              onSubmit={(e) => xuLy(e, "ho-so")}
              className="space-y-4 rounded-xl border border-slate-200 bg-white p-6"
            >
              <h2 className="font-semibold">Hồ sơ quản trị</h2>
              <p className="text-sm text-slate-500">{user.dia_chi_email}</p>
              <label className="block text-sm">
                Họ tên
                <input
                  required
                  className={input}
                  value={user.ho_ten}
                  onChange={(e) => setUser({ ...user, ho_ten: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                Số điện thoại
                <input
                  maxLength={20}
                  className={input}
                  value={user.so_dien_thoai ?? ""}
                  onChange={(e) =>
                    setUser({ ...user, so_dien_thoai: e.target.value })
                  }
                />
              </label>
              <label className="block text-sm">
                Địa chỉ
                <input
                  className={input}
                  value={user.dia_chi ?? ""}
                  onChange={(e) =>
                    setUser({ ...user, dia_chi: e.target.value })
                  }
                />
              </label>
              <button className={button} disabled={Boolean(luu)}>
                {luu === "ho-so" ? "Đang lưu..." : "Lưu hồ sơ"}
              </button>
            </form>
            <form
              onSubmit={(e) => xuLy(e, "mat-khau")}
              className="space-y-4 rounded-xl border border-slate-200 bg-white p-6"
            >
              <h2 className="font-semibold">Đổi mật khẩu</h2>
              {(
                [
                  { ten: "mat_khau_cu", nhan: "Mật khẩu hiện tại" },
                  {
                    ten: "mat_khau_moi",
                    nhan: "Mật khẩu mới (tối thiểu 6 ký tự)",
                  },
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
                    autoComplete={
                      f.ten === "mat_khau_cu"
                        ? "current-password"
                        : "new-password"
                    }
                    minLength={f.ten === "mat_khau_cu" ? undefined : 6}
                    className={input}
                    value={matKhau[f.ten]}
                    onChange={(e) =>
                      setMatKhau({ ...matKhau, [f.ten]: e.target.value })
                    }
                  />
                </label>
              ))}
              <button disabled={Boolean(luu)} className={button}>
                {luu === "mat-khau" ? "Đang lưu..." : "Đổi mật khẩu"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
