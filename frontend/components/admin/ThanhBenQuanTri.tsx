"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { dangXuat } from "@/lib/api/authApi";
import { apiRequest } from "@/lib/api/apiClient";

const mucQuanTri = [
  { nhan: "Tổng quan", duongDan: "/admin", bieuTuong: "⌂" },
  { nhan: "Xe máy", duongDan: "/admin/san-pham", bieuTuong: "♢" },
  { nhan: "Hãng xe", duongDan: "/admin/thuong-hieu", bieuTuong: "◈" },
  { nhan: "Danh mục", duongDan: "/admin/danh-muc", bieuTuong: "▤" },
  { nhan: "Người dùng", duongDan: "/admin/nguoi-dung", bieuTuong: "♙" },
  { nhan: "Đơn hàng", duongDan: "/admin/don-hang", bieuTuong: "▱" },
  { nhan: "Nhập hàng", duongDan: "/admin/phieu-nhap", bieuTuong: "↓" },
  { nhan: "Xuất hàng", duongDan: "/admin/phieu-xuat", bieuTuong: "↑" },
  { nhan: "Báo cáo", duongDan: "/admin/bao-cao", bieuTuong: "▥" },
  { nhan: "Bài viết", duongDan: "/admin/bai-viet", bieuTuong: "▤" },
  { nhan: "Ảnh quảng cáo", duongDan: "/admin/anh-quang-cao", bieuTuong: "▣" },
  {
    nhan: "Thanh điều hướng",
    duongDan: "/admin/thanh-dieu-huong",
    bieuTuong: "☰",
  },
  { nhan: "Trang đơn", duongDan: "/admin/trang-don", bieuTuong: "▧" },
  { nhan: "Liên hệ", duongDan: "/admin/lien-he", bieuTuong: "✉" },
  { nhan: "Cài đặt", duongDan: "/admin/cai-dat", bieuTuong: "⚙" },
];

export default function ThanhBenQuanTri() {
  const duongDanHienTai = usePathname();
  const router = useRouter();
  const [tenCuaHang, setTenCuaHang] = useState("MotoShop");
  useEffect(() => {
    let huy = false;
    function taiCaiDat() {
      apiRequest<{ ten_cua_hang: string }>("/admin/cai-dat")
        .then((v) => {
          if (!huy) setTenCuaHang(v.ten_cua_hang);
        })
        .catch(() => undefined);
    }
    taiCaiDat();
    window.addEventListener("cap-nhat-cai-dat", taiCaiDat);
    return () => {
      huy = true;
      window.removeEventListener("cap-nhat-cai-dat", taiCaiDat);
    };
  }, []);

  function dangChon(duongDan: string) {
    return duongDan === "/admin"
      ? duongDanHienTai === duongDan
      : duongDanHienTai.startsWith(duongDan);
  }

  return (
    <aside className="flex w-full shrink-0 flex-col bg-[#09233d] text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:self-start print:hidden">
      <div className="border-b border-white/10 px-5 py-5">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="text-3xl" aria-hidden="true">
            🏍
          </span>
          <span>
            <span className="block text-xl font-bold tracking-tight">
              {tenCuaHang}
            </span>
            <span className="block text-[10px] text-slate-300">
              Quản lý cửa hàng xe máy
            </span>
          </span>
        </Link>
      </div>

      <nav
        className="flex gap-1 overflow-x-auto px-3 py-3 lg:min-h-0 lg:flex-1 lg:flex-col lg:overflow-x-hidden lg:overflow-y-auto lg:py-5"
        aria-label="Menu Admin"
      >
        {mucQuanTri.map((muc) => (
          <Link
            key={muc.duongDan}
            href={muc.duongDan}
            className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-lg px-3 py-3 text-sm transition ${
              dangChon(muc.duongDan)
                ? "bg-[#1677e8] font-semibold text-white shadow-lg shadow-blue-950/20"
                : "text-slate-200 hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="w-6 text-center text-lg" aria-hidden="true">
              {muc.bieuTuong}
            </span>
            <span>{muc.nhan}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-5">
        <button
          type="button"
          onClick={() => {
            void dangXuat()
              .catch(() => undefined)
              .finally(() => router.replace("/admin/dang-nhap"));
          }}
          className="flex items-center gap-3 text-sm text-slate-200 transition hover:text-white"
        >
          <span className="text-lg" aria-hidden="true">
            ⇥
          </span>
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
