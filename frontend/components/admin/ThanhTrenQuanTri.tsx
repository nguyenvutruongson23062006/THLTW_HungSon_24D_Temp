"use client";

import Link from "next/link";
import { useEffect, useState, type SyntheticEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { NguoiDung } from "@/types/admin";
import { apiRequest } from "@/lib/api/apiClient";
import { dangXuat } from "@/lib/api/authApi";

type ThongBao = {
  don_cho_xac_nhan: number;
  lien_he_chua_xu_ly: number;
  san_pham_sap_het: number;
};

export default function ThanhTrenQuanTri({
  nguoiDung,
}: {
  nguoiDung: NguoiDung;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [tuKhoa, setTuKhoa] = useState("");
  const [thongBao, setThongBao] = useState<ThongBao | null>(null);
  useEffect(() => {
    let huy = false;
    function taiThongBao() {
      apiRequest<ThongBao>("/admin/thong-bao")
        .then((v) => {
          if (!huy) setThongBao(v);
        })
        .catch(() => undefined);
    }
    taiThongBao();
    window.addEventListener("du-lieu-quan-tri-thay-doi", taiThongBao);
    return () => {
      huy = true;
      window.removeEventListener("du-lieu-quan-tri-thay-doi", taiThongBao);
    };
  }, [pathname]);
  function timKiem(e: SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push(`/admin/tim-kiem?tu_khoa=${encodeURIComponent(tuKhoa.trim())}`);
  }
  const tong = thongBao
    ? thongBao.don_cho_xac_nhan +
      thongBao.lien_he_chua_xu_ly +
      thongBao.san_pham_sap_het
    : 0;
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-3 sm:px-8 print:hidden">
      <form
        onSubmit={timKiem}
        className="flex w-full max-w-md items-center gap-2 rounded-lg border border-slate-200 px-3 py-1 md:w-auto md:flex-1"
      >
        <input
          type="search"
          aria-label="Tìm kiếm quản trị"
          required
          minLength={2}
          maxLength={100}
          value={tuKhoa}
          onChange={(e) => setTuKhoa(e.target.value)}
          placeholder="Tìm sản phẩm, người dùng, đơn hàng..."
          className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none"
        />
        <button className="rounded-md bg-sky-50 px-3 py-2 text-sm text-sky-700">
          Tìm
        </button>
      </form>
      <div className="flex items-center gap-4">
        <details className="relative">
          <summary className="cursor-pointer list-none rounded-lg border border-slate-200 px-3 py-2 text-sm">
            Thông báo{" "}
            {tong > 0 && (
              <span className="ml-1 rounded-full bg-rose-600 px-1.5 text-xs text-white">
                {tong}
              </span>
            )}
          </summary>
          <div className="absolute right-0 z-30 mt-2 w-72 space-y-1 rounded-xl border border-slate-200 bg-white p-3 text-sm shadow-lg">
            {thongBao ? (
              <>
                <Link
                  href="/admin/don-hang"
                  className="block rounded-lg p-2 hover:bg-slate-50"
                >
                  {thongBao.don_cho_xac_nhan} đơn chờ xác nhận
                </Link>
                <Link
                  href="/admin/lien-he"
                  className="block rounded-lg p-2 hover:bg-slate-50"
                >
                  {thongBao.lien_he_chua_xu_ly} liên hệ chưa xử lý
                </Link>
                <Link
                  href="/admin/bao-cao"
                  className="block rounded-lg p-2 hover:bg-slate-50"
                >
                  {thongBao.san_pham_sap_het} sản phẩm sắp hết
                </Link>
              </>
            ) : (
              <p className="p-2 text-slate-500">Chưa tải được thông báo.</p>
            )}
          </div>
        </details>
        <details className="relative">
          <summary className="flex cursor-pointer list-none items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 font-semibold text-sky-700">
              {nguoiDung.ho_ten.slice(0, 1).toUpperCase()}
            </span>
            <span>
              <span className="block text-sm font-semibold">
                {nguoiDung.ho_ten}
              </span>
              <span className="block text-xs text-slate-500">
                Quản trị viên
              </span>
            </span>
          </summary>
          <div className="absolute right-0 z-30 mt-2 w-48 rounded-xl border border-slate-200 bg-white p-2 text-sm shadow-lg">
            <Link
              href="/admin/cai-dat"
              className="block rounded-lg p-2 hover:bg-slate-50"
            >
              Hồ sơ và cài đặt
            </Link>
            <button
              className="w-full rounded-lg p-2 text-left text-rose-600 hover:bg-rose-50"
              onClick={() => {
                void dangXuat()
                  .catch(() => undefined)
                  .finally(() => router.replace("/admin/dang-nhap"));
              }}
            >
              Đăng xuất
            </button>
          </div>
        </details>
      </div>
    </header>
  );
}
